import { Moment } from 'moment';

export interface Item {
  readonly title: string;
  readonly closedAt: Moment;
  readonly labels: string[];
  readonly type: string;
}
