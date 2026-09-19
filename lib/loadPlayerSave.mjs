// A failed read must never be interpreted as an empty/new account.
export async function loadPlayerSave(client, userId, createStarter) {
  const read = () => client.from("player_saves").select("*").eq("user_id", userId).maybeSingle();
  const existing = await read();
  if (existing.error) throw existing.error;
  if (existing.data) return existing.data;

  const created = await client.from("player_saves")
    .insert({ ...createStarter(), user_id: userId }).select().single();
  // Another tab may have initialized the same account while this tab loaded.
  if (created.error?.code === "23505") {
    const concurrent = await read();
    if (concurrent.error) throw concurrent.error;
    if (concurrent.data) return concurrent.data;
  }
  if (created.error) throw created.error;
  if (!created.data) throw new Error("Player save was not returned.");
  return created.data;
}
