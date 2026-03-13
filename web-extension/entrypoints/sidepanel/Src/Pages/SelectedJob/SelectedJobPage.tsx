import { JobData } from '@/src/data/job.data.ts';

export function SelectedJobPage() {
  const [job, setJob] = useState<JobData>();

  useEffect(() => {
    const fetchData = async () => {
      await browser.storage.local.get('selectedJob').then((result) => {
        if (result.jobAnalysis) {
          // @ts-ignore
          setJob(result.jobAnalysis ?? 'failed to get the key');
        }
      });
    };
    //todo: listen to the storage changes

    fetchData();
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
      <h1>{job.title}</h1>
      <h2>At {job.company}</h2>

      {job.predictedSalary && (
        <>
          <h1>Predicted salary</h1>
          <p>{job.predictedSalary}</p>
        </>
      )}

      {job.keySkills && (
        <>
          <h1>Key Skills</h1>
          {job.keySkills.map((skill, index) => {
            <p key={index}>{skill}</p>;
          })}
        </>
      )}

      {job.redFlags && (
        <>
          <h1>Red Flags</h1>
          {job.redFlags.map((flag, index) => {
            <p key={index}>{flag}</p>;
          })}
        </>
      )}

      {job.coverLetter && (
        <>
          <h1>Cover Letter</h1>
          <p>{job.coverLetter}</p>
        </>
      )}
    </>
  );
}
