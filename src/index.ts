import { isNil } from 'lodash';
import moment from 'moment';
import config from 'config';
// @ts-ignore
import Octokat from 'octokat';

const orgName = config.get('org');
const repoName = config.get('repo');
const closedAfter = config.get('closedAfter') as string;

async function getIssues(paginatedIssues: any): Promise<any[]> {
    let issues = paginatedIssues.items.filter((item: any) => {
        if (isNil(item.closedAt)) {
            return false;
        }

        console.log(item.closedAt)

        const closedAfterDate = moment(closedAfter);
        const closedAtDate = moment(item.closedAt);

        return closedAfterDate.isBefore(closedAtDate);
    });

    if (await paginatedIssues.nextPage) {
        return issues.concat(await getIssues(await paginatedIssues.nextPage.fetch()));
    } else {
        return issues;
    }
}

async function main() {
    const octo = new Octokat({ token: config.get('authorizationToken') });
    const repo = await octo.repos(orgName, repoName).fetch();
    let paginatedIssues = await repo.issues.fetch({ state: 'closed', since: closedAfter });

    const issues = await getIssues(paginatedIssues);
    console.log(issues.map(issue => issue.title));
}

main().then(() => console.log('Finish generating report.'));
