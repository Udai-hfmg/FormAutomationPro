import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, FolderOpen, Layers } from "lucide-react";
import FacilityFolder, { type Facility } from "./FaciliyFolder";
import SendFormModal from "./SendFormModal";
import type { Form } from "./FormCard";

const FacilityFolders: React.FC = () => {
  const [search, setSearch] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / pageSize);

  const scrollRef = useRef<HTMLDivElement>(null);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [sendModal, setSendModal] = useState<{
    form: Form[] | Form | null;
    facility: Facility;
  } | null>(null);

  const totalForms = facilities.reduce(
    (sum, f) => sum + (f.forms?.length ?? 0),
    0
  );

  

  // 🔥 Fetch API
  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/Admin/facilities-with-forms?page=${page}&pageSize=${pageSize}&search=${search}`
        );

        const data = await response.json();
        setTotalCount(data.totalCount);

        const mapped: Facility[] = (data.data || []).map((item: any) => ({
          officeid: item.officeId,
          officeName: item.officeName,
          state: item.state ?? "",
          city: item.city ?? "",
          addressLine1: item.addressLine1 ?? "",
          addressLine2: item.addressLine2,
          isActive: item.isActive ?? true,
          phone: item.phone,
          zipcode: item.zipcode,
          color: "green",   
        }));

        setFacilities(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [page,search]);

  // 🔥 Auto scroll active page into view
  // useEffect(() => {
  //   const active = document.querySelector(`[data-page="${page}"]`);
  //   active?.scrollIntoView({
  //     behavior: "smooth",
  //     inline: "center",
  //     block: "nearest",
  //   });
  // }, [page]);

  // // 🔍 Search filter
  // const filtered = useMemo(() => {
  //   if (!search.trim()) return facilities;

  //   const q = search.toLowerCase();

  //   return facilities
  //     .map((fac) => ({
  //       ...fac,
  //       forms:
  //         fac.forms?.filter(
  //           (f) =>
  //             f.name.toLowerCase().includes(q) ||
  //             f.description.toLowerCase().includes(q) ||
  //             f.category.toLowerCase().includes(q)
  //         ) ?? [],
  //     }))
  //     .filter(
  //       (fac) =>
  //         fac.officeName.toLowerCase().includes(q) ||
  //         (fac.forms?.length ?? 0) > 0
  //     );
  // }, [search, facilities]);

  useEffect(() => {
  setPage(1);
}, [search]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-black text-green-800">
            Patient Forms
          </h1>

          <div className="flex gap-4 mt-3">
            <span>{facilities.length} Facilities</span>
            <span>{totalForms} Forms</span>
          </div>

          {/* SEARCH */}
          <div className="relative mt-4 max-w-sm">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 border rounded"
            />
          </div>
        </motion.div>

        {/* LIST */}
        <div className="space-y-3">
          {loading ? (
            <p>Loading...</p>
          ) : facilities.length > 0 ? (
            facilities.map((facility, i) => (
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
            <p>No results</p>
          )}
        </div>
      </div>

      {/* MODAL */}
      <SendFormModal
        isOpen={!!sendModal}
        onClose={() => setSendModal(null)}
        facility={sendModal?.form ?? null}
      />

      {/* 🔥 PAGINATION */}
      <div className="flex items-center justify-center mt-8 gap-2">

        {/* LEFT */}
        <button
          onClick={() => {
            const newPage = Math.max(1, page - 1);
            setPage(newPage);
            scrollRef.current?.scrollBy({ left: -120, behavior: "smooth" });
          }}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          {"<"}
        </button>

        {/* PAGES */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto max-w-md px-2"
        >
          {pages.map((p) => (
            <button
              key={p}
              data-page={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded border text-sm whitespace-nowrap transition ${
                p === page
                  ? "bg-green-600 text-white scale-105 shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* RIGHT */}
        <button
          onClick={() => {
            const newPage = Math.min(totalPages, page + 1);
            setPage(newPage);
            scrollRef.current?.scrollBy({ left: 120, behavior: "smooth" });
          }}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default FacilityFolders;                                                                                                     