import config from 'config';
import { groupBy } from 'lodash';
import { ItemsFetch } from './items_fetch';
import { Issue, PullRequest } from './issue';

const bugFixLabels = config.get<string[]>('labels.bug');
const enhancementLabels = config.get<string[]>('labels.enhancement');
const infrastructureLabels = config.get<string[]>('labels.infrastructure');
const taskLabels = config.get<string[]>('labels.task');
const testLabels = config.get<string[]>('labels.test');

async function main() {
  const issues = await new ItemsFetch().fetch();
  const issuesByType = groupBy(issues, 'type');

  // TODO: Need to wrap so we can track progress.
  const prs = issuesByType['pull-request'] as PullRequest[];
  for (const pr of prs) {
    const id = pr.getIssueId();
    if (id) {
      try {
        const associatedItem = await new ItemsFetch().fetchById(id);
        if (associatedItem instanceof Issue) {
          pr.issue = associatedItem;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  const prByCategory = groupBy(prs, (pr) => {
    const prLabelsSet = new Set<string>(pr.labels);

    const bugFixLabelsSet = new Set<string>(bugFixLabels);
    let intersect = new Set([...prLabelsSet].filter((i) => bugFixLabelsSet.has(i)));
    if (intersect.size) {
      return 'bug';
    }

    const enhancementLabelsSet = new Set<string>(enhancementLabels);
    intersect = new Set([...prLabelsSet].filter((i) => enhancementLabelsSet.has(i)));
    if (intersect.size) {
      return 'enhancement';
    }

    const infrastructureLabelsSet = new Set<string>(infrastructureLabels);
    intersect = new Set([...prLabelsSet].filter((i) => infrastructureLabelsSet.has(i)));
    if (intersect.size) {
      return 'infrastructure';
    }

    const taskLabelSet = new Set<string>(taskLabels);
    intersect = new Set([...prLabelsSet].filter((i) => taskLabelSet.has(i)));
    if (intersect.size) {
      return 'task';
    }

    const testLabelSet = new Set<string>(testLabels);
    intersect = new Set([...prLabelsSet].filter((i) => testLabelSet.has(i)));
    if (intersect.size) {
      return 'test';
    }

    return 'misc';
  });

  for (const category of ['bug', 'enhancement', 'infrastructure', 'task', 'test']) {
    console.log(category);
    if (prByCategory[category]) {
      for (const pr of prByCategory[category]) {
        console.log(`\t${pr.title}`);
      }
    }
  }
}

main().then(() => console.log('Finish generating report.'));
