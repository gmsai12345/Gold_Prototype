import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, BoldIcon as GoldIcon, Coins, FileText, Settings, LogOut, User, Menu, X, Shield } from 'lucide-react';

// Admin pages
import AdminHome from './AdminHome';
import UserManagement from './UserManagement';
import GoldManagement from './GoldManagement';
import LoanManagement from './LoanManagement';
import AdminSettings from './AdminSettings';
import PendingApprovals from './PendingApprovals';

const AdminDashboard: React.FC = () => {
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  React.useEffect(() => {
    if (!userData?.isAdmin) {
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
            <Shield className="text-[#D4AF37]" size={24} />
            <h1 className="text-[#D4AF37] font-bold text-xl font-serif">Gold Admin</h1>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <User className="text-black" size={20} />
            </div>
            <div>
              <p className="text-white font-medium">{userData?.email}</p>
              <p className="text-gray-400 text-xs flex items-center">
                <Shield size={12} className="mr-1" /> Admin
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin"
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
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <Users size={20} />
                <span>User Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/approvals"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <FileText size={20} />
                <span>Pending Approvals</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/gold"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <GoldIcon size={20} />
                <span>Gold Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/loans"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <Coins size={20} />
                <span>Loan Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <Settings size={20} />
                <span>Settings</span>
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
            <Shield className="text-[#D4AF37]" size={24} />
            <h1 className="text-[#D4AF37] font-bold text-xl font-serif">Gold Admin</h1>
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
              <p className="text-white font-medium">{userData?.email}</p>
              <p className="text-gray-400 text-xs flex items-center">
                <Shield size={12} className="mr-1" /> Admin
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin"
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
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
                onClick={closeSidebar}
              >
                <Users size={20} />
                <span>User Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/approvals"
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
                <span>Pending Approvals</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/gold"
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
                <span>Gold Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/loans"
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
                <span>Loan Management</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-md ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
                onClick={closeSidebar}
              >
                <Settings size={20} />
                <span>Settings</span>
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
            {/* Admin badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-[#D4AF37] bg-opacity-20 px-4 py-2 rounded-md">
              <Shield size={16} className="text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-semibold">Administrator</span>
            </div>
            
            {/* User profile preview */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <User className="text-black" size={16} />
              </div>
              <span className="text-white text-sm hidden sm:inline">{userData?.email}</span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/approvals" element={<PendingApprovals />} />
            <Route path="/gold" element={<GoldManagement />} />
            <Route path="/loans" element={<LoanManagement />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;