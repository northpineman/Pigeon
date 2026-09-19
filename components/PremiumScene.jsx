"use client";

export default function PremiumScene({
  image,
  eyebrow,
  title,
  copy,
  actions = [],
  priority = false,
  compact = false,
  children,
}) {
  return (
    <section className={`premium-scene${compact ? " premium-scene-compact" : ""}`}>
      <img
        className="premium-scene-image"
        src={image}
        alt=""
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
      <div className="premium-scene-shade" aria-hidden="true" />
      <div className="premium-scene-copy">
        {eyebrow && <div className="premium-scene-eyebrow">{eyebrow}</div>}
        {title && <h2>{title}</h2>}
        {copy && <p>{copy}</p>}
        {actions.length > 0 && (
          <div className="premium-scene-actions">
            {actions.map((action, index) => (
              <button key={`${action.label}-${index}`} className={index === 0 ? "btn btn-primary" : "btn btn-ghost"} onClick={action.onClick}>
                {action.label}
              </button>
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
