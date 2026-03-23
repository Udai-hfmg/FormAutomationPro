

interface LineInputInterface extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: "text" | "email" | "tel" | "date" | "number";
  name?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LineInput = ({ className = ""  , type, name, value, onChange}: LineInputInterface) => (
  <input
    type={type || "text"}
    className={`border-b border-black outline-none px-1 w-full  ${className}`}
    name={name}
    value={value}
    onChange={onChange}
  />
);

export default LineInput;