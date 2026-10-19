export type SortOrder = "asc" | "desc";

export type QueryBasePayload = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
};

export type HierarchyNodeType = "industry" | "function" | "usecase";

export type HierarchyListPayload = QueryBasePayload & {
  type?: HierarchyNodeType;
  parentId?: number;
};

export type HierarchyBulkItemInput = {
  id?: number;
  title: string;
  description?: string | null;
};

export type IndustryBulkUpsertPayload = {
  items: HierarchyBulkItemInput[];
};

export type FunctionBulkUpsertPayload = {
  industryId: number;
  items: HierarchyBulkItemInput[];
};

export type FunctionBulkUpsertGroup = {
  industryId: number;
  items: HierarchyBulkItemInput[];
};

export type UseCaseUpsertPayload = {
  id?: number;
  functionId: number;
  title: string;
  description?: string | null;
  usecaseDetails?: UseCaseDetailNestedInput[];
};

export type UseCaseDetailType = "Impact" | "Outcome" | "Artifacts" | "Challenges";

export type UseCaseDetailNestedInput = {
  id?: number;
  type: UseCaseDetailType;
  description: string;
  filePath?: string | null;
};

export type UseCaseDetailUpsertPayload = {
  id?: number;
  useCaseId: number;
  type: UseCaseDetailType;
  description: string;
  filePath?: string | null;
};

export type BulkDeletePayload = {
  ids: number[];
};

export type ListData<T> = {
  result: T[];
  count: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  error?: string | null;
};

export type CookieConsentDecision = "accepted" | "essential";

export type CookieConsentRecord = {
  decision: CookieConsentDecision;
  version: string;
  timestamp: string;
};

export type CookieConsentCapturePayload = CookieConsentRecord & {
  path?: string | null;
};

