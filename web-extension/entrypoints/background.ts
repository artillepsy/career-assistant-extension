import { ExtensionService } from '@/src/extension.service.ts';
import { JobService } from '@/src/job.service.ts';
import { BrowserStorage } from '@/src/browser-storage.ts';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  const service = new ExtensionService(new JobService(), new BrowserStorage());

  browser.action.onClicked.addListener(async (tab) => {
    browser.sidePanel.open({ windowId: tab?.windowId });
  });

  browser.contextMenus.create({
    id: 'analyze-job',
    title: 'Analyze Job',
    contexts: ['page'],
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'analyze-job') {
      await service.analyzeJobOnPage(info, tab);
    }
  });
});
