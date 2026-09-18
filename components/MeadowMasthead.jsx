"use client";

import MeadowIcon from "./MeadowIcon";
import { TABS, MAX_IGGIES } from "@/lib/gameData";
import { LAUNCH_ART } from "@/lib/launchArt";

const TAB_COPY = {
  home: { kicker: "MEADOW PLAZA", title: "Home", copy: "Your gentle little world" },
  kennel: { kicker: "WILLOW KENNELS", title: "My Iggies", copy: "Care, bond, remember" },
  nests: { kicker: "ADOPTION & LINEAGE", title: "Adoption House", copy: "Adopt or grow a family" },
  events: { kicker: "THE GREAT MEADOW", title: "World & Events", copy: "Seasonal paths and places" },
  explore: { kicker: "GARDEN GATE", title: "Explore", copy: "Wander beyond the hedges" },
  games: { kicker: "ARCADE LANE", title: "Games", copy: "Small joys and seed prizes" },
  shop: { kicker: "MARKET LANE", title: "Market Lane", copy: "Toys, looks, little treasures" },
  collection: { kicker: "MEADOW ARCHIVE", title: "Collection", copy: "Every discovery has a page" },
};

const TAB_ART = {
  home: LAUNCH_ART.meadow,
  kennel: LAUNCH_ART.kennel,
  nests: LAUNCH_ART.adoption,
  events: LAUNCH_ART.meadow,
  explore: LAUNCH_ART.meadow,
  games: LAUNCH_ART.market,
  shop: LAUNCH_ART.market,
  collection: LAUNCH_ART.collection,
};

function Resource({ icon, label, value, className = "" }) {
  return (
    <div className={`meadow-resource ${className}`}>
      <span className="meadow-resource-icon" aria-hidden="true"><MeadowIcon name={icon} /></span>
      <span className="meadow-resource-copy"><small>{label}</small><strong>{value}</strong></span>
    </div>
  );
}

