import EventEmitter from 'eventemitter3';
import { BrowserStorageApi } from '@/src/storage/browser-storage-api.ts';

export class StorageContext {
  public readonly api: BrowserStorageApi;
  public readonly onChanged = new EventEmitter();

  public static readonly EV = {
    JOB_LIST_UPDATED: 'JOB_LIST_UPDATED',
    SELECTED_JOB_UPDATED: 'SELECTED_JOB_UPDATED',
  };

  constructor() {
    this.api = new BrowserStorageApi();
    browser.storage.onChanged.addListener((changes, area) => {
      this.handleStorageChange(changes, area);
    });
  }

  public dispose() {
    browser.storage.onChanged.removeListener((changes, area) => {
      this.handleStorageChange(changes, area);
    });
  }

  private handleStorageChange = (changes: Record<string, any>, area: string) => {
    if (area === 'local' && changes['jobList']) {
      this.onChanged.emit(StorageContext.EV.JOB_LIST_UPDATED);
    }

    if (area === 'local' && changes['selectedJob']) {
      this.onChanged.emit(StorageContext.EV.SELECTED_JOB_UPDATED);
    }
  };
}
