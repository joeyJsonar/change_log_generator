import { groupBy } from 'lodash';
import { PullRequest } from '../issue';

export class GroupByCategory {
  private readonly prs: PullRequest[];

  constructor(prs: PullRequest[]) {
    this.prs = prs;
  }

  public get() {
    return groupBy(this.prs, (pr) => pr.getCategory());
  }
}
