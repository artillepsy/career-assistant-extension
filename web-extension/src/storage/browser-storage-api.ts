import { JobData } from '@/src/data/job-data.ts';

export class BrowserStorageApi {
  public async saveJob(job: JobData | undefined, isSelected: boolean): Promise<void> {
    if (!job) {
      console.error("Can't save job. Object is undefined");
      return;
    }

    const result = await browser.storage.local.get({ jobList: [] });
    const jobList = result.jobList as JobData[];

    jobList.push(job);
    await browser.storage.local.set({ jobList });
    console.log(`saved job: ${job}. item count in storage: ${jobList.length}`);

    if (isSelected) {
      await browser.storage.local.set({ selectedJob: job });
      console.log(`saved selected job: ${job}`);
    }
  }

  public async selectJob(job: JobData | undefined): Promise<void> {
    if (!job) {
      console.error("Can't select job. Object is undefined");
      return;
    }

    await browser.storage.local.set({ selectedJob: job });
  }

  public async getJobList(): Promise<JobData[]> {
    const result = await browser.storage.local.get({ jobList: [] });
    return result.jobList as JobData[];
  }

  public async getSelectedJob(): Promise<JobData> {
    const result = await browser.storage.local.get('selectedJob');
    return result.selectedJob as JobData;
  }
}
