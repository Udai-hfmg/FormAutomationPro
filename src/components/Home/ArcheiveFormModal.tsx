import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import SearchFacility from "./SearchFacility";
import { useGetDocumentsQuery, useGetDocumentTypesQuery } from "../../redux/api/DocumentSlice";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Form {
  id: number;
  label: string;
  sub: string;
  date: string;
  status: "completed" | "pending" | "draft";
}

interface Facility {
  id: number;
  label: string;
  location: string;
  icon: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const ALL_FORMS: Form[] = [
  { id: 1, label: "OBG Intake Form", sub: "Hudson Valley Women's Health", date: "Apr 12, 2025", status: "completed" },
  { id: 2, label: "Lab Requisition", sub: "Diagnostics Dept.", date: "Apr 10, 2025", status: "completed" },
  { id: 3, label: "Consent Form — Surgery", sub: "Surgery Dept.", date: "Apr 8, 2025", status: "pending" },
  { id: 4, label: "General Intake", sub: "Primary Care", date: "Apr 5, 2025", status: "completed" },
  { id: 5, label: "Follow-up Questionnaire", sub: "OBG Dept.", date: "Apr 2, 2025", status: "draft" },
  { id: 6, label: "Annual Physical Form", sub: "Primary Care", date: "Mar 28, 2025", status: "completed" },
  { id: 7, label: "Referral Authorization", sub: "Admin", date: "Mar 22, 2025", status: "pending" },
];

const ALL_FACILITIES: Facility[] = [
  { id: 1, label: "Hudson Valley Women's Health", location: "Poughkeepsie, NY", icon: "🏥" },
  { id: 2, label: "Goshen Medical Center", location: "Goshen, NY", icon: "🏨" },
  { id: 3, label: "Middletown Clinic", location: "Middletown, NY", icon: "🏪" },
  { id: 4, label: "Delhi Outpatient Center", location: "Delhi, NY", icon: "🏢" },
  { id: 5, label: "Newburgh Family Practice", location: "Newburgh, NY", icon: "🏥" },
  { id: 6, label: "Monticello Health Center", location: "Monticello, NY", icon: "🏨" },
];

const STATUS_STYLES: Record<Form["status"], string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  draft:     "bg-gray-100 text-gray-500 border-gray-200",
};

