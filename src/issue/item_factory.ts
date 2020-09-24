import { has } from 'lodash';
import moment from 'moment';

import { Issue } from './issue';
import { PullRequest } from './pull_request';
import { Item } from './item';

export class ItemFactory {
  private readonly raw: any;

  constructor(raw: any) {
    this.raw = raw;
  }

  public create(): Item {
    const { title, closedAt } = this.raw;
    if (has(this.raw, 'pullRequest')) {
      return new PullRequest(title, moment(closedAt));
    }

    return new Issue(
      this.raw.number,
      title,
      moment(closedAt),
      this.raw.labels.map((l: any) => l.name)
    );
  }
}
