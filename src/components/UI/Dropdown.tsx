import React, { useEffect, useRef, useState } from "react";

type Item = string | { value: string; label?: string };

type DropdownProps = {
    id?: string;
    title?: string;
    list: Item[];
    selected: string | null;
    setSelect: (value: string) => void;
    // optional container customization for the list wrapper
    listContainerClassName?: string;
    listContainerStyle?: React.CSSProperties;
    placeholder?: string;
    disabled?: boolean;
    name?: string;
};

export default function Dropdown({
    id,
    title,
    list,
    selected,
    setSelect,
    listContainerClassName,
    listContainerStyle,
    placeholder = "Select...",
    disabled = false,
    name,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const normalize = (item: Item) =>
        typeof item === "string" ? { value: item, label: item } : { value: item.value, label: item.label ?? item.value };

    const current = selected ? normalize(list.find((it) => normalize(it).value === selected) ?? selected) : null;
    const displayLabel = current ? current.label : placeholder;

    return (
        <div
            id={id}
            ref={rootRef}
            className={`dropdown-root relative inline-block min-w-[160px] ${disabled ? "opacity-60" : ""}`}
        >
            {title && (
                <label htmlFor={id ? `${id}-button` : undefined} className="block mb-1.5 text-sm">
                    {title}
                </label>
            )}

            <button
                id={id ? `${id}-button` : undefined}
                name={name}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={disabled}
                onClick={() => !disabled && setOpen((s) => !s)}
                className={`w-full text-left px-2.5 py-2 border-2 rounded-md bg-white border-gray-400 focus:outline-none ${
                    disabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
            >
                <span className={`${current ? "" : "text-gray-500"}`}>{displayLabel}</span>
                <span className={`float-right inline-block transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-labelledby={id ? `${id}-button` : undefined}
                    className={`${listContainerClassName ?? ""} absolute z-50 mt-1 left-0 right-0  max-h-[220px] overflow-auto border border-gray-200 rounded-md bg-white shadow-md`}
                    style={listContainerStyle}
                >
                    {list.length === 0 && (
                        <div className="p-2.5 text-gray-500 text-sm">No options</div>
                    )}
                    {list.map((it, idx) => {
                        const { value, label } = normalize(it);
                        const isSelected = value === selected;
                        return (
                            <div
                                key={`${value}-${idx}`}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    setSelect(value);
                                    setOpen(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                                        e.preventDefault();
                                        setSelect(value);
                                        setOpen(false);
                                    }
                                }}
                                tabIndex={0}
                                className={`px-2.5 py-2 cursor-pointer border-b border-gray-100 ${
                                    isSelected ? "bg-blue-50" : "bg-transparent"
                                }`}
                            >
                                {label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
