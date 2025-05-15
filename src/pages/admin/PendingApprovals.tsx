import React, { useState, useEffect } from 'react';
import { getPendingForms, reviewUserForm } from '../../api/userApi';
import { getPendingLoans, processLoanApplication } from '../../api/loanApi';
import { useAuth } from '../../context/AuthContext';
import {
  UserIcon,
  CoinsIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  User,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';

const PendingApprovals: React.FC = () => {
  const { userData } = useAuth();
  const [pendingForms, setPendingForms] = useState<any[]>([]);
  const [pendingLoans, setPendingLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedTab, setSelectedTab] = useState<'forms' | 'loans'>('forms');
  const [expandedFormId, setExpandedFormId] = useState<string | null>(null);
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formsData, loansData] = await Promise.all([
          getPendingForms(),
          getPendingLoans()
        ]);
        
        setPendingForms(formsData);
        setPendingLoans(loansData);
      } catch (error) {
        console.error('Error fetching pending approvals:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter forms based on search term
  const filteredForms = pendingForms.filter(form => 
    form.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.formData?.fullName && form.formData.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Filter loans based on search term
  const filteredLoans = pendingLoans.filter(loan => 
    loan.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.userId?.formData?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Toggle form details
  const toggleFormDetails = (formId: string) => {
    if (expandedFormId === formId) {
      setExpandedFormId(null);
    } else {
      setExpandedFormId(formId);
    }
  };
  
  // Toggle loan details
  const toggleLoanDetails = (loanId: string) => {
    if (expandedLoanId === loanId) {
      setExpandedLoanId(null);
    } else {
      setExpandedLoanId(loanId);
    }
  };
  
  // Approve form
  const approveForm = async (formId: string) => {
    try {
      await reviewUserForm(formId, 'approved');
      
      // Update local state
      setPendingForms(pendingForms.filter(form => form._id !== formId));
      
      toast.success('Form approved successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error approving form');
    }
  };
  
  // Reject form
  const rejectForm = async (formId: string) => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      await reviewUserForm(formId, 'rejected', rejectionReason);
      
      // Update local state
      setPendingForms(pendingForms.filter(form => form._id !== formId));
      
      setRejectionReason('');
      toast.success('Form rejected successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error rejecting form');
    }
  };
  
  // Approve loan
  const approveLoan = async (loanId: string) => {
    if (!userData) return;
    
    try {
      await processLoanApplication(
        loanId,
        'approved',
        userData._id
      );
      
      // Update local state
      setPendingLoans(pendingLoans.filter(loan => loan._id !== loanId));
      
      toast.success('Loan approved successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error approving loan');
    }
  };
  
  // Reject loan
  const rejectLoan = async (loanId: string) => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      await processLoanApplication(
        loanId,
        'rejected',
        undefined,
        rejectionReason
      );
      
      // Update local state
      setPendingLoans(pendingLoans.filter(loan => loan._id !== loanId));
      
      setRejectionReason('');
      toast.success('Loan rejected successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error rejecting loan');
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">Pending Approvals</h1>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`bg-gray-900 p-4 rounded-lg border ${
          selectedTab === 'forms' ? 'border-[#D4AF37]' : 'border-gray-800'
        } shadow-md cursor-pointer`} onClick={() => setSelectedTab('forms')}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <UserIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Pending Registration Forms</h3>
          </div>
          <p className="text-[#D4AF37] text-2xl font-bold">{pendingForms.length}</p>
          <p className="text-gray-500 text-sm mt-1">
            Awaiting approval
          </p>
        </div>
        
        <div className={`bg-gray-900 p-4 rounded-lg border ${
          selectedTab === 'loans' ? 'border-[#D4AF37]' : 'border-gray-800'
        } shadow-md cursor-pointer`} onClick={() => setSelectedTab('loans')}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-[#D4AF37] bg-opacity-20 rounded-full">
              <CoinsIcon className="text-[#D4AF37]" size={20} />
            </div>
            <h3 className="text-gray-300 font-medium">Pending Loan Applications</h3>
          </div>
          <p className="text-white text-2xl font-bold">{pendingLoans.length}</p>
          <p className="text-gray-500 text-sm mt-1">
            Awaiting decision
          </p>
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            placeholder={`Search ${selectedTab === 'forms' ? 'registration forms' : 'loan applications'}`}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="flex border-b border-gray-800">
          <button
            className={`flex-1 py-3 font-medium ${
              selectedTab === 'forms'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setSelectedTab('forms')}
          >
            Registration Forms ({pendingForms.length})
          </button>
          <button
            className={`flex-1 py-3 font-medium ${
              selectedTab === 'loans'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setSelectedTab('loans')}
          >
            Loan Applications ({pendingLoans.length})
          </button>
        </div>
        
        {/* Tab content */}
        <div className="p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-t-[#D4AF37] border-r-[#D4AF37] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-400">Loading pending approvals...</p>
            </div>
          ) : selectedTab === 'forms' ? (
            /* Registration Forms Tab */
            filteredForms.length > 0 ? (
              <div className="space-y-4">
                {filteredForms.map((form) => (
                  <div key={form._id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    {/* Form header */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-700 flex items-center justify-between"
                      onClick={() => toggleFormDetails(form._id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#D4AF37] bg-opacity-20 flex items-center justify-center">
                          <User className="text-[#D4AF37]" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {form.formData?.fullName || 'No Name'}
                          </div>
                          <div className="text-xs text-gray-400">{form.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300 mr-2">
                          <Clock size={12} className="mr-1" /> Pending
                        </span>
                        {expandedFormId === form._id ? (
                          <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Form details */}
                    {expandedFormId === form._id && (
                      <div className="p-4 border-t border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-[#D4AF37] mb-2">Personal Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Full Name:</span>
                                <span className="text-white">{form.formData.fullName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Date of Birth:</span>
                                <span className="text-white">{new Date(form.formData.dateOfBirth).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Gender:</span>
                                <span className="text-white">{form.formData.gender}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Marital Status:</span>
                                <span className="text-white">{form.formData.maritalStatus}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Father's/Spouse's Name:</span>
                                <span className="text-white">{form.formData.fatherSpouseName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Nationality:</span>
                                <span className="text-white">{form.formData.nationality}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-[#D4AF37] mb-2">Contact & Identity</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Email:</span>
                                <span className="text-white">{form.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Mobile Number:</span>
                                <span className="text-white">{form.formData.mobileNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">PAN Card:</span>
                                <span className="text-white">{form.formData.panCardNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Aadhaar Number:</span>
                                <span className="text-white">XXXX-XXXX-{form.formData.aadhaarNumber.slice(-4)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">{form.formData.additionalIdType}:</span>
                                <span className="text-white">{form.formData.additionalIdNumber}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-[#D4AF37] mb-2">Current Address</h4>
                            <p className="text-sm text-white">
                              {form.formData.currentAddress.street}, {form.formData.currentAddress.city}, {form.formData.currentAddress.state} - {form.formData.currentAddress.pincode}, {form.formData.currentAddress.country}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-[#D4AF37] mb-2">Employment</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Employment Type:</span>
                                <span className="text-white">{form.formData.employmentType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Monthly Income Range:</span>
                                <span className="text-white">{form.formData.monthlyIncomeRange}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Annual Income:</span>
                                <span className="text-white">₹{form.formData.annualIncome.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-[#D4AF37] mb-2">Nominee Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Nominee Name:</span>
                              <span className="text-white">{form.formData.nominee.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Relationship:</span>
                              <span className="text-white">{form.formData.nominee.relationship}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-yellow-900 bg-opacity-20 rounded-md border border-yellow-800 mb-4">
                          <div className="flex items-start">
                            <AlertTriangle size={18} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-300">
                              Please verify all information carefully before approving this application. Once approved, the user will gain access to the platform.
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex space-x-2 mb-3">
                            <button
                              onClick={() => approveForm(form._id)}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-800 text-green-100 rounded-md hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle size={18} className="mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => rejectForm(form._id)}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-800 text-red-100 rounded-md hover:bg-red-700 transition-colors"
                              disabled={!rejectionReason}
                            >
                              <XCircle size={18} className="mr-2" />
                              Reject
                            </button>
                          </div>
                          
                          <div>
                            <label htmlFor="rejectionReason" className="block text-xs font-medium text-gray-400 mb-1">
                              Rejection Reason (Required to reject)
                            </label>
                            <textarea
                              id="rejectionReason"
                              rows={2}
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                              placeholder="Provide a reason for rejection"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No pending registration forms found</p>
              </div>
            )
          ) : (
            /* Loan Applications Tab */
            filteredLoans.length > 0 ? (
              <div className="space-y-4">
                {filteredLoans.map((loan) => (
                  <div key={loan._id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                    {/* Loan header */}
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-700 flex items-center justify-between"
                      onClick={() => toggleLoanDetails(loan._id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#D4AF37] bg-opacity-20 flex items-center justify-center">
                          <CoinsIcon className="text-[#D4AF37]" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            ₹{loan.loanAmount.toLocaleString('en-IN')} Loan
                          </div>
                          <div className="text-xs text-gray-400">
                            {loan.userId?.formData?.fullName || loan.userId?.email || 'Unknown User'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300 mr-2">
                          <Clock size={12} className="mr-1" /> Pending
                        </span>
                        {expandedLoanId === loan._id ? (
                          <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Loan details */}
                    {expandedLoanId === loan._id && (
                      <div className="p-4 border-t border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-[#D4AF37] mb-2">Loan Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Loan Amount:</span>
                                <span className="text-[#D4AF37] font-medium">₹{loan.loanAmount.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Gold Collateral:</span>
                                <span className="text-white">{loan.goldAmount} g</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Interest Rate:</span>
                                <span className="text-white">{loan.interestRate}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Tenure:</span>
                                <span className="text-white">{loan.tenure} months</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Application Date:</span>
                                <span className="text-white">{new Date(loan.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-[#D4AF37] mb-2">Applicant Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Name:</span>
                                <span className="text-white">{loan.userId?.formData?.fullName || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Email:</span>
                                <span className="text-white">{loan.userId?.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Mobile:</span>
                                <span className="text-white">{loan.userId?.formData?.mobileNumber || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total Gold Holdings:</span>
                                <span className="text-white">{loan.userId?.goldHoldings?.totalGold || 0} g</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Gold in Safe:</span>
                                <span className="text-white">{loan.userId?.goldHoldings?.goldInSafe || 0} g</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-[#D4AF37] mb-2">Purpose of Loan</h4>
                          <div className="p-3 bg-gray-700 rounded-md">
                            <p className="text-sm text-white">{loan.purpose}</p>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-yellow-900 bg-opacity-20 rounded-md border border-yellow-800 mb-4">
                          <div className="flex items-start">
                            <AlertTriangle size={18} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-300">
                              Please verify that the user has sufficient gold in their safe and that the loan amount is appropriate for the collateral provided.
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex space-x-2 mb-3">
                            <button
                              onClick={() => approveLoan(loan._id)}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-800 text-green-100 rounded-md hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle size={18} className="mr-2" />
                              Approve Loan
                            </button>
                            <button
                              onClick={() => rejectLoan(loan._id)}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-800 text-red-100 rounded-md hover:bg-red-700 transition-colors"
                              disabled={!rejectionReason}
                            >
                              <XCircle size={18} className="mr-2" />
                              Reject Loan
                            </button>
                          </div>
                          
                          <div>
                            <label htmlFor="loanRejectionReason" className="block text-xs font-medium text-gray-400 mb-1">
                              Rejection Reason (Required to reject)
                            </label>
                            <textarea
                              id="loanRejectionReason"
                              rows={2}
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-600 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                              placeholder="Provide a reason for rejection"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No pending loan applications found</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;