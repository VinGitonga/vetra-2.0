interface RadioButtonProps {
  label: string;
  value: boolean;
  onChange: () => void;
}

const RadioButton = ({ label, value, onChange }: RadioButtonProps) => {
  return (
    <div className="flex items-center mr-4">
      <input
        type="radio"
        checked={value}
        onChange={onChange}
        className={`w-4 h-4 bg-gray-100 border-gray-300`}
      />
      <label className="ml-2 text-sm font-medium text-gray-900">
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
