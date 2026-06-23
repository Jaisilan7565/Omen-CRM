import api from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Contact {
  id: string;
  accountId: string;
  contactType: string;
  kycCategory: string;
  firstName: string;
  lastName: string | null;
  email: string;
  mobileNumber1: string;
  mobileNumber2: string | null;
  landlineNumber: string | null;
  jobFunction: string;
  designation: string;
  department: string | null;
  employeeLevel: string | null;
  employeeId: string | null;
  joiningDate: string | null;
  buyingRole: string[] | null;
  decisionAuthority: string | null;
  budgetOwnership: boolean | null;
  technicalEvaluator: boolean | null;
  influencerScore: number | null;
  relationshipStrength: number | null;
  preferredCommMode: string[] | null;
  preferredContactTime: string | null;
  timeZone: string | null;
  languagePreference: string | null;
  marketingConsent: boolean | null;
  doNotContact: boolean | null;
  dob: string | null;
  anniversaryDate: string | null;
  linkedinProfile: string | null;
  assistantName: string | null;
  assistantContact: string | null;
  personalInterests: string[] | null;
  notes: string | null;
  reportingTo: string | null;
  reportingFunction: string | null;
  reportingToText: string | null;
  managerLocation: string | null;
  managerFunction: string | null;
  managerDesignation: string | null;
  managerName: string | null;
  managerEmail: string | null;
  managerMobile: string | null;
  accountManager: string | null;
  customerSuccessManager: string | null;
  preSalesOwner: string | null;
  relationshipOwner: string | null;
  accountTeam: string[] | null;
  engagementFrequency: string | null;
  lastMeetingDate: string | null;
  nextFollowUpDate: string | null;
  contactPriority: string | null;
  lastInteractionDate: string | null;
  lastInteractionNotes: string | null;
  relationshipScore: number | null;
  influenceLevel: string | null;
  decisionMakingPower: string | null;
  customerSentiment: string | null;
  dataQualityScore: number | null;
  duplicateContactCheck: boolean | null;
  associationStatus: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  account?: { id: string; name: string; accountType: string | null; industry: string | null };
  manager?: { id: string; firstName: string; lastName: string | null; designation: string; email: string } | null;
  accManagerKyc?: { id: string; firstName: string; lastName: string | null; designation: string; email: string } | null;
  csmKyc?: { id: string; firstName: string; lastName: string | null; designation: string; email: string } | null;
  preSalesKyc?: { id: string; firstName: string; lastName: string | null; designation: string; email: string } | null;
  relOwnerKyc?: { id: string; firstName: string; lastName: string | null; designation: string; email: string } | null;
}

export interface ContactListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Contact[];
}

export interface ContactListParams {
  page?: number;
  limit?: number;
  search?: string;
  accountId?: string;
  contactType?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export type ContactPayload = Partial<
  Omit<Contact, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "account" | "manager">
>;

// ── API calls ─────────────────────────────────────────────────────────────────
export const contactsApi = {
  list:   (params?: ContactListParams) =>
    api.get<{ data: ContactListResponse }>("/kyc", { params }),
  getOne: (id: string) =>
    api.get<{ data: Contact }>(`/kyc/${id}`),
  create: (data: ContactPayload) =>
    api.post<{ data: Contact }>("/kyc", data),
  update: (id: string, data: ContactPayload) =>
    api.patch<{ data: Contact }>(`/kyc/${id}`, data),
  remove: (id: string) =>
    api.delete(`/kyc/${id}`),
};
