import cliProgress from 'cli-progress';
import { Progress } from '../progress';

export class ProgressBar {
  private readonly progress: Progress;

  constructor(progress: Progress) {
    this.progress = progress;
  }

  public async run(): Promise<void> {
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(this.progress.getMax(), this.progress.getMin());
    this.progress.getValueUpdateSubject().subscribe((value) => bar.update(value));
    await this.progress.getValueUpdateSubject().toPromise();
    bar.stop();
  }
}
