export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  browser.sidebarAction.toggle();
});
