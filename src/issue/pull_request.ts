import { memoize } from 'lodash';
import { Moment } from 'moment';
import { Issue } from './issue';
import { Item } from './item';
import { Category } from '../category';

export class PullRequest implements Item {
  public readonly title: string;
  public readonly closedAt: Moment;

  public get labels(): string[] {
    if (!this.issue) {
      return [];
    }

    return this.issue.labels;
  }

  public readonly type: string = 'pull-request';
  public issue?: Issue;

  constructor(title: string, closedAt: Moment, issue?: Issue) {
    this.title = title;
    this.closedAt = closedAt;
    this.issue = issue;
  }

  public getIssueId(): string | undefined {
    const pattern = /.*GH-([0-9]+).*/;
    const matches = this.title.match(pattern);

    if (matches) {
      return matches[1];
    }

    return undefined;
  }

  public getCategory() {
    const prLabelSet = new Set<string>(this.labels);

    for (const category of ['bug', 'enhancement', 'infrastructure', 'task', 'test']) {
      const intersect = new Set([...prLabelSet].filter((i) => this.getLabels(category).has(i)));
      if (intersect.size) {
        return category;
      }
    }

    return 'misc';
  }

  private getLabels = memoize((category: string) => {
    return new Category(category).labels;
  });
}
