import axios from "axios";
import { useEffect, useRef, useState, type SetStateAction } from "react";

interface Patient {
  id: number;
  name: string;
  city: string;
  phone:string , 
  
}

interface ISearchPatient {
  id: string;
  setPatientId: React.Dispatch<SetStateAction<any>>;
  setPhone?:(phone:string)=>void
}

export default function SearchPatient({ id, setPatientId , setPhone}: ISearchPatient) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [debouncedId, setDebouncedId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedId(id), 500);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!debouncedId.trim()) {
      setPatients([]);
      setShowDropdown(false);
      return;
    }
    searchForPatient(debouncedId);
  }, [debouncedId]);

  async function searchForPatient(query: string) {
    try {
      setIsLoading(true);
      setIsError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/Patient/search/${query}`
      );
      const result: Patient[] = response.data?.data ?? response.data ?? [];
      setPatients(result);
      setShowDropdown(result.length > 0);
      
    } catch {
      setIsError("Something went wrong");
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelect(patient: Patient) {
    setPatientId(String(patient.id));
    setPhone && setPhone(String(patient.phone))
    setSelectedLabel(`${patient.name}`);
    setShowDropdown(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedLabel("");
    setPatientId(e.target.value);
  }

  return (
    <div ref={wrapperRef} className="relative w-full">

      {/* Input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>

        <input
          type="text"
          value={selectedLabel || id}
          onChange={handleInputChange}
          onFocus={() => patients.length > 0 && setShowDropdown(true)}
          placeholder="Search patient..."
          className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl
                     bg-white text-gray-800 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-[#1d5c3a]/30 focus:border-[#1d5c3a]
                     transition-all duration-200"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin text-[#1d5c3a]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
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

      {/* Error */}
      {isError && (
        <p className="text-xs text-red-500 mt-1 pl-1">{isError}</p>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <ul className="absolute z-50 top-[calc(100%+6px)] left-0 right-0
                       bg-white border border-gray-200 rounded-xl shadow-lg
                       overflow-hidden max-h-52 overflow-y-auto">
          {patients.map((patient, idx) => (
            <li
              key={patient.id}
              onClick={() => handleSelect(patient)}
              className={`flex items-center justify-between px-4 py-2.5 cursor-pointer
                         hover:bg-[#f0faf4] transition-colors duration-150 group
                         ${idx !== patients.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-[#1d5c3a]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[#1d5c3a]">
                    {patient.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-[#1d5c3a] transition-colors">
                    {patient.name}
                  </p>
                  <p className="text-xs text-gray-400"># {patient.id}</p>
                </div>
              </div>

              {/* City badge */}
              <span className="text-xs text-[#1d5c3a] bg-[#1d5c3a]/10 px-2.5 py-0.5 rounded-full font-medium">
                {patient.city}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}