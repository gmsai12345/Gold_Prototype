import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserLoans } from '../../api/loanApi';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { BoldIcon as GoldIcon, CoinsIcon, ArrowRightIcon, TrendingUpIcon, AlertTriangleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserHome: React.FC = () => {
  const { userData } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      if (userData?._id) {
        try {
          const loansData = await getUserLoans(userData._id);
          setLoans(loansData);
        } catch (error) {
          console.error('Error fetching loans:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLoans();
  }, [userData]);

  // Gold distribution data for pie chart
  const goldData = [
    { name: 'Gold in Safe', value: userData?.goldHoldings.goldInSafe || 0 },
    { name: 'Gold Mortgaged', value: userData?.goldHoldings.goldMortgaged || 0 }
  ];

  // Colors for pie chart
  const COLORS = ['#D4AF37', '#FFD700'];

  // Recent activity data
  const recentActivity = [
    { date: '15 Jul 2025', action: 'Gold deposit added', amount: '25.0g' },
    { date: '12 Jul 2025', action: 'Loan application submitted', amount: '₹50,000' },
    { date: '05 Jul 2025', action: 'Loan approved', amount: '₹75,000' },
    { date: '01 Jul 2025', action: 'Gold deposit added', amount: '15.0g' }
  ];

  // Gold price trend data
  const goldPriceTrend = [
    { name: 'Jan', price: 5600 },
    { name: 'Feb', price: 5700 },
    { name: 'Mar', price: 5650 },
    { name: 'Apr', price: 5800 },
    { name: 'May', price: 5900 },
    { name: 'Jun', price: 5950 },
    { name: 'Jul', price: 5980 }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">Dashboard</h1>
      
      {/* Welcome message */}
      <div className="mb-6 p-4 bg-gradient-to-r from-gray-900 to-black rounded-lg border border-[#D4AF37]">
        <h2 className="text-xl font-bold text-[#D4AF37]">
          Welcome, {userData?.formData?.fullName || userData?.email?.split('@')[0]}
        </h2>
        <p className="text-gray-400 mt-1">
          Here's an overview of your gold holdings and loan status
        </p>
      </div>
      
      {/* Gold summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-[#D4AF37] shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <GoldIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Total Gold</h3>
          </div>
          <p className="text-[#D4AF37] text-2xl font-bold">{userData?.goldHoldings.totalGold || 0} g</p>
          <p className="text-gray-500 text-sm mt-1">Current value: ₹{((userData?.goldHoldings.totalGold || 0) * 5986.25).toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <GoldIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Gold in Safe</h3>
          </div>
          <p className="text-white text-2xl font-bold">{userData?.goldHoldings.goldInSafe || 0} g</p>
          <p className="text-gray-500 text-sm mt-1">Available for loan</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <CoinsIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Gold Mortgaged</h3>
          </div>
          <p className="text-white text-2xl font-bold">{userData?.goldHoldings.goldMortgaged || 0} g</p>
          <p className="text-gray-500 text-sm mt-1">Used as loan collateral</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gold distribution chart */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-[#D4AF37] font-medium mb-4">Gold Distribution</h3>
          <div className="h-64">
            {userData?.goldHoldings.totalGold > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No gold data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Gold price trend */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#D4AF37] font-medium">Gold Price Trend</h3>
            <div className="flex items-center text-green-500 text-sm">
              <TrendingUpIcon size={16} className="mr-1" />
              <span>+2.3%</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goldPriceTrend}>
                <XAxis dataKey="name" tick={{ fill: '#D4AF37' }} />
                <YAxis tick={{ fill: '#D4AF37' }} />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Price per gram']}
                  contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#D4AF37' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Bar dataKey="price" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active loans summary */}
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#D4AF37] font-medium">Active Loans</h3>
            <Link to="/user/loans" className="text-sm text-[#D4AF37] flex items-center">
              View All <ArrowRightIcon size={16} className="ml-1" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-t-[#D4AF37] border-r-[#D4AF37] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-400">Loading loans...</p>
            </div>
          ) : loans.length > 0 ? (
            <div className="space-y-4">
              {loans
                .filter(loan => loan.status === 'approved')
                .slice(0, 3)
                .map((loan, index) => (
                  <div key={index} className="p-3 bg-gray-800 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-300">Loan #{loan._id.slice(-6)}</p>
                        <p className="text-[#D4AF37] text-lg font-semibold mt-1">₹{loan.loanAmount.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-[#D4AF37] bg-opacity-20 px-2 py-1 rounded text-[#D4AF37] text-xs">
                        Active
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>
                        <p>Gold Collateral</p>
                        <p className="text-white">{loan.goldAmount} g</p>
                      </div>
                      <div>
                        <p>Interest Rate</p>
                        <p className="text-white">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p>Start Date</p>
                        <p className="text-white">{new Date(loan.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p>End Date</p>
                        <p className="text-white">{new Date(loan.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No active loans</p>
              <Link 
                to="/user/apply-loan" 
                className="mt-3 inline-block px-4 py-2 bg-[#D4AF37] text-black rounded-md text-sm font-medium"
              >
                Apply for Loan
              </Link>
            </div>
          )}
        </div>
        
        {/* Quick actions & notifications */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
            <h3 className="text-[#D4AF37] font-medium mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/user/apply-loan" 
                className="p-3 bg-[#D4AF37] bg-opacity-10 border border-[#D4AF37] rounded-md hover:bg-opacity-20 transition-colors flex flex-col items-center justify-center text-center"
              >
                <CoinsIcon className="text-[#D4AF37] mb-2" size={24} />
                <span className="text-[#D4AF37] text-sm">Apply for Loan</span>
              </Link>
              <Link 
                to="/user/inventory" 
                className="p-3 bg-[#D4AF37] bg-opacity-10 border border-[#D4AF37] rounded-md hover:bg-opacity-20 transition-colors flex flex-col items-center justify-center text-center"
              >
                <GoldIcon className="text-[#D4AF37] mb-2" size={24} />
                <span className="text-[#D4AF37] text-sm">View Gold Inventory</span>
              </Link>
            </div>
          </div>
          
          {/* Recent activity */}
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
            <h3 className="text-[#D4AF37] font-medium mb-4">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800">
                    <div>
                      <p className="text-gray-300 text-sm">{activity.action}</p>
                      <p className="text-gray-500 text-xs">{activity.date}</p>
                    </div>
                    <p className="text-[#D4AF37] font-medium">{activity.amount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;