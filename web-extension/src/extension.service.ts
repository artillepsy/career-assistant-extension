import { Browser } from '@wxt-dev/browser';
import OnClickData = Browser.contextMenus.OnClickData;
import Tab = Browser.tabs.Tab;
import { JobService } from '@/src/job.service.ts';
import { JobStorage } from '@/src/job-storage.ts';

export class ExtensionService {
  private jobService: JobService;
  private storage: JobStorage;

  constructor(jobService: JobService, browserStorage: JobStorage) {
    this.jobService = jobService;
    this.storage = browserStorage;
  }

  public async analyzeJobOnPage(info: OnClickData, tab: Tab | undefined): Promise<void> {
    if (!tab || !tab.id) {
      console.log('Tab is not selected');
      return;
    }

    console.log(`page is selected, url: ${info.pageUrl}, tab: ${tab}, openerTabId: ${tab?.openerTabId}`);

    if (!info.pageUrl) {
      return;
    }

    browser.sidePanel.open({ windowId: tab.windowId });

    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        return document.body.innerText;
      },
    });

    const pagePlainText = results[0].result?.substring(0, 10000);

    if (!pagePlainText) {
      return;
    }

    try {
      const apiJobResponse = await this.jobService.analyzeJob(info.pageUrl, pagePlainText);
      await this.storage.saveJob(apiJobResponse.response, true);
    } catch (e) {
      console.error(e);
    }
  }
}
