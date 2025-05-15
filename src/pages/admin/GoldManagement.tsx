import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/userApi';
import { updateGoldHoldings } from '../../api/userApi';
import { BoldIcon as GoldIcon, Search, Plus, Edit, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface GoldEditState {
  userId: string;
  totalGold: number;
  goldInSafe: number;
  goldMortgaged: number;
}

const GoldManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<GoldEditState | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [goldAmount, setGoldAmount] = useState<number>(0);
  
  // Gold price for reference
  const goldPrice = 5986.25;
  
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
  
  // Start editing user gold
  const startEdit = (user: any) => {
    setEditingUser({
      userId: user._id,
      totalGold: user.goldHoldings.totalGold,
      goldInSafe: user.goldHoldings.goldInSafe,
      goldMortgaged: user.goldHoldings.goldMortgaged
    });
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingUser(null);
  };
  
  // Handle edit form field changes
  const handleEditChange = (field: keyof Omit<GoldEditState, 'userId'>, value: number) => {
    if (!editingUser) return;
    
    const updates: Partial<GoldEditState> = { ...editingUser };
    
    if (field === 'totalGold') {
      // When total gold is changed, adjust goldInSafe
      updates.totalGold = value;
      
      // Keep goldMortgaged the same if possible, adjust goldInSafe
      if (value >= editingUser.goldMortgaged) {
        updates.goldInSafe = value - editingUser.goldMortgaged;
      } else {
        // If totalGold is less than goldMortgaged, reset both
        updates.goldMortgaged = value;
        updates.goldInSafe = 0;
      }
    } else if (field === 'goldInSafe') {
      updates.goldInSafe = value;
      updates.goldMortgaged = editingUser.totalGold - value;
    } else if (field === 'goldMortgaged') {
      updates.goldMortgaged = value;
      updates.goldInSafe = editingUser.totalGold - value;
    }
    
    setEditingUser({ ...editingUser, ...updates });
  };
  
  // Save gold updates
  const saveGoldUpdates = async () => {
    if (!editingUser) return;
    
    try {
      // Validate that the sum equals totalGold
      if (Math.abs((editingUser.goldInSafe + editingUser.goldMortgaged) - editingUser.totalGold) > 0.001) {
        throw new Error('Sum of gold in safe and mortgaged gold must equal total gold');
      }
      
      // Save to server
      await updateGoldHoldings(editingUser.userId, {
        totalGold: editingUser.totalGold,
        goldInSafe: editingUser.goldInSafe,
        goldMortgaged: editingUser.goldMortgaged
      });
      
      // Update local state
      setUsers(users.map(user => {
        if (user._id === editingUser.userId) {
          return {
            ...user,
            goldHoldings: {
              totalGold: editingUser.totalGold,
              goldInSafe: editingUser.goldInSafe,
              goldMortgaged: editingUser.goldMortgaged
            }
          };
        }
        return user;
      }));
      
      toast.success('Gold holdings updated successfully');
      setEditingUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Error updating gold holdings');
    }
  };
  
  // Open add gold modal
  const openAddModal = (userId: string) => {
    setSelectedUserId(userId);
    setGoldAmount(0);
    setShowAddModal(true);
  };
  
  // Close add gold modal
  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedUserId('');
    setGoldAmount(0);
  };
  
  // Add gold to user
  const handleAddGold = async () => {
    if (!selectedUserId || goldAmount <= 0) return;
    
    try {
      const user = users.find(user => user._id === selectedUserId);
      if (!user) return;
      
      const newTotalGold = user.goldHoldings.totalGold + goldAmount;
      const newGoldInSafe = user.goldHoldings.goldInSafe + goldAmount;
      
      await updateGoldHoldings(selectedUserId, {
        totalGold: newTotalGold,
        goldInSafe: newGoldInSafe,
        goldMortgaged: user.goldHoldings.goldMortgaged
      });
      
      // Update local state
      setUsers(users.map(u => {
        if (u._id === selectedUserId) {
          return {
            ...u,
            goldHoldings: {
              totalGold: newTotalGold,
              goldInSafe: newGoldInSafe,
              goldMortgaged: u.goldHoldings.goldMortgaged
            }
          };
        }
        return u;
      }));
      
      toast.success(`Added ${goldAmount}g of gold successfully`);
      closeAddModal();
    } catch (error: any) {
      toast.error(error.message || 'Error adding gold');
    }
  };
  
  // Calculate totals
  const totalGoldHoldings = users.reduce((sum, user) => sum + (user.goldHoldings?.totalGold || 0), 0);
  const totalGoldValue = totalGoldHoldings * goldPrice;
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">Gold Management</h1>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-[#D4AF37] shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <GoldIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Total Gold Holdings</h3>
          </div>
          <p className="text-[#D4AF37] text-2xl font-bold">{totalGoldHoldings.toFixed(2)} g</p>
          <p className="text-gray-500 text-sm mt-1">Value: ₹{totalGoldValue.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <GoldIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Current Gold Rate</h3>
          </div>
          <p className="text-white text-2xl font-bold">₹{goldPrice.toLocaleString('en-IN')}/g</p>
          <p className="text-green-500 text-sm mt-1">+0.65% today</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <GoldIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Total Users with Gold</h3>
          </div>
          <p className="text-white text-2xl font-bold">
            {users.filter(user => user.goldHoldings?.totalGold > 0).length}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Out of {users.length} total users
          </p>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-t-[#D4AF37] border-r-[#D4AF37] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-400">Loading gold data...</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Gold
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Gold in Safe
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Gold Mortgaged
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Value (₹)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.formData?.fullName || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Total Gold */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.userId === user._id ? (
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={editingUser.totalGold}
                          onChange={(e) => handleEditChange('totalGold', Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      ) : (
                        <div className="flex items-center text-sm">
                          <GoldIcon size={14} className="text-[#D4AF37] mr-1" />
                          <span className="text-[#D4AF37] font-medium">
                            {user.goldHoldings?.totalGold || 0} g
                          </span>
                        </div>
                      )}
                    </td>
                    
                    {/* Gold in Safe */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.userId === user._id ? (
                        <input
                          type="number"
                          min="0"
                          max={editingUser.totalGold}
                          step="0.1"
                          value={editingUser.goldInSafe}
                          onChange={(e) => handleEditChange('goldInSafe', Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {user.goldHoldings?.goldInSafe || 0} g
                        </span>
                      )}
                    </td>
                    
                    {/* Gold Mortgaged */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser?.userId === user._id ? (
                        <input
                          type="number"
                          min="0"
                          max={editingUser.totalGold}
                          step="0.1"
                          value={editingUser.goldMortgaged}
                          onChange={(e) => handleEditChange('goldMortgaged', Number(e.target.value))}
                          className="w-20 px-2 py-1 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {user.goldHoldings?.goldMortgaged || 0} g
                        </span>
                      )}
                    </td>
                    
                    {/* Value */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[#D4AF37] font-medium">
                        ₹{((user.goldHoldings?.totalGold || 0) * goldPrice).toLocaleString('en-IN')}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingUser?.userId === user._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={saveGoldUpdates}
                            className="text-green-500 hover:text-green-400"
                            title="Save"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-500 hover:text-red-400"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEdit(user)}
                            className="text-gray-400 hover:text-[#D4AF37]"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => openAddModal(user._id)}
                            className="text-gray-400 hover:text-[#D4AF37]"
                            title="Add Gold"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Add Gold Modal */}
      {showAddModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
              onClick={closeAddModal}
            ></div>
            
            <div className="inline-block align-bottom bg-gray-900 rounded-lg border border-gray-800 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[#D4AF37] bg-opacity-20 sm:mx-0 sm:h-10 sm:w-10">
                    <GoldIcon className="text-[#D4AF37]" size={20} />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-[#D4AF37]">
                      Add Gold to User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        Enter the amount of gold to add to the user's safe balance.
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="goldAmount" className="block text-sm font-medium text-gray-400">
                        Gold Amount (grams)
                      </label>
                      <input
                        type="number"
                        id="goldAmount"
                        min="0"
                        step="0.1"
                        value={goldAmount}
                        onChange={(e) => setGoldAmount(Number(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        Value: <span className="text-[#D4AF37]">₹{(goldAmount * goldPrice).toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#D4AF37] text-base font-medium text-black hover:bg-[#FFD700] focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddGold}
                >
                  Add Gold
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeAddModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoldManagement;