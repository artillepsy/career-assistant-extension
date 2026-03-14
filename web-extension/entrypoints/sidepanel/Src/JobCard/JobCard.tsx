export interface JobCardInfo {
  title: string;
  url: string;
  dateTime: string;
}

export function JobCard(info: JobCardInfo) {
  return (
    <>
      <h3>{info.title}</h3>
      <button>
        <a target="_blank" rel="norefferer" href={info.url}>
          Open page
        </a>
      </button>
      <p>{info.dateTime}</p>
    </>
  );
}
