import React, { forwardRef } from "react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    // required props
    id: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // optional helpers
    label?: string;
    error?: string;
    className?: string;
}

/**
 * Tailwind-based input component.
 * Required props: id, value, onChange
 */
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { id, label, error, className = "", ...rest } = props;
    const hasError = Boolean(error);

    return (
        <div className="flex flex-col">
            {label && (
                <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                id={id}
                ref={ref}
                className={[
                    "px-3 py-2 rounded-md border-2 transition-colors focus:outline-none focus:ring-2 mb-5",
                    hasError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-400 focus:ring-indigo-500",
                    "disabled:opacity-50",
                    className,
                ].join(" ")}
                {...rest}
            />

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";
export default Input;