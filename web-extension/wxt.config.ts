import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['sidePanel', 'contextMenus', 'activeTab', 'scripting', 'storage'],
    host_permissions: ['<all_urls>'],
    action: {
      /*default_popup: 'entrypoints/popup/index.html',*/
      default_title: 'Click to open sidebar',
    },
    side_panel: {
      default_path: 'entrypoints/sidepanel/index.html',
      default_title: 'My Extension Sidebar',
      default_icon: 'assets/icon-32.png',
    },
  },
});
