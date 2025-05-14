import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FormContainer = ({ 
  title, 
  subtitle, 
  returnUrl, 
  returnText, 
  children 
}) => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto py-8 px-4 md:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to={returnUrl} 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>{returnText || 'Kembali'}</span>
          </Link>
        </div>
        
        {/* Form Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Form Content */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer; 