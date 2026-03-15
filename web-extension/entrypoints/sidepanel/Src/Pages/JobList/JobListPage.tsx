import { JobData } from '@/src/data/job-data.ts';
import { StorageContext } from '@/entrypoints/sidepanel/App.tsx';
import { JobCard } from '@/entrypoints/sidepanel/Src/JobCard/JobCard.tsx';
import { Storage } from '@/src/storage/storage.ts';

export function JobListPage() {
  const [jobList, setJobList] = useState<JobData[]>();
  const storage = useContext(StorageContext);

  useEffect(() => {
    console.log(`Listening to instance`);

    const fetchData = async () => {
      setJobList(await storage?.getJobList());
    };

    storage?.onUpdated.on(Storage.EVENTS.JOB_LIST_UPDATED, fetchData);
    fetchData();

    return () => {
      storage?.onUpdated.off(Storage.EVENTS.JOB_LIST_UPDATED, fetchData);
    };
  }, [storage]);

  return (
    <>
      {jobList?.map((job, index) => (
        <div key={index}>
          <JobCard
            index={index}
            url={job.url}
            createdAt={job.createdAt}
            title={job.jobTitle}
            company={job.company}
          ></JobCard>
          <br></br>
        </div>
      ))}
    </>
  );
}
