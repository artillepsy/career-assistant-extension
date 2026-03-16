export interface JobData {
  url: string;
  createdAt: string;

  jobTitle: string;
  company: string;
  predictedSalary: string | undefined;
  predictionConfidence: number | undefined;
  coverLetter: string | undefined;
  matchScore: string | undefined;
  requiredSkills: string[] | undefined;
  redFlags: string[] | undefined;
}