export type HierarchyRow = {
  id: number;
  parentId: number | null;
  parentTitle?: string | null;
  title: string;
  type: HierarchyNodeType;
  description: string | null;
  slug: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type UseCaseDetailRow = {
  id: number;
  useCaseId: number;
  type: UseCaseDetailType;
  description: string;
  filePath: string | null;
  createdAt: string;
  updatedAt: string;
};


export type PlanListPayload = {
  search?: string;
  hide?: boolean | null;
};

export type PlanUpsertPayload = {
  id?: number;
  planCode?: string | null;
  shortDescription?: string | null;
  highlightedFeatures?: string | null;
  features?: string | null;
  show: boolean;
};

export type PlanVisibilityPayload = {
  show: boolean;
};

export type PlanRow = {
  id: number;
  planCode: string | null;
  shortDescription: string | null;
  highlightedFeatures: string | null;
  features: string | null;
  show: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HeroSectionData = {
  salesBarText: string;
  heroHeading: string;
  highlightedHeading: string;
  shortDescription: string;
  buttonText: string;
  buttonText2: string;
  filepath: string | null;
};

export type HeroSectionUpsertPayload = {
  id?: number;
  data: HeroSectionData;
};

export type HeroSectionRow = {
  id: number;
  data: HeroSectionData;
  createdAt: string;
  updatedAt: string;
};

export type BlogStatus = "draft" | "published";

export type BlogListPayload = {
  search?: string;
  status?: BlogStatus | null;
};

export type BlogUpsertPayload = {
  id?: number;
  title: string;
  slug: string;
  shortDescription?: string | null;
  content: string;
  filepath?: string | null;
  status?: BlogStatus;
};

export type BlogRow = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  content: string;
  filepath: string | null;
  status: BlogStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SelectOption = {
  id: number;
  label: string;
  value: string;
  slug?: string | null;
};

export type HomeFeatureMediaType = "image" | "video";

export type HomeFeatureListPayload = {
  search?: string;
  mediaType?: HomeFeatureMediaType | null;
  isActive?: boolean | null;
};

export type HomeFeatureUpsertPayload = {
  id?: number;
  label: string;
  title: string;
  description?: string | null;
  features: string[];
  mediaType?: HomeFeatureMediaType | null;
  mediaUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
};

export type SectionHeaderKey =
  | "FEATURE"
  | "USE_CASE"
  | "TRUSTED_BY"
  | "TESTIMONIAL"
  | "FAQ"
  | "PARTNER_BENEFITS"
  | "HOW_IT_WORKS"
  | "BLOG"
  | "VISION"
  | "PARTNER_HEADER"
  | "PARTNER_PATHWAYS"
  | "AI_AGENTS_HEADER"
  | "AI_ADOPTION_HEADER";

export type PartnerPathwayRow = {
  id: number;
  title: string;
  description: string;
  points: string[];
  buttonText: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PartnerPathwayUpsertPayload = {
  id?: number;
  title: string;
  description: string;
  points: string[] | string;
  buttonText?: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type PartnerPathwayDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type PartnerPathwayDisplayOrderPayload = {
  items: PartnerPathwayDisplayOrderItem[];
};

export type PartnerBenefitRow = {
  id: number;
  title: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PartnerBenefitUpsertPayload = {
  id?: number;
  title: string;
  description: string;
  image: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type PartnerBenefitDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type PartnerBenefitDisplayOrderPayload = {
  items: PartnerBenefitDisplayOrderItem[];
};

export type OurMissionRow = {
  id: number;
  content: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OurMissionUpsertPayload = {
  id?: number;
  content: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type OurMissionListPayload = {
  search?: string;
  isActive?: boolean | null;
};

export type OurMissionDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type OurMissionDisplayOrderPayload = {
  items: OurMissionDisplayOrderItem[];
};

export type AboutTeamCategory = "LEADERSHIP" | "PRODUCT";

export type AboutTeamMemberRow = {
  id: number;
  category: AboutTeamCategory;
  name: string;
  designation: string | null;
  image: string | null;
  linkedinUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AboutTeamMemberUpsertPayload = {
  id?: number;
  category: AboutTeamCategory;
  name: string;
  designation?: string | null;
  image?: string | null;
  linkedinUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
};

export type AboutTeamMemberListPayload = {
  category?: AboutTeamCategory | null;
  search?: string;
  isActive?: boolean | null;
};

export type AboutTeamMemberDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type AboutTeamMemberDisplayOrderPayload = {
  items: AboutTeamMemberDisplayOrderItem[];
};

export type PageSectionRow = {
  id: number;
  pageKey: string;
  sectionKey: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PageSectionOrderItem = {
  sectionKey: string;
  displayOrder: number;
};

export type PageSectionsOrderPayload = {
  pageKey: string;
  items: PageSectionOrderItem[];
};

export type SectionHeaderData = {
  id: number;
  sectionKey: SectionHeaderKey | string;
  badgeText: string | null;
  heading: string;
  description: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  backgroundImage?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SectionHeaderUpsertPayload = {
  sectionKey?: SectionHeaderKey | string;
  badgeText?: string | null;
  heading: string;
  description?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  backgroundImage?: string | null;
};

export type HomeUseCaseHeader = {
  id: number;
  badgeText: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type HomeUseCaseHeaderUpsertPayload = {
  id?: number;
  badgeText: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
};

export type HomeFeatureHeader = {
  id: number;
  heading: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type HomeFeatureHeaderUpsertPayload = {
  id?: number;
  heading: string;
  description: string;
};

export type HomeTestimonialRow = {
  id: number;
  name: string;
  role: string;
  image: string | null;
  quote: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HomeTestimonialUpsertPayload = {
  id?: number;
  name: string;
  role: string;
  image?: string | null;
  quote: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type HomeTestimonialListPayload = {
  search?: string;
  isActive?: boolean | null;
};

export type HomeTestimonialDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type HomeTestimonialDisplayOrderPayload = {
  items: HomeTestimonialDisplayOrderItem[];
};

export type TrustedByLogoStatus = "active" | "inactive";

export type TrustedByLogoListPayload = QueryBasePayload & {
  status?: TrustedByLogoStatus | null;
};

export type TrustedByLogoUpsertPayload = {
  id?: number;
  logoImage: string;
  sortOrder?: number;
  status?: TrustedByLogoStatus;
};

export type TrustedByLogoRow = {
  id: number;
  logoImage: string;
  sortOrder: number;
  status: TrustedByLogoStatus;
  createdAt: string;
  updatedAt: string;
};

export type TrustedByLogoDisplayOrderItem = {
  id: number;
  sortOrder: number;
};

export type TrustedByLogoDisplayOrderPayload = {
  items: TrustedByLogoDisplayOrderItem[];
};

export type HomeFeatureDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type HomeFeatureDisplayOrderPayload = {
  items: HomeFeatureDisplayOrderItem[];
};

export type HomeFeatureRow = {
  id: number;
  label: string;
  title: string;
  description: string | null;
  features: string[];
  mediaType: HomeFeatureMediaType | null;
  mediaUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HomeUseCaseCardListPayload = {
  search?: string;
};

export type HomeUseCaseCardUpsertPayload = {
  id?: number;
  useCaseId: number;
  displayOrder?: number;
  isActive?: boolean;
};

export type HomeUseCaseCardDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type HomeUseCaseCardDisplayOrderPayload = {
  items: HomeUseCaseCardDisplayOrderItem[];
};

export type HomeUseCaseCardRow = {
  id: number;
  useCaseId: number;
  useCaseTitle: string;
  useCaseSlug: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HomeUseCasePublicRow = {
  id: number;
  useCaseId: number;
  useCaseTitle: string;
  useCaseSlug: string | null;
  useCaseDescription: string | null;
  functionId: number | null;
  functionTitle: string | null;
  functionSlug: string | null;
  industryId: number | null;
  industryTitle: string | null;
  industrySlug: string | null;
  displayOrder: number;
  impactDescription: string | null;
  impactFilePath: string | null;
  challenges: string[];
  outcomes: string[];
  artifacts: string[];
};

export type HomeFaqRow = {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HomeFaqUpsertPayload = {
  id?: number;
  question: string;
  answer: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type HomeFaqListPayload = {
  search?: string;
  isActive?: boolean | null;
};

export type HomeFaqDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type HomeFaqDisplayOrderPayload = {
  items: HomeFaqDisplayOrderItem[];
};

export type FooterSocialLinkRow = {
  id: number;
  platformName: string;
  icon: string;
  url: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FooterSocialLinkUpsertPayload = {
  id?: number;
  platformName: string;
  icon: string;
  url: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type FooterSocialLinkDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type FooterSocialLinkDisplayOrderPayload = {
  items: FooterSocialLinkDisplayOrderItem[];
};

export type FooterResourceLinkRow = {
  id: number;
  title: string;
  slug: string;
  url: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FooterResourceLinkUpsertPayload = {
  id?: number;
  title: string;
  slug: string;
  url: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type FooterResourceLinkDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type FooterResourceLinkDisplayOrderPayload = {
  items: FooterResourceLinkDisplayOrderItem[];
};

export type LegalPolicyRow = {
  policyKey: string;
  title: string;
  lastUpdated: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type LegalPolicyUpsertPayload = {
  policyKey: string;
  title: string;
  lastUpdated?: string;
  content: string;
};

export type SeoMetadataRow = {
  id: number;
  pageKey: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  createdAt: string;
  updatedAt: string;
};

export type SeoMetadataUpsertPayload = {
  id?: number;
  pageKey: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
};

export type HomeAiAdoptionCardRow = {
  id: number;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HomeAiAdoptionCardUpsertPayload = {
  id?: number;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type HomeAiAdoptionCardDisplayOrderItem = {
  id: number;
  displayOrder: number;
};

export type HomeAiAdoptionCardDisplayOrderPayload = {
  items: HomeAiAdoptionCardDisplayOrderItem[];
};

export type MediaFolder = "hero" | "impact" | "blog" | "feature" | "trusted-by" | "testimonials" | "team" | "section-bg";



