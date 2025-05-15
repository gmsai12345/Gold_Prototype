import React, { useState, useEffect } from 'react';
import { getAllLoans, getPendingLoans, processLoanApplication } from '../../api/loanApi';
import { 
  CoinsIcon, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  ThumbsUp, 
  ThumbsDown,
  User 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  pending: { bg: 'bg-yellow-900', text: 'text-yellow-300', icon: <Clock size={14} /> },
  approved: { bg: 'bg-green-900', text: 'text-green-300', icon: <CheckCircle size={14} /> },
  rejected: { bg: 'bg-red-900', text: 'text-red-300', icon: <XCircle size={14} /> },
  closed: { bg: 'bg-blue-900', text: 'text-blue-300', icon: <CheckCircle size={14} /> }
};

const LoanManagement: React.FC = () => {
  const { userData } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [pendingLoans, setPendingLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const [loansData, pendingLoansData] = await Promise.all([
          getAllLoans(),
          getPendingLoans()
        ]);
        
        setLoans(loansData);
        setPendingLoans(pendingLoansData);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoans();
  }, []);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter loans based on search term and status
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.userId?.formData?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // View loan details
  const viewLoanDetails = (loan: any) => {
    setSelectedLoan(loan);
    setShowDetails(true);
  };
  
  // Close details panel
  const closeDetails = () => {
    setShowDetails(false);
    setRejectionReason('');
  };
  
  // Approve loan
  const approveLoan = async () => {
    if (!selectedLoan || !userData) return;
    
    try {
      await processLoanApplication(
        selectedLoan._id,
        'approved',
        userData._id
      );
      
      // Update local state
      const updatedLoans = loans.map(loan => {
        if (loan._id === selectedLoan._id) {
          return {
            ...loan,
            status: 'approved',
            approvedBy: userData._id,
            approvedAt: new Date().toISOString()
          };
        }
        return loan;
      });
      
      // Remove from pending loans
      const updatedPendingLoans = pendingLoans.filter(loan => loan._id !== selectedLoan._id);
      
      setLoans(updatedLoans);
      setPendingLoans(updatedPendingLoans);
      setSelectedLoan({ ...selectedLoan, status: 'approved', approvedBy: userData._id, approvedAt: new Date().toISOString() });
      toast.success('Loan approved successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error approving loan');
    }
  };
  
  // Reject loan
  const rejectLoan = async () => {
    if (!selectedLoan || !rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      await processLoanApplication(
        selectedLoan._id,
        'rejected',
        undefined,
        rejectionReason
      );
      
      // Update local state
      const updatedLoans = loans.map(loan => {
        if (loan._id === selectedLoan._id) {
          return {
            ...loan,
            status: 'rejected',
            rejectionReason
          };
        }
        return loan;
      });
      
      // Remove from pending loans
      const updatedPendingLoans = pendingLoans.filter(loan => loan._id !== selectedLoan._id);
      
      setLoans(updatedLoans);
      setPendingLoans(updatedPendingLoans);
      setSelectedLoan({ ...selectedLoan, status: 'rejected', rejectionReason });
      setRejectionReason('');
      toast.success('Loan rejected successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error rejecting loan');
    }
  };
  
  // Calculate total loan amounts
  const totalApprovedLoans = loans
    .filter(loan => loan.status === 'approved')
    .reduce((sum, loan) => sum + loan.loanAmount, 0);
  
  const totalPendingLoans = pendingLoans
    .reduce((sum, loan) => sum + loan.loanAmount, 0);
  
  // Calculate EMI for loan
  const calculateEMI = (principal: number, rate: number, time: number) => {
    const r = rate / 100 / 12;
    const t = time;
    const emi = principal * r * Math.pow(1 + r, t) / (Math.pow(1 + r, t) - 1);
    return isNaN(emi) ? 0 : emi;
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">Loan Management</h1>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg border border-[#D4AF37] shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <CoinsIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Active Loans</h3>
          </div>
          <p className="text-[#D4AF37] text-2xl font-bold">₹{totalApprovedLoans.toLocaleString('en-IN')}</p>
          <p className="text-gray-500 text-sm mt-1">
            {loans.filter(loan => loan.status === 'approved').length} active loans
          </p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <Clock className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Pending Applications</h3>
          </div>
          <p className="text-white text-2xl font-bold">₹{totalPendingLoans.toLocaleString('en-IN')}</p>
          <p className="text-gray-500 text-sm mt-1">
            {pendingLoans.length} pending applications
          </p>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <CoinsIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Interest Rate</h3>
          </div>
          <p className="text-white text-2xl font-bold">11%</p>
          <p className="text-gray-500 text-sm mt-1">
            Fixed rate for all loans
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
            placeholder="Search loans"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <select
              className="block pl-4 pr-10 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="closed">Closed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <Filter size={16} />
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-t-[#D4AF37] border-r-[#D4AF37] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-400">Loading loans...</p>
        </div>
      ) : filteredLoans.length > 0 ? (
        <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Loan ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Gold Collateral
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredLoans.map((loan) => (
                  <tr key={loan._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        #{loan._id.slice(-6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#D4AF37] bg-opacity-20 flex items-center justify-center">
                          <User className="text-[#D4AF37]" size={16} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {loan.userId?.formData?.fullName || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-400">{loan.userId?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#D4AF37]">
                        ₹{loan.loanAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {loan.tenure} months @ {loan.interestRate}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {loan.goldAmount} g
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusColors[loan.status as keyof typeof statusColors].bg
                      } ${
                        statusColors[loan.status as keyof typeof statusColors].text
                      }`}>
                        <span className="mr-1">
                          {statusColors[loan.status as keyof typeof statusColors].icon}
                        </span>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(loan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => viewLoanDetails(loan)}
                        className="text-gray-400 hover:text-[#D4AF37]"
                        title="View Details"
                      >
                        <Eye size={18} />
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
          <p className="text-gray-400">No loans found</p>
        </div>
      )}
      
      {/* Loan details sidebar */}
      {showDetails && selectedLoan && (
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
                  <h2 className="text-lg font-medium text-[#D4AF37]">Loan Details</h2>
                  <button 
                    onClick={closeDetails}
                    className="bg-gray-800 rounded-md p-1 text-gray-400 hover:text-white"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 px-4 py-6">
                  {/* Status badge */}
                  <div className="mb-6 flex justify-between items-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[selectedLoan.status as keyof typeof statusColors].bg
                    } ${
                      statusColors[selectedLoan.status as keyof typeof statusColors].text
                    }`}>
                      <span className="mr-1">
                        {statusColors[selectedLoan.status as keyof typeof statusColors].icon}
                      </span>
                      {selectedLoan.status.charAt(0).toUpperCase() + selectedLoan.status.slice(1)}
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      #{selectedLoan._id.slice(-6)}
                    </div>
                  </div>
                  
                  {/* Applicant info */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Applicant</h3>
                    <div className="p-3 bg-gray-800 rounded-md">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-[#D4AF37] bg-opacity-20 flex items-center justify-center">
                          <User className="text-[#D4AF37]" size={20} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">
                            {selectedLoan.userId?.formData?.fullName || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {selectedLoan.userId?.email}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div>
                          <p className="text-gray-400">Mobile Number</p>
                          <p className="text-white">{selectedLoan.userId?.formData?.mobileNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">PAN Card</p>
                          <p className="text-white">{selectedLoan.userId?.formData?.panCardNumber || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Loan details */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Loan Details</h3>
                    <div className="p-3 bg-gray-800 rounded-md">
                      <div className="flex justify-between pb-2 border-b border-gray-700">
                        <span className="text-sm text-gray-400">Loan Amount</span>
                        <span className="text-sm font-medium text-[#D4AF37]">₹{selectedLoan.loanAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-sm text-gray-400">Gold Collateral</span>
                        <span className="text-sm font-medium text-white">{selectedLoan.goldAmount} g</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-sm text-gray-400">Interest Rate</span>
                        <span className="text-sm font-medium text-white">{selectedLoan.interestRate}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-sm text-gray-400">Tenure</span>
                        <span className="text-sm font-medium text-white">{selectedLoan.tenure} months</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-700">
                        <span className="text-sm text-gray-400">Monthly EMI</span>
                        <span className="text-sm font-medium text-white">
                          ₹{calculateEMI(selectedLoan.loanAmount, selectedLoan.interestRate, selectedLoan.tenure).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-gray-400">Application Date</span>
                        <span className="text-sm font-medium text-white">{new Date(selectedLoan.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      {selectedLoan.status === 'approved' && (
                        <>
                          <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-sm text-gray-400">Approval Date</span>
                            <span className="text-sm font-medium text-white">{new Date(selectedLoan.approvedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-sm text-gray-400">Start Date</span>
                            <span className="text-sm font-medium text-white">{new Date(selectedLoan.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-sm text-gray-400">End Date</span>
                            <span className="text-sm font-medium text-white">{new Date(selectedLoan.endDate).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                      
                      {selectedLoan.status === 'rejected' && selectedLoan.rejectionReason && (
                        <div className="mt-3 p-2 bg-red-900 bg-opacity-20 rounded border border-red-800">
                          <span className="text-xs text-red-400">Rejection Reason:</span>
                          <p className="text-sm text-white mt-1">{selectedLoan.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Loan purpose */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Purpose of Loan</h3>
                    <div className="p-3 bg-gray-800 rounded-md">
                      <p className="text-sm text-white">{selectedLoan.purpose}</p>
                    </div>
                  </div>
                  
                  {/* Actions for pending loans */}
                  {selectedLoan.status === 'pending' && (
                    <div className="mt-6 space-y-4">
                      <button
                        onClick={approveLoan}
                        className="w-full flex items-center justify-center px-4 py-2 bg-green-800 text-green-100 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <ThumbsUp size={18} className="mr-2" />
                        Approve Loan
                      </button>
                      
                      <div>
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-400 mb-1">
                          Rejection Reason
                        </label>
                        <textarea
                          id="rejectionReason"
                          rows={3}
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          placeholder="Provide a reason for rejection"
                        ></textarea>
                      </div>
                      
                      <button
                        onClick={rejectLoan}
                        className="w-full flex items-center justify-center px-4 py-2 bg-red-800 text-red-100 rounded-md hover:bg-red-700 transition-colors"
                        disabled={!rejectionReason}
                      >
                        <ThumbsDown size={18} className="mr-2" />
                        Reject Loan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;