import { Browser } from '@wxt-dev/browser';
import OnClickData = Browser.contextMenus.OnClickData;
import Tab = Browser.tabs.Tab;
import { BrowserStorageApi } from '@/src/storage/browser-storage-api.ts';
import { JobResponse } from '@/src/data/job-response.ts';

export class ExtensionService {
  private storage: BrowserStorageApi;

  constructor(storage: BrowserStorageApi) {
    this.storage = storage;
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
      const apiJobResponse = await this.analyzeJob(info.pageUrl, pagePlainText);
      await this.storage.saveJob(apiJobResponse.analysis, true);
    } catch (e) {
      alert(String(e));
      console.error(e);
    }
  }

  private async analyzeJob(pageUrl: string, pageText: string, cv: string = ''): Promise<JobResponse> {
    if (!pageUrl || !pageText) {
      throw new Error(`Error. Either url or pageText is empty.`);
    }

    const fetchUrl = import.meta.env.WXT_LAMBDA_ENDPOINT;

    const request = {
      method: 'POST',
      body: JSON.stringify({
        pageText: pageText,
        cv: cv,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
    };

    const response = await fetch(fetchUrl, request);
    console.log(`response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(
        `Error response.\nStatus: ${response.status}, message: ${response.statusText} \nRequest body: ${request.body}`,
      );
    }

    let responseDto = JSON.parse(await response.text()) as JobResponse;
    responseDto.analysis.url = pageUrl;
    responseDto.analysis.createdAt = new Date().toLocaleTimeString();
    return responseDto;
  }
}
