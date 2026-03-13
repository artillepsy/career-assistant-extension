import styles from './PageTab.module.css';

export interface PageTabProps {
  name: string;
  isActive: boolean;
  onSelect: (tabName: string) => void;
}

export function PageTab({ name, isActive, onSelect }: PageTabProps) {
  return (
    <button className={isActive ? styles['tab-active'] : styles['tab-inactive']} onClick={() => onSelect(name)}>
      {name}
    </button>
  );
}
