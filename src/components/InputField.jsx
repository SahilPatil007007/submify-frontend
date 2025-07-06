const InputField = ({ label, error, ...props }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
);

export default InputField;