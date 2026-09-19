import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPlayerSave } from '../lib/loadPlayerSave.mjs';

function mock(reads, inserted) {
  const writes = [];
  return { writes, from() { return {
    select() { return { eq() { return { maybeSingle: async () => reads.shift() }; } }; },
    insert(value) { writes.push(value); return { select() { return { single: async () => inserted }; } }; },
  }; } };
}
test('existing save is preserved without initialization', async () => {
  const data = { seeds: 14, birds: [{ name: 'Pebble' }] };
  const client = mock([{ data }]);
  assert.equal(await loadPlayerSave(client, 'u', () => { throw Error('unexpected'); }), data);
  assert.equal(client.writes.length, 0);
});
test('read errors never create starter data', async () => {
  for (const code of ['42501', 'NETWORK_ERROR', 'PGRST301']) {
    const client = mock([{ error: { code } }]);
    await assert.rejects(loadPlayerSave(client, 'u', () => ({ seeds: 30 })));
    assert.equal(client.writes.length, 0);
  }
});
test('only an explicitly empty result initializes the account', async () => {
  const data = { user_id: 'u', seeds: 30 };
  const client = mock([{ data: null }], { data });
  assert.equal(await loadPlayerSave(client, 'u', () => ({ seeds: 30 })), data);
  assert.deepEqual(client.writes, [data]);
});
test('failed initialization blocks gameplay', async () => {
  const client = mock([{ data: null }], { error: { code: '42501' } });
  await assert.rejects(loadPlayerSave(client, 'u', () => ({})));
});
test('concurrent initialization reloads the winning save', async () => {
  const data = { seeds: 45 };
  const client = mock([{ data: null }, { data }], { error: { code: '23505' } });
  assert.equal(await loadPlayerSave(client, 'u', () => ({})), data);
});
test('missing insert response fails instead of using defaults', async () => {
  const client = mock([{ data: null }], { data: null });
  await assert.rejects(loadPlayerSave(client, 'u', () => ({})), /not returned/);
});
