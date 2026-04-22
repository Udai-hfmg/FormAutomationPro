import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLazyGetSesionDetailsQuery } from "../redux/api/PatienSlice";
import { formRegistry } from "../Registry/formRegistry";
import useFormData from "../hooks/useFormData";

interface SessionDetails {
  sessionId: string;
  patientId: number;
  senderId: number;
  formIds: string;
  status: number;
  createdAt: string;
  expiresAt: string;
}

export default function SubForms() {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const [session, setSession] = useState<SessionDetails | null>(null);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedForms, setCompletedForms] = useState<string[]>([]);

  const [getSessionDetails, { isLoading }] = useLazyGetSesionDetailsQuery();

  // add this right after the token line
const isPreview = searchParams.get("preview") === "true";

  const {submitFormData} = useFormData()

  useEffect(() => {
    async function getSession() {
      if (!token) {
        setError("No session token found in URL.");
        return;
      }
      try {
        const result = await getSessionDetails(token).unwrap();
        setSession(result);
      } catch (err) {
        setError(`Failed to load session. Please check your link or try again.`);
      }
    }
    getSession();
  }, []);

  // ── Derived state ────────────────────────────────────────────────────────
  const formIds: string[] = session?.formIds
    ? session.formIds.split(",").map((id) => id.trim()).filter(Boolean)
    : [];

  const validFormIds   = formIds.filter((id) => id in formRegistry);
  const invalidFormIds = formIds.filter((id) => !(id in formRegistry));
  const totalForms     = validFormIds.length;
  // skip expiry check entirely in preview mode
const isExpired = !isPreview && session
  ? session.status !== 2 && new Date(session.expiresAt) < new Date()
  : false;

  function handleFormComplete(formId: string) {
    setCompletedForms((prev) => [...prev, formId]);
    if (currentIndex < totalForms - 1) setCurrentIndex((i) => i + 1);
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-[#1d5c3a]/20 border-t-[#1d5c3a] animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading your forms…</p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-800 mb-1">Something went wrong</h2>
          <p className="text-sm text-gray-500">{error}</p>
        </motion.div>
      </div>
    );
  }

  // ── Expired session ──────────────────────────────────────────────────────
  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-800 mb-1">Session Expired</h2>
          <p className="text-sm text-gray-500">
            This form link expired on{" "}
            <span className="font-semibold text-gray-700">
              {new Date(session!.expiresAt).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </span>. Please request a new link.
          </p>
        </motion.div>
      </div>
    );
  }

  // ── No valid forms found ─────────────────────────────────────────────────
  if (session && totalForms === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-gray-800 mb-1">No Forms Found</h2>
          <p className="text-sm text-gray-500">
            No matching forms were found for this session.
            {invalidFormIds.length > 0 && (
              <span className="block mt-2 text-xs text-red-400">
                Unknown form IDs: {invalidFormIds.join(", ")}
              </span>
            )}
          </p>
        </motion.div>
      </div>
    );
  }

  // ── All forms completed ──────────────────────────────────────────────────
  if (session && completedForms.length === totalForms && totalForms > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 18 }}
            className="w-16 h-16 rounded-full bg-[#1d5c3a]/10 border-2 border-[#1d5c3a]/20
                       flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-8 h-8 text-[#1d5c3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">All Done!</h2>
          <p className="text-sm text-gray-500">
            You've completed all {totalForms} form{totalForms > 1 ? "s" : ""}. Thank you!
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Render current form ──────────────────────────────────────────────────
  const currentFormId = validFormIds[currentIndex];
  const CurrentFormComponent = formRegistry[currentFormId];

 // ── Render all forms ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Preview banner ── */}
      

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {validFormIds.map((formId, idx) => {
          const FormComponent = formRegistry[formId];
          return (
            <motion.div
              key={formId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
                          ${isPreview ? "pointer-events-none select-none opacity-80" : ""}`}
            >
              <FormComponent
                patientId={session?.patientId}
                sessionId={session?.sessionId}
              />
            </motion.div>
          );
        })}

        {/* ── Submit button — hidden in preview ── */}
        {!isPreview && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => submitFormData()}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white
                       bg-[#1d5c3a] hover:bg-[#174d30] shadow-md shadow-[#1d5c3a]/20
                       flex items-center justify-center gap-2 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Submit All Forms
          </motion.button>
        )}

        {invalidFormIds.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 mb-0.5">Some forms could not be found</p>
            <p className="text-xs text-amber-600 font-mono">{invalidFormIds.join(", ")}</p>
          </div>
        )}

      </div>
    </div>
  );
}