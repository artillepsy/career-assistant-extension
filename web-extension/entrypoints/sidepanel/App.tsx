import { createContext, JSX, useState } from 'react';
import './App.css';
import { PageTab } from '@/entrypoints/sidepanel/Src/Tab/PageTab.tsx';
import { JobListPage } from '@/entrypoints/sidepanel/Src/Pages/JobList/JobListPage.tsx';
import { SelectedJobPage } from '@/entrypoints/sidepanel/Src/Pages/SelectedJob/SelectedJobPage.tsx';
import { CvPage } from '@/entrypoints/sidepanel/Src/Pages/Cv/CvPage.tsx';
import { AppContext } from '@/src/context/app-context.ts';
import { PageTabId } from '@/src/data/page-tab-id.ts';
import { useActiveTab } from '@/entrypoints/sidepanel/Src/Tab/Hooks/useActiveTab.tsx';

interface PageData {
  id: PageTabId;
  name: string;
  comp: JSX.Element;
}

const pages: PageData[] = [
  { id: PageTabId.JobList, name: 'List', comp: <JobListPage /> },
  { id: PageTabId.Selected, name: 'Selected', comp: <SelectedJobPage /> },
  { id: PageTabId.Cv, name: 'CV', comp: <CvPage /> },
];

export const AppGlobalContext = createContext<AppContext | null>(null);

function App() {
  const [appContext] = useState(() => new AppContext());
  const activeTabId = useActiveTab(appContext);

  useEffect(() => {
    return () => {
      appContext.dispose();
    };
  }, [appContext]);

  const getActivePage = () => {
    return pages.find((pageTab) => pageTab.id === activeTabId)?.comp;
  };

  return (
    <AppGlobalContext.Provider value={appContext}>
      <div className="tabs">
        {pages.map((pageData) => (
          <PageTab key={pageData.id} id={pageData.id} name={pageData.name} isActive={activeTabId === pageData.id} />
        ))}
      </div>
      <div className="mainPage">{getActivePage()}</div>
    </AppGlobalContext.Provider>
  );
}

export default App;
