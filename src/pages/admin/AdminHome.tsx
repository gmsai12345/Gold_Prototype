import React, { useState, useEffect } from 'react';
import { getAllUsers, getPendingForms } from '../../api/userApi';
import { getPendingLoans, getAllLoans } from '../../api/loanApi';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Users, FileText, CoinsIcon, BoldIcon as GoldIcon, ArrowRightIcon, TrendingUpIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminHome: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [pendingForms, setPendingForms] = useState<any[]>([]);
  const [pendingLoans, setPendingLoans] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, pendingFormsData, pendingLoansData, loansData] = await Promise.all([
          getAllUsers(),
          getPendingForms(),
          getPendingLoans(),
          getAllLoans()
        ]);
        
        setUsers(usersData);
        setPendingForms(pendingFormsData);
        setPendingLoans(pendingLoansData);
        setLoans(loansData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate total gold holdings
  const totalGold = users.reduce((sum, user) => sum + (user.goldHoldings?.totalGold || 0), 0);
  const totalGoldInSafe = users.reduce((sum, user) => sum + (user.goldHoldings?.goldInSafe || 0), 0);
  const totalGoldMortgaged = users.reduce((sum, user) => sum + (user.goldHoldings?.goldMortgaged || 0), 0);
  
  // Calculate total loans
  const totalLoanAmount = loans
    .filter(loan => loan.status === 'approved')
    .reduce((sum, loan) => sum + loan.loanAmount, 0);
  
  // Gold distribution data for pie chart
  const goldData = [
    { name: 'Gold in Safe', value: totalGoldInSafe },
    { name: 'Gold Mortgaged', value: totalGoldMortgaged }
  ];
  
  // Colors for pie chart
  const COLORS = ['#D4AF37', '#FFD700'];
  
  // Recent activity data
  const recentActivity = [
    { date: '15 Jul 2025', action: 'New user registration', user: 'rahul@example.com' },
    { date: '14 Jul 2025', action: 'Loan application approved', user: 'john@example.com' },
    { date: '13 Jul 2025', action: 'Gold deposit added', user: 'sarah@example.com' },
    { date: '12 Jul 2025', action: 'User form approved', user: 'david@example.com' }
  ];
  
  // Monthly data for chart
  const monthlyData = [
    { month: 'Jan', gold: 120, loans: 85 },
    { month: 'Feb', gold: 145, loans: 100 },
    { month: 'Mar', gold: 160, loans: 120 },
    { month: 'Apr', gold: 170, loans: 130 },
    { month: 'May', gold: 185, loans: 145 },
    { month: 'Jun', gold: 200, loans: 160 },
    { month: 'Jul', gold: 220, loans: 175 }
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">Admin Dashboard</h1>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-t-[#D4AF37] border-r-[#D4AF37] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-400">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Overview stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-[#D4AF37] shadow-md">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
                  <Users className="text-[#D4AF37]" size={20} />
                </div>
                <h3 className="text-gray-300 font-medium">Total Users</h3>
              </div>
              <p className="text-[#D4AF37] text-2xl font-bold">{users.length}</p>
              <p className="text-gray-500 text-sm mt-1">
                {pendingForms.length} awaiting approval
              </p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
                  <GoldIcon className="text-[#D4AF37]" size={20} />
                </div>
                <h3 className="text-gray-300 font-medium">Total Gold</h3>
              </div>
              <p className="text-white text-2xl font-bold">{totalGold.toFixed(2)} g</p>
              <p className="text-gray-500 text-sm mt-1">
                {((totalGoldMortgaged / totalGold) * 100).toFixed(2)}% mortgaged
              </p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
                  <CoinsIcon className="text-[#D4AF37]" size={20} />
                </div>
                <h3 className="text-gray-300 font-medium">Total Loans</h3>
              </div>
              <p className="text-white text-2xl font-bold">₹{totalLoanAmount.toLocaleString('en-IN')}</p>
              <p className="text-gray-500 text-sm mt-1">
                {pendingLoans.length} pending applications
              </p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
                  <FileText className="text-[#D4AF37]" size={20} />
                </div>
                <h3 className="text-gray-300 font-medium">Pending Approvals</h3>
              </div>
              <p className="text-white text-2xl font-bold">
                {pendingForms.length + pendingLoans.length}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-gray-500 text-sm">Forms: {pendingForms.length}</p>
                <p className="text-gray-500 text-sm">Loans: {pendingLoans.length}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly performance chart */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#D4AF37] font-medium">Monthly Performance</h3>
                <div className="flex items-center text-green-500 text-sm">
                  <TrendingUpIcon size={16} className="mr-1" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" tick={{ fill: '#D4AF37' }} />
                    <YAxis tick={{ fill: '#D4AF37' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#D4AF37' }}
                      itemStyle={{ color: '#D4AF37' }}
                    />
                    <Legend wrapperStyle={{ color: '#D4AF37' }} />
                    <Bar name="Gold (g)" dataKey="gold" fill="#D4AF37" />
                    <Bar name="Loans (₹10k)" dataKey="loans" fill="#FFD700" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Gold distribution chart */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
              <h3 className="text-[#D4AF37] font-medium mb-4">Gold Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={goldData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {goldData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}g`, 'Amount']}
                      contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#D4AF37' }}
                      itemStyle={{ color: '#D4AF37' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending approvals */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#D4AF37] font-medium">Pending Approvals</h3>
                <Link to="/admin/approvals" className="text-sm text-[#D4AF37] flex items-center">
                  View All <ArrowRightIcon size={16} className="ml-1" />
                </Link>
              </div>
              
              {pendingForms.length > 0 || pendingLoans.length > 0 ? (
                <div>
                  {/* Form approvals */}
                  {pendingForms.slice(0, 3).map((form, index) => (
                    <div key={`form-${index}`} className="p-3 bg-gray-800 rounded-md mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-300 text-sm flex items-center">
                            <Users size={14} className="mr-1" /> User Registration
                          </p>
                          <p className="text-[#D4AF37] font-medium mt-1">{form.email}</p>
                        </div>
                        <div className="bg-yellow-900 bg-opacity-50 px-2 py-1 rounded text-yellow-300 text-xs">
                          Form
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        Submitted: {new Date(form.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  
                  {/* Loan approvals */}
                  {pendingLoans.slice(0, 3).map((loan, index) => (
                    <div key={`loan-${index}`} className="p-3 bg-gray-800 rounded-md mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-gray-300 text-sm flex items-center">
                            <CoinsIcon size={14} className="mr-1" /> Loan Application
                          </p>
                          <p className="text-[#D4AF37] font-medium mt-1">₹{loan.loanAmount.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-yellow-900 bg-opacity-50 px-2 py-1 rounded text-yellow-300 text-xs">
                          Loan
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        Applied: {new Date(loan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No pending approvals</p>
                </div>
              )}
            </div>
            
            {/* Recent activity */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
              <h3 className="text-[#D4AF37] font-medium mb-4">Recent Activity</h3>
              
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-800">
                    <div>
                      <p className="text-gray-300 text-sm">{activity.action}</p>
                      <p className="text-gray-500 text-xs">{activity.date}</p>
                    </div>
                    <p className="text-[#D4AF37] text-sm">{activity.user}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick links */}
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
              <h3 className="text-[#D4AF37] font-medium mb-4">Quick Actions</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/admin/approvals" 
                  className="p-3 bg-[#D4AF37] bg-opacity-10 border border-[#D4AF37] rounded-md hover:bg-opacity-20 transition-colors flex flex-col items-center justify-center text-center"
                >
                  <FileText className="text-[#D4AF37] mb-2" size={24} />
                  <span className="text-[#D4AF37] text-sm">Review Approvals</span>
                </Link>
                <Link 
                  to="/admin/gold" 
                  className="p-3 bg-[#D4AF37] bg-opacity-10 border border-[#D4AF37] rounded-md hover:bg-opacity-20 transition-colors flex flex-col items-center justify-center text-center"
                >
                  <GoldIcon className="text-[#D4AF37] mb-2" size={24} />
                  <span className="text-[#D4AF37] text-sm">Manage Gold</span>
                </Link>
                <Link 
                  to="/admin/loans" 
                  className="p-3 bg-[#D4AF37] bg-opacity-10 border border-[#D4AF37] rounded-md hover:bg-opacity-20 transition-colors flex flex-col items-center justify-center text-center"
                >
                  <CoinsIcon className="text-[#D4AF37] mb-2" size={24} />
                  <span className="text-[#D4AF37] text-sm">Review Loans</span>
                </Link>
                <Link 
                  to="/admin/users" 
                  className="p-3 bg-[#D4AF37] bg-opacity-10 border border-[#D4AF37] rounded-md hover:bg-opacity-20 transition-colors flex flex-col items-center justify-center text-center"
                >
                  <Users className="text-[#D4AF37] mb-2" size={24} />
                  <span className="text-[#D4AF37] text-sm">Manage Users</span>
                </Link>
              </div>
              
              <div className="mt-4 p-3 bg-gray-800 rounded-md">
                <h4 className="text-sm font-medium text-[#D4AF37] mb-2">System Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-300 text-xs">Server: Online</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-300 text-xs">Database: Connected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-300 text-xs">Auth: Active</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-300 text-xs">API: Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHome;