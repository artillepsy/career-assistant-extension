import { JobData } from '@/src/data/job.data.ts';
import { ApiJobResponseData } from '@/src/data/api-job-response.data.ts';

export class JobService {
  //todo: add cv for cover letter, match score, skill gap and so on
  public async analyzeJob(
    pageUrl: string | undefined,
    pageText: string | undefined,
    cv: string = '',
  ): Promise<JobData> {
    let jobResponse: JobData = {
      url: pageUrl,
      jobTitle: '',
      company: '',
      error: undefined,
      predictedSalary: undefined,
      predictConfidence: undefined,
      coverLetter: undefined,
      matchScore: undefined,
      requiredSkills: [],
      redFlags: [],
    };

    if (!pageUrl || !pageText) {
      jobResponse.error = `Error. Either url or pageText is empty.`;
      return jobResponse;
    }

    const fetchUrl = import.meta.env.WXT_LAMBDA_ENDPOINT;

    try {
      const request = {
        method: 'POST',
        body: JSON.stringify({
          pageText: pageText,
          cv: cv,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
      };

      const response = await fetch(fetchUrl, request);
      console.log(`response status: ${response.status}`);

      if (!response.ok) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(`Error response.\nStatus: ${response.status}, \nRequest body: ${request.body}`);
      }

      jobResponse = (JSON.parse(await response.text()) as ApiJobResponseData).response;
    } catch (e) {
      console.error(e);
      jobResponse.error = String(e);
    }

    return jobResponse;
  }
}
