import { groupBy } from 'lodash';
import { ItemsClient, PullRequest } from './issue';
import { PRIssueLinker } from './pr_issue_linker';
import { BatchJobMonitor } from './batch_job_monitor';
import { ProgressBar } from './cli';
import { MarkdownReportBuilder } from './report_builder';

async function main() {
  const issues = await new ItemsClient().fetch();
  const issuesByType = groupBy(issues, 'type');

  console.log('Linking Pull Requests to Issues');
  const prs = (issuesByType['pull-request'] as PullRequest[]) || [];
  const batchJobMonitor = new BatchJobMonitor<PullRequest>(prs, async (pr) => {
    try {
      await new PRIssueLinker(pr).link();
    } catch (e) {
      console.error(e);
    }
  });
  const progress = batchJobMonitor.run();
  const progressBar = new ProgressBar(progress);
  progressBar.run(); // Don't wait for the promise.
  await progress.getValueUpdateSubject().toPromise();

  const reportBuilder = new MarkdownReportBuilder(prs);
  console.log(reportBuilder.build());
}

main();
