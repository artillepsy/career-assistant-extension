import { useState } from 'react';
import { AppContext } from '@/src/context/app-context.ts';
import { PageTabId } from '@/src/data/page-tab-id.ts';
import { AppGlobalContext } from '@/entrypoints/sidepanel/App.tsx';
import { PageTabContext } from '@/src/context/page-tab-context.ts';

export function useActiveTab(appContext: AppContext) {
  const tabs = appContext.tabs;
  const [activeTabId, setActiveTabId] = useState<PageTabId>(tabs.activeTabId);

  useEffect(() => {
    const handleTabsChange = (newTabId: PageTabId) => {
      setActiveTabId(newTabId);
    };

    tabs?.onChanged.on(PageTabContext.EV.PAGE_TAB_CHANGED, handleTabsChange);

    return () => {
      tabs?.onChanged.off(PageTabContext.EV.PAGE_TAB_CHANGED, handleTabsChange);
    };
  }, [tabs]);

  return activeTabId;
}
