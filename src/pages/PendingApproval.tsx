import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HourglassIcon, AlertTriangleIcon } from 'lucide-react';

const PendingApproval: React.FC = () => {
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!userData) {
      navigate('/');
    } else if (userData.form === 1 && userData.isAdmin) {
      navigate('/admin');
    } else if (userData.form === 1) {
      navigate('/user');
    } else if (userData.form === -1) {
      navigate('/rejected');
    } else if (userData.form === 0) {
      navigate('/register');
    }
  }, [userData, navigate]);
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-lg border border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <HourglassIcon size={60} className="text-[#D4AF37] animate-pulse" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#D4AF37] font-serif">Application Under Review</h1>
          <p className="mt-2 text-gray-300">
            Your registration is being reviewed by our team. This process typically takes 1-2 business days.
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-gray-800 rounded-md">
          <div className="flex items-start">
            <AlertTriangleIcon size={20} className="text-[#D4AF37] mt-1 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              You'll receive a notification once your application is approved. Until then, you won't be able to access the platform.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-400 text-center mb-4">
            Have questions? Contact our support at support@goldstorage.com
          </p>
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

export default PendingApproval;