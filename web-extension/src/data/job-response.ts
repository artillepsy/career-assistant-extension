import { JobData } from '@/src/data/job-data.ts';

export interface JobResponse {
  timeTaken: number;
  characters: number;
  aiModel: string;
  response: JobData;
}
