import React, { useState, useCallback, useRef } from "react";
import { Siren, Mic, Check } from "lucide-react";
import { C } from "../theme";

const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

export default function SOSButton({ onTrigger }) {
  const [state, setState] = useState("idle"); // idle | listening | sent
  const recRef = useRef(null);

  const fire = useCallback((transcript) => {
    setState("sent");
    onTrigger({ text: transcript || "SOS triggered — no details captured", severity: "critical" });
    setTimeout(() => setState("idle"), 4000);
  }, [onTrigger]);

  const pressHold = () => {
    fire(null);
  };

  const voiceSOS = () => {
    if (!SpeechRecognition) { fire(null); return; }
    const rec = new SpeechRecognition();
    recRef.current = rec;
    rec.lang = "en-IN";
    rec.onstart = () => setState("listening");
    rec.onresult = (e) => fire(e.results[0][0].transcript);
    rec.onerror = () => setState("idle");
    rec.onend = () => { if (state === "listening") setState("idle"); };
    rec.start();
  };

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        {state === "idle" && (
          <>
            <span className="dn-sos-ring" />
            <span className="dn-sos-ring delay" />
          </>
        )}
        <button onClick={pressHold} className="dn-press" style={{ ...styles.sos, background: state === "sent" ? C.green : C.red, position: "relative" }}>
          {state === "sent" ? <Check size={22} /> : <Siren size={22} />}
          {state === "sent" ? "SOS SENT" : "SEND SOS"}
        </button>
      </div>
      <button onClick={voiceSOS} className="dn-press" style={styles.voiceIcon} title="Voice SOS">
        <Mic size={18} color={state === "listening" ? C.red : C.ink} className={state === "listening" ? "spin" : ""} />
      </button>
    </div>
  );
}

const styles = {
  sos: { display: "flex", alignItems: "center", gap: 8, color: "#fff", border: "none", borderRadius: 14, padding: "16px 22px", fontWeight: 800, fontSize: 15, letterSpacing: 0.5, cursor: "pointer", boxShadow: "0 8px 24px rgba(229,52,42,0.35)" },
  voiceIcon: { background: C.surface2, border: `1px solid ${C.line}`, borderRadius: 14, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
};
