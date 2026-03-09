
type LineInputProps = {
  className?: string;
  type?: "text" | "email" | "tel" | "date" | "number";
};

const LineInput = ({ className = ""  , type}: LineInputProps) => (
  <input
    type={type || "text"}
    className={`border-b border-black outline-none px-1 w-full  ${className}`}
  />
);

export default LineInput;