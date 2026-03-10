export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
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
      console.log(`page is selected, url: ${info.pageUrl}, tab: ${tab}, openerTabId: ${tab?.openerTabId}`);

      if (!tab || !tab.id) {
        console.log('Tab is not selected');
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

      const url = import.meta.env.WXT_LAMBDA_ENDPOINT;
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ pageText: pagePlainText }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`Error response. Status: ${response.status}`);
        }

        browser.storage.local.set({ jobAnalysis: response.json() });
      } catch (e) {
        console.error(e);
      }
    }
  });
});
