import api from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Account {
  id: string;
  name: string;
  accountType: string | null;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  annualRevenue: number | null;
  employees: number | null;
  billingStreet: string | null;
  billingCity: string | null;
  billingState: string | null;
  billingCountry: string | null;
  billingZip: string | null;
  description: string | null;
  status: "active" | "inactive";
  ownerId: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: { id: string; fullName: string; email: string };
  parentCompany?: { id: string; name: string; industry?: string | null };
  creator?: { id: string; fullName: string; email: string };
  updater?: { id: string; fullName: string; email: string };

  // Extended fields
  category?: string | null;
  organizationProfile?: string | null;
  subIndustry?: string | null;
  linkedinPage?: string | null;
  yearEstablished?: number | null;
  employeeSize?: string | null;
  annualRevenueRange?: string | null;
  marketSegment?: string | null;
  officesCount?: number | null;
  globalPresence?: boolean;
  countriesOperation?: string[] | null;
  parentCompanyId?: string | null;
  gstNumber?: string | null;
  panNumber?: string | null;
  cinNumber?: string | null;
  paymentTerms?: string | null;
  creditLimit?: number | null;
  taxExemptionStatus?: boolean;
  billingStreet2?: string | null;
  shippingLocation?: string | null;
  shippingStreet?: string | null;
  shippingCity?: string | null;
  shippingCountry?: string | null;
  shippingPhone?: string | null;
  primaryContactName?: string | null;
  primaryContactDesignation?: string | null;
  primaryContactDepartment?: string | null;
  primaryContactEmail?: string | null;
  primaryContactMobile?: string | null;
  primaryContactPhone?: string | null;
  primaryContactLinkedin?: string | null;
  cloudProvider?: string | null;
  dataCentreProvider?: string | null;
  systemIntegrator?: string | null;
  securityPartner?: string | null;
  techPlatforms?: string | null;
  digitalInitiatives?: string | null;
  existingContracts?: string | null;
  renewalDates?: string | null;
  leadSource?: string | null;
  accountSource?: string | null;
  referralPartner?: string | null;
  accountPriority?: string | null;
  accountTier?: string | null;
  strategicAccount?: boolean;
  estimatedRevenue?: number | null;
  currentSpend?: number | null;
  competitorInfo?: string | null;
  keyChallenges?: string | null;
  nextAction?: string | null;
  nextFollowUpDate?: string | null;
  existingCustomer?: boolean;
  currentProducts?: string | null;
  previousOrders?: string | null;
  lastPurchaseDate?: string | null;
  activeOpportunities?: number | null;
  expectedDealSize?: number | null;
  expectedClosureDate?: string | null;
  probabilityClosure?: number | null;
  territory?: string | null;
  region?: string | null;
  businessUnit?: string | null;
  dataQualityScore?: number | null;
}

export interface AccountListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Account[];
}

export interface AccountListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  industry?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export type AccountPayload = Omit<
  Account,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "owner"
>;

// ── API calls ─────────────────────────────────────────────────────────────────
export const accountsApi = {
  list:   (params?: AccountListParams) =>
    api.get<{ data: AccountListResponse }>("/accounts", { params }),
  getOne: (id: string) =>
    api.get<{ data: Account }>(`/accounts/${id}`),
  create: (data: Partial<AccountPayload>) =>
    api.post<{ data: Account }>("/accounts", data),
  update: (id: string, data: Partial<AccountPayload>) =>
    api.patch<{ data: Account }>(`/accounts/${id}`, data),
  remove: (id: string) =>
    api.delete(`/accounts/${id}`),
};
