/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "./http";

// ============================================
// Auth Endpoints
// ============================================

export async function registerAccount(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
  orgName?: string;
}) {
  const res = await http.post("/auth/register", payload);
  return res.data;
}

export async function apiLogin(payload: { email: string; password: string }) {
  const res = await http.post("/auth/login", payload);
  return res.data;
}

export async function apiVerify2FA(payload: {
  tempToken: string;
  code: string;
}) {
  const res = await http.post("/auth/verify-2fa", payload);
  return res.data;
}

export async function apiVerifyEmail(payload: { email: string; code: string }) {
  const res = await http.post("/auth/verify-email", payload);
  return res.data;
}

export async function apiResendOtp(payload: { email: string }) {
  const res = await http.post("/auth/resend-otp", payload);
  return res.data;
}

export async function apiForgotPassword(payload: { email: string }) {
  const res = await http.post("/auth/forgot-password", payload);
  return res.data;
}

export async function apiResetPassword(payload: {
  email: string;
  code: string;
  password: string;
}) {
  const res = await http.post("/auth/reset-password", payload);
  return res.data;
}

export async function apiCurrentUser() {
  const res = await http.get("/auth/me");
  return res.data;
}

// ============================================
// Plan Endpoints
// ============================================

export async function createPlan(payload: {
  name: string;
  price: number;
  duration: number;
}) {
  const res = await http.post("/plans", payload);
  return res.data;
}

export async function getPlans(params?: any) {
  const res = await http.get("/plans", { params });
  return res.data;
}

export async function getPlan(id: string | number) {
  const res = await http.get(`/plans/${id}`);
  return res.data;
}

export async function updatePlan(id: string | number, payload: any) {
  const res = await http.put(`/plans/${id}`, payload);
  return res.data;
}

export async function archivePlan(id: string | number) {
  const res = await http.put(`/plans/${id}`);
  return res.data;
}

export async function activatePlan(id: string | number) {
  const res = await http.put(`/plans/${id}`);
  return res.data;
}

export async function deletePlan(id: string | number) {
  const res = await http.delete(`/plans/${id}`);
  return res.data;
}

// ============================================
// Subscription Endpoints
// ============================================

export async function createSubscriptionSession(payload: any) {
  const res = await http.post("/subscriptions/create-session", payload);
  return res.data;
}

export async function getSubscriptions(params?: any) {
  const res = await http.get("/subscriptions", { params });
  return res.data;
}

export async function getAdminSubscriptions(params?: any) {
  const res = await http.get("/admin-subscriptions", { params });
  return res.data;
}

export async function getSubscription(id: string | number) {
  const res = await http.get(`/subscriptions/${id}`);
  return res.data;
}

export async function getStripePublishableKey() {
  const res = await http.get("/subscriptions/stripe-publishable-key");
  return res.data;
}

export async function cancelSubscription(id: string | number) {
  const res = await http.put(`/subscriptions/${id}/cancel`);
  return res.data;
}

// ============================================
// Organizations Endpoints
// ============================================

export async function getOrganizations(params?: any) {
  const res = await http.get("/organizations", { params });
  return res.data;
}

export async function getOrganization(id: string | number) {
  const res = await http.get(`/organizations/${id}`);
  return res.data;
}

export async function updateOrganization(id: string | number, payload: any) {
  const res = await http.put(`/organizations/${id}`, payload);
  return res.data;
}

// ============================================
// Dashboard Endpoints
// ============================================

export async function getDashboardReport() {
  const res = await http.get(`/dashboard/report`);
  return res.data;
}

export async function getRecentAudit() {
  const res = await http.get(`/dashboard/recent-audit`);
  return res.data;
}

export async function getRecentInvoice() {
  const res = await http.get(`/dashboard/recent-invoice`);
  return res.data;
}

export async function getRecentOrganizations() {
  const res = await http.get(`/admin-dashboard/recent-organizations`);
  return res.data;
}

export async function getRecentPayments() {
  const res = await http.get(`/admin-dashboard/recent-payments`);
  return res.data;
}

export async function getRecentUserRegistrations() {
  const res = await http.get(`/admin-dashboard/recent-user-registrations`);
  return res.data;
}

export async function getAdminDashboardReport() {
  const res = await http.get(`/admin-dashboard/dashboard-report`);
  return res.data;
}

// ============================================
// Website Audits Endpoints
// ============================================

export async function createWebsiteAudits(payload: any) {
  const res = await http.post("/website-audits", payload);
  return res.data;
}

export async function getWebsiteAudits(params?: any) {
  const res = await http.get("/website-audits", { params });
  return res.data;
}

export async function getWebsiteAuditDetails(id: string) {
  const res = await http.get(`/website-audits/${id}`);
  return res.data;
}

// ============================================
// Settings Endpoints
// ============================================

export async function createSettingsPaymentGateway(payload: any) {
  const res = await http.post("/settings/payment-gateway", payload);
  return res.data;
}

export async function getSettingsPaymentGateway() {
  const res = await http.get("/settings/payment-gateway");
  return res.data;
}

export async function updateSettingPaymentGateway(
  id: string | number,
  payload: any,
) {
  const res = await http.put(`/settings/payment-gateway/${id}`, payload);
  return res.data;
}

// ============================================
// Role Endpoints
// ============================================

export async function createRole(payload: { name: string; isSystem: boolean }) {
  const res = await http.post("/role", payload);
  return res.data;
}

export async function getRoles(params?: any) {
  const res = await http.get("/role", { params });
  return res.data;
}

export async function getRole(id: number | string) {
  const res = await http.get(`/role/${id}`);
  return res.data;
}

export async function updateRole(
  id: number | string,
  payload: {
    name?: string;
    isSystem?: boolean;
  },
) {
  const res = await http.patch(`/role/${id}`, payload);
  return res.data;
}

export async function deleteRole(id: number | string) {
  const res = await http.delete(`/role/${id}`);
  return res.data;
}

// ============================================
// Resource Endpoints
// ============================================

export async function createResource(payload: { name: string }) {
  const res = await http.post("/resource", payload);
  return res.data;
}

export async function getResources(params?: any) {
  const res = await http.get("/resource", { params });
  return res.data;
}

export async function getResource(id: number | string) {
  const res = await http.get(`/resource/${id}`);
  return res.data;
}

export async function updateResource(
  id: number | string,
  payload: {
    name?: string;
    slug?: string;
  },
) {
  const res = await http.patch(`/resource/${id}`, payload);
  return res.data;
}

export async function deleteResource(id: number | string) {
  const res = await http.delete(`/resource/${id}`);
  return res.data;
}

// ============================================
// Permission Endpoints
// ============================================

export async function createPermission(payload: {
  roleId: number;
  resourceId: number;
  action: any;
}) {
  const res = await http.post("/permission", payload);
  return res.data;
}

export async function getPermissions(params?: any) {
  const res = await http.get("/permission", { params });
  return res.data;
}

export async function getPermission(id: number | string) {
  const res = await http.get(`/permission/${id}`);
  return res.data;
}

export async function updatePermission(
  id: number | string,
  payload: {
    roleId?: number;
    resourceId?: number;
    action?: any;
  },
) {
  const res = await http.patch(`/permission/${id}`, payload);
  return res.data;
}

export async function deletePermission(id: number | string) {
  const res = await http.delete(`/permission/${id}`);
  return res.data;
}

// ============================================
// App Endpoints
// ============================================

export async function getHello() {
  const res = await http.get("/");
  return res.data;
}
