// Shared UI components for admin pages
import React from 'react';

// Card component for admin sections
export const AdminCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

// Section header component
export const SectionHeader = ({ title, subtitle, icon }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      {icon && <span className="text-3xl">{icon}</span>}
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    </div>
    {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
  </div>
);

// Tab button component
export const TabButton = ({ id, title, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
    }`}
  >
    {title}
  </button>
);

// Primary button component
export const PrimaryButton = ({ children, onClick, disabled = false, loading = false, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
  >
    {loading ? (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Loading...
      </div>
    ) : (
      children
    )}
  </button>
);

// Secondary button component
export const SecondaryButton = ({ children, onClick, disabled = false, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

// Success button component
export const SuccessButton = ({ children, onClick, disabled = false, loading = false, className = "" }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
  >
    {loading ? (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        Loading...
      </div>
    ) : (
      children
    )}
  </button>
);

// Input field component
export const InputField = ({ label, placeholder, value, onChange, type = "text", required = false, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
    />
  </div>
);

// File upload component
export const FileUpload = ({ label, onChange, accept = ".csv", selectedFile }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-50 file:to-blue-100 file:text-blue-700 hover:file:from-blue-100 hover:file:to-blue-200 transition-all duration-200 cursor-pointer"
      />
    </div>
    {selectedFile && (
      <p className="text-sm text-green-600 mt-2 font-medium">
        ✓ Selected: {selectedFile.name}
      </p>
    )}
  </div>
);

// Info card component
export const InfoCard = ({ title, children, type = "info" }) => {
  const colors = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  return (
    <div className={`p-6 rounded-xl border ${colors[type]}`}>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="text-sm space-y-2">
        {children}
      </div>
    </div>
  );
};

// Grid layout component
export const AdminGrid = ({ children, cols = 1 }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6`}>
    {children}
  </div>
);

// Stats card component
export const StatsCard = ({ title, value, icon, color = "blue" }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50", 
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}; 