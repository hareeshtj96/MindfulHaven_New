
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const ADMINLOGIN = `${BASE_URL}/admin/admin_login`;
export const GETTHERAPIST = `${BASE_URL}/admin/admin_getTherapist`
export const GETTHERAPISTDETAILS = `${BASE_URL}/admin/admin_getTherapistDetails`
export const GETUSERS = `${BASE_URL}/admin/admin_getUsers`
export const GOTVERIFIED = `${BASE_URL}/admin/therapist_getVerified`
export const GOTBLOCKUNBLOCK = `${BASE_URL}/admin/user_blockUnblock`;
export const GETDASHBOARDDETAILS = `${BASE_URL}/admin/admin_dashboard`;
export const FETCHISSUES = `${BASE_URL}/admin/admin_issues`;
export const RESOLVEISSUE = `${BASE_URL}/admin/admin_resolveIssues`;
export const ADMINNOTIFICATIONS = `${BASE_URL}/admin/notifications`;