import { Moment } from 'moment';
import { Issue } from './issue';
import { Item } from './item';

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
}
