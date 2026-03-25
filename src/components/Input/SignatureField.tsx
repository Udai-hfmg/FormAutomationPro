import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import type SignatureCanvasType from "react-signature-canvas";

interface SignatureFieldProps {
  className?: string;
  // FIX: accepts string | null so both "signed" and "cleared" states work
  onChange?: (dataUrl: string | null) => void;
  name?: string;
  value?: string | null;
}

const SignatureField = ({ className = "", onChange, name, value }: SignatureFieldProps) => {
  const sigCanvasRef = useRef<SignatureCanvasType>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  // FIX: Removed the dead `canvasRef` useEffect — it was never attached to any element

  // Resize canvas on mount and window resize to keep drawing crisp
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = sigCanvasRef.current?.getCanvas();
      if (!canvas) return;

      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;

      const ctx = canvas.getContext("2d");
      ctx?.scale(ratio, ratio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Remove overflow clipping from all ancestor elements so canvas isn't clipped
  useEffect(() => {
    let el = wrapperRef.current?.parentElement;
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      if (style.overflow !== "visible") {
        el.style.overflow = "visible";
      }
      el = el.parentElement;
    }
  }, []);

  // If a saved value comes in from DB, draw it onto the canvas
  useEffect(() => {
    if (!value || !sigCanvasRef.current) return;
    sigCanvasRef.current.fromDataURL(value);
    setIsEmpty(false);
  }, [value]);

  const handleBegin = (): void => {
    setIsEmpty(false);
    onChange?.(null); // signal "in progress"
  };

  const handleEnd = (): void => {
    if (!sigCanvasRef.current) return;
    const dataUrl = sigCanvasRef.current
      .getSignaturePad()
      .toDataURL("image/png");
    onChange?.(dataUrl); // FIX: always string here, never null
  };

  const handleClear = (): void => {
    sigCanvasRef.current?.clear();
    setIsEmpty(true);
    onChange?.(null); // FIX: null on clear — HIPAANotice must accept string | null
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative flex flex-col ${className}`}
      style={{ zIndex: 9999, isolation: "isolate" }}
    >
      <div className="relative border-b border-black" style={{ overflow: "visible" }}>

        {/* Clear button */}
        {!isEmpty && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-0 right-0 text-[10px] text-gray-400 hover:text-red-500 px-1"
            style={{ zIndex: 10000 }}
          >
            ✕ Cancel
          </button>
        )}

        {/* Placeholder */}
        {isEmpty && (
          <span className="absolute inset-0 flex items-center text-gray-300 text-[10px] italic pointer-events-none pl-1">
            Sign here
          </span>
        )}

        {/* Canvas */}
        <div style={{ position: "relative", height: "148px", overflow: "visible", zIndex: 9999 }}>
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="#000000"
            dotSize={1.5}
            minWidth={1}
            maxWidth={2.5}
            velocityFilterWeight={0.4}
            onBegin={handleBegin}
            onEnd={handleEnd}
            canvasProps={{
              style: {
                width: "100%",
                height: "148px",
                display: "block",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 9999,
                touchAction: "none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureField;