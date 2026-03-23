import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import type SignatureCanvasType from "react-signature-canvas";

interface SignatureFieldProps {
  className?: string;
  onChange?: (dataUrl: string | null) => void;
  name?: string;
  value?: string | null;
}

const SignatureField = ({ className = "", onChange, name, value }: SignatureFieldProps) => {
  const sigCanvasRef = useRef<SignatureCanvasType>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;

}, []);

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

  // Walk up the DOM and remove any overflow clipping from ancestors
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

  const handleBegin = (): void => {
    setIsEmpty(false);
    onChange?.(null);
  };

  const handleEnd = (): void => {
      if (!sigCanvasRef.current) return;
  const dataUrl = sigCanvasRef.current
    .getSignaturePad()
    .toDataURL("image/png");
  
  // Log the base64 string
  console.log("Signature base64:", dataUrl);

  // Preview the image in console (click the link in browser console)

  console.log("Signature preview:");
  console.log("%c ", `
    padding: 100px 200px;
    background: url(${dataUrl}) no-repeat center center;
    background-size: contain;
  `);

  onChange?.(dataUrl);
  };

  const handleClear = (): void => {
    sigCanvasRef.current?.clear();
    setIsEmpty(true);
    onChange?.(null);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative flex flex-col ${className}`}
      style={{ zIndex: 9999, isolation: "isolate" }}
    >
      {/* Underline border — same visual as LineInput */}
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

        {/* Placeholder text */}
        {isEmpty && (
          <span className="absolute inset-0 flex items-center text-gray-300 text-[10px] italic pointer-events-none pl-1">
            Sign here
          </span>
        )}

        {/* Canvas container — overflows visually above siblings */}
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
                touchAction: "none", // prevents scroll hijack on mobile
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureField;