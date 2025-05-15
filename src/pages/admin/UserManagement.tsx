import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/userApi';
import { Search, Filter, MoreVertical, User, Shield, CheckCircle, XCircle, Clock, BoldIcon as GoldIcon } from 'lucide-react';

const formStatusMap = {
  '-1': { label: 'Rejected', color: 'bg-red-900 text-red-300' },
  '0': { label: 'Not Filled', color: 'bg-gray-700 text-gray-300' },
  '1': { label: 'Filled', color: 'bg-green-900 text-green-300' }
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.formData?.fullName && user.formData.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle user selection
  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setShowDetails(true);
  };
  
  // Close details panel
  const closeDetails = () => {
    setShowDetails(false);
  };
  
  return (
    <div className="relative">
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">User Management</h1>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            placeholder="Search users by name or email"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center">
          <button className="px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-md flex items-center hover:bg-gray-700">
            <Filter size={18} className="mr-2 text-gray-400" />
            <span>Filter</span>
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-t-[#D4AF37] border-r-[#D4AF37] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-400">Loading users...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Form Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Gold Holdings
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Registered On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800 cursor-pointer" onClick={() => handleUserSelect(user)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#D4AF37] bg-opacity-20 flex items-center justify-center">
                          <User className="text-[#D4AF37]" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.formData?.fullName || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'
                      }`}>
                        {user.isAdmin ? (
                          <>
                            <Shield size={12} className="mr-1" /> Admin
                          </>
                        ) : (
                          <>
                            <User size={12} className="mr-1" /> Client
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        formStatusMap[user.form as keyof typeof formStatusMap].color
                      }`}>
                        {user.form === 1 ? (
                          <>
                            <CheckCircle size={12} className="mr-1" />
                          </>
                        ) : user.form === -1 ? (
                          <>
                            <XCircle size={12} className="mr-1" />
                          </>
                        ) : (
                          <>
                            <Clock size={12} className="mr-1" />
                          </>
                        )}
                        {formStatusMap[user.form as keyof typeof formStatusMap].label}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <GoldIcon size={14} className="text-[#D4AF37] mr-1" />
                        <span className="text-[#D4AF37]">{user.goldHoldings?.totalGold || 0}g</span>
                        <span className="mx-1 text-gray-500">/</span>
                        <span className="text-gray-300">{user.goldHoldings?.goldInSafe || 0}g available</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-gray-400 hover:text-[#D4AF37]">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-gray-400">No users found</p>
        </div>
      )}
      
      {/* User details sidebar */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 overflow-hidden z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeDetails}
          ></div>
          
          {/* Sidebar */}
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800 shadow-xl overflow-y-auto">
                {/* Header */}
                <div className="px-4 py-6 border-b border-gray-800 flex items-start justify-between">
                  <h2 className="text-lg font-medium text-[#D4AF37]">User Details</h2>
                  <button 
                    onClick={closeDetails}
                    className="bg-gray-800 rounded-md p-1 text-gray-400 hover:text-white"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 px-4 py-6">
                  {/* User profile header */}
                  <div className="flex items-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-[#D4AF37] bg-opacity-20 flex items-center justify-center">
                      <User className="text-[#D4AF37]" size={30} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">
                        {selectedUser.formData?.fullName || 'No Name'}
                      </h3>
                      <p className="text-gray-400">{selectedUser.email}</p>
                      <div className={`inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium ${
                        selectedUser.isAdmin ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'
                      }`}>
                        {selectedUser.isAdmin ? 'Administrator' : 'Client'}
                      </div>
                    </div>
                  </div>
                  
                  {/* User details */}
                  <div className="space-y-6">
                    {/* Account Status */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Account Status</h4>
                      <div className="p-3 bg-gray-800 rounded-md">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Registration Form</span>
                          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            formStatusMap[selectedUser.form as keyof typeof formStatusMap].color
                          }`}>
                            {formStatusMap[selectedUser.form as keyof typeof formStatusMap].label}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-300">Created On</span>
                          <span className="text-sm text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                        </div>
                        {selectedUser.form === -1 && selectedUser.rejectionReason && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-300">Rejection Reason</span>
                            <p className="text-sm text-red-400 mt-1">{selectedUser.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Gold Holdings */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Gold Holdings</h4>
                      <div className="p-3 bg-gray-800 rounded-md">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-[#D4AF37] font-medium">{selectedUser.goldHoldings?.totalGold || 0}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">In Safe</p>
                            <p className="text-white font-medium">{selectedUser.goldHoldings?.goldInSafe || 0}g</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">Mortgaged</p>
                            <p className="text-white font-medium">{selectedUser.goldHoldings?.goldMortgaged || 0}g</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Personal Information */}
                    {selectedUser.formData && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Personal Information</h4>
                        <div className="p-3 bg-gray-800 rounded-md space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-400">Full Name</span>
                            <span className="text-sm text-white">{selectedUser.formData.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-400">Gender</span>
                            <span className="text-sm text-white">{selectedUser.formData.gender}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-400">Date of Birth</span>
                            <span className="text-sm text-white">
                              {new Date(selectedUser.formData.dateOfBirth).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-400">Mobile</span>
                            <span className="text-sm text-white">{selectedUser.formData.mobileNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-400">PAN Card</span>
                            <span className="text-sm text-white">{selectedUser.formData.panCardNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-400">Aadhaar</span>
                            <span className="text-sm text-white">XXXX-XXXX-{selectedUser.formData.aadhaarNumber.slice(-4)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="pt-4">
                      <button className="w-full px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#FFD700] transition-colors">
                        Edit User
                      </button>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button className="px-4 py-2 bg-gray-800 text-[#D4AF37] border border-[#D4AF37] rounded-md hover:bg-gray-700 transition-colors">
                          Update Gold
                        </button>
                        <button className="px-4 py-2 bg-gray-800 text-red-400 border border-red-400 rounded-md hover:bg-gray-700 transition-colors">
                          Disable User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;