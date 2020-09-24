import { GroupByCategory } from './group_by_category';
import { Category } from '../category';
import { PullRequest } from '../issue';

export class MarkdownReportBuilder {
  private readonly groupByCategory: GroupByCategory;

  constructor(arg: PullRequest[] | GroupByCategory) {
    const groupByCategory = Array.isArray(arg) ? new GroupByCategory(arg) : arg;
    this.groupByCategory = groupByCategory;
  }

  public build(): string {
    const categorizedIssues = this.groupByCategory.get();

    let output = '';
    const categories = ['bug', 'enhancement', 'infrastructure', 'task', 'test'].map(
      (label) => new Category(label)
    );
    for (const category of categories) {
      if (categorizedIssues[category.category]) {
        output += `# ${category.displayName}\n`;
        for (const pr of categorizedIssues[category.category]) {
          output += `- ${String(pr.title).trim()}\n`;
        }
        output += '\n';
      }
    }

    return output;
  }
}
