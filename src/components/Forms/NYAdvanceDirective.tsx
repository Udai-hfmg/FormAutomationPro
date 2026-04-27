import { useState, useEffect, useMemo, type JSX } from "react";
import Navbar from "../Home/Navbar";
import SignatureField from "../../components/Input/SignatureField";
import toast from "react-hot-toast";

/* ─── Brand ──────────────────────────────────────────────────────────────────── */
const GREEN      = "#1B6B3A";
const GREEN_DARK = "#145230";
const BURG       = "#8B1A2E";
const BURG_LIGHT = "#f7eaed";

/* ─── API base ───────────────────────────────────────────────────────────────── */
const API_BASE: string = (import.meta as any).env?.VITE_BASE_URL ?? "";

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface AgentFields  { name: string; addr: string; city: string; phone: string; }
interface NoTreatments { cpr: boolean; vent: boolean; nutrition: boolean; antibiotics: boolean; }
interface Purposes     { transplant: boolean; therapy: boolean; research: boolean; education: boolean; }
interface WitnessFields { name: string; date: string; addr: string; }
type LifeChoice  = "" | "a" | "b";
type OrganChoice = "" | "none" | "all" | "specific";

interface NYAdvanceDirectiveProps {
  patientId?: number | null;
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const norm = (s: string) => s.trim().toLowerCase();

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onloadend = () => res((r.result as string).split(",")[1]);
    r.onerror   = rej;
    r.readAsDataURL(blob);
  });

/* ─── CSS ────────────────────────────────────────────────────────────────────── */
const DOC_CSS = `
.ad-root *{box-sizing:border-box;}
.ad-root{font-family:Georgia,"Times New Roman",serif;color:#111;max-width:860px;margin:0 auto;padding-bottom:48px;}
.intro-page{background:#fff;border:1px solid #ccc;padding:40px 48px;margin-bottom:0;border-bottom:none;font-size:13.5px;line-height:1.9;}
.intro-page:last-of-type{border-bottom:1px solid #ccc;}
.intro-page h1{font-size:22px;font-weight:700;text-align:center;margin:0 0 4px;letter-spacing:.02em;}
.intro-page h2{font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin:18px 0 6px;}
.intro-page h3{font-size:13.5px;font-weight:700;margin:14px 0 4px;}
.intro-page p{margin:0 0 10px;}
.intro-page ul{margin:4px 0 10px 20px;padding:0;}
.intro-page li{margin-bottom:6px;}
.intro-page .courtesy{text-align:center;font-size:12.5px;color:#444;margin-bottom:18px;}
.intro-page .copy{font-size:11px;color:#666;text-align:center;margin-bottom:20px;}
.intro-page .pkg-box{border:1px solid #ccc;padding:12px 16px;margin:14px 0;background:#f9f9f9;font-size:13px;}
.intro-page .before-box{border:1px solid #ccc;padding:12px 16px;margin:14px 0;}

.form-page{display:grid;grid-template-columns:175px 1fr;background:#fff;border:1px solid #ccc;border-bottom:none;}
.form-page:last-of-type{border-bottom:1px solid #ccc;}
.fp-header{grid-column:1/-1;padding:18px 28px 14px;border-bottom:1px solid #ddd;font-size:13.5px;line-height:1.85;}
.fp-header h2{font-size:13px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:.04em;margin:0 0 4px;}
.fp-header h3{font-size:13px;font-weight:700;text-align:center;margin:0 0 10px;}
.fp-header p{margin:0 0 8px;}
.fp-sb{background:#d9d9d9;padding:14px 10px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#333;line-height:1.6;border-right:1px solid #bbb;border-top:1px solid rgba(0,0,0,.1);}
.fp-ct{padding:14px 28px;font-size:13.5px;line-height:1.85;border-top:1px solid rgba(0,0,0,.06);}
.fp-ct p{margin:0 0 10px;}
.fp-sb-tag{display:inline-block;background:#1a1a1a;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;letter-spacing:.05em;margin-bottom:6px;}
.page-break-line{border:none;border-top:2px dashed #ccc;margin:0;}
.fp-copy{font-size:10px;color:#666;margin-top:18px;}

.ad-input{border:none;border-bottom:1.5px solid #333;background:rgba(27,107,58,.05);font-family:Georgia,serif;font-size:13.5px;color:#111;outline:none;padding:2px 4px;width:100%;transition:border-color .15s;}
.ad-input:focus{border-bottom-color:${GREEN};background:rgba(27,107,58,.10);}
.ad-textarea{border:1px solid #bbb;background:#fff;font-family:Georgia,serif;font-size:13px;color:#111;outline:none;padding:6px 8px;width:100%;resize:vertical;line-height:1.7;transition:border-color .15s;}
.ad-textarea:focus{border-color:${GREEN};box-shadow:0 0 0 2px rgba(27,107,58,.10);}
.ad-inline{border:none;border-bottom:1.5px solid #333;background:rgba(27,107,58,.05);font-family:Georgia,serif;font-size:13.5px;color:#111;outline:none;padding:1px 4px;display:inline-block;vertical-align:bottom;transition:border-color .15s;}
.ad-inline:focus{border-bottom-color:${GREEN};}

.choice-wrap{border:1px solid #bbb;margin:8px 0;overflow:hidden;}
.choice-wrap.sel-a{border:2px solid ${BURG};}
.choice-wrap.sel-b{border:2px solid ${GREEN};}
.choice-row{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;}
.sub-checks{background:${BURG_LIGHT};border-top:1px solid #e0c0c8;padding:10px 12px 10px 36px;}
.sub-check-row{display:flex;align-items:center;gap:10px;margin-bottom:7px;font-size:13px;}
.organ-row{display:flex;align-items:flex-start;gap:10px;padding:8px 0;font-size:13.5px;}
.purpose-row{display:flex;gap:20px;flex-wrap:wrap;margin:8px 0;}
.purpose-item{display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;}

.sig-field-row{display:flex;gap:16px;margin-bottom:10px;}
.sig-field-row>div{flex:1;}
.sig-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#555;margin-bottom:3px;}
.sig-wrap{border:1px solid #bbb;background:#fafff8;margin-bottom:4px;}

.f-row{margin-bottom:10px;}
.f-lbl{font-size:11.5px;color:#555;display:block;margin-bottom:2px;}
.agent-box{margin:10px 0;padding:12px 14px;border:1px solid #bbb;background:#fafafa;}

/* Two-column row: used for first/last name and city/state/zip */
.two-col-row{display:flex;gap:10px;margin-bottom:10px;}
.two-col-row>div{flex:1;}
.addr-row{display:flex;gap:10px;margin-bottom:10px;}
.addr-row>div{flex:1;}

.conflict-badge{display:flex;align-items:flex-start;gap:8px;margin-top:8px;padding:9px 12px;background:#fff7ed;border:1.5px solid #f59e0b;border-radius:5px;font-size:12.5px;color:#92400e;font-family:Georgia,serif;line-height:1.6;}
.conflict-summary{display:flex;flex-direction:column;gap:6px;background:#fff7ed;border:1.5px solid #f59e0b;border-radius:7px;padding:14px 18px;margin-bottom:16px;font-size:13px;color:#78350f;font-family:Georgia,serif;}

@media(max-width:600px){
  .form-page{grid-template-columns:1fr;}
  .fp-sb{border-right:none;border-bottom:1px solid #bbb;}
  .fp-ct{padding:12px 16px;}
  .sig-field-row{flex-direction:column;}
  .two-col-row{flex-direction:column;}
  .addr-row{flex-direction:column;}
}
`;