const fieldVariants : Variants= {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ArchiveFormModal({
  isOpen,
  onClose,
  forms
}: {
  isOpen: boolean;
  onClose: () => void;
  forms: any;
}) {
  const [label, setLabel] = useState("");
  console.log("this is forms data" , forms)
  // forms
  const [selectedForms, setSelectedForms] = useState<any>([1, 2, 3, 4]);
  const [expanded, setExpanded] = useState(false);

  // facilities multi-select
  const [facilityQuery, setFacilityQuery] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState<any>([]);
  const [showFacilityDrop, setShowFacilityDrop] = useState(false);
  const facilityRef = useRef<HTMLDivElement>(null);

  const PREVIEW_COUNT = 3;

  const {data , isLoading , isError} = useGetDocumentsQuery("documents");
  

  // for getting for details 
  useEffect(()=>{
    if(forms.length > 0 && data){
      console.log("data from api" , data)
      setSelectedForms(data.filter((d:any) => forms.includes(d.documentVersionId)))
    }
    
  }, [forms])

  console.log("selected forms in modal" , selectedForms)

  const mappedForms = selectedForms.map((f: any) => ({
  id: f.documentVersionId,
  label: f.versionLabel,
  sub: f.documentType?.name,
  date: f.retiredDate ? new Date(f.retiredDate).toDateString() : "No date",
  status: f.retiredDate ? "completed" : "pending" // or your logic
}));

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (facilityRef.current && !facilityRef.current.contains(e.target as Node))
        setShowFacilityDrop(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredFacilities = ALL_FACILITIES.filter(
    (f) =>
      f.label.toLowerCase().includes(facilityQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(facilityQuery.toLowerCase())
  );

  function toggleFacility(id: number) {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleForm(id: number) {
  setSelectedForms((prev:any[]) =>
    prev.some(f => f.documentVersionId === id)
      ? prev.filter(f => f.documentVersionId !== id)
      : [...prev, data.find((d:any) => d.documentVersionId === id)]
  );
}

  function removeFacility(id: number) {
    setSelectedFacilities((prev) => prev.filter((x) => x !== id));
  }

  const visibleForms = expanded ? mappedForms : mappedForms.slice(0, PREVIEW_COUNT);
const hiddenCount = mappedForms.length - PREVIEW_COUNT > 0 ? mappedForms.length - PREVIEW_COUNT : 0;
  const isValid = label.trim() && selectedForms.length > 0 && selectedFacilities.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 28 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-[520px] rounded-2xl overflow-hidden shadow-2xl bg-white pointer-events-auto">

              {/* ── Header ── */}
              <div className="bg-[#1d5c3a] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-[15px] leading-tight">Archive Forms</p>
                    <p className="text-green-300 text-xs mt-0.5">Select forms and facilities to archive</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* ── Scrollable Body ── */}
              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* ── 1. Archive Label ── */}
                <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                  <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
                    Archive Label <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Q1 2025 OBG Records..."
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl
                               bg-gray-50 text-gray-800 placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-[#1d5c3a]/25
                               focus:border-[#1d5c3a] focus:bg-white transition-all duration-200"
                  />
                </motion.div>

                {/* ── 2. Forms Box ── */}
                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[13px] font-medium text-gray-600">
                      Forms{" "}
                      <span className="ml-1 text-xs font-semibold text-[#1d5c3a] bg-[#1d5c3a]/10 px-1.5 py-0.5 rounded-full">
                        {selectedForms.length} selected
                      </span>
                    </label>
                    <span className="text-xs text-gray-400">{ALL_FORMS.length} total</span>
                  </div>

                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <AnimatePresence initial={false}>
                      {visibleForms.map((form, idx) => {
                        const isChecked = selectedForms.some((f:any) => f.documentVersionId === form.id);
                        return (
                          <motion.div
                            key={form.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div
                              onClick={() => toggleForm(form.id)}
                              className={`flex items-center gap-3 px-4 py-3 cursor-pointer
                                         transition-colors group select-none
                                         ${isChecked ? "bg-[#f0faf4]" : "bg-white hover:bg-gray-50"}
                                         ${idx !== visibleForms.length - 1 ? "border-b border-gray-100" : ""}`}
                            >
                              {/* checkbox */}
                              <div className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center
                                              flex-shrink-0 transition-all duration-150
                                              ${isChecked
                                                ? "bg-[#1d5c3a] border-[#1d5c3a]"
                                                : "border-gray-300 group-hover:border-[#1d5c3a]/50"
                                              }`}
                                style={{ width: "18px", height: "18px" }}
                              >
                                {isChecked && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>

                              {/* icon */}
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                              ${isChecked ? "bg-[#1d5c3a]/10" : "bg-gray-100"}`}>
                                <svg className={`w-4 h-4 ${isChecked ? "text-[#1d5c3a]" : "text-gray-400"}`}
                                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>

                              {/* info */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate
                                              ${isChecked ? "text-[#1d5c3a]" : "text-gray-800"}`}>
                                  {form.label}
                                </p>
                                <p className="text-xs text-gray-400 truncate">{form.sub} · {form.date}</p>
                              </div>

                              {/* status badge */}
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border
                                              flex-shrink-0 capitalize ${STATUS_STYLES[form.status]}`}>
                                {form.status}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {/* View more / less */}
                    {ALL_FORMS.length > PREVIEW_COUNT && (
                      <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs
                                   font-semibold text-[#1d5c3a] hover:bg-[#f0faf4]
                                   border-t border-gray-100 transition-colors"
                      >
                        {expanded ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                            </svg>
                            Show less
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                            View {hiddenCount} more forms
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>

                {/* ── 3. Facilities Multi-Select ── */}
                <SearchFacility ids={selectedFacilities} setFacilityIds={setSelectedFacilities} />

              </div>

              {/* ── Footer ── */}
              <motion.div
                custom={3} variants={fieldVariants} initial="hidden" animate="visible"
                className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600
                             border border-gray-200 bg-white hover:bg-gray-100
                             transition-all duration-200 active:scale-[0.98]"
                >
                  Cancel
                </button>

                <motion.button
                  type="button"
                  disabled={!isValid}
                  whileHover={isValid ? { scale: 1.02 } : {}}
                  whileTap={isValid ? { scale: 0.97 } : {}}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center
                              justify-center gap-2 transition-all duration-200
                              ${isValid
                                ? "bg-[#1d5c3a] text-white shadow-md shadow-[#1d5c3a]/25 hover:bg-[#174d30]"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  Archive Forms
                </motion.button>
              </motion.div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}