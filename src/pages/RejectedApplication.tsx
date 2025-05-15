import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon, RefreshCw } from 'lucide-react';

const RejectedApplication: React.FC = () => {
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!userData) {
      navigate('/');
    } else if (userData.form === 1 && userData.isAdmin) {
      navigate('/admin');
    } else if (userData.form === 1) {
      navigate('/user');
    } else if (userData.form === 0) {
      navigate('/register');
    }
  }, [userData, navigate]);
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <XCircleIcon size={60} className="text-red-500" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-red-500 font-serif">Application Rejected</h1>
          <p className="mt-2 text-gray-300">
            We're sorry, but your application has been rejected. Please review the feedback below.
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-gray-800 rounded-md">
          <h2 className="text-md font-semibold text-[#D4AF37] mb-2">Reason for Rejection:</h2>
          <p className="text-sm text-gray-300">
            {userData?.rejectionReason || "Your application did not meet our verification requirements. Please ensure all information provided is accurate and complete."}
          </p>
        </div>
        
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full py-2 px-4 bg-[#D4AF37] text-black rounded-md hover:bg-[#FFD700] transition-colors flex items-center justify-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Update & Resubmit Application
          </button>
          
          <button
            onClick={() => signOut()}
            className="w-full py-2 px-4 bg-transparent text-[#D4AF37] border border-[#D4AF37] rounded-md hover:bg-gray-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectedApplication;