import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitUserForm } from '../api/userApi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ClipboardIcon, CheckCircleIcon } from 'lucide-react';

// Define form sections
const formSections = [
  { title: 'Personal Information', fields: ['fullName', 'dateOfBirth', 'gender', 'fatherSpouseName', 'maritalStatus', 'nationality'] },
  { title: 'Contact Details', fields: ['currentAddress', 'permanentAddress', 'mobileNumber', 'alternateMobileNumber', 'preferredCommunication'] },
  { title: 'Identity Details', fields: ['panCardNumber', 'aadhaarNumber', 'additionalIdType', 'additionalIdNumber'] },
  { title: 'Employment Details', fields: ['employmentType', 'organizationName', 'designation', 'workAddress', 'workContactNumber', 'monthlyIncomeRange', 'annualIncome', 'sector'] },
  { title: 'Nominee Details', fields: ['nominee'] }
];

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full legal name is required'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Must be at least 18 years old'),
  gender: Yup.string().required('Gender is required'),
  fatherSpouseName: Yup.string().required("Father's/Spouse's name is required"),
  maritalStatus: Yup.string().required('Marital status is required'),
  nationality: Yup.string().required('Nationality is required'),
  
  currentAddress: Yup.object().shape({
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string().required('Pincode is required').matches(/^\d{6}$/, 'Pincode must be 6 digits'),
    country: Yup.string().required('Country is required')
  }),
  
  permanentAddress: Yup.object().shape({
    sameAsCurrent: Yup.boolean(),
    street: Yup.string().when('sameAsCurrent', {
      is: false,
      then: Yup.string().required('Street address is required')
    }),
    city: Yup.string().when('sameAsCurrent', {
      is: false,
      then: Yup.string().required('City is required')
    }),
    state: Yup.string().when('sameAsCurrent', {
      is: false,
      then: Yup.string().required('State is required')
    }),
    pincode: Yup.string().when('sameAsCurrent', {
      is: false,
      then: Yup.string().required('Pincode is required').matches(/^\d{6}$/, 'Pincode must be 6 digits')
    }),
    country: Yup.string().when('sameAsCurrent', {
      is: false,
      then: Yup.string().required('Country is required')
    })
  }),
  
  mobileNumber: Yup.string()
    .required('Mobile number is required')
    .matches(/^\d{10}$/, 'Mobile number must be 10 digits'),
  
  preferredCommunication: Yup.string().required('Preferred communication method is required'),
  
  panCardNumber: Yup.string()
    .required('PAN Card number is required')
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Card format'),
  
  aadhaarNumber: Yup.string()
    .required('Aadhaar number is required')
    .matches(/^\d{12}$/, 'Aadhaar number must be 12 digits'),
  
  additionalIdType: Yup.string().required('Additional ID type is required'),
  additionalIdNumber: Yup.string().required('Additional ID number is required'),
  
  employmentType: Yup.string().required('Employment type is required'),
  monthlyIncomeRange: Yup.string().required('Monthly income range is required'),
  annualIncome: Yup.number().required('Annual income is required').positive('Annual income must be positive'),
  
  nominee: Yup.object().shape({
    name: Yup.string().required("Nominee's name is required"),
    relationship: Yup.string().required('Relationship is required'),
    dateOfBirth: Yup.date().required("Nominee's date of birth is required"),
    address: Yup.string().required("Nominee's address is required"),
    contactNumber: Yup.string()
      .required("Nominee's contact number is required")
      .matches(/^\d{10}$/, 'Contact number must be 10 digits')
  })
});

const initialValues = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  fatherSpouseName: '',
  maritalStatus: '',
  nationality: 'Indian',
  
  currentAddress: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  },
  
  permanentAddress: {
    sameAsCurrent: false,
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  },
  
  mobileNumber: '',
  alternateMobileNumber: '',
  preferredCommunication: '',
  
  panCardNumber: '',
  aadhaarNumber: '',
  additionalIdType: '',
  additionalIdNumber: '',
  
  employmentType: '',
  organizationName: '',
  designation: '',
  workAddress: '',
  workContactNumber: '',
  monthlyIncomeRange: '',
  annualIncome: '',
  sector: '',
  
  nominee: {
    name: '',
    relationship: '',
    dateOfBirth: '',
    address: '',
    contactNumber: ''
  }
};

