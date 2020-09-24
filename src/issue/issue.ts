import { Moment } from 'moment';
import { Item } from './item';

export class Issue implements Item {
  public readonly id: string;
  public readonly title: string;
  public readonly closedAt: Moment;
  public readonly labels: string[];
  public readonly type: string = 'issue';

  constructor(id: string, title: string, closedAt: Moment, labels: string[]) {
    this.id = id;
    this.title = title;
    this.closedAt = closedAt;
    this.labels = labels;
  }
}
