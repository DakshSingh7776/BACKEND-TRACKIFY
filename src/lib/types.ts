export const applicationStatuses = ['applied', 'interviewed', 'offer', 'rejected'] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export interface Application {
  id: string;
  company: string;
  position: string;
  dateApplied: Date;
  status: ApplicationStatus;
  linkToJobPosting: string;
  notes?: string;
  interviewDate?: Date;
  offerDate?: Date;
  rejectionDate?: Date;
}

export type NewsArticle = {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
};
