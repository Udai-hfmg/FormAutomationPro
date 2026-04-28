import { useEffect, useId, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import type SignatureCanvasType from "react-signature-canvas";
import useFormData from "../../hooks/useFormData";

interface SignatureFieldProps {
  className?: string;
  onChange?: (data: Blob | null) => void;
  value?: Blob | string | null;
  name?: string;
}

const SignatureField = ({ className = "", onChange, value }: SignatureFieldProps) => {
  const { setFormData, signatureMeta, setSignatureMeta } = useFormData();
  const fieldId = useId(); 
  const sigCanvasRef = useRef<SignatureCanvasType>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const isDrawingRef = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showReusePopup, setShowReusePopup] = useState(false);
  const [allowDrawing, setAllowDrawing] = useState(true);
  const [mode, setMode] = useState<"empty" | "pending" | "linked" | "editing">("empty");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const revokeObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const clearCanvas = () => {
    if (isDrawingRef.current) return;
    sigCanvasRef.current?.clear();
    setIsEmpty(true);
  };

  const blobToDataUrl = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

  const drawSignature = async (nextValue: Blob | string) => {
    if (!sigCanvasRef.current || isDrawingRef.current) return;

    const dataUrl =
      typeof nextValue === "string"
        ? `data:image/png;base64,${nextValue}`
        : await blobToDataUrl(nextValue);

    sigCanvasRef.current.clear();
    sigCanvasRef.current.fromDataURL(dataUrl);
    setIsEmpty(false);
    setAllowDrawing(false);
  };

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

  useEffect(() => {
    if (!sigCanvasRef.current) return;
    if (isDrawingRef.current) return;

    if (!value) {
      clearCanvas();
      setAllowDrawing(true);
      setMode("empty");
      setShowReusePopup(false);
      return;
    }

    if (typeof value === "string") {
      drawSignature(value).catch(() => undefined);
      setMode("linked");
      setAllowDrawing(false);
      return;
    }

    if (mode === "editing") {
      clearCanvas();
      setAllowDrawing(true);
      return;
    }

    if (mode === "linked" || signatureMeta.lastSignatureSourceId === fieldId) {
      drawSignature(value).catch(() => undefined);
      setMode("linked");
      setAllowDrawing(false);
      return;
    }

    clearCanvas();
    setMode("pending");
    setAllowDrawing(false);
  }, [fieldId, mode, signatureMeta.lastSignatureSourceId, signatureMeta.signatureVersion, value]);

  useEffect(() => () => revokeObjectUrl(), []);

  useEffect(() => {
    if (!value) {
      revokeObjectUrl();
      setPreviewSrc(null);
      return;
    }

    if (typeof value === "string") {
      revokeObjectUrl();
      setPreviewSrc(`data:image/png;base64,${value}`);
      return;
    }

    revokeObjectUrl();
    objectUrlRef.current = URL.createObjectURL(value);
    setPreviewSrc(objectUrlRef.current);
  }, [value]);

  const handleBegin = () => {
    if (!allowDrawing) return;
    isDrawingRef.current = true;
    setMode("editing");
    setIsEmpty(false);
  };

  const handleEnd = () => {
    if (!allowDrawing) return;

    const canvas = sigCanvasRef.current?.getCanvas();
    if (!canvas) {
      isDrawingRef.current = false;
      return;
    }

    canvas.toBlob((blob) => {
      isDrawingRef.current = false;
      if (!blob) return;

      setMode("linked");
      setAllowDrawing(false);
      setShowReusePopup(false);
      setSignatureMeta((prev) => ({
        ...prev,
        signatureVersion: prev.signatureVersion + 1,
        lastSignatureSourceId: fieldId,
      }));

      setFormData((prev: any) => ({
        ...prev,
        signature: blob,
      }));

      onChange?.(blob);
    }, "image/png");
  };

  const handleUsePreviousSignature = async () => {
    if (!value) return;

    setMode("linked");
    await drawSignature(value);
    setShowReusePopup(false);

    if (value instanceof Blob) {
      onChange?.(value);
    }
  };

  const handleSignAgain = () => {
    isDrawingRef.current = false;
    clearCanvas();
    setAllowDrawing(true);
    setMode("editing");
    setShowReusePopup(false);
  };

  const handleHoverField = () => {
    if (!value || mode !== "pending") return;
    setShowReusePopup(true);
  };

  const handleClear = () => {
    isDrawingRef.current = false;
    clearCanvas();
    setAllowDrawing(true);
    setMode("editing");
    setShowReusePopup(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`relative flex flex-col ${className}`}
      style={{ zIndex: 9999, isolation: "isolate" }}
    >
      <div className="relative border-b border-black" style={{ overflow: "visible" }}>
        {showReusePopup && previewSrc && (
          <div className="absolute inset-0 z-[10001] flex items-center justify-center bg-white/95 p-3">
            <div className="w-full max-w-xs rounded border border-gray-300 bg-white p-3 shadow-lg">
              <p className="mb-3 text-xs text-gray-700">Use the previous signature for this field?</p>
              <button
                type="button"
                onClick={handleUsePreviousSignature}
                className="mb-3 w-full rounded border border-gray-300 bg-gray-50 p-2 hover:bg-gray-100"
              >
                <img
                  src={previewSrc}
                  alt="Previous signature"
                  className="h-20 w-full object-contain"
                />
              </button>
              <button
                type="button"
                onClick={handleSignAgain}
                className="w-full rounded bg-black px-3 py-2 text-xs text-white"
              >
                Sign again
              </button>
            </div>
          </div>
        )}

        {!isEmpty && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-0 right-0 z-[10002] px-1 text-[10px] text-gray-400 hover:text-red-500"
          >
            Cancel
          </button>
        )}

        {isEmpty && (
          <span className="absolute inset-0 flex items-center pl-1 text-[10px] italic text-gray-300 pointer-events-none">
            Sign here
          </span>
        )}

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
              onMouseEnter: handleHoverField,
              onTouchStart: handleHoverField,
              style: {
                width: "100%",
                height: "148px",
                display: "block",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 9999,
                touchAction: allowDrawing ? "auto" : "none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureField;
