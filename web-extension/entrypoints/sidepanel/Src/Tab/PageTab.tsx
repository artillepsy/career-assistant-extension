import styles from './PageTab.module.css';
import { PageTabId } from '@/src/data/page-tab-id.ts';
import { AppGlobalContext } from '@/entrypoints/sidepanel/App.tsx';

export interface PageTabProps {
  id: PageTabId;
  name: string;
  isActive: boolean;
}

export function PageTab({ id, name, isActive }: PageTabProps) {
  const tabs = useContext(AppGlobalContext)?.tabs;

  return (
    <button className={isActive ? styles['tab-active'] : styles['tab-inactive']} onClick={() => tabs?.switchTab(id)}>
      {name}
    </button>
  );
}
