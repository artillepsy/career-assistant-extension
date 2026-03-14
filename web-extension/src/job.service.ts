import { ApiJobResponse } from '@/src/data/api-job-response.ts';

export class JobService {
  //todo: add cv for cover letter, match score, skill gap and so on
  public async analyzeJob(pageUrl: string, pageText: string, cv: string = ''): Promise<ApiJobResponse> {
    if (!pageUrl || !pageText) {
      throw new Error(`Error. Either url or pageText is empty.`);
    }

    const fetchUrl = import.meta.env.WXT_LAMBDA_ENDPOINT;

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
      throw new Error(`Error response.\nStatus: ${response.status}, \nRequest body: ${request.body}`);
    }

    let responseDto = JSON.parse(await response.text()) as ApiJobResponse;
    responseDto.response.url = pageUrl;
    responseDto.response.createdAt = new Date().toString();
    return responseDto;
  }
}
