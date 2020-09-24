import config from 'config';

export class Category {
  public readonly category: string;
  public readonly displayName: string;
  public readonly labels: Set<string>;

  constructor(category: string) {
    this.category = category;
    this.displayName = config.get<string>(`labels.${category}.displayName`);
    this.labels = this.getLabels(category);
  }

  private getLabels(category: string) {
    return new Set<string>(config.get<string[]>(`labels.${category}.labels`));
  }
}
