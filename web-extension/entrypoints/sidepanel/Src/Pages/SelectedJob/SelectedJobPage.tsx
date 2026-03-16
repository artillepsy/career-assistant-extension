import { useSelectedJob } from '@/entrypoints/sidepanel/Src/Pages/SelectedJob/Hooks/useSelectedJob.tsx';

export function SelectedJobPage() {
  const job = useSelectedJob();

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
