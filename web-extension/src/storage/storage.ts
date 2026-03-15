import { JobData } from '@/src/data/job-data.ts';
import EventEmitter from 'eventemitter3';

export class Storage {
  public readonly onUpdated: EventEmitter;

  public static readonly EVENTS = {
    JOB_LIST_UPDATED: 'JOB_LIST_UPDATED',
    SELECTED_JOB_UPDATED: 'SELECTED_JOB_UPDATED',
  };

  constructor() {
    this.onUpdated = new EventEmitter();
    browser.storage.onChanged.addListener((changes, area) => {
      this.handleStorageChange(changes, area);
    });
  }

  public dispose() {
    browser.storage.onChanged.removeListener((changes, area) => {
      this.handleStorageChange(changes, area);
    });
  }

  private handleStorageChange = (changes: Record<string, any>, area: string) => {
    if (area === 'local' && changes['jobList']) {
      this.onUpdated.emit(Storage.EVENTS.JOB_LIST_UPDATED);
    }

    if (area === 'local' && changes['selectedJob']) {
      this.onUpdated.emit(Storage.EVENTS.SELECTED_JOB_UPDATED);
    }
  };

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
