"use client";
import { useEffect, useId, useRef } from "react";

export function StatBar({ value, color }) {
  return <div className="statbar"><div className="statbar-fill" style={{ width: `${value}%`, background: color }} /></div>;
}

export function Modal({ children, onClose, label = "Iggy Meadow dialog" }) {
  const sheet = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  const titleId = useId();
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheet.current?.focus();
    function handleKey(event) {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close.current?.(); }
      if (event.key !== "Tab") return;
      const controls = [...sheet.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')].filter((node) => node.getClientRects().length);
      const first = controls[0]; const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); sheet.current.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === sheet.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === sheet.current)) { event.preventDefault(); first.focus(); }
    }
    const node = sheet.current;
    node.addEventListener("keydown", handleKey);
    return () => { node.removeEventListener("keydown", handleKey); document.body.style.overflow = previousOverflow; if (previousFocus?.isConnected) previousFocus.focus(); };
  }, []);
  return <div className="modal-backdrop" onClick={() => close.current?.()}><div ref={sheet} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} className="modal-sheet" onClick={(e) => e.stopPropagation()}><span id={titleId} className="meadow-sr-only">{label}</span><button type="button" className="meadow-dialog-close" onClick={() => close.current?.()} aria-label="Close dialog">×</button>{children}</div></div>;
}
