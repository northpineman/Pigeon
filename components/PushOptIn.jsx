"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function PushOptIn({ userId }) {
  const [status, setStatus] = useState("checking");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }
      if (typeof Notification !== "undefined" && Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        setStatus(existing ? "subscribed" : "unsubscribed");
      } catch (e) {
        setStatus("unsupported");
      }
    })();
  }, []);

  const enable = async () => {
    setBusy(true);
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        setStatus("unsupported");
        setBusy(false);
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        setBusy(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      await supabase.from("push_subscriptions").upsert({
        user_id: userId,
        endpoint: sub.endpoint,
        subscription: sub.toJSON(),
      });
      setStatus("subscribed");
    } catch (e) {
      console.error("push enable failed", e);
    }
    setBusy(false);
  };

  const disable = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await supabase.from("push_subscriptions").delete().eq("user_id", userId).eq("endpoint", sub.endpoint);
        await sub.unsubscribe();
      }
      setStatus("unsubscribed");
    } catch (e) {
      console.error("push disable failed", e);
    }
    setBusy(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, marginBottom: 8 }}>🔔 Notifications</div>

      {status === "checking" && <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Checking your browser…</div>}

      {status === "unsupported" && (
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          Push notifications aren't available in this browser. Try adding this site to your home screen first, or use
          a different browser.
        </div>
      )}

      {status === "denied" && (
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          Notifications are blocked for this site. You can re-enable them from your browser's site settings.
        </div>
      )}

      {status === "unsubscribed" && (
        <>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 12 }}>
            Get a gentle daily reminder when your Iggies and seeds are waiting for you.
          </div>
          <button className="btn btn-primary" onClick={enable} disabled={busy}>
            {busy ? "Enabling…" : "Enable notifications"}
          </button>
        </>
      )}

      {status === "subscribed" && (
        <>
          <div style={{ fontSize: 13, color: "#4CAF7D", fontWeight: 800, marginBottom: 12 }}>Notifications are on ✓</div>
          <button className="btn btn-ghost" onClick={disable} disabled={busy}>
            {busy ? "Turning off…" : "Turn off"}
          </button>
        </>
      )}
    </div>
  );
}