/* ─── Input components ───────────────────────────────────────────────────────── */
interface TIProps { v: string; s: (v: string) => void; ph?: string; type?: string; }
const TI = ({ v, s, ph = "", type = "text" }: TIProps): JSX.Element => (
  <input className="ad-input" type={type} value={v} onChange={e => s(e.target.value)} placeholder={ph} />
);

interface TAProps { v: string; s: (v: string) => void; ph?: string; rows?: number; }
const TA = ({ v, s, ph = "", rows = 4 }: TAProps): JSX.Element => (
  <textarea className="ad-textarea" value={v} onChange={e => s(e.target.value)} placeholder={ph} rows={rows} />
);

interface ILProps { v: string; s: (v: string) => void; w?: number; ph?: string; }
const IL = ({ v, s, w = 220, ph = "" }: ILProps): JSX.Element => (
  <input className="ad-inline" value={v} onChange={e => s(e.target.value)} placeholder={ph} style={{ minWidth: w }} />
);

/* ─── ConflictBadge ──────────────────────────────────────────────────────────── */
function ConflictBadge({ messages }: { messages: string[] }): JSX.Element | null {
  if (!messages.length) return null;
  return (
    <div className="conflict-badge">
      <span style={{ flexShrink: 0, fontSize: 14, marginTop: 1 }}>⚠️</span>
      <div>{messages.map((m, i) => <div key={i}>{m}</div>)}</div>
    </div>
  );
}

/* ─── AgentBox ───────────────────────────────────────────────────────────────── */
function AgentBox({ data, onChange, conflictMsgs = [] }: {
  data: AgentFields; onChange: (d: AgentFields) => void; conflictMsgs?: string[];
}): JSX.Element {
  const u = (k: keyof AgentFields) => (val: string) => onChange({ ...data, [k]: val });
  return (
    <div className="agent-box">
      <div className="f-row"><span className="f-lbl">Name</span><TI v={data.name} s={u("name")} ph="Full legal name" /></div>
      <ConflictBadge messages={conflictMsgs} />
      <div className="f-row" style={{ marginTop: conflictMsgs.length ? 10 : 0 }}>
        <span className="f-lbl">Home address</span><TI v={data.addr} s={u("addr")} ph="Street address" />
      </div>
      <div className="f-row"><span className="f-lbl">City, State, ZIP</span><TI v={data.city} s={u("city")} ph="City, NY 00000" /></div>
      <div className="f-row"><span className="f-lbl">Telephone number</span><TI v={data.phone} s={u("phone")} ph="(   )   -    " /></div>
    </div>
  );
}

/* ─── WitnessBlock ───────────────────────────────────────────────────────────── */
function WitnessBlock({ num, data, onChange, sigValue, onSigChange, conflictMsgs = [] }: {
  num: number; data: WitnessFields; onChange: (d: WitnessFields) => void;
  sigValue: Blob | string | null; onSigChange: (b: Blob | null) => void; conflictMsgs?: string[];
}): JSX.Element {
  const u = (k: keyof WitnessFields) => (val: string) => onChange({ ...data, [k]: val });
  return (
    <div style={{ borderTop: "1px solid #ccc", paddingTop: 14, marginTop: 14, marginBottom: 20 }}>
      <div className="sig-label" style={{ marginBottom: 8 }}>
        WITNESS {num}&nbsp;
        <span style={{ fontWeight: 400, fontStyle: "italic", textTransform: "none", fontSize: 11 }}>
          (cannot be your agent or alternate agent)
        </span>
      </div>
      <div className="sig-field-row">
        <div>
          <div className="sig-label">Signed (draw below)</div>
          <div className="sig-wrap"><SignatureField value={sigValue} onChange={onSigChange} /></div>
        </div>
        <div style={{ maxWidth: 180 }}>
          <div className="sig-label">Date</div>
          <TI v={data.date} s={u("date")} type="date" />
        </div>
      </div>
      <div className="f-row">
        <div className="sig-label">Print Name <span style={{ color: BURG }}>*</span></div>
        <TI v={data.name} s={u("name")} ph={`Witness ${num} full name`} />
        <ConflictBadge messages={conflictMsgs} />
      </div>
      <div className="f-row">
        <div className="sig-label">Address</div>
        <TI v={data.addr} s={u("addr")} ph="Street address, City, State, ZIP" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */
export default function NYAdvanceDirective({ patientId }: NYAdvanceDirectiveProps): JSX.Element {

  /* ── Meta ── */
  const [loading,    setLoading]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEdit,     setIsEdit]     = useState(false);

  /* ── Part I ── */
  const [myName,      setMyName]      = useState("");
  const [agent,       setAgent]       = useState<AgentFields>({ name: "", addr: "", city: "", phone: "" });
  const [altAgent,    setAltAgent]    = useState<AgentFields>({ name: "", addr: "", city: "", phone: "" });
  const [agentLimits, setAgentLimits] = useState("");
  const [expiry,      setExpiry]      = useState("");
  const [agentInstr,  setAgentInstr]  = useState("");

  /* ── Part II ── */
  const [lwName,     setLwName]     = useState("");
  const [lifeChoice, setLifeChoice] = useState<LifeChoice>("");
  const [noTx,       setNoTx]       = useState<NoTreatments>({ cpr: false, vent: false, nutrition: false, antibiotics: false });
  const [painLimit,  setPainLimit]  = useState("");
  const [otherDir,   setOtherDir]   = useState("");

  /* ── Organ ── */
  const [organChoice, setOrganChoice] = useState<OrganChoice>("");
  const [organSpec,   setOrganSpec]   = useState("");
  const [purposes,    setPurposes]    = useState<Purposes>({ transplant: true, therapy: true, research: true, education: true });

  /* ── Part III — signature block ──────────────────────────────────────────────
     sigFirstName → patients.FirstName   (also stored in patient_acp_forms)
     sigLastName  → patients.LastName    (also stored in patient_acp_forms)
     sigPhone     → patients.PhonePrimary
     sigAddr      → patients.AddressLine1
     sigCity      → patients.City
     sigState     → patients.State
     sigZip       → patients.ZipCode
  ── */
  const [sigFirstName, setSigFirstName] = useState("");
  const [sigLastName,  setSigLastName]  = useState("");
  const [sigDate,      setSigDate]      = useState("");
  const [sigPhone,     setSigPhone]     = useState("");
  const [sigAddr,      setSigAddr]      = useState("");
  const [sigCity,      setSigCity]      = useState("");
  const [sigState,     setSigState]     = useState("");
  const [sigZip,       setSigZip]       = useState("");

  /* ── Witnesses ── */
  const [witness1, setWitness1] = useState<WitnessFields>({ name: "", date: "", addr: "" });
  const [witness2, setWitness2] = useState<WitnessFields>({ name: "", date: "", addr: "" });

  /* ── Signature blobs / saved base64 ── */
  const [patSigBlob,  setPatSigBlob]  = useState<Blob | null>(null);
  const [wit1SigBlob, setWit1SigBlob] = useState<Blob | null>(null);
  const [wit2SigBlob, setWit2SigBlob] = useState<Blob | null>(null);
  const [patSigB64,   setPatSigB64]   = useState<string | null>(null);
  const [wit1SigB64,  setWit1SigB64]  = useState<string | null>(null);
  const [wit2SigB64,  setWit2SigB64]  = useState<string | null>(null);

  /* ── Acknowledgment ── */
  const [ackChecked, setAckChecked] = useState(false);

  const toggleNoTx    = (k: keyof NoTreatments) => setNoTx(p => ({ ...p, [k]: !p[k] }));
  const togglePurpose = (k: keyof Purposes)     => setPurposes(p => ({ ...p, [k]: !p[k] }));

  /* ── Inject CSS ── */
  useEffect(() => {
    if (document.getElementById("acp-doc-css")) return;
    const el = document.createElement("style");
    el.id = "acp-doc-css";
    el.textContent = DOC_CSS;
    document.head.appendChild(el);
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     CONFLICT DETECTION
  ───────────────────────────────────────────────────────────────────────── */
  const conflictMap = useMemo(() => {
    const an = norm(agent.name);
    const bn = norm(altAgent.name);
    const w1 = norm(witness1.name);
    const w2 = norm(witness2.name);
    const primary: string[] = []; const alternate: string[] = [];
    const wit1: string[] = [];    const wit2: string[] = [];

    if (an && bn && an === bn) { primary.push("Primary agent and alternate agent cannot be the same person."); alternate.push("Primary agent and alternate agent cannot be the same person."); }
    if (an && w1 && an === w1) { primary.push("Primary agent and Witness 1 cannot be the same person."); wit1.push("Witness 1 and the primary agent cannot be the same person."); }
    if (an && w2 && an === w2) { primary.push("Primary agent and Witness 2 cannot be the same person."); wit2.push("Witness 2 and the primary agent cannot be the same person."); }
    if (bn && w1 && bn === w1) { alternate.push("Alternate agent and Witness 1 cannot be the same person."); wit1.push("Witness 1 and the alternate agent cannot be the same person."); }
    if (bn && w2 && bn === w2) { alternate.push("Alternate agent and Witness 2 cannot be the same person."); wit2.push("Witness 2 and the alternate agent cannot be the same person."); }
    if (w1 && w2 && w1 === w2) { wit1.push("Witness 1 and Witness 2 cannot be the same person."); wit2.push("Witness 1 and Witness 2 cannot be the same person."); }

    return { primary, alternate, wit1, wit2 };
  }, [agent.name, altAgent.name, witness1.name, witness2.name]);

  const hasConflicts = Object.values(conflictMap).some(a => a.length > 0);
  const allConflicts = useMemo(() => {
    const seen = new Set<string>(); const out: string[] = [];
    [...conflictMap.primary, ...conflictMap.alternate, ...conflictMap.wit1, ...conflictMap.wit2]
      .forEach(m => { if (!seen.has(m)) { seen.add(m); out.push(m); } });
    return out;
  }, [conflictMap]);

  /* ─────────────────────────────────────────────────────────────────────────
     LOAD EXISTING FORM
  ───────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    fetch(`${API_BASE}/api/AcpForm/patient/${patientId}`)
      .then(r => { if (r.status === 404) return null; if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: any) => {
        if (!data) return;
        setIsEdit(true);

        /* Part I */
        setMyName(data.patient_name ?? "");
        setAgentLimits(data.agent_limits ?? "");
        setExpiry(data.proxy_expiry ?? "");
        setAgentInstr(data.agent_instructions ?? "");
        const primary   = (data.agents ?? []).find((a: any) => a.type === "primary")   ?? {};
        const alternate = (data.agents ?? []).find((a: any) => a.type === "alternate") ?? {};
        setAgent({    name: primary.name   ?? "", addr: primary.address   ?? "", city: primary.city   ?? "", phone: primary.phone   ?? "" });
        setAltAgent({ name: alternate.name ?? "", addr: alternate.address ?? "", city: alternate.city ?? "", phone: alternate.phone ?? "" });

        /* Part II */
        setLwName(data.lw_name ?? "");
        setLifeChoice((data.life_choice ?? "") as LifeChoice);
        setNoTx({ cpr: !!data.no_cpr, vent: !!data.no_vent, nutrition: !!data.no_nutrition, antibiotics: !!data.no_antibiotics });
        setPainLimit(data.pain_limit ?? "");
        setOtherDir(data.other_directions ?? "");

        /* Organ */
        setOrganChoice((data.organ_choice ?? "") as OrganChoice);
        setOrganSpec(data.organ_spec ?? "");
        setPurposes({ transplant: data.purpose_transplant !== false, therapy: data.purpose_therapy !== false, research: data.purpose_research !== false, education: data.purpose_education !== false });

        /* Part III — split name fields */
        setSigFirstName(data.signature_first_name ?? "");
        setSigLastName(data.signature_last_name   ?? "");
        setSigDate(data.signature_date ? data.signature_date.substring(0, 10) : "");
        setSigPhone(data.signature_phone   ?? "");
        setSigAddr(data.signature_address  ?? "");
        setSigCity(data.signature_city     ?? "");
        setSigState(data.signature_state   ?? "");
        setSigZip(data.signature_zip       ?? "");
        if (data.signature_image) setPatSigB64(data.signature_image);

        /* Witnesses */
        const w1 = (data.witnesses ?? [])[0] ?? {};
        const w2 = (data.witnesses ?? [])[1] ?? {};
        setWitness1({ name: w1.name ?? "", date: w1.date?.substring(0, 10) ?? "", addr: w1.address ?? "" });
        setWitness2({ name: w2.name ?? "", date: w2.date?.substring(0, 10) ?? "", addr: w2.address ?? "" });
        if (w1.signature_image) setWit1SigB64(w1.signature_image);
        if (w2.signature_image) setWit2SigB64(w2.signature_image);
      })
      .catch(err => console.error("[ACP] Load error:", err))
      .finally(() => setLoading(false));
  }, [patientId]);

  /* ─────────────────────────────────────────────────────────────────────────
     SUBMIT
  ───────────────────────────────────────────────────────────────────────── */
 const handleSubmit = async (): Promise<void> => {
  if (hasConflicts) {
    toast.error("Please resolve the conflicts before submitting");
    return;
  }

  const missing: string[] = [];
  if (!myName)         missing.push("Your full legal name (Part I)");
  if (!agent.name)     missing.push("Health care agent name");
  if (!lwName)         missing.push("Your full legal name (Living Will, Part II)");
  if (!lifeChoice)     missing.push("Life-sustaining treatment choice (Part II)");
  if (!sigFirstName)   missing.push("First name (Part III)");
  if (!sigLastName)    missing.push("Last name (Part III)");
  if (!sigDate)        missing.push("Signature date (Part III)");
  if (!sigPhone)       missing.push("Phone number (Part III)");
  if (!sigAddr)        missing.push("Street address (Part III)");
  if (!sigCity)        missing.push("City (Part III)");
  if (!sigState)       missing.push("State (Part III)");
  if (!sigZip)         missing.push("ZIP code (Part III)");
  if (!patSigBlob && !patSigB64) missing.push("Your drawn signature (Part III)");
  if (!witness1.name)  missing.push("Witness 1 name");
  if (!witness2.name)  missing.push("Witness 2 name");

  if (missing.length) {
    toast.error(`Please complete:\n• ${missing.join("\n• ")}`);
    return;
  }

  if (!ackChecked) {
    toast.error("Please check the acknowledgment box before submitting");
    return;
  }

  setSubmitting(true);
  const toastId = toast.loading("Submitting form...");

  try {
    const patSigFinal  = patSigBlob  ? await blobToBase64(patSigBlob)  : patSigB64;
    const wit1SigFinal = wit1SigBlob ? await blobToBase64(wit1SigBlob) : wit1SigB64;
    const wit2SigFinal = wit2SigBlob ? await blobToBase64(wit2SigBlob) : wit2SigB64;

    const payload = {
      patient_id: patientId ?? null,

      patient_info: !patientId ? {
        first_name:    sigFirstName || null,
        last_name:     sigLastName  || null,
        phone_primary: sigPhone     || null,
        address_line1: sigAddr      || null,
        city:          sigCity      || null,
        state:         sigState     || null,
        zip_code:      sigZip       || null,
      } : null,

      patient_name:       myName,
      agent_limits:       agentLimits,
      proxy_expiry:       expiry,
      agent_instructions: agentInstr,
      lw_name:            lwName,
      life_choice:        lifeChoice,
      no_cpr:             noTx.cpr,
      no_vent:            noTx.vent,
      no_nutrition:       noTx.nutrition,
      no_antibiotics:     noTx.antibiotics,
      pain_limit:         painLimit,
      other_directions:   otherDir,
      organ_choice:       organChoice || null,
      organ_spec:         organSpec,
      purpose_transplant: purposes.transplant,
      purpose_therapy:    purposes.therapy,
      purpose_research:   purposes.research,
      purpose_education:  purposes.education,

      signature_first_name: sigFirstName,
      signature_last_name:  sigLastName,
      signature_date:       sigDate,
      signature_phone:      sigPhone,
      signature_address:    sigAddr,
      signature_city:       sigCity,
      signature_state:      sigState,
      signature_zip:        sigZip,
      signature_image:      patSigFinal,

      agents: [
        { type: "primary",   name: agent.name,    address: agent.addr,    city: agent.city,    phone: agent.phone },
        { type: "alternate", name: altAgent.name, address: altAgent.addr, city: altAgent.city, phone: altAgent.phone },
      ],

      witnesses: [
        { name: witness1.name, date: witness1.date, address: witness1.addr, signature_image: wit1SigFinal },
        { name: witness2.name, date: witness2.date, address: witness2.addr, signature_image: wit2SigFinal },
      ],
    };

    const res = await fetch(`${API_BASE}/api/AcpForm/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message ?? errJson.error ?? `HTTP ${res.status}`);
    }

    const result = await res.json();
    setIsEdit(true);

    toast.success(
      result.isNew
        ? "Form submitted successfully"
        : "Form updated successfully",
      { id: toastId }
    );

  } catch (err: any) {
    toast.error(err.message ?? "Submission failed", { id: toastId });
  } finally {
    setSubmitting(false);
  }
};

  /* ─────────────────────────────────────────────────────────────────────────
     LOADING SPINNER
  ───────────────────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 12 }}>
          <svg style={{ animation: "spin 1s linear infinite", width: 32, height: 32, color: GREEN }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <circle style={{ opacity: .25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: .75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p style={{ color: "#888", fontFamily: "Georgia,serif", fontSize: 14 }}>Loading your advance directive…</p>
        </div>
      </>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <>
      <Navbar />
      <div className="ad-root">

        {/* ── Header ── */}
        <div style={{ background: GREEN, padding: "14px 22px", display: "flex", alignItems: "center", gap: 14, borderRadius: "8px 8px 0 0" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <circle cx="15" cy="8" r="5" fill={BURG} />
              <ellipse cx="15" cy="22" rx="9" ry="6" fill={BURG} />
              <circle cx="5.5" cy="14" r="3.2" fill={BURG} opacity=".65" />
              <circle cx="24.5" cy="14" r="3.2" fill={BURG} opacity=".65" />
            </svg>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,.8)", fontSize: 11.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Horizon Family Medical Group</div>
            <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>New York Advance Directive</div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 12 }}>Health Care Proxy and Living Will</div>
          </div>
          {isEdit && (
            <span style={{ marginLeft: "auto", background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.3)", borderRadius: 5, padding: "3px 12px", color: "#fff", fontSize: 12, fontWeight: 600 }}>
              ✏️ Editing Saved Record
            </span>
          )}
        </div>

        {/* ── Status banners ── */}
        {isEdit ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 5, padding: "10px 16px", color: "#166534", fontSize: 13, marginTop: 8 }}>
            <span>✅</span><span>A saved advance directive was found. Your changes will update the existing record on submit.</span>
          </div>
        ) : patientId ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 5, padding: "10px 16px", color: "#1e40af", fontSize: 13, marginTop: 8 }}>
            <span>📋</span><span>No advance directive on file. Complete the form below and click Submit to create your record.</span>
          </div>
        ) : null}

        {/* ── Conflict summary ── */}
        {hasConflicts && (
          <div className="conflict-summary" style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: "#92400e", marginBottom: 4 }}>⚠️ Person Conflict — Please Resolve Before Submitting</div>
            {allConflicts.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}><span style={{ color: "#f59e0b", flexShrink: 0 }}>•</span><span>{m}</span></div>
            ))}
          </div>
        )}

        {/* ════ INTRO 1 ════ */}
        <div className="intro-page">
          <p className="copy">Copyright © 2005 National Alliance for Care at Home. All rights reserved. Revised 2023.</p>
          <h1>NEW YORK</h1>
          <h1 style={{ fontSize: 18 }}>Advance Directive</h1>
          <p style={{ textAlign: "center", fontStyle: "italic", margin: "4px 0 2px", fontSize: 13 }}>Planning for Important Healthcare Decisions</p>
          <p className="courtesy">Courtesy of CaringInfo<br />www.caringinfo.org</p>
          <p>CaringInfo, a program of the National Alliance for Care at Home, is a national consumer engagement initiative to improve care and the experience of caregiving during serious illness and at the end of life.</p>
          <div className="pkg-box">
            <strong>This package includes:</strong>
            <ul>
              <li>Instructions for preparing your advance directive. Please read all the instructions.</li>
              <li>Your state-specific advance directive forms, which are the pages with the gray instruction bar on the left side.</li>
            </ul>
          </div>
          <div className="before-box">
            <h2 style={{ marginTop: 0 }}>BEFORE YOU BEGIN</h2>
            <p>The advance directives in this package will be legally binding only if the person completing them is a competent adult who is 18 years of age or older, or an emancipated minor, or, in the state of New York, has been married, or is a parent.</p>
          </div>
          <h2>ACTION STEPS</h2>
          <ol style={{ margin: "4px 0 10px 20px", padding: 0 }}>
            <li style={{ marginBottom: 8 }}>You may want to photocopy or print a second set of these forms before you start.</li>
            <li style={{ marginBottom: 8 }}>Refer to the gray instruction bars — they will guide you through the process.</li>
            <li style={{ marginBottom: 8 }}>Talk with your family, friends, and physicians about your advance directive.</li>
            <li style={{ marginBottom: 8 }}>Once completed and signed, give copies to your agent, family, healthcare providers, and faith leaders.</li>
          </ol>
        </div>

        {/* ════ INTRO 2 ════ */}
        <div className="intro-page" style={{ borderBottom: "1px solid #ccc" }}>
          <h2>INTRODUCTION TO YOUR NEW YORK ADVANCE HEALTH CARE DIRECTIVE</h2>
          <p><strong>Part I, Health Care Proxy,</strong> lets you name someone, your agent, to make decisions about your health care if you can no longer speak for yourself.</p>
          <p><strong>Part II, Living Will,</strong> lets you state your wishes about healthcare in the event that you can no longer speak for yourself.</p>
          <p><strong>Part III</strong> contains the signature and witnessing provisions so that your document will be effective.</p>
          <h3 style={{ textAlign: "left", fontSize: 13.5 }}>How do I make my New York Advance Health Care Directive legal?</h3>
          <p>If you complete Part I, you must sign and date this document in the presence of two adult witnesses. The person you name as your agent or alternate agent cannot act as a witness.</p>
          <h3 style={{ textAlign: "left", fontSize: 13.5 }}>What if I change my mind?</h3>
          <p>You may revoke your advance directive by notifying your agent or healthcare provider orally or in writing, or by any other act that clearly shows your intent to revoke the document.</p>
        </div>

        {/* ════ PAGE 1 — Health Care Proxy ════ */}
        <hr className="page-break-line" />
        <div className="form-page">
          <div className="fp-header">
            <h2>NEW YORK HEALTH CARE PROXY AND LIVING WILL – PAGE 1 OF 6</h2>
            <h3>Part I. Health Care Proxy</h3>
          </div>
          <div className="fp-sb" style={{ borderTop: "none" }}><span className="fp-sb-tag">PART I</span><br />PRINT YOUR NAME</div>
          <div className="fp-ct" style={{ borderTop: "none" }}>
            <p>I,&nbsp;<IL v={myName} s={setMyName} w={260} ph="your full legal name" />,&nbsp;hereby appoint:</p>
          </div>
          <div className="fp-sb">PRINT NAME,<br />HOME ADDRESS<br />AND TELEPHONE<br />NUMBER OF<br />YOUR AGENT</div>
          <div className="fp-ct">
            <AgentBox data={agent} onChange={setAgent} conflictMsgs={conflictMap.primary} />
            <p style={{ marginTop: 8 }}>as my health care agent.</p>
          </div>
          <div className="fp-sb">PRINT NAME, HOME<br />ADDRESS AND<br />TELEPHONE NUMBER<br />OF YOUR ALTERNATE<br />AGENT</div>
          <div className="fp-ct">
            <p>In the event that the person I name above is unable, unwilling, or reasonably unavailable to act as my agent, I hereby appoint</p>
            <AgentBox data={altAgent} onChange={setAltAgent} conflictMsgs={conflictMap.alternate} />
            <p style={{ marginTop: 8 }}>as my health care agent.</p>
            <p>This health care proxy shall take effect in the event I become unable to make my own health care decisions.</p>
          </div>
          <div className="fp-sb">ADD INSTRUCTIONS<br />ONLY IF YOU WANT<br />TO LIMIT YOUR<br />AGENT'S AUTHORITY</div>
          <div className="fp-ct">
            <p>My agent has the authority to make any and all health care decisions for me, except to the extent that I state otherwise here:</p>
            <div className="f-row"><TA v={agentLimits} s={setAgentLimits} ph="State any limitations here, or leave blank to grant full authority…" rows={3} /></div>
          </div>
          <div className="fp-sb">SPECIFY DATE OR<br />CONDITIONS FOR<br />EXPIRATION, IF ANY</div>
          <div className="fp-ct">
            <p>Unless I revoke it, this proxy shall remain in effect indefinitely, or until the date or condition I have stated below:</p>
            <div className="f-row"><TI v={expiry} s={setExpiry} ph="e.g. December 31, 2030 — or leave blank for indefinite" /></div>
            <p className="fp-copy">© 2005 National Alliance for Care at Home. 2023 Revised.</p>
          </div>
        </div>

        {/* ════ PAGE 2 — Additional Instructions ════ */}
        <hr className="page-break-line" />
        <div className="form-page">
          <div className="fp-header"><h2>NEW YORK HEALTH CARE PROXY AND LIVING WILL – PAGE 2 OF 6</h2></div>
          <div className="fp-sb" style={{ borderTop: "none" }}>ADD OTHER<br />INSTRUCTIONS,<br />IF ANY<br /><br />ATTACH ADDITIONAL<br />PAGES IF NEEDED</div>
          <div className="fp-ct" style={{ borderTop: "none" }}>
            <p>When making health-care decisions for me, my agent should think about what action would be consistent with past conversations we have had, my treatment preferences as expressed in this or any other document, my religious and other beliefs and values, and how I have handled medical and other important issues in the past. If what I would decide is still unclear, then my agent should make decisions for me that my agent believes are in my best interest, considering the benefits, burdens, and risks of my current circumstances and treatment options.</p>
            <p>My agent should also consider the following instructions when making health care decisions for me:</p>
            <div className="f-row"><TA v={agentInstr} s={setAgentInstr} ph="Enter additional instructions here… (attach additional pages if needed)" rows={12} /></div>
            <p className="fp-copy">© 2005 National Alliance for Care at Home. 2023 Revised.</p>
          </div>
        </div>

        {/* ════ PAGE 3 — Living Will ════ */}
        <hr className="page-break-line" />
        <div className="form-page">
          <div className="fp-header"><h2>Part II. NEW YORK HEALTH CARE PROXY AND LIVING WILL – PAGE 3 OF 6</h2></div>
          <div className="fp-sb" style={{ borderTop: "none" }}><span className="fp-sb-tag">PART II</span><br />PRINT YOUR NAME</div>
          <div className="fp-ct" style={{ borderTop: "none" }}>
            <p>I,&nbsp;<IL v={lwName} s={setLwName} w={240} ph="your full legal name" />,&nbsp;being of sound mind, make this statement as a directive to be followed if I become unable to participate in decisions regarding my medical care.</p>
          </div>
          <div className="fp-sb">INITIAL ONLY ONE<br />CHOICE: (a) OR (b)<br /><br />IF YOU INITIAL (a),<br />YOU MAY INITIAL<br />SPECIFIC TREATMENTS<br />YOU WOULD LIKE<br />WITHHELD</div>
          <div className="fp-ct">
            <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 }}>LIFE-SUSTAINING TREATMENTS</p>
            <p>I direct that my health care providers provide, withhold, or withdraw treatment in accordance with the choice I have marked below: <strong>(Initial only one box)</strong></p>
            <div className={`choice-wrap${lifeChoice === "a" ? " sel-a" : ""}`}>
              <div className="choice-row">
                <input type="radio" name="life" value="a" checked={lifeChoice === "a"} onChange={() => setLifeChoice("a")} style={{ accentColor: BURG, width: 17, height: 17, marginTop: 3, flexShrink: 0, cursor: "pointer" }} />
                <label style={{ cursor: "pointer", fontSize: 13.5, lineHeight: 1.85 }}>
                  <strong>(a) Choice NOT To Prolong Life</strong><br />
                  I do not want my life to be prolonged if I should be in an incurable or irreversible mental or physical condition with no reasonable expectation of recovery, including but not limited to: a terminal condition; a permanently unconscious condition; or a minimally conscious condition in which I am permanently unable to make decisions or express my wishes.
                </label>
              </div>
              {lifeChoice === "a" && (
                <div className="sub-checks">
                  {([["cpr", "I do not want cardiac resuscitation."], ["vent", "I do not want mechanical respiration."], ["nutrition", "I do not want artificial nutrition and hydration."], ["antibiotics", "I do not want antibiotics."]] as [keyof NoTreatments, string][]).map(([k, t]) => (
                    <div key={k} className="sub-check-row">
                      <input type="checkbox" checked={noTx[k]} onChange={() => toggleNoTx(k)} style={{ accentColor: BURG, width: 15, height: 15, flexShrink: 0, cursor: "pointer" }} />
                      <label style={{ cursor: "pointer" }}>{t}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p style={{ textAlign: "center", fontWeight: 700, margin: "6px 0", fontSize: 13 }}>OR</p>
            <div className={`choice-wrap${lifeChoice === "b" ? " sel-b" : ""}`}>
              <div className="choice-row">
                <input type="radio" name="life" value="b" checked={lifeChoice === "b"} onChange={() => setLifeChoice("b")} style={{ accentColor: GREEN, width: 17, height: 17, marginTop: 3, flexShrink: 0, cursor: "pointer" }} />
                <label style={{ cursor: "pointer", fontSize: 13.5, lineHeight: 1.85 }}>
                  <strong>(b) Choice To Prolong Life</strong><br />
                  I want my life to be prolonged as long as possible within the limits of generally accepted health care standards.
                </label>
              </div>
            </div>
            <p className="fp-copy">© 2005 National Alliance for Care at Home. 2023 Revised.</p>
          </div>
        </div>

        {/* ════ PAGE 4 — Pain Relief ════ */}
        <hr className="page-break-line" />
        <div className="form-page">
          <div className="fp-header"><h2>NEW YORK HEALTH CARE PROXY AND LIVING WILL – PAGE 4 OF 6</h2></div>
          <div className="fp-sb" style={{ borderTop: "none" }}>ADD ADDITIONAL<br />INSTRUCTIONS ONLY<br />IF YOU WANT TO<br />LIMIT PAIN RELIEF</div>
          <div className="fp-ct" style={{ borderTop: "none" }}>
            <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>RELIEF FROM PAIN:</p>
            <p>Except as I state in the following space, I direct that treatment for alleviation of pain or discomfort should be provided at all times even if it hastens my death:</p>
            <div className="f-row"><TA v={painLimit} s={setPainLimit} ph="State any limitations on pain relief here, or leave blank…" rows={4} /></div>
          </div>
          <div className="fp-sb">ADD OTHER<br />INSTRUCTIONS,<br />IF ANY<br /><br />ATTACH ADDITIONAL<br />PAGES IF NEEDED</div>
          <div className="fp-ct">
            <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>OTHER WISHES:</p>
            <p>(If you do not agree with any of the optional choices above and wish to write your own, or if you wish to add to the instructions you have given above, you may do so here.) I direct that:</p>
            <div className="f-row"><TA v={otherDir} s={setOtherDir} ph="Enter any additional wishes or directives here…" rows={7} /></div>
            <p>These directions express my legal right to refuse treatment, under the law of New York. I intend my instructions to be carried out unless I have rescinded them in a new writing or by clearly indicating that I have changed my mind.</p>
            <p className="fp-copy">© 2005 National Alliance for Care at Home. 2023 Revised.</p>
          </div>
        </div>

        {/* ════ PAGE 5 — Organ Donation ════ */}
        <hr className="page-break-line" />
        <div className="form-page">
          <div className="fp-header"><h2>NEW YORK HEALTH CARE PROXY AND LIVING WILL – PAGE 5 OF 6</h2></div>
          <div className="fp-sb" style={{ borderTop: "none" }}>ORGAN DONATION<br />(OPTIONAL)<br /><br />INITIAL THE BOX<br />THAT AGREES WITH<br />YOUR WISHES<br /><br />INITIAL ONLY ONE</div>
          <div className="fp-ct" style={{ borderTop: "none" }}>
            <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>OPTIONAL ORGAN DONATION:</p>
            <p>Upon my death: <strong>(initial only one applicable box)</strong></p>
            {([["none", "(a)", "I do not give any of my organs, tissues, or parts and do not want my agent, guardian, or family to make a donation on my behalf;"], ["all", "(b)", "I give any needed organs, tissues, or parts;"], ["specific", "(c)", "I give the following organs, tissues, or parts only:"]] as [OrganChoice, string, string][]).map(([v, ltr, text]) => (
              <div key={v} className="organ-row">
                <input type="radio" name="organ" value={v} checked={organChoice === v} onChange={() => setOrganChoice(v)} style={{ accentColor: GREEN, width: 16, height: 16, marginTop: 3, flexShrink: 0, cursor: "pointer" }} />
                <label style={{ cursor: "pointer", lineHeight: 1.8 }}><strong>{ltr}</strong> {text}</label>
              </div>
            ))}
            {organChoice === "specific" && (
              <div className="f-row" style={{ paddingLeft: 28, marginTop: 4 }}>
                <TI v={organSpec} s={setOrganSpec} ph="e.g. kidneys, corneas, heart…" />
              </div>
            )}
          </div>
          <div className="fp-sb">STRIKE THROUGH ANY<br />USES YOU DO NOT<br />AGREE TO</div>
          <div className="fp-ct">
            <p>My gift, if I have made one, is for the following purposes:<br /><em>(strike any of the following you do not want)</em></p>
            <div className="purpose-row">
              {([["transplant", "(1) Transplant"], ["therapy", "(2) Therapy"], ["research", "(3) Research"], ["education", "(4) Education"]] as [keyof Purposes, string][]).map(([k, label]) => (
                <div key={k} className="purpose-item" onClick={() => togglePurpose(k)}>
                  <input type="checkbox" checked={purposes[k]} onChange={() => togglePurpose(k)} style={{ accentColor: GREEN, width: 15, height: 15, pointerEvents: "none" }} />
                  <span style={{ textDecoration: purposes[k] ? "none" : "line-through", color: purposes[k] ? "#111" : "#aaa", fontSize: 13.5 }}>{label}</span>
                </div>
              ))}
            </div>
            <p className="fp-copy">© 2005 National Alliance for Care at Home. 2023 Revised.</p>
          </div>
        </div>

        {/* ════ PAGE 6 — Execution ════ */}
        <hr className="page-break-line" />
        <div className="form-page">
          <div className="fp-header">
            <h2>NEW YORK HEALTH CARE PROXY AND LIVING WILL – PAGE 6 OF 6</h2>
            <h3>Part III. Execution</h3>
          </div>

          {/* ── Patient signature + contact ── */}
          <div className="fp-sb" style={{ borderTop: "none" }}>
            <span className="fp-sb-tag">PART III</span><br />
            SIGN AND DATE<br />THE DOCUMENT<br />AND PRINT YOUR<br />NAME, PHONE<br />AND ADDRESS
          </div>
          <div className="fp-ct" style={{ borderTop: "none" }}>
            <div className="sig-label" style={{ color: GREEN, fontSize: 12, marginBottom: 8 }}>YOUR SIGNATURE</div>

            {/* Signature canvas + date */}
            <div className="sig-field-row">
              <div>
                <div className="sig-label">Signed <span style={{ color: BURG }}>*</span></div>
                <div className="sig-wrap">
                  <SignatureField value={patSigBlob ?? patSigB64} onChange={blob => setPatSigBlob(blob)} />
                </div>
              </div>
              <div style={{ maxWidth: 180 }}>
                <div className="sig-label">Date <span style={{ color: BURG }}>*</span></div>
                <TI v={sigDate} s={setSigDate} type="date" />
              </div>
            </div>

            {/* ── First Name / Last Name — two columns ── */}
            <div className="two-col-row">
              <div>
                <div className="sig-label">First Name <span style={{ color: BURG }}>*</span></div>
                <TI v={sigFirstName} s={setSigFirstName} ph="First name" />
              </div>
              <div>
                <div className="sig-label">Last Name <span style={{ color: BURG }}>*</span></div>
                <TI v={sigLastName} s={setSigLastName} ph="Last name" />
              </div>
            </div>

            {/* Phone */}
            <div className="f-row">
              <div className="sig-label">Phone Number <span style={{ color: BURG }}>*</span></div>
              <TI v={sigPhone} s={setSigPhone} ph="(   )   -    " />
            </div>

            {/* Street address */}
            <div className="f-row">
              <div className="sig-label">Street Address <span style={{ color: BURG }}>*</span></div>
              <TI v={sigAddr} s={setSigAddr} ph="123 Main Street" />
            </div>

            {/* City / State / ZIP */}
            <div className="addr-row">
              <div style={{ flex: 2 }}>
                <div className="sig-label">City <span style={{ color: BURG }}>*</span></div>
                <TI v={sigCity} s={setSigCity} ph="New York" />
              </div>
              <div style={{ flex: 1 }}>
                <div className="sig-label">State <span style={{ color: BURG }}>*</span></div>
                <TI v={sigState} s={setSigState} ph="NY" />
              </div>
              <div style={{ flex: 1 }}>
                <div className="sig-label">ZIP Code <span style={{ color: BURG }}>*</span></div>
                <TI v={sigZip} s={setSigZip} ph="10001" />
              </div>
            </div>
          </div>

          {/* ── Witnessing statement ── */}
          <div className="fp-sb">WITNESSING<br />PROCEDURE</div>
          <div className="fp-ct">
            <p>I declare that the person who signed this document appeared to execute the living will willingly and free from duress. He or she signed (or asked another to sign for him or her) this document in my presence.</p>
          </div>

          {/* ── Witnesses ── */}
          <div className="fp-sb">YOUR WITNESSES<br />MUST SIGN AND<br />DATE AND PRINT<br />THEIR NAMES AND<br />ADDRESSES HERE</div>
          <div className="fp-ct">
            <WitnessBlock num={1} data={witness1} onChange={setWitness1} sigValue={wit1SigBlob ?? wit1SigB64} onSigChange={b => setWit1SigBlob(b)} conflictMsgs={conflictMap.wit1} />
            <WitnessBlock num={2} data={witness2} onChange={setWitness2} sigValue={wit2SigBlob ?? wit2SigB64} onSigChange={b => setWit2SigBlob(b)} conflictMsgs={conflictMap.wit2} />
            <p className="fp-copy" style={{ textAlign: "center" }}>
              Courtesy of CaringInfo · © 2005 National Alliance for Care at Home. 2023 Revised. · www.caringinfo.org
            </p>
          </div>
        </div>

        {/* ════ ACKNOWLEDGMENT + SUBMIT ════ */}
        <div style={{ padding: "24px 0 0" }}>
          {hasConflicts && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#fff7ed", border: "1.5px solid #f59e0b", borderRadius: 7, padding: "13px 16px", marginBottom: 16, fontFamily: "Georgia,serif", fontSize: 13, color: "#78350f" }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <div>
                <strong>Submission blocked: person conflicts must be resolved first.</strong>
                <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                  {allConflicts.map((m, i) => <li key={i} style={{ marginBottom: 3 }}>{m}</li>)}
                </ul>
              </div>
            </div>
          )}

          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 18, padding: "14px 18px", borderRadius: 8, border: `1.5px solid ${ackChecked ? GREEN : "#d1d5db"}`, background: ackChecked ? "rgba(27,107,58,0.06)" : "#fafafa", transition: "border-color .2s, background .2s", fontFamily: "Georgia,serif" }}>
            <input type="checkbox" checked={ackChecked} onChange={e => setAckChecked(e.target.checked)} style={{ accentColor: GREEN, width: 18, height: 18, marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, lineHeight: 1.75, color: ackChecked ? "#111" : "#555" }}>
              <strong style={{ color: GREEN }}>Acknowledgment</strong> — I confirm that all information entered in this form is accurate, complete, and has been filled out by me voluntarily. I understand this document will be submitted to Horizon Family Medical Group as part of my patient record.
            </span>
          </label>

          <button
            disabled={submitting || !ackChecked || hasConflicts}
            onClick={handleSubmit}
            style={{ width: "100%", padding: 14, background: (!ackChecked || submitting || hasConflicts) ? "#9ca3af" : GREEN, color: "#fff", border: "none", borderRadius: 7, fontSize: 15, fontWeight: 700, cursor: (!ackChecked || submitting || hasConflicts) ? "not-allowed" : "pointer", fontFamily: "Georgia,serif", letterSpacing: ".01em", opacity: (!ackChecked || submitting || hasConflicts) ? 0.7 : 1, transition: "background .2s, opacity .2s" }}
            onMouseEnter={e => { if (ackChecked && !submitting && !hasConflicts) (e.currentTarget as HTMLButtonElement).style.background = GREEN_DARK; }}
            onMouseLeave={e => { if (ackChecked && !submitting && !hasConflicts) (e.currentTarget as HTMLButtonElement).style.background = GREEN; }}
          >
            {submitting ? "Saving…" : hasConflicts ? "Resolve Person Conflicts to Submit" : isEdit ? "Update Record at Horizon Family Medical Group" : "Submit Completed Form to Horizon Family Medical Group"}
          </button>

          {!ackChecked && !hasConflicts && (
            <p style={{ fontSize: 12, color: BURG, textAlign: "center", marginTop: 8, fontFamily: "Georgia,serif" }}>
              ⚠️ Please check the acknowledgment box above to enable submission.
            </p>
          )}
          <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 12, lineHeight: 1.7, fontFamily: "Georgia,serif" }}>
            New York Health Care Proxy and Living Will · Courtesy of CaringInfo · © 2005 National Alliance for Care at Home. Revised 2023.<br />
            www.caringinfo.org · Horizon Family Medical Group · Confidential Patient Document
          </p>
        </div>

      </div>
    </>
  );
}