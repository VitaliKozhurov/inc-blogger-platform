import { getAuthToken } from './get-auth-token';
import { TestContextType, setupTestContext } from './setup-test-context';

export class TestManager {
  private testContext!: TestContextType;
  readonly authToken: string;

  constructor() {
    this.authToken = getAuthToken();
  }

  async init() {
    this.testContext = await setupTestContext();

    return this;
  }

  get context(): TestContextType {
    return this.testContext;
  }

  async clearDb() {
    await this.testContext.clearDb();
  }

  async close() {
    await this.testContext.closeSession();
  }
}
