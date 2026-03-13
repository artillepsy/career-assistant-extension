import { JSX, useState } from 'react';
import './App.css';
import { PageTab } from '@/entrypoints/sidepanel/Src/Tab/PageTab.tsx';
import { JobListPage } from '@/entrypoints/sidepanel/Src/Pages/JobList/JobListPage.tsx';
import { SelectedJobPage } from '@/entrypoints/sidepanel/Src/Pages/SelectedJob/SelectedJobPage.tsx';

function App() {
  const pageDataList: PageData[] = [
    { id: 1, name: 'List', page: <JobListPage /> },
    { id: 2, name: 'Selected', page: <SelectedJobPage /> },
  ];

  const [activePageName, setActivePageName] = useState(pageDataList[0].name);

  interface PageData {
    id: number;
    name: string;
    page: JSX.Element;
  }

  const getActivePage = () => {
    let elem = pageDataList.find((data) => {
      return data.name === activePageName;
    });

    if (elem == null) {
      throw new Error(`Can't find active page with name ${activePageName}`);
    }

    return elem?.page;
  };

  return (
    <>
      <div className="tabs">
        {pageDataList.map((pageData) => (
          <PageTab
            key={pageData.id}
            name={pageData.name}
            isActive={activePageName === pageData.name}
            onSelect={setActivePageName}
          />
        ))}
      </div>
      <div className="mainPage">{getActivePage()}</div>
    </>
  );
}

export default App;
