export type BlogType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogInputType = Omit<BlogType, 'id'>;
