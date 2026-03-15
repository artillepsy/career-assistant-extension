import { createContext, JSX, useState } from 'react';
import './App.css';
import { PageTab } from '@/entrypoints/sidepanel/Src/Tab/PageTab.tsx';
import { JobListPage } from '@/entrypoints/sidepanel/Src/Pages/JobList/JobListPage.tsx';
import { SelectedJobPage } from '@/entrypoints/sidepanel/Src/Pages/SelectedJob/SelectedJobPage.tsx';
import { Storage } from '@/src/storage/storage.ts';

interface PageData {
  id: number;
  name: string;
  comp: JSX.Element;
}

const pages: PageData[] = [
  { id: 1, name: 'List', comp: <JobListPage /> },
  { id: 2, name: 'Selected', comp: <SelectedJobPage /> },
  /* { id: 3, name: 'CV', comp: <SelectedJobPage /> },*/
];

const storage = new Storage();

export const StorageContext = createContext<Storage | null>(null);

function App() {
  const [activePageName, setActivePageName] = useState(pages[1].name);

  useEffect(() => {
    return () => {
      storage.dispose();
    };
  }, [storage]);

  const getActivePage = () => {
    return pages.find((tab) => tab.name === activePageName)?.comp;
  };

  return (
    <StorageContext.Provider value={storage}>
      <div className="tabs">
        {pages.map((pageData) => (
          <PageTab
            key={pageData.id}
            name={pageData.name}
            isActive={activePageName === pageData.name}
            onSelect={setActivePageName}
          />
        ))}
      </div>
      <div className="mainPage">{getActivePage()}</div>
    </StorageContext.Provider>
  );
}

export default App;
