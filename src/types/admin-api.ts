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
