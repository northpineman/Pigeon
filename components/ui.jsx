"use client";

export function StatBar({ value, color }) {
  return (
    <div className="statbar">
      <div className="statbar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export function Modal({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
