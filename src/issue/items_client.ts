import { isNil } from 'lodash';
import moment from 'moment';
import config from 'config';
// @ts-ignore
import Octokat from 'octokat';
import { Item } from './item';
import { ItemFactory } from './item_factory';

const orgName = config.get('org');
const repoName = config.get('repo');
const closedTimeframeFrom = config.get('closedTimeframe.from') as string;
const closedTimeframeTo = config.get('closedTimeframe.to') as string;

export class ItemsClient {
  public async fetchById(id: string): Promise<Item> {
    const octo = new Octokat({ token: config.get('authorizationToken') });
    const repo = await octo.repos(orgName, repoName).fetch();
    return new ItemFactory(await repo.issues(id).fetch()).create();
  }

  public async fetch(): Promise<Item[]> {
    const octo = new Octokat({ token: config.get('authorizationToken') });
    const repo = await octo.repos(orgName, repoName).fetch();
    const paginatedIssues = await repo.issues.fetch({
      state: 'closed',
      since: closedTimeframeFrom,
    });

    return this.fetchPaginated(paginatedIssues);
  }

  private async fetchPaginated(paginatedIssues: any): Promise<Item[]> {
    const rawIssues = await this.fetchPaginatedRaw(paginatedIssues);
    return rawIssues.map((i) => new ItemFactory(i).create());
  }

  private async fetchPaginatedRaw(paginatedItems: any): Promise<any[]> {
    const issues = paginatedItems.items.filter((item: any) => {
      if (isNil(item.closedAt)) {
        return false;
      }

      const closedTimeframeFromDate = moment(closedTimeframeFrom);
      const closedTimeframeToDate = moment(closedTimeframeTo);
      const closedAtDate = moment(item.closedAt);

      return (
        closedAtDate.isSameOrAfter(closedTimeframeFromDate) &&
        closedAtDate.isBefore(closedTimeframeToDate)
      );
    });

    if (await paginatedItems.nextPage) {
      return issues.concat(await this.fetchPaginatedRaw(await paginatedItems.nextPage.fetch()));
    }

    return issues;
  }
}
