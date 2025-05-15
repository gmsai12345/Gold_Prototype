import React from 'react';
import { Settings, Lock, Bell, HelpCircle, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSettings: React.FC = () => {
  const { userData } = useAuth();
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">Admin Settings</h1>
      
      {/* Admin information card */}
      <div className="bg-gray-900 p-6 rounded-lg border border-[#D4AF37] shadow-md mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#D4AF37] bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield size={50} className="text-[#D4AF37]" />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">Administrator Account</h2>
            <p className="text-gray-400 mt-1">{userData?.email}</p>
            
            <div className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
              <Shield size={12} className="mr-1" /> Super Admin
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center">
                <User size={16} className="text-[#D4AF37] mr-2" />
                <span className="text-gray-300">Account ID: {userData?._id.slice(-8)}</span>
              </div>
              <div className="flex items-center">
                <Lock size={16} className="text-[#D4AF37] mr-2" />
                <span className="text-gray-300">Last login: Today, 09:45 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <Settings className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-lg font-medium text-[#D4AF37]">System Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="loanInterestRate" className="block text-sm font-medium text-gray-300">
                Default Loan Interest Rate (%)
              </label>
              <input
                type="number"
                id="loanInterestRate"
                min="0"
                max="50"
                step="0.1"
                defaultValue="11.0"
                className="ml-2 w-20 px-2 py-1 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="maxLoanPercentage" className="block text-sm font-medium text-gray-300">
                Max Loan to Value Ratio (%)
              </label>
              <input
                type="number"
                id="maxLoanPercentage"
                min="0"
                max="100"
                step="1"
                defaultValue="70"
                className="ml-2 w-20 px-2 py-1 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="goldPriceFeed" className="block text-sm font-medium text-gray-300">
                Gold Price Feed Source
              </label>
              <select
                id="goldPriceFeed"
                defaultValue="manual"
                className="ml-2 px-2 py-1 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              >
                <option value="manual">Manual Entry</option>
                <option value="api">Live API</option>
                <option value="exchange">Exchange Feed</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <label htmlFor="maintenanceMode" className="block text-sm font-medium text-gray-300">
                Maintenance Mode
              </label>
              <div className="inline-flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <Bell className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-lg font-medium text-[#D4AF37]">Notification Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-300">New user registrations</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-300">New loan applications</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-300">Loan repayment alerts</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-300">System alerts</span>
              </label>
            </div>
            
            <div className="mt-4">
              <label htmlFor="emailNotifications" className="block text-sm font-medium text-gray-300 mb-1">
                Email Notification Frequency
              </label>
              <select
                id="emailNotifications"
                defaultValue="immediate"
                className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <Lock className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-lg font-medium text-[#D4AF37]">Security Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-300">Two-factor authentication</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-300">Email notifications for login attempts</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-300">IP address restrictions</span>
              </label>
            </div>
            
            <div className="mt-4">
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-300 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                id="sessionTimeout"
                min="5"
                max="480"
                step="5"
                defaultValue="60"
                className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              />
            </div>
            
            <div className="mt-4">
              <button className="w-full px-4 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#FFD700] transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help section */}
      <div className="mt-6 bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
            <HelpCircle className="text-[#D4AF37]" size={20} />
          </div>
          <h3 className="text-lg font-medium text-[#D4AF37]">Help & Support</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="font-medium text-white mb-2">Admin Guide</h4>
            <p className="text-sm text-gray-400 mb-3">
              Comprehensive documentation for administrative functions and best practices.
            </p>
            <button className="text-[#D4AF37] text-sm hover:underline">
              View Documentation
            </button>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="font-medium text-white mb-2">Technical Support</h4>
            <p className="text-sm text-gray-400 mb-3">
              Get in touch with our technical team for system-related issues.
            </p>
            <button className="text-[#D4AF37] text-sm hover:underline">
              Contact Support
            </button>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-md">
            <h4 className="font-medium text-white mb-2">Release Notes</h4>
            <p className="text-sm text-gray-400 mb-3">
              Latest updates and changes to the Gold Storage & Loan Management System.
            </p>
            <button className="text-[#D4AF37] text-sm hover:underline">
              View Release Notes
            </button>
          </div>
        </div>
      </div>
      
      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <button className="px-6 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#FFD700] transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;