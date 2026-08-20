export type AdminSession = {
  email: string;
  role: "super-admin";
};

export type SeoFields = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl: string;
};

export type PublishStatus = "draft" | "published";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  shortDescription: string;
  content: string;
  author: string;
  categoryId: string;
  tagIds: string[];
  status: PublishStatus;
  publishDate: string;
  seo: SeoFields;
  createdAt: string;
  updatedAt: string;
};

export type Industry = {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: PublishStatus;
  sortOrder: number;
  seo: SeoFields;
};

export type IndustryFunction = {
  id: string;
  industryId: string;
  name: string;
  slug: string;
  summary: string;
  status: PublishStatus;
  sortOrder: number;
};

export type UseCaseSection = {
  title: string;
  items: string[];
};

export type UseCaseImpact = {
  label: string;
  value: string;
  description: string;
};

export type UseCase = {
  id: string;
  industryId: string;
  functionId: string;
  title: string;
  slug: string;
  bannerTitle: string;
  summary: string;
  heroImage: string;
  status: PublishStatus;
  publishDate: string;
  seo: SeoFields;
  impact: UseCaseImpact;
  challenges: UseCaseSection;
  outcomes: UseCaseSection;
  artefacts: UseCaseSection;
  detail: UseCaseSection;
  createdAt: string;
  updatedAt: string;
};

export type PricingPlan = {
  id: string;
  planName: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: string[];
  ctaText: string;
  highlighted: boolean;
  visible: boolean;
  planOrder: number;
};

export type HomeHeroButton = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
};

export type HomeAgentCard = {
  id: string;
  title: string;
  image: string;
  description: string;
  bullets: string[];
  cta: string;
  accent: "rose" | "gold";
};

export type HomeBlock = {
  id: string;
  label: string;
  heading: string;
  body: string;
};

export type HomePageContent = {
  salesBar: {
    visible: boolean;
    text: string;
    ctaLabel: string;
    ctaHref: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    highlightedText: string;
    subheading: string;
    image: string;
    buttons: HomeHeroButton[];
  };
  aiAgents: {
    heading: string;
    subheading: string;
    cards: HomeAgentCard[];
  };
  blocks: HomeBlock[];
  seo: SeoFields;
};

export type AdminCmsData = {
  schemaVersion: number;
  updatedAt: string;
  blogCategories: BlogCategory[];
  blogTags: BlogTag[];
  blogPosts: BlogPost[];
  industries: Industry[];
  functions: IndustryFunction[];
  useCases: UseCase[];
  pricingPlans: PricingPlan[];
  homePage: HomePageContent;
};

export type DashboardStats = {
  totalPosts: number;
  publishedPosts: number;
  totalIndustries: number;
  totalFunctions: number;
  totalUseCases: number;
  visiblePricingPlans: number;
};