export default function MeadowMasthead({
  username,
  seeds,
  bones,
  streak,
  petCount,
  pending,
  onCollect,
  saveStatus,
  lastSavedAt,
  isAdmin,
  tab,
  nestsSubtab,
  shopSubtab,
  onTab,
  onNestsSubtab,
  onShopSubtab,
  onAchievements,
  onLeaderboard,
  onNotifications,
  onAdmin,
  onSignOut,
}) {
  const chapter = TAB_COPY[tab] || TAB_COPY.home;
  const art = TAB_ART[tab] || LAUNCH_ART.meadow;
  const saveText = saveStatus === "saving" ? "Saving…" : saveStatus === "error" ? "Save failed" : "Saved";

  return (
    <>
      <header className="meadow-masthead">
        <div className="meadow-masthead-flower meadow-masthead-flower-left" aria-hidden="true">✿</div>
        <div className="meadow-masthead-flower meadow-masthead-flower-right" aria-hidden="true">✿</div>

        <button type="button" className="meadow-brand-plaque" onClick={() => onTab("home")}>
          <span className="meadow-brand-paw" aria-hidden="true"><MeadowIcon name="paw" /></span>
          <div>
            <small>SMALL DOGS. BIG ADVENTURES.</small>
            <div className="meadow-wordmark">Iggy Meadow</div>
            <span className="meadow-welcome">Welcome back, @{username}</span>
          </div>
        </button>

        <div className="meadow-resource-rail" aria-label="Meadow resources">
          <Resource icon="paw" label="Iggies" value={`${petCount}/${MAX_IGGIES}`} />
          <Resource icon="seeds" label="Seeds" value={seeds} />
          <Resource icon="bone" label="Special Dog Bones" value={bones} className="meadow-resource-premium" />
          <Resource icon="flower" label="Streak" value={streak} />
        </div>

        <div className="meadow-account-plaque">
          <div className="meadow-account-portrait"><img src={LAUNCH_ART.fawnMaster} alt="" aria-hidden="true" /></div>
          <div className="meadow-account-copy">
            <small>MEADOW MEMBER</small>
            <strong>@{username}</strong>
            <span className={`meadow-save-state meadow-save-${saveStatus}`} title={lastSavedAt ? `Last saved ${new Date(lastSavedAt).toLocaleTimeString()}` : undefined}>● {saveText}</span>
          </div>
          <div className="meadow-utility-actions">
            <a href={`/profile/${encodeURIComponent(username)}`} className="meadow-icon-button" title="My profile" aria-label="My profile"><MeadowIcon name="profile" /></a>
            <button onClick={onAchievements} className="meadow-icon-button" title="Achievements" aria-label="Achievements"><MeadowIcon name="award" /></button>
            <button onClick={onLeaderboard} className="meadow-icon-button" title="Leaderboard" aria-label="Leaderboard"><MeadowIcon name="archive" /></button>
            <button onClick={onNotifications} className="meadow-icon-button" title="Notifications" aria-label="Notifications"><MeadowIcon name="bell" /></button>
            {isAdmin && <button onClick={onAdmin} className="meadow-icon-button" title="Admin" aria-label="Admin"><MeadowIcon name="settings" /></button>}
            <button onClick={onSignOut} className="meadow-icon-button meadow-icon-signout" title="Sign out" aria-label="Sign out"><MeadowIcon name="exit" /></button>
          </div>
        </div>
      </header>

      <a className="meadow-skip-link" href="#meadow-content">Skip to the Meadow</a>
      <nav className="meadow-mainnav" aria-label="Primary navigation">
        {TABS.map((item) => {
          const meta = TAB_COPY[item.key] || { copy: item.label };
          const active = tab === item.key;
          return (
            <button key={item.key} className={`meadow-nav-card${active ? " active" : ""}`} onClick={() => onTab(item.key)} aria-current={active ? "page" : undefined}>
              <span className="meadow-nav-icon" aria-hidden="true"><img src={TAB_ART[item.key] || LAUNCH_ART.meadow} alt="" decoding="async" /></span>
              <span className="meadow-nav-text"><strong>{meta.title || item.label}</strong><small>{meta.copy}</small></span>
              <span className="meadow-nav-spark" aria-hidden="true">✦</span>
            </button>
          );
        })}
      </nav>

      <section className="meadow-chapter-ribbon" aria-label={`Current section: ${chapter.title}`}>
        <img src={art} alt="" aria-hidden="true" />
        <div className="meadow-chapter-shade" aria-hidden="true" />
        <div className="meadow-chapter-copy">
          <small>{chapter.kicker}</small>
          <strong>{chapter.title}</strong>
          <span>{chapter.copy}</span>
        </div>
        <div className="meadow-income-ticket">
          <span><small>KENNEL INCOME</small><strong>+{pending} seeds</strong></span>
          <button onClick={onCollect} disabled={pending <= 0}>Collect</button>
        </div>
        <div className="meadow-quicktrail" aria-label="Quick destinations">
          <button onClick={() => onTab("home")} className={tab === "home" ? "active" : ""}>Meadow</button>
          <button onClick={() => onTab("kennel")} className={tab === "kennel" ? "active" : ""}>Kennel</button>
          <button onClick={() => { onTab("nests"); onNestsSubtab("adopt"); }} className={tab === "nests" && nestsSubtab === "adopt" ? "active" : ""}>Adopt</button>
          <button onClick={() => { onTab("nests"); onNestsSubtab("breed"); }} className={tab === "nests" && nestsSubtab === "breed" ? "active" : ""}>Lineage</button>
          <button onClick={() => onTab("explore")} className={tab === "explore" ? "active" : ""}>Explore</button>
          <button onClick={() => onTab("games")} className={tab === "games" ? "active" : ""}>Arcade</button>
          <button onClick={() => { onTab("shop"); onShopSubtab("shop"); }} className={tab === "shop" && shopSubtab === "shop" ? "active" : ""}>Market</button>
          <button onClick={() => { onTab("shop"); onShopSubtab("wardrobe"); }} className={tab === "shop" && shopSubtab === "wardrobe" ? "active" : ""}>Wardrobe</button>
        </div>
      </section>

      <div className="meadow-gazette-ribbon" aria-label="Meadow today">
        <span className="meadow-gazette-seal">MEADOW TODAY</span>
        <span>❀ Flowers are blooming</span><i>◆</i>
        <span>❀ New looks in Market Lane</span><i>◆</i>
        <span>❀ Every Iggy has a story</span><i>◆</i>
        <span>❀ Gentle adventures await</span>
      </div>
    </>
  );
}
