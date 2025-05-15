import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { BoldIcon as GoldIcon, FileSignatureIcon } from 'lucide-react';

const goldRates = {
  current: 5986.25,
  yesterday: 5947.80,
  lastWeek: 5890.50,
  lastMonth: 5800.25,
  lastYear: 5400.75
};

const GoldInventory: React.FC = () => {
  const { userData } = useAuth();
  
  // Gold details - in real app this would come from backend
  const goldDetails = [
    {
      id: 'GLD001',
      type: 'Gold Bar',
      purity: '24K',
      weight: userData?.goldHoldings.totalGold ? (userData.goldHoldings.totalGold * 0.4).toFixed(2) : 0,
      depositDate: '2025-01-15',
      status: 'In Safe'
    },
    {
      id: 'GLD002',
      type: 'Gold Coins',
      purity: '22K',
      weight: userData?.goldHoldings.totalGold ? (userData.goldHoldings.totalGold * 0.3).toFixed(2) : 0,
      depositDate: '2025-02-20',
      status: 'In Safe'
    },
    {
      id: 'GLD003',
      type: 'Gold Jewelry',
      purity: '18K',
      weight: userData?.goldHoldings.totalGold ? (userData.goldHoldings.totalGold * 0.3).toFixed(2) : 0,
      depositDate: '2025-03-10',
      status: 'Mortgaged'
    }
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">Gold Inventory</h1>
      
      {/* Gold summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-[#D4AF37] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
                <GoldIcon className="text-[#D4AF37]" size={20} />
              </div>
              <h3 className="text-gray-300 font-medium">Total Gold</h3>
            </div>
          </div>
          <p className="text-[#D4AF37] text-2xl font-bold">{userData?.goldHoldings.totalGold || 0} g</p>
          <p className="text-gray-500 text-sm mt-1">Current value: ₹{((userData?.goldHoldings.totalGold || 0) * goldRates.current).toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
                <GoldIcon className="text-[#D4AF37]" size={20} />
              </div>
              <h3 className="text-gray-300 font-medium">Gold in Safe</h3>
            </div>
          </div>
          <p className="text-white text-2xl font-bold">{userData?.goldHoldings.goldInSafe || 0} g</p>
          <p className="text-gray-500 text-sm mt-1">Available for loan: ₹{((userData?.goldHoldings.goldInSafe || 0) * goldRates.current).toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
                <GoldIcon className="text-[#D4AF37]" size={20} />
              </div>
              <h3 className="text-gray-300 font-medium">Gold Mortgaged</h3>
            </div>
          </div>
          <p className="text-white text-2xl font-bold">{userData?.goldHoldings.goldMortgaged || 0} g</p>
          <p className="text-gray-500 text-sm mt-1">Loan amount: ₹{((userData?.goldHoldings.goldMortgaged || 0) * goldRates.current * 0.7).toLocaleString('en-IN')}</p>
        </div>
      </div>
      
      {/* Current gold rates */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md mb-6">
        <h3 className="text-[#D4AF37] font-medium mb-4">Current Gold Rates (per gram)</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-gray-800 rounded-md">
            <p className="text-xs text-gray-400 mb-1">Today</p>
            <p className="text-lg text-[#D4AF37] font-bold">₹{goldRates.current.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-md">
            <p className="text-xs text-gray-400 mb-1">Yesterday</p>
            <p className="text-lg text-white font-bold">₹{goldRates.yesterday.toLocaleString('en-IN')}</p>
            <p className="text-xs text-green-500">+{((goldRates.current - goldRates.yesterday) / goldRates.yesterday * 100).toFixed(2)}%</p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-md">
            <p className="text-xs text-gray-400 mb-1">Last Week</p>
            <p className="text-lg text-white font-bold">₹{goldRates.lastWeek.toLocaleString('en-IN')}</p>
            <p className="text-xs text-green-500">+{((goldRates.current - goldRates.lastWeek) / goldRates.lastWeek * 100).toFixed(2)}%</p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-md">
            <p className="text-xs text-gray-400 mb-1">Last Month</p>
            <p className="text-lg text-white font-bold">₹{goldRates.lastMonth.toLocaleString('en-IN')}</p>
            <p className="text-xs text-green-500">+{((goldRates.current - goldRates.lastMonth) / goldRates.lastMonth * 100).toFixed(2)}%</p>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-md">
            <p className="text-xs text-gray-400 mb-1">Last Year</p>
            <p className="text-lg text-white font-bold">₹{goldRates.lastYear.toLocaleString('en-IN')}</p>
            <p className="text-xs text-green-500">+{((goldRates.current - goldRates.lastYear) / goldRates.lastYear * 100).toFixed(2)}%</p>
          </div>
        </div>
      </div>
      
      {/* Gold deposits table */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#D4AF37] font-medium">Gold Deposits</h3>
          <button className="flex items-center text-sm text-[#D4AF37] border border-[#D4AF37] px-3 py-1 rounded-md hover:bg-[#D4AF37] hover:bg-opacity-10">
            <FileSignatureIcon size={16} className="mr-2" />
            Download Statement
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Purity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Weight (g)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deposit Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {goldDetails.map((item, index) => (
                <tr key={index} className="hover:bg-gray-800">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{item.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{item.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{item.purity}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{item.weight}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(item.depositDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'In Safe' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[#D4AF37]">
                    ₹{(Number(item.weight) * goldRates.current).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {goldDetails.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No gold deposits found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoldInventory;