import { useState, useRef, useEffect, useCallback, type JSX } from "react";
import Navbar from "../Home/Navbar";

/* ─── Brand ──────────────────────────────────────────────────────────────────── */
const GREEN      = "#1B6B3A";
const GREEN_DARK = "#145230";
const BURG       = "#8B1A2E";
const BURG_LIGHT = "#f7eaed";

/* ─── Types ──────────────────────────────────────────────────────────────────── */
interface AgentFields {
  name:  string;
  addr:  string;
  city:  string;
  phone: string;
}

interface NoTreatments {
  cpr:        boolean;
  vent:       boolean;
  nutrition:  boolean;
  antibiotics:boolean;
}

interface Purposes {
  transplant: boolean;
  therapy:    boolean;
  research:   boolean;
  education:  boolean;
}

interface WitnessFields {
  name: string;
  date: string;
  addr: string;
}

type LifeChoice  = "" | "a" | "b";
type OrganChoice = "" | "none" | "all" | "specific";

/* ─── Global CSS ─────────────────────────────────────────────────────────────── */
const CSS = `
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
.form-page{display:flex;background:#fff;border:1px solid #ccc;border-bottom:none;min-height:900px;}
.form-page:last-of-type{border-bottom:1px solid #ccc;}
.fp-sidebar{width:175px;flex-shrink:0;background:#d9d9d9;padding:14px 10px;display:flex;flex-direction:column;gap:22px;border-right:1px solid #bbb;}
.fp-sidebar-block{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#333;line-height:1.5;}
.fp-sidebar-tag{display:inline-block;background:#1a1a1a;color:#fff;font-size:10px;font-weight:700;padding:2px 7px;letter-spacing:.05em;margin-bottom:6px;}
.fp-main{flex:1;padding:24px 28px;font-size:13.5px;line-height:1.85;}
.fp-main h2{font-size:13px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:.04em;margin:0 0 4px;}
.fp-main h3{font-size:13px;font-weight:700;text-align:center;margin:0 0 16px;}
.fp-main p{margin:0 0 10px;}
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
.sig-area{border:1px solid #bbb;background:#fafff8;position:relative;overflow:hidden;cursor:crosshair;margin-bottom:4px;}
.sig-area canvas{display:block;width:100%;height:90px;touch-action:none;}
.sig-hint{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:12px;color:#bbb;pointer-events:none;font-style:italic;}
.sig-clear{font-size:11px;color:${BURG};border:1px solid ${BURG};background:#fff;border-radius:3px;cursor:pointer;padding:2px 8px;float:right;}
.sig-field-row{display:flex;gap:16px;margin-bottom:10px;}
.sig-field-row>div{flex:1;}
.sig-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#555;margin-bottom:3px;}
.page-break-line{border:none;border-top:2px dashed #ccc;margin:0;}
.fp-copy{font-size:10px;color:#666;margin-top:18px;}
.f-row{margin-bottom:10px;}
.f-lbl{font-size:11.5px;color:#555;display:block;margin-bottom:2px;}
.agent-box{margin:14px 0;padding:12px 14px;border:1px solid #bbb;background:#fafafa;}
@media(max-width:600px){
  .form-page{flex-direction:column;}
  .fp-sidebar{width:100%;flex-direction:row;flex-wrap:wrap;min-height:auto;}
}
`;

/* ─── SignaturePad ───────────────────────────────────────────────────────────── */
interface SigPadProps {
  hint?:   string;
  onSign?: (signed: boolean) => void;
}

function SigPad({ hint = "Sign here", onSign }: SigPadProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing   = useRef<boolean>(false);
  const hasMark   = useRef<boolean>(false);
  const [signed, setSigned] = useState<boolean>(false);

  const init = useCallback((): void => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = c.parentElement?.clientWidth ?? 500;
    c.width  = w * dpr;
    c.height = 90 * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth   = 1.8;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
  }, []);

  useEffect((): (() => void) => {
    init();
    window.addEventListener("resize", init);
    return () => window.removeEventListener("resize", init);
  }, [init]);

  const getPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    const s = "touches" in e ? e.touches[0] : e;
    return { x: s.clientX - r.left, y: s.clientY - r.top };
  };

  const onDown = (e: React.MouseEvent | React.TouchEvent): void => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p   = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent): void => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const p   = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (!hasMark.current) {
      hasMark.current = true;
      setSigned(true);
      onSign?.(true);
    }
  };

  const onUp = (): void => { drawing.current = false; };

  const clear = (): void => {
    const c = canvasRef.current;
    if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    hasMark.current = false;
    setSigned(false);
    onSign?.(false);
  };

  return (
    <div>
      <div className="sig-area">
        <canvas
          ref={canvasRef}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        />
        {!signed && <span className="sig-hint">{hint}</span>}
      </div>
      <button className="sig-clear" onClick={clear}>Clear</button>
      <div style={{ clear: "both", height: 4 }} />
    </div>
  );
}

/* ─── Input Helpers ──────────────────────────────────────────────────────────── */
interface TIProps {
  v:   string;
  s:   (val: string) => void;
  ph?: string;
  type?: string;
}
const TI = ({ v, s, ph = "", type = "text" }: TIProps): JSX.Element => (
  <input className="ad-input" type={type} value={v} onChange={e => s(e.target.value)} placeholder={ph} />
);

interface TAProps {
  v:    string;
  s:    (val: string) => void;
  ph?:  string;
  rows?: number;
}
const TA = ({ v, s, ph = "", rows = 4 }: TAProps): JSX.Element => (
  <textarea className="ad-textarea" value={v} onChange={e => s(e.target.value)} placeholder={ph} rows={rows} />
);

interface ILProps {
  v:  string;
  s:  (val: string) => void;
  w?: number;
  ph?: string;
}
const IL = ({ v, s, w = 220, ph = "" }: ILProps): JSX.Element => (
  <input className="ad-inline" value={v} onChange={e => s(e.target.value)} placeholder={ph} style={{ minWidth: w }} />
);

/* ─── AgentBox ───────────────────────────────────────────────────────────────── */
interface AgentBoxProps {
  data:     AgentFields;
  onChange: (data: AgentFields) => void;
}
function AgentBox({ data, onChange }: AgentBoxProps): JSX.Element {
  const u = (k: keyof AgentFields) => (val: string) => onChange({ ...data, [k]: val });
  return (
    <div className="agent-box">
      <div className="f-row"><span className="f-lbl">Name</span><TI v={data.name} s={u("name")} ph="Full legal name" /></div>
      <div className="f-row"><span className="f-lbl">Home address</span><TI v={data.addr} s={u("addr")} ph="Street address" /></div>
      <div className="f-row"><span className="f-lbl">City, State, ZIP</span><TI v={data.city} s={u("city")} ph="City, NY 00000" /></div>
      <div className="f-row"><span className="f-lbl">Telephone number</span><TI v={data.phone} s={u("phone")} ph="(   )   -    " /></div>
    </div>
  );
}

