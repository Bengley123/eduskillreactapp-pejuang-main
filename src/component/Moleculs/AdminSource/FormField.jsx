// src/Molecules/FormField.js
import Label from '../../Elements/Input/Label';

const FormField = ({ label, inputProps }) => (
  <div>
    <Label>{label}</Label>
    {inputProps}
  </div>
);

export default FormField;
