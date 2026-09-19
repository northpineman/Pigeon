"use client";

export default function MeadowAtmosphere({ tab = "home" }) {
  return (
    <div className={`meadow-atmosphere atmosphere-${tab}`} aria-hidden="true">
      <span className="ambient-cloud cloud-a" />
      <span className="ambient-cloud cloud-b" />
      <span className="ambient-cloud cloud-c" />
      <span className="ambient-spark spark-a">✦</span>
      <span className="ambient-spark spark-b">✧</span>
      <span className="ambient-spark spark-c">✦</span>
      <span className="ambient-petal petal-a">❀</span>
      <span className="ambient-petal petal-b">❀</span>
      <span className="ambient-petal petal-c">❀</span>
    </div>
  );
}
