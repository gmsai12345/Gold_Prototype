import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserIcon, MailIcon, PhoneIcon, MapPinIcon, ClipboardIcon, UserCircleIcon } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { userData } = useAuth();
  
  if (!userData?.formData) {
    return (
      <div className="text-center py-8">
        <UserCircleIcon size={60} className="text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Profile data not available</p>
      </div>
    );
  }
  
  const { formData } = userData;
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 font-serif">My Profile</h1>
      
      {/* Profile header */}
      <div className="bg-gray-900 p-6 rounded-lg border border-[#D4AF37] shadow-md mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#D4AF37] bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon size={50} className="text-[#D4AF37]" />
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white">{formData.fullName}</h2>
            <p className="text-gray-400 mt-1">Client since {new Date(userData.createdAt).toLocaleDateString()}</p>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center">
                <MailIcon size={16} className="text-[#D4AF37] mr-2" />
                <span className="text-gray-300">{userData.email}</span>
              </div>
              
              <div className="flex items-center">
                <PhoneIcon size={16} className="text-[#D4AF37] mr-2" />
                <span className="text-gray-300">{formData.mobileNumber}</span>
              </div>
              
              <div className="flex items-center">
                <MapPinIcon size={16} className="text-[#D4AF37] mr-2" />
                <span className="text-gray-300">{formData.currentAddress.city}, {formData.currentAddress.state}</span>
              </div>
              
              <div className="flex items-center">
                <ClipboardIcon size={16} className="text-[#D4AF37] mr-2" />
                <span className="text-gray-300">PAN: {formData.panCardNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-lg font-medium text-[#D4AF37] mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Full Name</p>
                <p className="text-white">{formData.fullName}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Date of Birth</p>
                <p className="text-white">{new Date(formData.dateOfBirth).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Gender</p>
                <p className="text-white">{formData.gender}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Father's/Spouse's Name</p>
                <p className="text-white">{formData.fatherSpouseName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Marital Status</p>
                <p className="text-white">{formData.maritalStatus}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Nationality</p>
                <p className="text-white">{formData.nationality}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-lg font-medium text-[#D4AF37] mb-4">Contact Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Email Address</p>
              <p className="text-white">{userData.email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Mobile Number</p>
                <p className="text-white">{formData.mobileNumber}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Alternate Mobile</p>
                <p className="text-white">{formData.alternateMobileNumber || 'Not provided'}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Preferred Communication</p>
              <p className="text-white">{formData.preferredCommunication}</p>
            </div>
          </div>
        </div>
        
        {/* Address Information */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-lg font-medium text-[#D4AF37] mb-4">Address Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Current Residential Address</p>
              <div className="p-3 bg-gray-800 rounded-md">
                <p className="text-white">
                  {formData.currentAddress.street}, {formData.currentAddress.city}, {formData.currentAddress.state} - {formData.currentAddress.pincode}, {formData.currentAddress.country}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm mb-1">Permanent Address</p>
              <div className="p-3 bg-gray-800 rounded-md">
                {formData.permanentAddress.sameAsCurrent ? (
                  <p className="text-white">Same as Current Address</p>
                ) : (
                  <p className="text-white">
                    {formData.permanentAddress.street}, {formData.permanentAddress.city}, {formData.permanentAddress.state} - {formData.permanentAddress.pincode}, {formData.permanentAddress.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Identity Information */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-lg font-medium text-[#D4AF37] mb-4">Identity Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">PAN Card Number</p>
                <p className="text-white">{formData.panCardNumber}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Aadhaar Number</p>
                <p className="text-white">XXXX-XXXX-{formData.aadhaarNumber.slice(-4)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Additional ID Type</p>
              <p className="text-white">{formData.additionalIdType}: {formData.additionalIdNumber}</p>
            </div>
          </div>
        </div>
        
        {/* Employment Information */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-lg font-medium text-[#D4AF37] mb-4">Employment Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Employment Type</p>
                <p className="text-white">{formData.employmentType}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Organization/Business</p>
                <p className="text-white">{formData.organizationName || 'Not applicable'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Designation</p>
                <p className="text-white">{formData.designation || 'Not applicable'}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Sector</p>
                <p className="text-white">{formData.sector || 'Not specified'}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Work Address</p>
              <p className="text-white">{formData.workAddress || 'Not applicable'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Monthly Income Range</p>
                <p className="text-white">{formData.monthlyIncomeRange}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Annual Income</p>
                <p className="text-white">₹{formData.annualIncome?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Nominee Information */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 shadow-md">
          <h3 className="text-lg font-medium text-[#D4AF37] mb-4">Nominee Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Nominee Name</p>
                <p className="text-white">{formData.nominee.name}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">Relationship</p>
                <p className="text-white">{formData.nominee.relationship}</p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Date of Birth</p>
              <p className="text-white">{new Date(formData.nominee.dateOfBirth).toLocaleDateString()}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Address</p>
              <p className="text-white">{formData.nominee.address}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Contact Number</p>
              <p className="text-white">{formData.nominee.contactNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;