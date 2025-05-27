import React, { useEffect, useState } from 'react';
import { Users, Search, Filter, PlusCircle, Edit, Trash2, MoreVertical } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import useAuthStore from '../../store/auth-store';
import useAdminStore from '../../store/admin-store';

const AdminUsers = () => {
  const { user } = useAuthStore();
  const { users, loadUsers, createUser, updateUser, deleteUser, isLoading } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  
  // Filter users based on search term, role filter, and status filter
  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Handle opening modal for creating or editing users
  const handleOpenUserModal = (user = null) => {
    setCurrentUser(user);
    setShowUserModal(true);
  };
  
  // Handle user deletion
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Users Management</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Manage users, roles, and permissions</p>
        </div>
        <Button onClick={() => handleOpenUserModal()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input 
            type="text"
            placeholder="Search users by name or email..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm dark:border-neutral-700 dark:bg-neutral-800"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          
          <select
            className="rounded-md border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm dark:border-neutral-700 dark:bg-neutral-800"
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
              <thead className="bg-neutral-50 dark:bg-neutral-900">
                <tr className="border-b border-neutral-200 text-left text-sm font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  <th className="whitespace-nowrap px-4 py-3">User</th>
                  <th className="whitespace-nowrap px-4 py-3">Email</th>
                  <th className="whitespace-nowrap px-4 py-3">Role</th>
                  <th className="whitespace-nowrap px-4 py-3">Status</th>
                  <th className="whitespace-nowrap px-4 py-3">Created</th>
                  <th className="whitespace-nowrap px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
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
                        <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'admin' ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 
                        user.role === 'doctor' ? 'bg-secondary-50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400' : 
                        'bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.status === 'active' ? 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400' : 
                        user.status === 'pending' ? 'bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' : 
                        'bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-400'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-600 dark:text-neutral-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                          onClick={() => handleOpenUserModal(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-neutral-600 hover:text-error-600 dark:text-neutral-400 dark:hover:text-error-400"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled={true}>Previous</Button>
              <Button variant="outline" size="sm" disabled={true}>Next</Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex h-64 flex-col items-center justify-center text-center">
          <Users className="h-12 w-12 text-neutral-400" />
          <p className="mt-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
            No users found
          </p>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create a new user to get started'}
          </p>
          {searchTerm === '' && roleFilter === 'all' && statusFilter === 'all' && (
            <Button className="mt-4" onClick={() => handleOpenUserModal()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add User
            </Button>
          )}
        </Card>
      )}
      
      {/* Modal for creating/editing users would be here in a real implementation */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {currentUser ? 'Edit User' : 'Create New User'}
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {currentUser ? 'Update user details below' : 'Fill in the details below to create a new user'}
            </p>
            
            {/* Form would be here */}
            <div className="mt-4 text-center">
              <p className="text-neutral-600 dark:text-neutral-400">User form implementation omitted for simplicity</p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowUserModal(false)}>
                Cancel
              </Button>
              <Button>
                {currentUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;