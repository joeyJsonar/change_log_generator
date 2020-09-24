import { PullRequest } from '../issue/pull_request';
import { ItemsClient } from '../issue/items_client';
import { Issue } from '../issue/issue';

export class PRIssueLinker {
  private readonly pr: PullRequest;

  constructor(pr: PullRequest) {
    this.pr = pr;
  }

  public async link(): Promise<void> {
    const id = this.pr.getIssueId();
    if (id) {
      const associatedItem = await new ItemsClient().fetchById(id);
      if (associatedItem instanceof Issue) {
        this.pr.issue = associatedItem;
      }
    }
  }
}
