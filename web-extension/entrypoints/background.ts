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

      const results = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          return document.body.innerText;
        },
      });

      const html = results[0].result;

      console.log(`page content: ${html?.substring(0, 10000)}`);
    }
  });
});
