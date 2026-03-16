import { JobData } from '@/src/data/job-data.ts';
import { AppGlobalContext } from '@/entrypoints/sidepanel/App.tsx';
import { StorageContext } from '@/src/context/storage-context.ts';

export function useJobList() {
  const [jobList, setJobList] = useState<JobData[]>();
  const storage = useContext(AppGlobalContext)?.storage;

  useEffect(() => {
    const fetchData = async () => {
      setJobList(await storage?.api.getJobList());
    };

    storage?.onChanged.on(StorageContext.EV.JOB_LIST_UPDATED, fetchData);
    fetchData();

    return () => {
      storage?.onChanged.off(StorageContext.EV.JOB_LIST_UPDATED, fetchData);
    };
  }, [storage]);

  return jobList;
}
