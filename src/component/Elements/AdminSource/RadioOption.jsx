export const RadioOption = ({ label, checked, onChange }) => (
  <label className="flex items-center text-xs">
    <input type="radio" checked={checked} onChange={onChange} className="mr-1" />
    {label}
  </label>
);