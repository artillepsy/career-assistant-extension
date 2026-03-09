import { JSX, useState } from 'react';
import './App.css';
import { PageTab } from '@/entrypoints/sidepanel/src/components/Tab/PageTab.tsx';
import { MainPage } from '@/entrypoints/sidepanel/src/components/pages/MainPage/MainPage.tsx';
import { CurrentJobPage } from '@/entrypoints/sidepanel/src/components/pages/CurrentJobPage/CurrentJobPage.tsx';
import { SettingsPage } from '@/entrypoints/sidepanel/src/components/pages/SettingsPage/SettingsPage.tsx';

function App() {
  const [activePageName, setActivePageName] = useState('Main');

  interface PageData {
    name: string;
    page: JSX.Element;
  }

  const pageDataList: PageData[] = [
    { name: 'Main', page: <MainPage /> },
    { name: 'Current Job', page: <CurrentJobPage /> },
    { name: 'Settings', page: <SettingsPage /> },
  ];

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
          <PageTab name={pageData.name} isActive={activePageName === pageData.name} onSelect={setActivePageName} />
        ))}
      </div>
      <div className="mainPage">{getActivePage()}</div>
    </>
  );
}

export default App;
