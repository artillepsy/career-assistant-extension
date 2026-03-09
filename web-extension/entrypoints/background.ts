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

  /*browser.contextMenus.create({
    id: 'open-panel',
    title: 'Open side panel',
    contexts: ['all'],
  });*/

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'analyze-job') {
      /*console.log(`page is selected, url: ${info.pageUrl}`);

      const results = browser.scripting.executeScript({
        target: { tabId: tab.tabId },
        func: () => {
          const bodyText = document.body.innerText;
          const html = document.documentElement.innerHTML;
          return { bodyText, html };
        },
      });

      const pageData = results[0].result;
      console.log(`page content: ${pageData.bodyText.substring(0, 100)}`);*/
    } else if (info.menuItemId === 'open-panel') {
      browser.sidePanel.open({ windowId: tab.windowId });
    }
  });
});
