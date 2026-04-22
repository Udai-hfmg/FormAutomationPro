import React, { useState, useMemo, useEffect } from "react";

import { motion } from "framer-motion";

import { Search, FolderOpen, Layers } from "lucide-react";

import FacilityFolder, { type Facility } from "./FaciliyFolder";

import SendFormModal from "./SendFormModal";

import type { Form } from "./FormCard";

// ── Sample Forms (used until real forms API is ready) ──────────────────────────

const SAMPLE_FORMS: Form[] = [
  {
    id: "f1-1",

    name: "OBG Forms",

    description:
      "Collects demographics, insurance, and emergency contact details for first-time patients.",

    category: "Intake",

    link: "/preview",
  },
   {
    id: "f1-2",

    name: "ACP Forms",

    description:
      "These Acp forms are for the patients to make the decision about what kinf of treatment they are getting and all the details will be here in this ACP Forms.",

    category: "Intake",

    link: "/acp",
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

const FacilityFolders: React.FC = () => {
  const [search, setSearch] = useState("");

  const [facilities, setFacilities] = useState<Facility[]>([]);

  const [loading, setLoading] = useState(true);

  const [sendModal, setSendModal] = useState<{
    form: Form;
    facility: Facility;
  } | null>(null);

  const totalForms = facilities.reduce(
    (sum, f) => sum + (f.forms?.length ?? 0),
    0,
  );

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/Admin`,
        );

        if (!response.ok) {
          console.error("API failed:", response.status);

          return;
        }

        const data = await response.json();

        console.log("these are the facilities", data);

        // ✅ Map API fields + attach sample forms to every facility

        const mapped: Facility[] = (Array.isArray(data) ? data : []).map(
          (item: any) => ({
            officeid: item.officeid,

            officeName: item.officeName,

            state: item.state ?? "",

            city: item.city ?? "",

            addressLine1: item.addressLine1 ?? "",

            addressLine2: item.addressLine2,

            isActive: item.isActive ?? true,

            phone: item.phone,

            zipcode: item.zipcode,

            color: "green",

            forms: SAMPLE_FORMS, // 👈 replace with API forms later
          }),
        );

        setFacilities(mapped);
      } catch (e) {
        console.error("Error fetching facilities:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []); // ✅ runs once only

  const filtered = useMemo(() => {
    if (!search.trim()) return facilities;

    const q = search.toLowerCase();

    return facilities

      .map((fac: Facility) => ({
        ...fac,

        forms:
          fac.forms?.filter(
            (f) =>
              f.name.toLowerCase().includes(q) ||
              f.description.toLowerCase().includes(q) ||
              f.category.toLowerCase().includes(q),
          ) ?? [],
      }))

      .filter(
        (fac) =>
          fac.officeName.toLowerCase().includes(q) ||
          (fac.forms?.length ?? 0) > 0,
      );
  }, [search, facilities]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Header */}

        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="text-2xl font-black tracking-tight"
                style={{ color: "#1a5c38" }}
              >
                Patient Forms
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Select a facility folder and send forms directly to your
                patients
              </p>
            </div>

            {/* Stats badges */}

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <FolderOpen size={15} color="#1a5c38" />

                <span className="text-sm font-bold text-gray-700">
                  {facilities.length}
                </span>

                <span className="text-xs text-gray-400">Facilities</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
                <Layers size={15} color="#9b1c3a" />

                <span className="text-sm font-bold text-gray-700">
                  {totalForms}
                </span>

                <span className="text-xs text-gray-400">Forms</span>
              </div>
            </div>
          </div>

          {/* Search */}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.38 }}
            className="relative mt-5 max-w-sm"
          >
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search facilities or forms…"
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none transition-colors duration-150 shadow-sm"
              onFocus={(e) => (e.target.style.borderColor = "#1a5c38")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </motion.div>
        </motion.div>

        {/* Folders List */}

        <div className="space-y-3">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4 animate-pulse">
                <FolderOpen size={22} className="text-gray-400" />
              </div>

              <p className="text-gray-500 font-medium">Loading facilities…</p>
            </motion.div>
          ) : filtered.length > 0 ? (
            filtered.map((facility: Facility, i: number) => (
              <FacilityFolder
                key={i}
                facility={facility}
                index={i}
                onSendForm={(form, fac) =>
                  setSendModal({ form, facility: fac })
                }
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
                <Search size={22} className="text-gray-400" />
              </div>

              <p className="text-gray-600 font-medium">No results found</p>

              <p className="text-sm text-gray-400 mt-1">
                Try a different search term
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Send Modal */}

      <SendFormModal
        isOpen={!!sendModal}
        onClose={() => setSendModal(null)}
        form={sendModal?.form ?? null}
        // facility={sendModal?.facility ?? null} 
      />
    </div>
  );
};

export default FacilityFolders;
