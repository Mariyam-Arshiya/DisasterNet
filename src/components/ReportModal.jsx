import React, { useState, useRef, useCallback } from "react";
import { X, Mic, Send, Loader2 } from "lucide-react";
import { C } from "../theme";
import { autoTag, scoreSeverity } from "../data/aiTagging";

const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function ReportModal({ onClose, onSubmit, isOnline }) {
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [listening, setListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const recognitionRef = useRef(null);

  const tags = autoTag(text);
  const { level } = scoreSeverity(text, 0);

  const startVoice = useCallback(() => {
    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser — try Chrome, or type your report below.");
      return;
    }
    const rec = new SpeechRecognition();
    recognitionRef.current = rec;
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => setText((prev) => (prev ? prev + " " : "") + e.results[0][0].transcript);
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
  }, []);

  const submit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit({ text: text.trim(), location: location.trim() || "Current location", severity: level, tags });
    setSubmitting(false);
    onClose();
  };

  return (
    <div style={styles.backdrop} className="dn-backdrop-in" onClick={onClose}>
      <div style={styles.sheet} className="dn-sheet-up" onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <span style={{ fontWeight: 700, color: C.ink, fontSize: 16 }}>Report an incident</span>
          <button onClick={onClose} style={styles.iconBtn}><X size={18} color={C.fog} /></button>
        </div>

        {!isOnline && (
          <div style={styles.offlineNote}>Offline — this report will queue on your device and sync automatically.</div>
        )}

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening? e.g. Water rising fast, two families need evacuation"
          style={styles.textarea}
        />

        <button onClick={startVoice} className="dn-press" style={{ ...styles.voiceBtn, borderColor: listening ? C.red : C.line }}>
          {listening ? <Loader2 size={16} className="spin" color={C.red} /> : <Mic size={16} color={C.red} />}
          {listening ? "Listening…" : "Speak your report"}
        </button>

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location / landmark"
          style={styles.input}
        />

        {text.trim() && (
          <div style={styles.aiRow}>
            <span style={styles.aiLabel}>AI tagging:</span>
            {tags.map((t) => <span key={t} style={styles.tag}>{t}</span>)}
            <span style={{ ...styles.severityTag, color: severityColor(level) }}>{level}</span>
          </div>
        )}

        <button onClick={submit} disabled={!text.trim() || submitting} className="dn-press" style={{ ...styles.submitBtn, opacity: !text.trim() || submitting ? 0.5 : 1 }}>
          {submitting ? "Submitting…" : "Send report"} <Send size={15} />
        </button>
      </div>
    </div>
  );
}

function severityColor(level) {
  return { critical: C.red, high: C.amber, medium: "#D6A93B", unverified: C.fog }[level] || C.fog;
}

const styles = {
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  sheet: { width: "100%", maxWidth: 480, background: C.surface, borderRadius: "18px 18px 0 0", padding: 20, boxSizing: "border-box", maxHeight: "88vh", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  iconBtn: { background: "none", border: "none", cursor: "pointer" },
  offlineNote: { background: "rgba(242,169,59,0.12)", border: `1px solid ${C.amber}55`, color: C.amber, fontSize: 12.5, padding: "8px 10px", borderRadius: 8, marginBottom: 12 },
  textarea: { width: "100%", minHeight: 90, background: C.void, border: `1px solid ${C.line}`, borderRadius: 10, color: C.ink, padding: 12, fontSize: 14, boxSizing: "border-box", resize: "vertical", marginBottom: 10 },
  voiceBtn: { display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid", borderRadius: 10, padding: "10px 14px", color: C.ink, fontSize: 13, marginBottom: 10, cursor: "pointer", width: "100%" },
  input: { width: "100%", background: C.void, border: `1px solid ${C.line}`, borderRadius: 10, color: C.ink, padding: "11px 12px", fontSize: 14, boxSizing: "border-box", marginBottom: 12 },
  aiRow: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 14 },
  aiLabel: { fontSize: 11, color: C.fog, marginRight: 2 },
  tag: { fontSize: 11, background: C.surface2, color: C.ink, borderRadius: 20, padding: "3px 9px", border: `1px solid ${C.line}` },
  severityTag: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginLeft: "auto" },
  submitBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: C.red, color: "#fff", border: "none", borderRadius: 10, padding: "14px 16px", fontWeight: 700, fontSize: 14, cursor: "pointer" },
};