/* ─── WitnessBlock ───────────────────────────────────────────────────────────── */
interface WitnessBlockProps {
  num:      number;
  data:     WitnessFields;
  onChange: (data: WitnessFields) => void;
}
function WitnessBlock({ num, data, onChange }: WitnessBlockProps): JSX.Element {
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
          <SigPad hint={`Witness ${num} signature`} />
        </div>
        <div style={{ maxWidth: 180 }}>
          <div className="sig-label">Date</div>
          <TI v={data.date} s={u("date")} type="date" />
        </div>
      </div>
      <div className="f-row">
        <div className="sig-label">Print Name <span style={{ color: BURG }}>*</span></div>
        <TI v={data.name} s={u("name")} ph={`Witness ${num} full name`} />
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
export default function NYAdvanceDirective(): JSX.Element {

  /* Part I */
  const [myName,      setMyName]      = useState<string>("");
  const [agent,       setAgent]       = useState<AgentFields>({ name:"", addr:"", city:"", phone:"" });
  const [altAgent,    setAltAgent]    = useState<AgentFields>({ name:"", addr:"", city:"", phone:"" });
  const [agentLimits, setAgentLimits] = useState<string>("");
  const [expiry,      setExpiry]      = useState<string>("");
  const [agentInstr,  setAgentInstr]  = useState<string>("");

  /* Part II */
  const [lwName,     setLwName]     = useState<string>("");
  const [lifeChoice, setLifeChoice] = useState<LifeChoice>("");
  const [noTx,       setNoTx]       = useState<NoTreatments>({ cpr:false, vent:false, nutrition:false, antibiotics:false });
  const [painLimit,  setPainLimit]  = useState<string>("");
  const [otherDir,   setOtherDir]   = useState<string>("");

  /* Organ */
  const [organChoice, setOrganChoice] = useState<OrganChoice>("");
  const [organSpec,   setOrganSpec]   = useState<string>("");
  const [purposes,    setPurposes]    = useState<Purposes>({ transplant:true, therapy:true, research:true, education:true });

  /* Part III */
  const [sigName,   setSigName]   = useState<string>("");
  const [sigDate,   setSigDate]   = useState<string>("");
  const [sigAddr,   setSigAddr]   = useState<string>("");
  const [patSigned, setPatSigned] = useState<boolean>(false);
  const [witness1,  setWitness1]  = useState<WitnessFields>({ name:"", date:"", addr:"" });
  const [witness2,  setWitness2]  = useState<WitnessFields>({ name:"", date:"", addr:"" });

  const toggleNoTx      = (k: keyof NoTreatments): void  => setNoTx(p => ({ ...p, [k]: !p[k] }));
  const togglePurpose   = (k: keyof Purposes): void      => setPurposes(p => ({ ...p, [k]: !p[k] }));

  const handleSubmit = (): void => {
    const missing: string[] = [];
    if (!myName)       missing.push("Your full legal name (Part I)");
    if (!agent.name)   missing.push("Health care agent name");
    if (!lwName)       missing.push("Your full legal name (Living Will)");
    if (!lifeChoice)   missing.push("Life-sustaining treatment choice");
    if (!sigName)      missing.push("Printed name (Part III)");
    if (!sigDate)      missing.push("Signature date");
    if (!patSigned)    missing.push("Your drawn signature");
    if (!witness1.name)missing.push("Witness 1 name");
    if (!witness2.name)missing.push("Witness 2 name");
    if (missing.length) { alert("Please complete:\n\n• " + missing.join("\n• ")); return; }
    alert("✓ Submitted to Horizon Family Medical Group. Saved to your patient record.");
  };

  /* Inject CSS once */
  useEffect((): void => {
    if (document.getElementById("ad-css")) return;
    const el = document.createElement("style");
    el.id = "ad-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <>
    <Navbar/>
    <div className="ad-root">

      {/* ── HFMG Header ── */}
      <div style={{ background: GREEN, padding: "14px 22px", display: "flex", alignItems: "center", gap: 14, borderRadius: "8px 8px 0 0" }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="8"  r="5"   fill={BURG} />
            <ellipse cx="15" cy="22" rx="9" ry="6" fill={BURG} />
            <circle cx="5.5"  cy="14" r="3.2" fill={BURG} opacity=".65" />
            <circle cx="24.5" cy="14" r="3.2" fill={BURG} opacity=".65" />
          </svg>
        </div>
        <div>
          <div style={{ color: "rgba(255,255,255,.8)", fontSize: 11.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase" }}>Horizon Family Medical Group</div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>New York Advance Directive</div>
          <div style={{ color: "rgba(255,255,255,.7)", fontSize: 12 }}>Health Care Proxy and Living Will</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          INTRO PAGE 1
      ══════════════════════════════════════════ */}
      <div className="intro-page">
        <p className="copy">Copyright © 2005 National Alliance for Care at Home. All rights reserved. Revised 2023. Reproduction and distribution by an organization or organized group without the written permission of the National Alliance for Care at Home is expressly forbidden.</p>
        <h1>NEW YORK</h1>
        <h1 style={{ fontSize: 18 }}>Advance Directive</h1>
        <p style={{ textAlign: "center", fontStyle: "italic", margin: "4px 0 2px", fontSize: 13 }}>Planning for Important Healthcare Decisions</p>
        <p className="courtesy">Courtesy of CaringInfo<br />www.caringinfo.org</p>
        <p>CaringInfo, a program of the National Alliance for Care at Home (the Alliance), is a national consumer engagement initiative to improve care and the experience of caregiving during serious illness and at the end of life. As part of that effort, CaringInfo provides detailed guidance for completing advance directive forms in all 50 states, the District of Columbia, and Puerto Rico.</p>
        <div className="pkg-box">
          <strong>This package includes:</strong>
          <ul>
            <li>Instructions for preparing your advance directive. Please read all the instructions.</li>
            <li>Your state-specific advance directive forms, which are the pages with the gray instruction bar on the left side.</li>
          </ul>
        </div>
        <div className="before-box">
          <h2 style={{ marginTop: 0 }}>BEFORE YOU BEGIN</h2>
          <p>Check to be sure that you have the materials for each state in which you may receive healthcare. Because documents are state-specific, having a state-specific document for each state where you may spend significant time can be beneficial. A new advance directive is not necessary for ordinary travel into other states. The advance directives in this package will be legally binding only if the person completing them is a competent adult who is 18 years of age or older, or an emancipated minor, or, in the state of New York, has been married, or is a parent.</p>
        </div>
        <h2>ACTION STEPS</h2>
        <ol style={{ margin: "4px 0 10px 20px", padding: 0 }}>
          <li style={{ marginBottom: 8 }}>You may want to photocopy or print a second set of these forms before you start so you will have a clean copy if you need to start over.</li>
          <li style={{ marginBottom: 8 }}>When you begin to fill out the forms, refer to the gray instruction bars — they will guide you through the process.</li>
          <li style={{ marginBottom: 8 }}>Talk with your family, friends, and physicians about your advance directive. Be sure the person you appoint to make decisions on your behalf understands your wishes.</li>
          <li style={{ marginBottom: 8 }}>Once the form is completed and signed, photocopy, scan, or take a photo of the form and give it to the person you have appointed to make decisions on your behalf, your family, friends, healthcare providers, and/or faith leaders so that the form is available in the event of an emergency.</li>
        </ol>
      </div>

      {/* ══════════════════════════════════════════
          INTRO PAGE 2
      ══════════════════════════════════════════ */}
      <div className="intro-page">
        <ol start={5} style={{ margin: "0 0 18px 20px", padding: 0 }}>
          <li style={{ marginBottom: 8 }}>You may also want to save a copy of your form in your electronic healthcare record, or an online personal health records application, program, or service that allows you to share your medical documents with your physicians, family, and others who you want to take an active role in your advance care planning.</li>
        </ol>
        <h2>INTRODUCTION TO YOUR NEW YORK ADVANCE HEALTH CARE DIRECTIVE</h2>
        <p>This packet contains a legal document, a New York Health Care Proxy and Living Will, that protects your right to refuse medical treatment you do not want, or to request treatment you do want, in the event you lose the ability to make decisions yourself.</p>
        <p>Your New York Advance Directive has three parts. Depending on your advance planning needs, you may complete Part I, Part II, or both, depending on your advance-planning needs. You must complete Part III.</p>
        <p><strong>Part I, Health Care Proxy,</strong> lets you name someone, your agent, to make decisions about your health care—including decisions about life-sustaining treatment—if you can no longer speak for yourself. The health care proxy is especially useful because it appoints someone to speak for you any time you are unable to make your own healthcare decisions, not only at the end of life.</p>
        <p><strong>Part II, Living Will,</strong> lets you state your wishes about healthcare in the event that you can no longer speak for yourself. Part II also allows you to record your organ donation, pain relief, funeral, and other advance planning wishes. If you also complete Part I, your living will is an important source of guidance for your agent.</p>
        <p><strong>Part III</strong> contains the signature and witnessing provisions so that your document will be effective.</p>
        <h3 style={{ textAlign: "left", fontSize: 13.5 }}>How do I make my New York Advance Health Care Directive legal?</h3>
        <p>If you complete Part I, the Health Care Proxy, you (or another person at your direction, if you are unable) must sign and date this document in the presence of two adult witnesses. The person you name as your agent or alternate agent cannot act as a witness.</p>
        <p>If you only complete Part II, the Living Will, there are no special witnessing requirements. However, because your living will may be used as evidence of your wishes, it is best that you sign and date this document in the presence of witnesses just as if you had completed Part I.</p>
        <h3 style={{ textAlign: "left", fontSize: 13.5 }}>Whom should I appoint as my agent?</h3>
        <p>Your agent is the person you appoint to make decisions about your healthcare if you become unable to make those decisions yourself. Your agent may be a family member or a close friend whom you trust to make serious decisions. The person you name as your agent should clearly understand your wishes and be willing to accept the responsibility of making healthcare decisions for you.</p>
      </div>

      {/* ══════════════════════════════════════════
          INTRO PAGE 3
      ══════════════════════════════════════════ */}
      <div className="intro-page">
        <p>You can appoint a second person as your alternate agent. An alternate agent will step in if the person you name as agent is unable, unwilling, or unavailable to act for you.</p>
        <p>You may not appoint the operator, administrator, or employee of a hospital where you are a patient or a resident or where you have applied for admission, unless the person is related to you by blood, marriage, or adoption. Your agent cannot also act as your attending physician or nurse practitioner. You cannot appoint as your agent someone who is already an agent for ten or more people, unless the agent is your spouse, child, parent, sibling, or grandparent.</p>
        <p>Unless you specify otherwise in the space for additional instructions on page 2 of the form, if you appoint your spouse as your agent, the health care proxy will be revoked automatically if you divorce or are legally separated.</p>
        <h3 style={{ textAlign: "left", fontSize: 13.5 }}>Should I add personal instructions to my advance directive?</h3>
        <p>Yes! One of the most important reasons to execute an advance directive is to have your voice heard. When you name an agent and clearly communicate to them what you want and don't want, they are in the strongest position to advocate for you. Because the future is unpredictable, be careful that you do not unintentionally restrict your agent's power to act in your best interest. Be especially careful with the words "always" and "never." In any event, be sure to talk with your agent and others about your future healthcare and describe what you consider to be an acceptable "quality of life."</p>
        <h3 style={{ textAlign: "left", fontSize: 13.5 }}>When does my agent's authority become effective?</h3>
        <p><strong>Part I, Health Care Proxy,</strong> goes into effect when your doctor or nurse practitioner determines that you are no longer able to make or communicate your healthcare decisions.</p>
        <p><strong>Part II, Living Will,</strong> goes into effect when your doctor or nurse practitioner determines that you are no longer able to make or communicate your healthcare decisions.</p>
        <h3 style={{ textAlign: "left", fontSize: 13.5 }}>Agent Limitations</h3>
        <p>Your agent will be bound by the current laws of New York as they regard pregnancy and termination of pregnancies.</p>
        <h3 style={{ textAlign: "left", fontSize: 13.5 }}>What if I change my mind?</h3>
        <p>You may revoke your advance directive by notifying your agent or healthcare provider orally or in writing, or by any other act that clearly shows your intent to revoke the document. Such acts might include tearing up your advance directive, signing a written revocation, or executing a new advance directive with different terms.</p>
        <h3 style={{ textAlign: "left", fontSize: 13.5 }}>Mental Health Issues</h3>
        <p>These forms do not expressly address mental illness, although you can state your wishes and grant authority to your agent regarding mental health issues. The National Resource Center on</p>
      </div>

      {/* ══════════════════════════════════════════
          INTRO PAGE 4
      ══════════════════════════════════════════ */}
      <div className="intro-page" style={{ borderBottom: "1px solid #ccc" }}>
        <p>Psychiatric Advance Directives maintains a website (https://nrc-pad.org/) with links to each state's psychiatric advance directive forms. If you would like to make more detailed advance care plans regarding mental illness, you could talk to your physician and an attorney about a durable power of attorney tailored to your needs. If you are a resident in a facility operated or licensed by the New York Office of Mental Health or the New York Office of Mental Retardation and Developmental Disabilities, there are special witnessing requirements that you should talk about with your physician and an attorney.</p>
        <h3 style={{ textAlign: "left", fontSize: 13.5 }}>What other important facts should I know?</h3>
        <p>Be aware that your advance directive will not be effective in the event of a medical emergency, except to identify your agent. Ambulance and hospital emergency department personnel are required to provide cardiopulmonary resuscitation (CPR) unless you have a separate physician's order, which are typically called "prehospital medical care directives" or "do not resuscitate orders." DNR forms may be obtained from your state health department or department of aging (https://www.hhs.gov/aging/state-resources/index.html). Another form of orders regarding CPR and other treatments are state-specific POLST (portable orders for life sustaining treatment) (https://polst.org/form-patients/). Both a POLST and a DNR form MUST be signed by a healthcare provider and MUST be presented to the emergency responders when they arrive. These directives instruct ambulance and hospital emergency personnel not to attempt CPR (or to stop it if it has begun) if your heart or breathing should stop.</p>
      </div>

      {/* ══════════════════════════════════════════
          FORM PAGE 1 OF 6
      ══════════════════════════════════════════ */}
      <hr className="page-break-line" />
      <div className="form-page">
        <div className="fp-sidebar">
          <div className="fp-sidebar-block"><span className="fp-sidebar-tag">PART I</span></div>
          <div className="fp-sidebar-block">PRINT YOUR NAME</div>
          <div className="fp-sidebar-block">PRINT NAME,<br />HOME ADDRESS<br />AND TELEPHONE<br />NUMBER OF<br />YOUR AGENT</div>
          <div className="fp-sidebar-block">PRINT NAME, HOME<br />ADDRESS<br />AND TELEPHONE<br />NUMBER OF YOUR<br />ALTERNATE AGENT</div>
          <div className="fp-sidebar-block">ADD INSTRUCTIONS<br />HERE ONLY IF YOU WANT<br />TO LIMIT YOUR AGENT'S<br />AUTHORITY</div>
          <div className="fp-sidebar-block">SPECIFY THE DATE OR<br />CONDITIONS FOR<br />EXPIRATION, IF ANY</div>
        </div>
        <div className="fp-main">
          <h2>NEW YORK HEALTH CARE PROXY AND<br />LIVING WILL – PAGE 1 OF 6</h2>
          <h3>Part I. Health Care Proxy</h3>
          <p>I,&nbsp;<IL v={myName} s={setMyName} w={240} ph="your full legal name" />,&nbsp;hereby appoint:</p>
          <AgentBox data={agent} onChange={setAgent} />
          <p>as my health care agent.</p>
          <p>In the event that the person I name above is unable, unwilling, or reasonably unavailable to act as my agent, I hereby appoint</p>
          <AgentBox data={altAgent} onChange={setAltAgent} />
          <p>as my health care agent.</p>
          <p>This health care proxy shall take effect in the event I become unable to make my own health care decisions.</p>
          <p>My agent has the authority to make any and all health care decisions for me, except to the extent that I state otherwise here:</p>
          <div className="f-row"><TA v={agentLimits} s={setAgentLimits} ph="State any limitations here, or leave blank to grant full authority…" rows={3} /></div>
          <p>Unless I revoke it, this proxy shall remain in effect indefinitely, or until the date or condition I have stated below. This proxy shall expire (specific date or conditions, if desired):</p>
          <div className="f-row"><TI v={expiry} s={setExpiry} ph="e.g. December 31, 2030  —  or leave blank for indefinite" /></div>
          <p className="fp-copy">© 2005 National Alliance<br />for Care at Home. 2023<br />Revised.</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FORM PAGE 2 OF 6
      ══════════════════════════════════════════ */}
      <hr className="page-break-line" />
      <div className="form-page">
        <div className="fp-sidebar">
          <div className="fp-sidebar-block">ADD OTHER<br />INSTRUCTIONS, IF ANY,<br />REGARDING YOUR<br />ADVANCE CARE PLANS</div>
          <div className="fp-sidebar-block">THESE INSTRUCTIONS<br />CAN FURTHER ADDRESS<br />YOUR HEALTH CARE<br />PLANS, SUCH AS YOUR<br />WISHES REGARDING<br />HOSPICE TREATMENT,<br />BUT CAN ALSO ADDRESS<br />OTHER ADVANCE<br />PLANNING ISSUES, SUCH<br />AS YOUR BURIAL WISHES</div>
          <div className="fp-sidebar-block">ATTACH ADDITIONAL<br />PAGES IF NEEDED</div>
        </div>
        <div className="fp-main">
          <h2>NEW YORK HEALTH CARE PROXY AND<br />LIVING WILL – PAGE 2 OF 6</h2>
          <p>When making health-care decisions for me, my agent should think about what action would be consistent with past conversations we have had, my treatment preferences as expressed in this or any other document, my religious and other beliefs and values, and how I have handled medical and other important issues in the past. If what I would decide is still unclear, then my agent should make decisions for me that my agent believes are in my best interest, considering the benefits, burdens, and risks of my current circumstances and treatment options.</p>
          <p>My agent should also consider the following instructions when making health care decisions for me:</p>
          <div className="f-row"><TA v={agentInstr} s={setAgentInstr} ph="Enter additional instructions here… (attach additional pages if needed)" rows={12} /></div>
          <p className="fp-copy">© 2005 National Alliance<br />for Care at Home. 2023<br />Revised.</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FORM PAGE 3 OF 6
      ══════════════════════════════════════════ */}
      <hr className="page-break-line" />
      <div className="form-page">
        <div className="fp-sidebar">
          <div className="fp-sidebar-block"><span className="fp-sidebar-tag">PART II</span></div>
          <div className="fp-sidebar-block">PRINT YOUR NAME</div>
          <div className="fp-sidebar-block">INITIAL ONLY ONE<br />CHOICE: (a) OR (b)</div>
          <div className="fp-sidebar-block">IF YOU DO NOT AGREE<br />WITH EITHER CHOICE,<br />YOU MAY WRITE YOUR<br />OWN DIRECTIONS ON<br />THE NEXT PAGE</div>
          <div className="fp-sidebar-block">IF YOU INITIAL BOX (a),<br />YOU MAY INITIAL<br />SPECIFIC TREATMENTS<br />YOU WOULD LIKE<br />WITHHELD</div>
        </div>
        <div className="fp-main">
          <h2>Part II. NEW YORK HEALTH CARE PROXY AND<br />LIVING WILL – PAGE 3 OF 6</h2>
          <p>This Living Will has been prepared to conform to the law in the State of New York, and is intended to be "clear and convincing" evidence of my wishes regarding the health care decisions I have indicated below.</p>
          <p>I,&nbsp;<IL v={lwName} s={setLwName} w={240} ph="your full legal name" />,&nbsp;being of sound mind, make this statement as a directive to be followed if I become unable to participate in decisions regarding my medical care. These instructions reflect my firm and settled commitment to regarding health care under the circumstances indicated below:</p>
          <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em", marginTop: 16 }}>LIFE-SUSTAINING TREATMENTS</p>
          <p>I direct that my health care providers and others involved in my care provide, withhold, or withdraw treatment in accordance with the choice I have marked below: <strong>(Initial only one box)</strong></p>

          {/* Choice A */}
          <div className={`choice-wrap${lifeChoice === "a" ? " sel-a" : ""}`}>
            <div className="choice-row">
              <input type="radio" name="life" value="a" checked={lifeChoice === "a"} onChange={() => setLifeChoice("a")}
                style={{ accentColor: BURG, width: 17, height: 17, marginTop: 3, flexShrink: 0, cursor: "pointer" }} />
              <label style={{ cursor: "pointer", fontSize: 13.5, lineHeight: 1.85 }}>
                <strong>(a) Choice NOT To Prolong Life</strong><br />
                I do not want my life to be prolonged if I should be in an incurable or irreversible mental or physical condition with no reasonable expectation of recovery, including but not limited to: (a) a terminal condition; (b) a permanently unconscious condition; or (c) a minimally conscious condition in which I am permanently unable to make decisions or express my wishes. While I understand that I am not legally required to be specific about future treatments if I am in the condition(s) described above I feel especially strongly about the following forms of treatment:
              </label>
            </div>
            {lifeChoice === "a" && (
              <div className="sub-checks">
                {([
                  ["cpr",        "I do not want cardiac resuscitation."],
                  ["vent",       "I do not want mechanical respiration."],
                  ["nutrition",  "I do not want artificial nutrition and hydration."],
                  ["antibiotics","I do not want antibiotics."],
                ] as [keyof NoTreatments, string][]).map(([k, t]) => (
                  <div key={k} className="sub-check-row">
                    <input type="checkbox" checked={noTx[k]} onChange={() => toggleNoTx(k)}
                      style={{ accentColor: BURG, width: 15, height: 15, flexShrink: 0, cursor: "pointer" }} />
                    <label style={{ cursor: "pointer" }}>{t}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p style={{ textAlign: "center", fontWeight: 700, margin: "6px 0", fontSize: 13 }}>OR</p>

          {/* Choice B */}
          <div className={`choice-wrap${lifeChoice === "b" ? " sel-b" : ""}`}>
            <div className="choice-row">
              <input type="radio" name="life" value="b" checked={lifeChoice === "b"} onChange={() => setLifeChoice("b")}
                style={{ accentColor: GREEN, width: 17, height: 17, marginTop: 3, flexShrink: 0, cursor: "pointer" }} />
              <label style={{ cursor: "pointer", fontSize: 13.5, lineHeight: 1.85 }}>
                <strong>(b) Choice To Prolong Life</strong><br />
                I want my life to be prolonged as long as possible within the limits of generally accepted health care standards.
              </label>
            </div>
          </div>
          <p className="fp-copy">© 2005 National Alliance<br />for Care at Home. 2023<br />Revised.</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FORM PAGE 4 OF 6
      ══════════════════════════════════════════ */}
      <hr className="page-break-line" />
      <div className="form-page">
        <div className="fp-sidebar">
          <div className="fp-sidebar-block">ADD ADDITIONAL<br />INSTRUCTIONS HERE<br />ONLY IF YOU WANT TO<br />LIMIT PAIN RELIEF</div>
          <div className="fp-sidebar-block">ADD OTHER<br />INSTRUCTIONS, IF ANY,<br />REGARDING YOUR<br />ADVANCE CARE PLANS</div>
          <div className="fp-sidebar-block">THESE INSTRUCTIONS<br />CAN FURTHER ADDRESS<br />YOUR HEALTH CARE<br />PLANS, SUCH AS YOUR<br />WISHES REGARDING<br />HOSPICE TREATMENT,<br />BUT CAN ALSO ADDRESS<br />OTHER ADVANCE<br />PLANNING ISSUES, SUCH<br />AS YOUR BURIAL WISHES</div>
          <div className="fp-sidebar-block">ATTACH ADDITIONAL<br />PAGES IF NEEDED</div>
        </div>
        <div className="fp-main">
          <h2>NEW YORK HEALTH CARE PROXY AND<br />LIVING WILL – PAGE 4 OF 6</h2>
          <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>RELIEF FROM PAIN:</p>
          <p>Except as I state in the following space, I direct that treatment for alleviation of pain or discomfort should be provided at all times even if it hastens my death:</p>
          <div className="f-row"><TA v={painLimit} s={setPainLimit} ph="State any limitations on pain relief here, or leave blank…" rows={4} /></div>
          <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em", marginTop: 16 }}>OTHER WISHES:</p>
          <p>(If you do not agree with any of the optional choices above and wish to write your own, or if you wish to add to the instructions you have given above, you may do so here.) I direct that:</p>
          <div className="f-row"><TA v={otherDir} s={setOtherDir} ph="Enter any additional wishes or directives here… (attach additional pages if needed)" rows={7} /></div>
          <p>These directions express my legal right to refuse treatment, under the law of New York. I intend my instructions to be carried out unless I have rescinded them in a new writing or by clearly indicating that I have changed my mind.</p>
          <p>My agent, if I have appointed one in Part I or elsewhere, has full authority to resolve any question regarding my health care decisions, as recorded in this document or otherwise, and what my choices may be.</p>
          <p className="fp-copy">© 2005 National Alliance<br />for Care at Home. 2023<br />Revised.</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FORM PAGE 5 OF 6
      ══════════════════════════════════════════ */}
      <hr className="page-break-line" />
      <div className="form-page">
        <div className="fp-sidebar">
          <div className="fp-sidebar-block">ORGAN<br />DONATION<br />(OPTIONAL)</div>
          <div className="fp-sidebar-block">INITIAL THE BOX THAT<br />AGREES WITH YOUR<br />WISHES ABOUT ORGAN<br />DONATION</div>
          <div className="fp-sidebar-block">INITIAL ONLY ONE</div>
          <div className="fp-sidebar-block">STRIKE THROUGH ANY<br />USES YOU DO NOT AGREE<br />TO</div>
        </div>
        <div className="fp-main">
          <h2>NEW YORK HEALTH CARE PROXY AND<br />LIVING WILL – PAGE 5 OF 6</h2>
          <p style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>OPTIONAL ORGAN DONATION:</p>
          <p>Upon my death: <strong>(initial only one applicable box)</strong></p>

          {([
            ["none",     "(a)", "I do not give any of my organs, tissues, or parts and do not want my agent, guardian, or family to make a donation on my behalf;"],
            ["all",      "(b)", "I give any needed organs, tissues, or parts;"],
            ["specific", "(c)", "I give the following organs, tissues, or parts only:"],
          ] as [OrganChoice, string, string][]).map(([v, ltr, text]) => (
            <div key={v} className="organ-row">
              <input type="radio" name="organ" value={v} checked={organChoice === v} onChange={() => setOrganChoice(v)}
                style={{ accentColor: GREEN, width: 16, height: 16, marginTop: 3, flexShrink: 0, cursor: "pointer" }} />
              <label style={{ cursor: "pointer", lineHeight: 1.8 }}><strong>{ltr}</strong> {text}</label>
            </div>
          ))}

          {organChoice === "specific" && (
            <div className="f-row" style={{ paddingLeft: 28, marginTop: 4 }}>
              <TI v={organSpec} s={setOrganSpec} ph="e.g. kidneys, corneas, heart…" />
            </div>
          )}

          <p style={{ marginTop: 16 }}>My gift, if I have made one, is for the following purposes:<br /><em>(strike any of the following you do not want)</em></p>
          <div className="purpose-row">
            {([
              ["transplant", "(1) Transplant"],
              ["therapy",    "(2) Therapy"],
              ["research",   "(3) Research"],
              ["education",  "(4) Education"],
            ] as [keyof Purposes, string][]).map(([k, label]) => (
              <div key={k} className="purpose-item" onClick={() => togglePurpose(k)}>
                <input type="checkbox" checked={purposes[k]} onChange={() => togglePurpose(k)}
                  style={{ accentColor: GREEN, width: 15, height: 15, pointerEvents: "none" }} />
                <span style={{ textDecoration: purposes[k] ? "none" : "line-through", color: purposes[k] ? "#111" : "#aaa", fontSize: 13.5 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <p className="fp-copy">© 2005 National Alliance<br />for Care at Home. 2023<br />Revised.</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FORM PAGE 6 OF 6
      ══════════════════════════════════════════ */}
      <hr className="page-break-line" />
      <div className="form-page">
        <div className="fp-sidebar">
          <div className="fp-sidebar-block"><span className="fp-sidebar-tag">PART III</span></div>
          <div className="fp-sidebar-block">SIGN AND DATE<br />THE DOCUMENT<br />AND PRINT YOUR NAME<br />AND<br />ADDRESS</div>
          <div className="fp-sidebar-block">WITNESSING<br />PROCEDURE</div>
          <div className="fp-sidebar-block">YOUR<br />WITNESSES<br />MUST SIGN AND DATE<br />AND<br />PRINT THEIR NAMES AND<br />ADDRESSES HERE</div>
        </div>
        <div className="fp-main">
          <h2>NEW YORK HEALTH CARE PROXY AND<br />LIVING WILL – PAGE 6 OF 6</h2>
          <h3>Part III. Execution</h3>

          {/* Patient signature */}
          <div style={{ marginBottom: 20 }}>
            <div className="sig-label" style={{ color: GREEN, fontSize: 12, marginBottom: 8 }}>YOUR SIGNATURE</div>
            <div className="sig-field-row">
              <div>
                <div className="sig-label">Signed <span style={{ color: BURG }}>*</span></div>
                <SigPad hint="Draw your signature" onSign={setPatSigned} />
              </div>
              <div style={{ maxWidth: 180 }}>
                <div className="sig-label">Date <span style={{ color: BURG }}>*</span></div>
                <TI v={sigDate} s={setSigDate} type="date" />
              </div>
            </div>
            <div className="f-row">
              <div className="sig-label">Print Name <span style={{ color: BURG }}>*</span></div>
              <TI v={sigName} s={setSigName} ph="Your full legal name" />
            </div>
            <div className="f-row">
              <div className="sig-label">Address</div>
              <TI v={sigAddr} s={setSigAddr} ph="Street address, City, State, ZIP" />
            </div>
          </div>

          <p>I declare that the person who signed this document appeared to execute the living will willingly and free from duress. He or she signed (or asked another to sign for him or her) this document in my presence.</p>

          <WitnessBlock num={1} data={witness1} onChange={setWitness1} />
          <WitnessBlock num={2} data={witness2} onChange={setWitness2} />

          <p className="fp-copy" style={{ textAlign: "center" }}>
            Courtesy of CaringInfo &nbsp;·&nbsp; © 2005 National Alliance for Care at Home. 2023 Revised. &nbsp;·&nbsp; www.caringinfo.org
          </p>
        </div>
      </div>

      {/* ── Submit ── */}
      <div style={{ padding: "20px 0 0" }}>
        <button
          style={{ width: "100%", padding: 14, background: GREEN, color: "#fff", border: "none", borderRadius: 7, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia,serif", letterSpacing: ".01em" }}
          onClick={handleSubmit}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = GREEN_DARK)}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = GREEN)}
        >
          Submit Completed Form to Horizon Family Medical Group
        </button>
        <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 10, lineHeight: 1.7, fontFamily: "Georgia,serif" }}>
          New York Health Care Proxy and Living Will · Courtesy of CaringInfo, a program of the National Alliance for Care at Home<br />
          © 2005 National Alliance for Care at Home. Revised 2023. · www.caringinfo.org · Horizon Family Medical Group · Confidential Patient Document
        </p>
      </div>

    </div>
    </>
  );
}
