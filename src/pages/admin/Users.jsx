import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  MoreVertical,
  UserCheck,
  UserX,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Avatar from "../../components/ui/Avatar";
import useAuthStore from "../../store/auth-store";
import {
  getAllUsersInfo,
  getUserInfoByRole,
  getUserInfoById,
  getRecordsByUserId,
  suspendUser,
  removeRecordByImageId,
} from "../../api/admin";
import { getDoctorAcceptationResult } from "../../api/users/getDoctorAcceptationResult";

const AdminUsers = () => {
  const { user: currentAuthUser, token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userRecords, setUserRecords] = useState([]);  const [doctorAcceptanceStatus, setDoctorAcceptanceStatus] = useState(null);  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Real users data from API
  const [users, setUsers] = useState([]);// Load users data from API
  const loadUsersData = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      let userData = [];

      if (roleFilter === "all") {
        userData = await getAllUsersInfo(token);
      } else {
        userData = await getUserInfoByRole(roleFilter, token);
      }

      // Format user data to match expected structure
      const formattedUsers = Array.isArray(userData)
        ? userData.map((user) => {
            const userId = user.user_id || user.id;

            return {
              id: userId,
              firstName: user.name ? user.name.split(" ")[0] : "",
              lastName: user.name
                ? user.name.split(" ").slice(1).join(" ")
                : "",
              email: user.email || "",
              role: user.role || "patient",
              status: user.suspension ? "suspended" : "active",
              createdAt: user.signup_date,
            };
          })
        : [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, roleFilter]);
  useEffect(() => {
    // Load users from API
    if (currentAuthUser?.id && token) {
      loadUsersData();
    }
  }, [currentAuthUser?.id, token, roleFilter, loadUsersData]); // Handle user suspension toggle
  const handleToggleSuspension = async (userId, currentStatus) => {
    const action = currentStatus === "suspended" ? "reactivate" : "suspend";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await suspendUser(userId, token);
        // Reload users data
        loadUsersData();
      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        alert(`Failed to ${action} user`);
      }
    }
  };

  // Handle deleting user record
  const handleDeleteUserRecord = async (recordId) => {
    if (window.confirm("Are you sure you want to delete this user record?")) {
      try {
        await removeRecordByImageId(recordId, token);
        // Reload users data
        loadUsersData();
        alert("User record deleted successfully");
      } catch (error) {
        console.error("Error deleting user record:", error);
        alert("Failed to delete user record");
      }
    }
  };

  // Handle viewing user details
  const handleViewUserDetails = async (user) => {
    try {
      setIsLoading(true);
      const details = await getUserInfoById(user.id, token);
      
      // Format the details to match our expected structure
      const formattedDetails = {
        id: details.user_id || details.id,
        name: details.name,
        email: details.email,
        role: details.role,
        signupDate: details.signup_date,
        suspension: details.suspension,
        ...details, // Include any additional fields
      };

      setUserDetails(formattedDetails);
      setCurrentUser(user);

      // Try to get user records, but don't fail if 404
      try {
        const records = await getRecordsByUserId(user.id, token);
        setUserRecords(Array.isArray(records) ? records : []);
      } catch (recordError) {
        console.log("No records found for user:", recordError);
        setUserRecords([]);
      }

      // If user is a doctor, fetch their acceptance status
      if (details.role === "doctor") {
        try {
          const acceptanceResult = await getDoctorAcceptationResult(token);
          setDoctorAcceptanceStatus(acceptanceResult);
        } catch (error) {
          console.error("Error fetching doctor acceptance status:", error);
          setDoctorAcceptanceStatus(null);
        }
      } else {
        setDoctorAcceptanceStatus(null);
      }

      setShowUserDetailsModal(true);
    } catch (error) {
      console.error("Error loading user details:", error);
      setErrorMessage("Failed to load user details. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };
  // Handle user creation/update - placeholder functions will be integrated with API later

  // Filter users based on search term, role filter, and status filter
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });
  // Handle opening modal for creating or editing users
  const handleOpenUserModal = (user = null) => {
    setCurrentUser(user);
    setShowUserModal(true);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Users Management
          </h1>
          <p className="mt-1 text-neutral-600">
            Manage users, roles, and permissions
          </p>
        </div>
        {/* <Button onClick={() => handleOpenUserModal()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>{" "} */}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search users by name or email..."
            className="pl-10"
            value={searchTerm}            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm text-neutral-900"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>

          <select
            className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm text-neutral-900"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr className="border-b border-neutral-200 text-left text-sm font-medium text-neutral-500">
                  <th className="whitespace-nowrap px-4 py-3">User</th>
                  <th className="whitespace-nowrap px-4 py-3">Email</th>
                  <th className="whitespace-nowrap px-4 py-3">Role</th>
                  <th className="whitespace-nowrap px-4 py-3">Status</th>
                  <th className="whitespace-nowrap px-4 py-3">Created</th>
                  <th className="whitespace-nowrap px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-sm">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center">
                        <Avatar
                          src={user.avatarUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          fallback={`${user.firstName[0]}${user.lastName[0]}`}
                          className="h-8 w-8"
                        />
                        <span className="ml-2 font-medium text-neutral-900">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                            : user.role === "doctor"
                            ? "bg-secondary-50 text-secondary-700 dark:bg-secondary-900/20 dark:text-secondary-400"
                            : "bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        }`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.status === "active"
                            ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                            : user.status === "suspended"
                            ? "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400"
                            : "bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </td>                    <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {/* View Details button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 border-blue-300 hover:bg-blue-50"
                          onClick={() => handleViewUserDetails(user)}
                        >
                          <Users className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                        {/* Suspend/Reactivate toggle button */}
                        {user.id !== currentAuthUser?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              user.status === "suspended"
                                ? "border-success-500 bg-success-50 text-success-700 hover:bg-success-100 hover:text-success-800"
                                : "border-warning-500 bg-warning-50 text-warning-700 hover:bg-warning-100 hover:text-warning-800"
                            }
                            onClick={() =>
                              handleToggleSuspension(user.id, user.status)
                            }
                          >
                            {user.status === "suspended" ? (
                              <>
                                <UserCheck className="h-3 w-3 mr-1" />
                                Reactivate
                              </>
                            ) : (
                              <>
                                <UserX className="h-3 w-3 mr-1" />
                                Suspend
                              </>
                            )}
                          </Button>
                        )}
                        {/* Edit button */}
                        {/* <Button
                          variant="outline"
                          size="sm"
                          className="border-neutral-300 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-800"
                          onClick={() => handleOpenUserModal(user)}
                        >
                          <Edit className="h-3 w-3 mr-1" />                          Edit
                        </Button> */}
                        {/* Delete button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-error-500 bg-error-50 text-error-700 hover:bg-error-100 hover:text-error-800"
                          onClick={() => handleDeleteUserRecord(user.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete record
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
            <div className="text-sm text-neutral-600">
              Showing{" "}
              <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> users
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled={true}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={true}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <Users className="h-12 w-12 text-neutral-400" />
          <p className="mt-4 text-lg font-medium text-neutral-900">
            No users found
          </p>
          <p className="mt-1 text-neutral-600">
            {searchTerm || roleFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Create a new user to get started"}
          </p>
          {searchTerm === "" &&
            roleFilter === "all" &&
            statusFilter === "all" && (
              <Button className="mt-4" onClick={() => handleOpenUserModal()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add User
              </Button>
            )}
        </Card>
      )}      {/* Modal for creating/editing users would be here in a real implementation */}
      {showUserModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-neutral-900">
              {currentUser ? "Edit User" : "Create New User"}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              {currentUser
                ? "Update user details below"
                : "Fill in the details below to create a new user"}
            </p>

            {/* Form would be here */}
            <div className="mt-4 text-center">
              <p className="text-neutral-600">
                User form implementation omitted for simplicity
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowUserModal(false)}>
                Cancel
              </Button>
              <Button>{currentUser ? "Update User" : "Create User"}</Button>
            </div>
          </Card>
        </div>,
        document.body
      )}      {/* User Details Modal */}
      {showUserDetailsModal && currentUser && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                User Details: {currentUser.firstName} {currentUser.lastName}
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowUserDetailsModal(false)}
              >
                ×
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3">
                  User Information
                </h3>
                {userDetails ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">ID:</span> {userDetails.id}
                    </p>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {userDetails.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {userDetails.email}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span>{" "}
                      {userDetails.role}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {userDetails.suspension ? "Suspended" : "Active"}
                    </p>
                    <p>
                      <span className="font-medium">Signup Date:</span>{" "}
                      {userDetails.signupDate
                        ? new Date(userDetails.signupDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    {userDetails.role === "doctor" && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Doctor Status
                        </h4>
                        {doctorAcceptanceStatus ? (
                          <div className="space-y-1">
                            <p>
                              <span className="font-medium">
                                Acceptance Status:
                              </span>
                              <span
                                className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  doctorAcceptanceStatus.status === true ||
                                  doctorAcceptanceStatus.status ===
                                    "accepted" ||
                                  doctorAcceptanceStatus.status === "approved"
                                    ? "bg-green-50 text-green-700"
                                    : doctorAcceptanceStatus.status === false ||
                                      doctorAcceptanceStatus.status ===
                                        "rejected" ||
                                      doctorAcceptanceStatus.status === "denied"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-yellow-50 text-yellow-700"
                                }`}
                              >
                                {doctorAcceptanceStatus.status === true ||
                                doctorAcceptanceStatus.status === "accepted" ||
                                doctorAcceptanceStatus.status === "approved"
                                  ? "Accepted"
                                  : doctorAcceptanceStatus.status === false ||
                                    doctorAcceptanceStatus.status ===
                                      "rejected" ||
                                    doctorAcceptanceStatus.status === "denied"
                                  ? "Rejected"
                                  : "Pending"}
                              </span>
                            </p>
                            {doctorAcceptanceStatus.message && (
                              <p>
                                <span className="font-medium">Message:</span>{" "}
                                {doctorAcceptanceStatus.message}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-600">
                            Doctor acceptance status not available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-600">
                    Loading user details...
                  </p>
                )}
              </div>
              {/* User Records */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3">
                  User Records ({userRecords.length})
                </h3>
                {userRecords.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {userRecords.map((record, index) => {
                      const recordInfo = record.records_info || record;
                      return (
                        <div
                          key={recordInfo.img_id || index}
                          className="p-3 border border-neutral-200 rounded-md"
                        >
                          <p className="text-sm">
                            <span className="font-medium">
                              Record #{recordInfo.img_id || index + 1}
                            </span>
                          </p>
                          <p className="text-xs text-neutral-600">
                            {recordInfo.test_date
                              ? new Date(
                                  recordInfo.test_date
                                ).toLocaleDateString()
                              : "Date N/A"}
                          </p>
                          {recordInfo.test_result && (
                            <p className="text-xs">
                              <span className="font-medium">Diagnosis:</span>{" "}
                              {recordInfo.test_result.toUpperCase()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-600">
                    No records found for this user.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowUserDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}      {/* Error Modal */}
      {showErrorModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6 text-center">
            <h2 className="text-xl font-bold text-error-900 mb-2">
              Error
            </h2>
            <p className="text-neutral-600 mb-6">
              {errorMessage}
            </p>
            <Button variant="outline" onClick={() => setShowErrorModal(false)}>
              Close
            </Button>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminUsers;
