export interface JobCardProps {
  index: number;
  title: string;
  company: string;
  createdAt: string;
  url: string;
}

export function JobCard(props: JobCardProps) {
  const openJobInNewTab = () => {
    window.open(props.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <h3>
        [{props.index}] {props.title}
      </h3>
      <p>At {props.company}</p>
      <p>Created At: {props.createdAt}</p>
      <button onClick={openJobInNewTab}>Open Tab</button>
    </>
  );
}
