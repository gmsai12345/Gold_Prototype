import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BoldIcon as GoldIcon, Coins, FileText, LogOut, User, Menu, X, ArrowDown } from 'lucide-react';

// User pages
import UserHome from './UserHome';
import GoldInventory from './GoldInventory';
import LoanApplication from './LoanApplication';
import UserLoans from './UserLoans';
import UserProfile from './UserProfile';

const UserDashboard: React.FC = () => {
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (!userData) {
      navigate('/');
    }
  }, [userData, navigate]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 bg-gray-900 flex-col fixed h-full border-r border-[#D4AF37] z-10">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <GoldIcon className="text-[#D4AF37]" size={24} />
            <h1 className="text-[#D4AF37] font-bold text-xl font-serif">Gold Vault</h1>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <User className="text-black" size={20} />
            </div>
            <div>
              <p className="text-white font-medium">{userData?.formData?.fullName || userData?.email}</p>
              <p className="text-gray-400 text-xs">Client</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/user"
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/inventory"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <GoldIcon size={20} />
                <span>Gold Inventory</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/apply-loan"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <Coins size={20} />
                <span>Apply for Loan</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/loans"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <FileText size={20} />
                <span>My Loans</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/profile"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <User size={20} />
                <span>Profile</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-3 text-gray-300 hover:text-[#D4AF37] w-full p-2"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out border-r border-[#D4AF37]`}
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GoldIcon className="text-[#D4AF37]" size={24} />
            <h1 className="text-[#D4AF37] font-bold text-xl font-serif">Gold Vault</h1>
          </div>
          <button onClick={toggleSidebar} className="text-gray-300 hover:text-[#D4AF37]">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <User className="text-black" size={20} />
            </div>
            <div>
              <p className="text-white font-medium">{userData?.formData?.fullName || userData?.email}</p>
              <p className="text-gray-400 text-xs">Client</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/user"
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
                onClick={closeSidebar}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/inventory"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
                onClick={closeSidebar}
              >
                <GoldIcon size={20} />
                <span>Gold Inventory</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/apply-loan"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
                onClick={closeSidebar}
              >
                <Coins size={20} />
                <span>Apply for Loan</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/loans"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
                onClick={closeSidebar}
              >
                <FileText size={20} />
                <span>My Loans</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user/profile"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
                onClick={closeSidebar}
              >
                <User size={20} />
                <span>Profile</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-3 text-gray-300 hover:text-[#D4AF37] w-full p-2"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="md:ml-64 flex-1">
        {/* Top header */}
        <header className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-300 hover:text-[#D4AF37]"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4">
            {/* Gold price ticker */}
            <div className="hidden sm:flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-md">
              <GoldIcon size={16} className="text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-semibold">₹5,986.25/g</span>
              <ArrowDown size={14} className="text-red-500" />
            </div>
            
            {/* User profile preview */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <User className="text-black" size={16} />
              </div>
              <span className="text-white text-sm hidden sm:inline">{userData?.formData?.fullName || userData?.email}</span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<UserHome />} />
            <Route path="/inventory" element={<GoldInventory />} />
            <Route path="/apply-loan" element={<LoanApplication />} />
            <Route path="/loans" element={<UserLoans />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;