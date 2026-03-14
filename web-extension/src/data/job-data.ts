export interface JobData {
  url: string;
  createdAt: Date;
  jobTitle: string;
  company: string;
  predictedSalary: string | undefined;
  predictConfidence: number | undefined;
  coverLetter: string | undefined;
  matchScore: string | undefined;
  requiredSkills: string[] | undefined;
  redFlags: string[] | undefined;
  error: string | undefined;
}
