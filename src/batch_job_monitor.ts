import Bluebird from 'bluebird';
import { Progress } from './progress';

type Iteratee<I> = (item: I, index: number, length: number) => Promise<void>;

export class BatchJobMonitor<I> {
  private readonly batch: I[];
  private readonly iteratee: Iteratee<I>;

  constructor(batch: any[], iteratee: Iteratee<I>) {
    this.batch = batch;
    this.iteratee = iteratee;
  }

  public run(): Progress {
    const progress = new Progress(0, this.batch.length);
    // I know I'm not doing any map operations here and should've been using
    // Promise#all but `map` is the only with `concurrency` parameter such that
    // I don't spam github api with just a bulk of requests, but instead restrict
    // it to some determined constant.
    Bluebird.map(
      this.batch,
      async (item: any, index: number, length: number) => {
        await this.iteratee(item, index, length);
        progress.incrementValue();
      },
      { concurrency: 5 }
    );
    return progress;
  }
}
