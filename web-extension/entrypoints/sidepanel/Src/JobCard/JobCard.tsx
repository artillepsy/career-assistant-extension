import { AppGlobalContext } from '@/entrypoints/sidepanel/App.tsx';
import { PageTabId } from '@/src/data/page-tab-id.ts';

export interface JobCardProps {
  index: number;
  title: string;
  company: string;
  createdAt: string;
  url: string;
}

export function JobCard(props: JobCardProps) {
  const tabs = useContext(AppGlobalContext)?.tabs;
  const storageApi = useContext(AppGlobalContext)?.storage.api;

  const openJobLink = () => {
    window.open(props.url, '_blank', 'noopener,noreferrer');
  };

  const openJobAnalysis = () => {
    /*storageApi?.selectJob();*/
    tabs?.switchTab(PageTabId.Selected);
  };

  return (
    <>
      <h3>
        [{props.index}] {props.title}
      </h3>
      <p>At {props.company}</p>
      <p>Created At: {props.createdAt}</p>
      <button onClick={openJobLink}>Link</button>
      <button onClick={openJobAnalysis}>Analysis</button>
    </>
  );
}
