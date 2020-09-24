import { Subject } from 'rxjs';

export class Progress {
  private readonly min: number;
  private readonly max: number;
  private value: number;
  private readonly valueUpdateSubject = new Subject<number>();

  constructor(min: number, max: number, startValue?: number) {
    this.min = min;
    this.max = max;
    this.value = startValue == null ? min : startValue;

    if (this.value >= this.max) {
      this.valueUpdateSubject.complete();
    }
  }

  public getMin(): number {
    return this.min;
  }

  public getMax(): number {
    return this.max;
  }

  public getValue(): number {
    return this.value;
  }

  public incrementValue() {
    this.value += 1.0;

    if (this.value < this.max) {
      this.valueUpdateSubject.next(this.value);
    } else {
      this.valueUpdateSubject.complete();
    }
  }

  public getValueUpdateSubject(): Subject<number> {
    return this.valueUpdateSubject;
  }
}
