import React, { useState } from 'react';

const LostItemsForm = () => {
  const [formType, setFormType] = useState('lost');
  const [formData, setFormData] = useState({
    itemName: '',
    brand: '',
    color: '',
    specialCharacteristics: '',
    isAnonymous: false,
    contactInfo: '',
    additionalDetails: {
      date: '',
      location: ''
    },
    supportingDocuments: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else if (name.includes('additionalDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        additionalDetails: {
          ...prev.additionalDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Here you would typically send the data to a backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-blue-50 p-6 flex flex-col justify-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-800">Lost & Found</h2>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={() => setFormType('lost')}
              className={`w-full py-3 rounded-lg transition-all duration-300 ${
                formType === 'lost' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              Report Lost Item
            </button>
            <button 
              onClick={() => setFormType('found')}
              className={`w-full py-3 rounded-lg transition-all duration-300 ${
                formType === 'found' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              Report Found Item
            </button>
          </div>
          
          <div className="text-sm text-blue-700 opacity-70">
            {formType === 'lost' 
              ? 'Help us find your lost item by providing details.' 
              : 'Help reunite an item with its owner by reporting it here.'}
          </div>
        </div>

        {/* Form */}
        <div className="w-2/3 p-8 space-y-6">
          <h3 className="text-3xl font-bold text-blue-900">
            {formType === 'lost' ? 'Lost Item Form' : 'Found Item Form'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Item Name</label>
                <input 
                  type="text" 
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Brand (if applicable)</label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  placeholder="Brand name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Special Characteristics</label>
              <textarea 
                name="specialCharacteristics"
                value={formData.specialCharacteristics}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300 h-24"
                placeholder="Describe unique features or marks"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Item Photo (Optional)</label>
              <input 
                type="file" 
                name="supportingDocuments"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Date</label>
                <input 
                  type="date" 
                  name="additionalDetails.date"
                  value={formData.additionalDetails.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Location</label>
                <input 
                  type="text" 
                  name="additionalDetails.location"
                  value={formData.additionalDetails.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  placeholder="Where was the item lost/found?"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <input 
                type="checkbox" 
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-blue-800">
                I want to remain anonymous
              </span>
            </div>

            {!formData.isAnonymous && (
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Contact Information</label>
                <input 
                  type="text" 
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                  placeholder="Phone or email"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-blue-800">
                I confirm the information provided is accurate
              </span>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LostItemsForm;