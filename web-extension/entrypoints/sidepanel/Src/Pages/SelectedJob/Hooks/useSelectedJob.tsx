import { JobData } from '@/src/data/job-data.ts';
import { AppGlobalContext } from '@/entrypoints/sidepanel/App.tsx';
import { StorageContext } from '@/src/context/storage-context.ts';

export function useSelectedJob() {
  const [job, setJob] = useState<JobData>();
  const storageCtx = useContext(AppGlobalContext)?.storage;

  useEffect(() => {
    if (!storage) {
      return;
    }

    const fetchData = async () => {
      setJob(await storageCtx?.api.getSelectedJob());
    };

    storageCtx?.onChanged.on(StorageContext.EV.SELECTED_JOB_UPDATED, fetchData);

    fetchData();

    return () => {
      storageCtx?.onChanged.off(StorageContext.EV.SELECTED_JOB_UPDATED, fetchData);
    };
  }, [storageCtx]);

  return job;
}
