export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  browser.browserAction.onClicked.addListener(() => {
    browser.sidebarAction.open();
  });

  browser.menus.create({
    id: 'analyze-job',
    title: 'Analyze Job',
    contexts: ['page'],
  });

  browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'analyze-job') {
      console.log(`page is selected, url: ${info.pageUrl}`);
    }
  });
});
