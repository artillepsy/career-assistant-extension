import EventEmitter from 'eventemitter3';
import { PageTabId } from '@/src/data/page-tab-id.ts';

export class PageTabContext {
  public readonly onChanged = new EventEmitter();
  private _activeTabId = PageTabId.Selected;

  public static readonly EV = {
    PAGE_TAB_CHANGED: 'TAB_CHANGED',
  };

  public get activeTabId() {
    return this._activeTabId;
  }

  public isActive(id: PageTabId) {
    return this._activeTabId == id;
  }

  public switchTab(newTabId: PageTabId) {
    this._activeTabId = newTabId;
    this.onChanged.emit(PageTabContext.EV.PAGE_TAB_CHANGED, newTabId);
  }
}
