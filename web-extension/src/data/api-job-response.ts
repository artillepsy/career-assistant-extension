import { JobData } from '@/src/data/job-data.ts';

export interface ApiJobResponse {
  timeTaken: number;
  characters: number;
  aiModel: string;
  response: JobData;
}
