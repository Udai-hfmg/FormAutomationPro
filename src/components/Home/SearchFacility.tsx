import { useState, useEffect, useRef, type SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Facility {
  id: number;
  name: string;
  location: string;
}

export interface ISearchFacility {
  ids: number[];
  setFacilityIds: React.Dispatch<SetStateAction<number[]>>;
}

export default function SearchFacility({ ids, setFacilityIds }: ISearchFacility) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setShowDropdown(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(t);
  }, [query]);

  // fetch
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFacilities([]);
      setShowDropdown(false);
      return;
    }
    fetchFacilities(debouncedQuery);
  }, [debouncedQuery]);

  async function fetchFacilities(q: string) {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/Office/search?query=${q}`
      );
      const result: Facility[] = res.data?.data ?? res.data ?? [];
      setFacilities(result);
      setShowDropdown(result.length > 0);
    } catch {
      setError("Failed to load facilities.");
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  }

  function toggleFacility(facility: Facility) {
    const alreadySelected = selectedFacilities.some((f) => f.id === facility.id);
    let updated: Facility[];

    if (alreadySelected) {
      updated = selectedFacilities.filter((f) => f.id !== facility.id);
    } else {
      updated = [...selectedFacilities, facility];
    }

    setSelectedFacilities(updated);
    setFacilityIds(updated.map((f) => f.id));
  }

  function removeFacility(id: number) {
    const updated = selectedFacilities.filter((f) => f.id !== id);
    setSelectedFacilities(updated);
    setFacilityIds(updated.map((f) => f.id));
  }

  return (
    <div className="w-full space-y-2">

      {/* ── Search Input ── */}
      <div ref={wrapperRef} className="relative">
        <div className="relative">
          {/* left icon */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </span>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => facilities.length > 0 && setShowDropdown(true)}
            placeholder="Search facilities..."
            className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl
                       bg-gray-50 text-gray-800 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[#1d5c3a]/25
                       focus:border-[#1d5c3a] focus:bg-white transition-all duration-200"
          />

          {/* right — spinner or search */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin text-[#1d5c3a]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            )}
          </span>
        </div>

        {/* ── Dropdown ── */}
        <AnimatePresence>
          {showDropdown && (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute z-50 top-[calc(100%+6px)] left-0 right-0
                         bg-white border border-gray-200 rounded-xl shadow-lg
                         overflow-hidden max-h-52 overflow-y-auto"
            >
              {facilities.map((facility, idx) => {
                const isSelected = selectedFacilities.some((f) => f.id === facility.id);
                return (
                  <li
                    key={facility.id}
                    onClick={() => toggleFacility(facility)}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer
                               transition-colors group
                               ${isSelected ? "bg-[#f0faf4]" : "hover:bg-gray-50"}
                               ${idx !== facilities.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    {/* checkbox */}
                    <div
                      className={`flex-shrink-0 w-[18px] h-[18px] rounded-md border-2
                                  flex items-center justify-center transition-all duration-150
                                  ${isSelected
                                    ? "bg-[#1d5c3a] border-[#1d5c3a]"
                                    : "border-gray-300 group-hover:border-[#1d5c3a]/50"
                                  }`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.12 }}
                            className="w-2.5 h-2.5 text-white"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth={3} d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* avatar */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                    flex-shrink-0 transition-colors
                                    ${isSelected ? "bg-[#1d5c3a]/10" : "bg-gray-100"}`}>
                      <svg className={`w-4 h-4 ${isSelected ? "text-[#1d5c3a]" : "text-gray-400"}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>

                    {/* text */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate transition-colors
                                    ${isSelected ? "text-[#1d5c3a]" : "text-gray-800 group-hover:text-[#1d5c3a]"}`}>
                        {facility.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{facility.location}</p>
                    </div>

                    {/* id badge */}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                                    ${isSelected
                                      ? "bg-[#1d5c3a]/10 text-[#1d5c3a]"
                                      : "bg-gray-100 text-gray-400"}`}>
                      #{facility.id}
                    </span>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-500 pl-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Selected Pills ── */}
      <AnimatePresence>
        {selectedFacilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2 pt-1"
          >
            {selectedFacilities.map((f) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5 bg-[#1d5c3a]/10 border
                           border-[#1d5c3a]/20 rounded-full pl-2 pr-1.5 py-1"
              >
                {/* mini icon */}
                <svg className="w-3 h-3 text-[#1d5c3a] flex-shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-xs font-medium text-[#1d5c3a] max-w-[140px] truncate">
                  {f.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFacility(f.id)}
                  className="w-4 h-4 rounded-full flex items-center justify-center
                             text-[#1d5c3a]/50 hover:text-[#1d5c3a] hover:bg-[#1d5c3a]/15
                             transition-colors ml-0.5"
                >
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}

            {/* clear all */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              type="button"
              onClick={() => { setSelectedFacilities([]); setFacilityIds([]); }}
              className="flex items-center gap-1 text-xs text-gray-400
                         hover:text-red-500 transition-colors px-2 py-1
                         rounded-full hover:bg-red-50"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}