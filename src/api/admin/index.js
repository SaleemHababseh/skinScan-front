// Admin API exports
export { getUserInfoById, getAllUsersInfo, getUserInfoByRole } from './getUserInfo.js';
export { getAllRecords, getRecordsByUserId, getRecordByImageId, removeRecordByImageId } from './records.js';
export { suspendUser, acceptDoctor, getNotAcceptedDoctors, getDoctorCV } from './userManagement.js';
export { getReportsByStatus } from './reports.js';
