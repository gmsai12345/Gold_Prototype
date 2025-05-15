import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createLoanApplication } from '../../api/loanApi';
import { toast } from 'react-toastify';
import { InfoIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';

const LoanApplication: React.FC = () => {
  const { userData, refreshUserData } = useAuth();
  const [goldAmount, setGoldAmount] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [tenure, setTenure] = useState<number>(3);
  const [purpose, setPurpose] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Constants
  const interestRate = 11.0;
  const maxLoanPercentage = 70; // 70% of gold value
  const goldPrice = 5986.25; // Price per gram
  
  // Calculate max available gold and loan amount
  const availableGold = userData?.goldHoldings.goldInSafe || 0;
  const maxLoanAmount = (availableGold * goldPrice * maxLoanPercentage) / 100;
  
  // Calculate EMI (simple calculation for demonstration)
  const calculateEMI = (principal: number, rate: number, time: number) => {
    const r = rate / 100 / 12;
    const t = time;
    const emi = principal * r * Math.pow(1 + r, t) / (Math.pow(1 + r, t) - 1);
    return isNaN(emi) ? 0 : emi;
  };
  
  // Calculate total interest
  const calculateTotalInterest = (principal: number, emi: number, time: number) => {
    return (emi * time) - principal;
  };
  
  // Update loan amount when gold amount changes
  useEffect(() => {
    const calculatedLoanAmount = (goldAmount * goldPrice * maxLoanPercentage) / 100;
    setLoanAmount(Math.round(calculatedLoanAmount));
  }, [goldAmount, goldPrice]);
  
  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (goldAmount <= 0) {
      newErrors.goldAmount = 'Gold amount must be greater than 0';
    }
    
    if (goldAmount > availableGold) {
      newErrors.goldAmount = `Gold amount cannot exceed available gold (${availableGold}g)`;
    }
    
    if (loanAmount <= 0) {
      newErrors.loanAmount = 'Loan amount must be greater than 0';
    }
    
    if (loanAmount > maxLoanAmount) {
      newErrors.loanAmount = `Loan amount cannot exceed ${maxLoanPercentage}% of gold value`;
    }
    
    if (!purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const loanData = {
        userId: userData?._id,
        goldAmount,
        loanAmount,
        tenure,
        purpose
      };
      
      await createLoanApplication(loanData);
      await refreshUserData();
      setSubmitted(true);
      toast.success('Loan application submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error submitting loan application');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form for new application
  const handleNewApplication = () => {
    setGoldAmount(0);
    setLoanAmount(0);
    setTenure(3);
    setPurpose('');
    setSubmitted(false);
    setErrors({});
  };
  
  // Monthly EMI
  const emi = calculateEMI(loanAmount, interestRate, tenure);
  
  // Total interest
  const totalInterest = calculateTotalInterest(loanAmount, emi, tenure);
  
  // Total amount to be repaid
  const totalRepayment = loanAmount + totalInterest;
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">Gold Loan Application</h1>
      
      {submitted ? (
        <div className="bg-gray-900 p-6 rounded-lg border border-[#D4AF37] shadow-md text-center">
          <div className="flex justify-center mb-4">
            <CheckCircleIcon size={60} className="text-[#D4AF37]" />
          </div>
          <h2 className="text-xl font-bold text-[#D4AF37] mb-2">Application Submitted!</h2>
          <p className="text-gray-300 mb-6">
            Your loan application has been submitted successfully and is pending approval.
            Our team will review your application and notify you of the status.
          </p>
          <button
            onClick={handleNewApplication}
            className="px-6 py-2 bg-[#D4AF37] text-black rounded-md hover:bg-[#FFD700] transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      ) : (
        <>
          {/* Gold availability notice */}
          <div className="bg-gray-900 p-4 rounded-lg border border-[#D4AF37] shadow-md mb-6">
            <div className="flex items-start">
              <InfoIcon size={24} className="text-[#D4AF37] mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Gold Available for Loan</h3>
                <p className="text-gray-300">
                  You have <span className="text-[#D4AF37] font-semibold">{availableGold}g</span> of gold available in your safe.
                  You can apply for a loan of up to <span className="text-[#D4AF37] font-semibold">₹{maxLoanAmount.toLocaleString('en-IN')}</span> ({maxLoanPercentage}% of gold value).
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Loan application form */}
            <div className="lg:col-span-2 bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
              <h2 className="text-xl font-medium text-[#D4AF37] mb-6">Loan Application Form</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Gold amount selection */}
                  <div>
                    <label htmlFor="goldAmount" className="block text-sm font-medium text-gray-300 mb-1">
                      Gold Amount (in grams) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        id="goldAmount"
                        min="0"
                        max={availableGold}
                        step="0.1"
                        value={goldAmount}
                        onChange={(e) => setGoldAmount(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-400 text-sm">0g</span>
                      <span className="text-[#D4AF37] font-medium">{goldAmount.toFixed(1)}g</span>
                      <span className="text-gray-400 text-sm">{availableGold}g</span>
                    </div>
                    {errors.goldAmount && (
                      <p className="mt-1 text-sm text-red-500">{errors.goldAmount}</p>
                    )}
                  </div>
                  
                  {/* Loan amount */}
                  <div>
                    <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-300 mb-1">
                      Loan Amount (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="loanAmount"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      placeholder="Enter loan amount"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum available: ₹{maxLoanAmount.toLocaleString('en-IN')} ({maxLoanPercentage}% of gold value)
                    </p>
                    {errors.loanAmount && (
                      <p className="mt-1 text-sm text-red-500">{errors.loanAmount}</p>
                    )}
                  </div>
                  
                  {/* Loan tenure */}
                  <div>
                    <label htmlFor="tenure" className="block text-sm font-medium text-gray-300 mb-1">
                      Loan Tenure (months) <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="tenure"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                      <option value={3}>3 months</option>
                      <option value={6}>6 months</option>
                      <option value={12}>12 months</option>
                      <option value={24}>24 months</option>
                      <option value={36}>36 months</option>
                    </select>
                  </div>
                  
                  {/* Loan purpose */}
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-300 mb-1">
                      Purpose of Loan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      placeholder="Briefly describe the purpose of this loan"
                    ></textarea>
                    {errors.purpose && (
                      <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>
                    )}
                  </div>
                  
                  {/* Terms acceptance */}
                  <div className="bg-gray-800 p-4 rounded-md">
                    <div className="flex items-start">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-500 rounded mt-1"
                      />
                      <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                        I agree to the loan terms and conditions, including the {interestRate}% interest rate and repayment schedule.
                        I understand that my gold will be mortgaged until the loan is fully repaid.
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || availableGold <= 0}
                    className={`w-full py-3 px-4 rounded-md font-medium ${
                      isSubmitting || availableGold <= 0
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-[#D4AF37] text-black hover:bg-[#FFD700] transition-colors'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Loan Application'}
                  </button>
                  
                  {availableGold <= 0 && (
                    <p className="text-center text-red-500 text-sm">
                      You don't have any gold available in your safe to apply for a loan.
                    </p>
                  )}
                </div>
              </form>
            </div>
            
            {/* Loan summary */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md h-fit">
              <h2 className="text-xl font-medium text-[#D4AF37] mb-6">Loan Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Gold Amount:</span>
                  <span className="text-white font-medium">{goldAmount.toFixed(1)} g</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Gold Value:</span>
                  <span className="text-white font-medium">₹{(goldAmount * goldPrice).toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Loan Amount:</span>
                  <span className="text-[#D4AF37] font-medium">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Interest Rate:</span>
                  <span className="text-white font-medium">{interestRate}% per annum</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Tenure:</span>
                  <span className="text-white font-medium">{tenure} months</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Monthly EMI:</span>
                  <span className="text-white font-medium">₹{emi.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Total Interest:</span>
                  <span className="text-white font-medium">₹{totalInterest.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between py-2 bg-gray-800 p-3 rounded-md">
                  <span className="text-white font-medium">Total Repayment:</span>
                  <span className="text-[#D4AF37] font-bold">₹{totalRepayment.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-gray-800 rounded-md">
                <div className="flex items-start">
                  <InfoIcon size={16} className="text-[#D4AF37] mr-2 mt-1 flex-shrink-0" />
                  <p className="text-xs text-gray-300">
                    The loan amount is calculated at {maxLoanPercentage}% of the current gold value. The interest rate is fixed at {interestRate}% per annum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoanApplication;