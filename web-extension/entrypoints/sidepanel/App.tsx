import { createContext, JSX, useState } from 'react';
import './App.css';
import { PageTab } from '@/entrypoints/sidepanel/Src/Tab/PageTab.tsx';
import { JobListPage } from '@/entrypoints/sidepanel/Src/Pages/JobList/JobListPage.tsx';
import { SelectedJobPage } from '@/entrypoints/sidepanel/Src/Pages/SelectedJob/SelectedJobPage.tsx';
import { JobStorage } from '@/src/job-storage.ts';

export interface PageData {
  id: number;
  name: string;
  comp: JSX.Element;
}

export const pages: PageData[] = [
  { id: 1, name: 'List', comp: <JobListPage /> },
  { id: 2, name: 'Selected', comp: <SelectedJobPage /> },
];

export const JobStorageContext = createContext<JobStorage | null>(null);

function App() {
  const [activePageName, setActivePageName] = useState(pages[0].name);
  const [jobStorage] = useState(() => new JobStorage());

  const getActivePage = () => {
    return pages.find((tab) => tab.name === activePageName)?.comp;
  };

  return (
    <JobStorageContext.Provider value={jobStorage}>
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
    </JobStorageContext.Provider>
  );
}

export default App;
