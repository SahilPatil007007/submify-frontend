const InputField = ({ label, ...props }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        {...props}
      />
    </div>
);

export default InputField;