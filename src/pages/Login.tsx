import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LockIcon, UserIcon } from 'lucide-react';

const Login: React.FC = () => {
  const { signInWithGoogle, userData, currentUser } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (currentUser && userData) {
      if (userData.isAdmin) {
        navigate('/admin');
      } else if (userData.form === -1) {
        navigate('/rejected');
      } else if (userData.form === 0) {
        navigate('/register');
      } else {
        navigate('/user');
      }
    }
  }, [currentUser, userData, navigate]);
  
  const handleSignIn = async () => {
    await signInWithGoogle();
  };
  
  return (
    <div 
      className="min-h-screen bg-black bg-opacity-85 flex items-center justify-center"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="max-w-md w-full bg-gray-900 bg-opacity-70 p-8 rounded-lg border border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <LockIcon size={40} className="text-[#D4AF37]" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-[#FFD700] font-serif">Gold Storage & Loan</h1>
          <p className="mt-2 text-gray-300">Secure your gold, unlock your potential</p>
        </div>
        
        <button
          onClick={handleSignIn}
          className="w-full py-3 px-4 bg-[#121212] text-[#D4AF37] rounded-md border border-[#D4AF37] flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#121212] transition-all duration-300 shadow-md"
        >
          <UserIcon className="mr-2" size={20} />
          Sign in with Google
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;