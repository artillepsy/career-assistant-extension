import { JobData } from '@/src/data/job.data.ts';

export interface ApiJobResponseData {
  timeTaken: number;
  characters: number;
  aiModel: string;
  response: JobData;
}
