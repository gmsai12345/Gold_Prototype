import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserLoans } from '../../api/loanApi';
import { CoinsIcon, FileTextIcon, AlertTriangleIcon } from 'lucide-react';

const statusColors = {
  pending: { bg: 'bg-yellow-900', text: 'text-yellow-300' },
  approved: { bg: 'bg-green-900', text: 'text-green-300' },
  rejected: { bg: 'bg-red-900', text: 'text-red-300' },
  closed: { bg: 'bg-blue-900', text: 'text-blue-300' }
};

const UserLoans: React.FC = () => {
  const { userData } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  
  useEffect(() => {
    const fetchLoans = async () => {
      if (userData?._id) {
        try {
          const loansData = await getUserLoans(userData._id);
          setLoans(loansData);
          if (loansData.length > 0) {
            setSelectedLoan(loansData[0]);
          }
        } catch (error) {
          console.error('Error fetching loans:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchLoans();
  }, [userData]);
  
  // Calculate total outstanding loans
  const totalOutstanding = loans
    .filter(loan => loan.status === 'approved')
    .reduce((sum, loan) => sum + loan.loanAmount, 0);
  
  // Filter loans by status
  const getFilteredLoans = (status: string) => {
    return loans.filter(loan => loan.status === status);
  };
  
  const pendingLoans = getFilteredLoans('pending');
  const activeLoans = getFilteredLoans('approved');
  const rejectedLoans = getFilteredLoans('rejected');
  const closedLoans = getFilteredLoans('closed');
  
  // Calculate EMI for loan
  const calculateEMI = (principal: number, rate: number, time: number) => {
    const r = rate / 100 / 12;
    const t = time;
    const emi = principal * r * Math.pow(1 + r, t) / (Math.pow(1 + r, t) - 1);
    return isNaN(emi) ? 0 : emi;
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">My Loans</h1>
      
      {/* Loan summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-[#D4AF37] shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <CoinsIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Outstanding Loans</h3>
          </div>
          <p className="text-[#D4AF37] text-2xl font-bold">₹{totalOutstanding.toLocaleString('en-IN')}</p>
          <p className="text-gray-500 text-sm mt-1">{activeLoans.length} active loans</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-gray-300 font-medium mb-2">Pending</h3>
          <p className="text-white text-2xl font-bold">{pendingLoans.length}</p>
          <p className="text-gray-500 text-sm mt-1">Awaiting approval</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-gray-300 font-medium mb-2">Active</h3>
          <p className="text-white text-2xl font-bold">{activeLoans.length}</p>
          <p className="text-gray-500 text-sm mt-1">Currently active</p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-gray-300 font-medium mb-2">Closed/Rejected</h3>
          <p className="text-white text-2xl font-bold">{closedLoans.length + rejectedLoans.length}</p>
          <p className="text-gray-500 text-sm mt-1">Past applications</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-t-[#D4AF37] border-r-[#D4AF37] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-400">Loading loans...</p>
        </div>
      ) : loans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Loan list */}
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
            <h2 className="text-lg font-medium text-[#D4AF37] mb-4">Loan Applications</h2>
            
            <div className="space-y-3">
              {loans.map((loan, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedLoan(loan)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedLoan?._id === loan._id
                      ? 'bg-[#D4AF37] bg-opacity-20 border border-[#D4AF37]'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm ${selectedLoan?._id === loan._id ? 'text-[#D4AF37]' : 'text-gray-300'}`}>
                        Loan #{loan._id.slice(-6)}
                      </p>
                      <p className={`${selectedLoan?._id === loan._id ? 'text-[#D4AF37]' : 'text-white'} font-semibold mt-1`}>
                        ₹{loan.loanAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[loan.status as keyof typeof statusColors].bg} ${statusColors[loan.status as keyof typeof statusColors].text}`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Applied: {new Date(loan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Loan details */}
          <div className="lg:col-span-2 bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
            {selectedLoan ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-[#D4AF37]">
                    Loan Details #{selectedLoan._id.slice(-6)}
                  </h2>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[selectedLoan.status as keyof typeof statusColors].bg} ${statusColors[selectedLoan.status as keyof typeof statusColors].text}`}>
                    {selectedLoan.status.charAt(0).toUpperCase() + selectedLoan.status.slice(1)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Loan Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-800">
                        <span className="text-gray-400">Loan Amount</span>
                        <span className="text-[#D4AF37] font-medium">₹{selectedLoan.loanAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-800">
                        <span className="text-gray-400">Gold Collateral</span>
                        <span className="text-white font-medium">{selectedLoan.goldAmount} g</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-800">
                        <span className="text-gray-400">Interest Rate</span>
                        <span className="text-white font-medium">{selectedLoan.interestRate}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-800">
                        <span className="text-gray-400">Tenure</span>
                        <span className="text-white font-medium">{selectedLoan.tenure} months</span>
                      </div>
                      {selectedLoan.status === 'approved' && (
                        <>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">Monthly EMI</span>
                            <span className="text-white font-medium">
                              ₹{calculateEMI(selectedLoan.loanAmount, selectedLoan.interestRate, selectedLoan.tenure).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">Start Date</span>
                            <span className="text-white font-medium">{new Date(selectedLoan.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-800">
                            <span className="text-gray-400">End Date</span>
                            <span className="text-white font-medium">{new Date(selectedLoan.endDate).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Application Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-800">
                        <span className="text-gray-400">Application Date</span>
                        <span className="text-white font-medium">{new Date(selectedLoan.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-800">
                        <span className="text-gray-400">Status</span>
                        <span className={`font-medium ${statusColors[selectedLoan.status as keyof typeof statusColors].text}`}>
                          {selectedLoan.status.charAt(0).toUpperCase() + selectedLoan.status.slice(1)}
                        </span>
                      </div>
                      {selectedLoan.approvedAt && (
                        <div className="flex justify-between py-2 border-b border-gray-800">
                          <span className="text-gray-400">Approval Date</span>
                          <span className="text-white font-medium">{new Date(selectedLoan.approvedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedLoan.rejectionReason && (
                        <div className="flex justify-between py-2 border-b border-gray-800">
                          <span className="text-gray-400">Rejection Reason</span>
                          <span className="text-red-400 font-medium">{selectedLoan.rejectionReason}</span>
                        </div>
                      )}
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Purpose:</h4>
                        <p className="text-white text-sm p-3 bg-gray-800 rounded-md">
                          {selectedLoan.purpose}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedLoan.status === 'pending' && (
                  <div className="p-4 bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-md mt-4">
                    <div className="flex items-start">
                      <AlertTriangleIcon size={20} className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-yellow-200 text-sm">
                        Your loan application is currently under review. You will be notified once a decision has been made.
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedLoan.status === 'approved' && (
                  <div className="p-4 bg-gray-800 rounded-md mt-4">
                    <div className="flex items-start">
                      <FileTextIcon size={20} className="text-[#D4AF37] mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm">
                          Your loan has been approved and the amount has been disbursed. Please make your monthly payments on time to avoid penalties.
                        </p>
                        <div className="mt-4">
                          <p className="text-[#D4AF37] text-sm font-medium mb-2">Repayment Schedule:</p>
                          <div className="h-48 overflow-y-auto pr-2">
                            <table className="min-w-full divide-y divide-gray-700">
                              <thead>
                                <tr>
                                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-400">Month</th>
                                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-400">Due Date</th>
                                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-400">EMI</th>
                                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-400">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-700">
                                {Array.from({ length: selectedLoan.tenure }, (_, i) => {
                                  const dueDate = new Date(selectedLoan.startDate);
                                  dueDate.setMonth(dueDate.getMonth() + i + 1);
                                  
                                  return (
                                    <tr key={i} className={i === 0 ? 'bg-gray-700 bg-opacity-30' : ''}>
                                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-300">{i + 1}</td>
                                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-300">{dueDate.toLocaleDateString()}</td>
                                      <td className="px-2 py-2 whitespace-nowrap text-xs text-[#D4AF37]">
                                        ₹{calculateEMI(selectedLoan.loanAmount, selectedLoan.interestRate, selectedLoan.tenure).toFixed(2)}
                                      </td>
                                      <td className="px-2 py-2 whitespace-nowrap text-xs">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
                                          i === 0 ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-400'
                                        }`}>
                                          {i === 0 ? 'Upcoming' : 'Pending'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Select a loan to view details</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 shadow-md text-center">
          <div className="inline-block p-4 bg-gray-800 rounded-full mb-4">
            <FileTextIcon size={40} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-medium text-white mb-2">No Loans Found</h2>
          <p className="text-gray-400 mb-6">
            You haven't applied for any loans yet. Use your gold as collateral to apply for a loan.
          </p>
          <a
            href="/user/apply-loan"
            className="inline-block px-6 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#FFD700] transition-colors"
          >
            Apply for Loan
          </a>
        </div>
      )}
    </div>
  );
};

export default UserLoans;