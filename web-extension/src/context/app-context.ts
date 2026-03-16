import { StorageContext } from '@/src/context/storage-context.ts';
import { PageTabContext } from '@/src/context/page-tab-context.ts';

export class AppContext {
  public readonly storage: StorageContext = new StorageContext();
  public readonly tabs: PageTabContext = new PageTabContext();

  public dispose() {
    this.storage.dispose();
  }
}
