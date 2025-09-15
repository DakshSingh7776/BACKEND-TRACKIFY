export type JobBoard = {
  name: string;
  url: string;
};

export const jobBoards: JobBoard[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/jobs/',
  },
  {
    name: 'Indeed',
    url: 'https://www.indeed.com/',
  },
  {
    name: 'Glassdoor',
    url: 'https://www.glassdoor.com/Job/index.htm',
  },
  {
    name: 'Wellfound (formerly AngelList)',
    url: 'https://wellfound.com/',
  },
  {
    name: 'Built In',
    url: 'https://builtin.com/',
  },
];
