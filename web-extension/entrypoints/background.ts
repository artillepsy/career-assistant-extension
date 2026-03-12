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
        const request = {
          method: 'POST',
          body: JSON.stringify({ pageText: pagePlainText }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/plain',
          },
        };

        //console.log(`request is formed but not sent. Body: ${request.body}`);
        const response = await fetch(url, request);

        //const url = import.meta.env.WXT_LAMBDA_TEST_ENDPOINT;
        //const response = await fetch(url);

        console.log(`response status: ${response.status}`);

        if (!response.ok) {
          // noinspection ExceptionCaughtLocallyJS
          throw new Error(`Error response.\nStatus: ${response.status}, \nRequest body: ${request.body}`);
        }

        // todo: parse into json. Right now it's displayed as plain text.
        browser.storage.local.set({ jobAnalysis: await response.text() });
      } catch (e) {
        console.error(e);
      }
    }
  });
});
