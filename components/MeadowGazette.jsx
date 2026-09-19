"use client";

const STORIES = [
  { icon: "🌲", kicker: "FIELD NOTE", title: "Lanterns in Whispering Woods", text: "Travelers say the moss glows brighter after dusk. The Old Oak may know why.", art: "/art/scenes/whispering-woods.svg", go: "world" },
  { icon: "🎀", kicker: "MARKET POST", title: "Velvet changed the window", text: "A new display has appeared on Market Lane, and every ribbon seems to tell a tiny story.", art: "/art/scenes/wardrobe-boutique-interior.svg", go: "wardrobe" },
  { icon: "🏰", kicker: "ROYAL MAIL", title: "Bramblewick sent a seal", text: "A wax-stamped invitation arrived from beyond the gate. Archivist Moon has already filed a copy.", art: "/art/scenes/bramblewick.svg", go: "world" },
];

export default function MeadowGazette({ onGo }) {
  return (
    <section className="v40-gazette" aria-label="The Meadow Gazette">
      <div className="v40-gazette-masthead"><span>✦</span><div><small>EST. IN THE HEART OF THE MEADOW</small><strong>The Meadow Gazette</strong><em>Stories, rumors & tiny reasons to wander</em></div><span>✦</span></div>
      <div className="v40-gazette-grid">
        {STORIES.map((story) => <button key={story.title} type="button" className="v40-gazette-story" onClick={() => onGo?.(story.go)}>
          <img src={story.art} alt="" loading="lazy" decoding="async" />
          <span className="v40-gazette-copy"><small>{story.icon} {story.kicker}</small><strong>{story.title}</strong><p>{story.text}</p><em>Turn the page →</em></span>
        </button>)}
      </div>
      <div className="v40-gazette-foot"><span>🐾 Townfolk tip: click pictures, doors, pets and postcards.</span><span>🌼 Nothing here expires just because you needed a day away.</span></div>
    </section>
  );
}