const UserRegistration: React.FC = () => {
  const { userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!userData) {
    return navigate('/');
  }
  
  // If form is already filled and approved, redirect to dashboard
  if (userData.form === 1) {
    navigate('/user');
  }
  
  const handleSubmit = async (values: any) => {
    if (!userData?._id) return;
    
    setIsSubmitting(true);
    try {
      await submitUserForm(userData._id, values);
      await refreshUserData();
      toast.success('Registration form submitted successfully!');
      navigate('/pending-approval');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    setCurrentStep(Math.min(currentStep + 1, formSections.length - 1));
  };
  
  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };
  
  return (
    <div className="min-h-screen bg-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#D4AF37] font-serif">Registration Form</h1>
          <p className="mt-2 text-gray-400">Complete your profile to access the platform</p>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {formSections.map((section, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`flex flex-col items-center ${
                    index === currentStep 
                      ? 'text-[#D4AF37]' 
                      : index < currentStep 
                        ? 'text-[#D4AF37]' 
                        : 'text-gray-500'
                  }`}
                >
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      index === currentStep 
                        ? 'bg-[#D4AF37] text-black' 
                        : index < currentStep 
                          ? 'bg-[#D4AF37] text-black' 
                          : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? <CheckCircleIcon size={20} /> : index + 1}
                  </div>
                  <span className="mt-2 text-xs sm:text-sm hidden sm:block">{section.title}</span>
                </div>
                {index < formSections.length - 1 && (
                  <div 
                    className={`flex-1 h-1 ${
                      index < currentStep ? 'bg-[#D4AF37]' : 'bg-gray-700'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 text-center sm:hidden">
            <h2 className="text-[#D4AF37] text-lg">{formSections[currentStep].title}</h2>
          </div>
        </div>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isValid }) => (
            <Form className="bg-gray-900 rounded-lg border border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)] p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#D4AF37] mb-4 hidden sm:block">
                  {formSections[currentStep].title}
                </h2>
                
                {/* Personal Information */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                        Full Legal Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="fullName" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="dateOfBirth" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        id="gender"
                        name="gender"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="fatherSpouseName" className="block text-sm font-medium text-gray-300">
                        Father's/Spouse's Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="fatherSpouseName"
                        name="fatherSpouseName"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="fatherSpouseName" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-300">
                        Marital Status <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        id="maritalStatus"
                        name="maritalStatus"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </Field>
                      <ErrorMessage name="maritalStatus" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-300">
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="nationality"
                        name="nationality"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="nationality" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                  </div>
                )}
                
                {/* Contact Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-semibold text-[#D4AF37] mb-2">Current Residential Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="currentAddress.street" className="block text-sm font-medium text-gray-300">
                            Street/House No. <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="currentAddress.street"
                            name="currentAddress.street"
                            className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          />
                          <ErrorMessage name="currentAddress.street" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        <div>
                          <label htmlFor="currentAddress.city" className="block text-sm font-medium text-gray-300">
                            City <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="currentAddress.city"
                            name="currentAddress.city"
                            className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          />
                          <ErrorMessage name="currentAddress.city" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        <div>
                          <label htmlFor="currentAddress.state" className="block text-sm font-medium text-gray-300">
                            State <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="currentAddress.state"
                            name="currentAddress.state"
                            className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          />
                          <ErrorMessage name="currentAddress.state" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                        <div>
                          <label htmlFor="currentAddress.pincode" className="block text-sm font-medium text-gray-300">
                            Pincode <span className="text-red-500">*</span>
                          </label>
                          <Field
                            type="text"
                            id="currentAddress.pincode"
                            name="currentAddress.pincode"
                            className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          />
                          <ErrorMessage name="currentAddress.pincode" component="div" className="mt-1 text-sm text-red-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-md font-semibold text-[#D4AF37] mb-2">Permanent Address</h3>
                      <div className="mb-4">
                        <label className="flex items-center">
                          <Field
                            type="checkbox"
                            name="permanentAddress.sameAsCurrent"
                            className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-500 rounded"
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFieldValue('permanentAddress.sameAsCurrent', checked);
                              
                              if (checked) {
                                setFieldValue('permanentAddress.street', values.currentAddress.street);
                                setFieldValue('permanentAddress.city', values.currentAddress.city);
                                setFieldValue('permanentAddress.state', values.currentAddress.state);
                                setFieldValue('permanentAddress.pincode', values.currentAddress.pincode);
                                setFieldValue('permanentAddress.country', values.currentAddress.country);
                              }
                            }}
                          />
                          <span className="ml-2 text-sm text-gray-300">Same as Current Address</span>
                        </label>
                      </div>
                      
                      {!values.permanentAddress.sameAsCurrent && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="permanentAddress.street" className="block text-sm font-medium text-gray-300">
                              Street/House No. <span className="text-red-500">*</span>
                            </label>
                            <Field
                              type="text"
                              id="permanentAddress.street"
                              name="permanentAddress.street"
                              className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            />
                            <ErrorMessage name="permanentAddress.street" component="div" className="mt-1 text-sm text-red-500" />
                          </div>
                          <div>
                            <label htmlFor="permanentAddress.city" className="block text-sm font-medium text-gray-300">
                              City <span className="text-red-500">*</span>
                            </label>
                            <Field
                              type="text"
                              id="permanentAddress.city"
                              name="permanentAddress.city"
                              className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            />
                            <ErrorMessage name="permanentAddress.city" component="div" className="mt-1 text-sm text-red-500" />
                          </div>
                          <div>
                            <label htmlFor="permanentAddress.state" className="block text-sm font-medium text-gray-300">
                              State <span className="text-red-500">*</span>
                            </label>
                            <Field
                              type="text"
                              id="permanentAddress.state"
                              name="permanentAddress.state"
                              className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            />
                            <ErrorMessage name="permanentAddress.state" component="div" className="mt-1 text-sm text-red-500" />
                          </div>
                          <div>
                            <label htmlFor="permanentAddress.pincode" className="block text-sm font-medium text-gray-300">
                              Pincode <span className="text-red-500">*</span>
                            </label>
                            <Field
                              type="text"
                              id="permanentAddress.pincode"
                              name="permanentAddress.pincode"
                              className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                            />
                            <ErrorMessage name="permanentAddress.pincode" component="div" className="mt-1 text-sm text-red-500" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-300">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          id="mobileNumber"
                          name="mobileNumber"
                          className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                        <ErrorMessage name="mobileNumber" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                      <div>
                        <label htmlFor="alternateMobileNumber" className="block text-sm font-medium text-gray-300">
                          Alternate Mobile Number (Optional)
                        </label>
                        <Field
                          type="text"
                          id="alternateMobileNumber"
                          name="alternateMobileNumber"
                          className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="preferredCommunication" className="block text-sm font-medium text-gray-300">
                        Preferred Communication Method <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        id="preferredCommunication"
                        name="preferredCommunication"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        <option value="">Select Communication Method</option>
                        <option value="SMS">SMS</option>
                        <option value="Email">Email</option>
                        <option value="Both">Both</option>
                      </Field>
                      <ErrorMessage name="preferredCommunication" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                  </div>
                )}
                
                {/* Identity Details */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="panCardNumber" className="block text-sm font-medium text-gray-300">
                        PAN Card Number <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="panCardNumber"
                        name="panCardNumber"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <p className="mt-1 text-xs text-gray-500">Format: ABCDE1234F</p>
                      <ErrorMessage name="panCardNumber" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-300">
                        Aadhaar Number <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="aadhaarNumber"
                        name="aadhaarNumber"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <p className="mt-1 text-xs text-gray-500">Enter 12 digit Aadhaar number</p>
                      <ErrorMessage name="aadhaarNumber" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="additionalIdType" className="block text-sm font-medium text-gray-300">
                        Additional ID Proof Type <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        id="additionalIdType"
                        name="additionalIdType"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        <option value="">Select ID Type</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Passport">Passport</option>
                      </Field>
                      <ErrorMessage name="additionalIdType" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="additionalIdNumber" className="block text-sm font-medium text-gray-300">
                        Additional ID Number <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="additionalIdNumber"
                        name="additionalIdNumber"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="additionalIdNumber" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                  </div>
                )}
                
                {/* Employment Details */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="employmentType" className="block text-sm font-medium text-gray-300">
                        Employment Type <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        id="employmentType"
                        name="employmentType"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        <option value="">Select Employment Type</option>
                        <option value="Salaried">Salaried</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Business">Business</option>
                        <option value="Professional">Professional</option>
                        <option value="Retired">Retired</option>
                        <option value="Homemaker">Homemaker</option>
                      </Field>
                      <ErrorMessage name="employmentType" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    {values.employmentType && values.employmentType !== 'Homemaker' && values.employmentType !== 'Retired' && (
                      <>
                        <div>
                          <label htmlFor="organizationName" className="block text-sm font-medium text-gray-300">
                            Organization/Business Name
                          </label>
                          <Field
                            type="text"
                            id="organizationName"
                            name="organizationName"
                            className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="designation" className="block text-sm font-medium text-gray-300">
                            Designation/Nature of Business
                          </label>
                          <Field
                            type="text"
                            id="designation"
                            name="designation"
                            className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="workAddress" className="block text-sm font-medium text-gray-300">
                            Work Address
                          </label>
                          <Field
                            as="textarea"
                            id="workAddress"
                            name="workAddress"
                            rows={3}
                            className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="workContactNumber" className="block text-sm font-medium text-gray-300">
                            Work Contact Number
                          </label>
                          <Field
                            type="text"
                            id="workContactNumber"
                            name="workContactNumber"
                            className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                          />
                        </div>
                      </>
                    )}
                    
                    <div>
                      <label htmlFor="monthlyIncomeRange" className="block text-sm font-medium text-gray-300">
                        Monthly Income Range <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        id="monthlyIncomeRange"
                        name="monthlyIncomeRange"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        <option value="">Select Income Range</option>
                        <option value="Below ₹25,000">Below ₹25,000</option>
                        <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                        <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                        <option value="₹1,00,000 - ₹2,00,000">₹1,00,000 - ₹2,00,000</option>
                        <option value="Above ₹2,00,000">Above ₹2,00,000</option>
                      </Field>
                      <ErrorMessage name="monthlyIncomeRange" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-300">
                        Annual Income (in ₹) <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        id="annualIncome"
                        name="annualIncome"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="annualIncome" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="sector" className="block text-sm font-medium text-gray-300">
                        Sector
                      </label>
                      <Field
                        type="text"
                        id="sector"
                        name="sector"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                )}
                
                {/* Nominee Details */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="nominee.name" className="block text-sm font-medium text-gray-300">
                        Nominee Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="nominee.name"
                        name="nominee.name"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="nominee.name" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="nominee.relationship" className="block text-sm font-medium text-gray-300">
                        Relationship with Applicant <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="nominee.relationship"
                        name="nominee.relationship"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="nominee.relationship" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="nominee.dateOfBirth" className="block text-sm font-medium text-gray-300">
                        Nominee's Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="date"
                        id="nominee.dateOfBirth"
                        name="nominee.dateOfBirth"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="nominee.dateOfBirth" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="nominee.address" className="block text-sm font-medium text-gray-300">
                        Nominee's Address <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="textarea"
                        id="nominee.address"
                        name="nominee.address"
                        rows={3}
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="nominee.address" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div>
                      <label htmlFor="nominee.contactNumber" className="block text-sm font-medium text-gray-300">
                        Nominee's Contact Number <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id="nominee.contactNumber"
                        name="nominee.contactNumber"
                        className="mt-1 block w-full border border-gray-600 bg-gray-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      />
                      <ErrorMessage name="nominee.contactNumber" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-800 rounded-md border border-gray-600">
                      <h3 className="text-md font-semibold text-[#D4AF37] mb-2">Declaration</h3>
                      <p className="text-sm text-gray-300">
                        I hereby declare that the information provided in this form is true, complete and correct to the best of my knowledge and belief. I understand that any false information, omission or misrepresentation of facts may result in rejection of my application or cancellation of membership if such a false declaration is discovered later.
                      </p>
                      <div className="mt-4">
                        <label className="flex items-center">
                          <Field
                            type="checkbox"
                            name="declaration"
                            className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-500 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-300">I agree to the declaration</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`py-2 px-4 rounded-md ${
                    currentStep === 0
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-800 text-[#D4AF37] border border-[#D4AF37] hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>
                
                {currentStep < formSections.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="py-2 px-4 bg-[#D4AF37] text-black rounded-md hover:bg-[#FFD700] transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !values.declaration}
                    className={`py-2 px-4 rounded-md ${
                      isSubmitting || !values.declaration
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-[#D4AF37] text-black hover:bg-[#FFD700] transition-colors'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserRegistration;