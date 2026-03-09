import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['sidePanel', 'sidebarAction', 'menus', 'activeTab'],
    action: {
      /*default_popup: 'entrypoints/popup/index.html',*/
      default_title: 'Click to open sidebar',
    },
    sidebar_action: {
      default_panel: 'entrypoints/sidepanel/index.html',
      default_title: 'My Extension Sidebar',
      default_icon: 'assets/icon-32.png',
    },
  },
});
