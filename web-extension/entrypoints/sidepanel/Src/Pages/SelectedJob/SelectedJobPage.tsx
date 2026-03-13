import { JobData } from '@/src/data/job-data.ts';

export function SelectedJobPage() {
  const [job, setJob] = useState<JobData>();

  useEffect(() => {
    const fetchData = async () => {
      await browser.storage.local.get('selectedJob').then((result) => {
        if (result.selectedJob) {
          // @ts-ignore
          setJob(result.selectedJob ?? 'failed to get the key');
        }
      });
    };

    const handleStorageChange = (changes: Record<string, any>, areaName: string) => {
      if (areaName === 'local' && changes['selectedJob']) {
        fetchData();
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);

    fetchData();

    return () => {
      browser.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  if (!job) {
    return <h1>Waiting for data...</h1>;
  }

  if (job.error) {
    return <h1>{job.error}</h1>;
  }

  return (
    <>
      <a>{job.url}</a>
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
