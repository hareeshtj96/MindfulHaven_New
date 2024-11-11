
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const REGISTERTHERAPIST = `${BASE_URL}/therapist/therapist_register`;
export const VERIFYOTP = `${BASE_URL}/therapist/therapist_OTP`;
export const LOGINTHERAPIST = `${BASE_URL}/therapist/therapist_login`;
export const UPDATETHERAPIST = `${BASE_URL}/therapist/therapist_details`;
export const GETPROFILE = `${BASE_URL}/therapist/therapist_profile`;
export const GETAPPOINTMENT = `${BASE_URL}/therapist/therapist_bookings`;
export const UPDATETIMINGS = `${BASE_URL}/therapist/therapist_updateTimings`;
export const JOINTHERAPISTVIDEO = `${BASE_URL}/therapist/therapist_video_call`;
export const CANCELAPPOINTMENTBYTHERAPIST = `${BASE_URL}/therapist/therapist_cancelAppointment`
export const GETAVAILABILITY = `${BASE_URL}/therapist/therapist_availableDetails`
export const CANCELAVAILABLESLOT = `${BASE_URL}/therapist/therapist_cancelSlot`
export const UPDATEPHOTO = `${BASE_URL}/therapist/updatePhoto`;