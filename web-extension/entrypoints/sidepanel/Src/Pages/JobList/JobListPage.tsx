import { JobCard } from '@/entrypoints/sidepanel/Src/JobCard/JobCard.tsx';
import { useJobList } from '@/entrypoints/sidepanel/Src/Pages/JobList/Hooks/useJobList.tsx';

export function JobListPage() {
  const jobList = useJobList();

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
