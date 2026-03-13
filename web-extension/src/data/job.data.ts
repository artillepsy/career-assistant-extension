export interface JobData {
  url: string;
  title: string;
  company: string;
  predictedSalary: string | undefined;
  predictConfidence: number | undefined;
  coverLetter: string | undefined;
  matchScore: string | undefined;
  keySkills: string[] | undefined;
  redFlags: string[] | undefined;
  error: string | undefined;
}
