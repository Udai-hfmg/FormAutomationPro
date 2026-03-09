import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modal = (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 flex items-center justify-center z-50 "
            onMouseDown={onClose}
        >
            <div className="absolute inset-0 bg-black/45 bg-opacity-50" />
            <div
                onMouseDown={(e) => e.stopPropagation()}
                className="bg-white rounded-lg p-10 w-full md:w-3/6 max-w-full z-50 shadow-lg mx-4"
            >
                {/* <div className="flex justify-between items-center mb-3">
                    <h3 className="m-0 text-lg font-medium">{title ?? "Modal"}</h3>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="ml-3 text-xl leading-none hover:opacity-80"
                    >
                        ×
                    </button>
                </div> */}
                <div>{children}</div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

