import { JobData } from '@/src/data/job-data.ts';
import { StorageContext } from '@/entrypoints/sidepanel/App.tsx';
import { Storage } from '@/src/storage/storage.ts';

export function SelectedJobPage() {
  const [job, setJob] = useState<JobData>();
  const storage = useContext(StorageContext);

  useEffect(() => {
    const fetchData = async () => {
      setJob(await storage?.getSelectedJob());
    };

    storage?.onUpdated.on(Storage.EVENTS.SELECTED_JOB_UPDATED, fetchData);

    fetchData();

    return () => {
      storage?.onUpdated.off(Storage.EVENTS.SELECTED_JOB_UPDATED, fetchData);
    };
  }, [storage]);

  if (!job) {
    return <h3>Waiting for data...</h3>;
  }

  if (job.error) {
    return <h3>{job.error}</h3>;
  }

  return (
    <>
      <a target="_blank" rel="norefferer" href={job.url}>
        Open page
      </a>
      <h2>{job.jobTitle}</h2>
      <p>At {job.company}</p>
      <br />

      {job.predictedSalary && (
        <>
          <h3>Predicted salary</h3>
          <p>{job.predictedSalary}</p>
        </>
      )}
      <br />

      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <>
          <h3>Key Skills: {job.requiredSkills.length}</h3>
          {job.requiredSkills.map((skill, index) => (
            <p key={index}>
              {index + 1}. {skill}
            </p>
          ))}
        </>
      )}
      <br />

      {job.redFlags && job.redFlags.length > 0 && (
        <>
          <h3>Red Flags: {job.redFlags.length}</h3>
          {job.redFlags.map((flag, index) => (
            <p key={index}>
              {index + 1}. {flag}
            </p>
          ))}
        </>
      )}
      <br />

      {job.coverLetter && (
        <>
          <h3>Cover Letter</h3>
          <p>{job.coverLetter}</p>
        </>
      )}
    </>
  );
}
