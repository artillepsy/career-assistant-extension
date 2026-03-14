import { JobData } from '@/src/data/job-data.ts';
import { JobStorageContext } from '@/entrypoints/sidepanel/App.tsx';
import { JobCard } from '@/entrypoints/sidepanel/Src/JobCard/JobCard.tsx';

export function JobListPage() {
  const [jobList, setJobList] = useState<JobData[]>();
  const jobStorage = useContext(JobStorageContext);

  useEffect(() => {
    const fetchData = async () => {
      setJobList(await jobStorage?.getJobList());
    };

    const handleStorageChange = (changes: Record<string, any>, areaName: string) => {
      if (areaName === 'local' && changes['jobList']) {
        fetchData();
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);

    fetchData();

    return () => {
      browser.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <>
      {jobList?.map((job, index) => (
        <JobCard
          index={index}
          url={job.url}
          createdAt={job.createdAt}
          title={job.jobTitle}
          company={job.company}
        ></JobCard>
      ))}
    </>
  );
}
