import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import worker from './index';

test('verified accounts see only their own orders and only staff can update fulfillment', async () => {
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwk = { ...await exportJWK(publicKey), kid: 'fixture', alg: 'RS256', use: 'sig' };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => String(input).includes('/service_accounts/v1/jwk/') ? Response.json({ keys: [jwk] }) : originalFetch(input, init);
  const data = [
    { session_id: 'cs_test_one', customer_uid: 'alice', status: 'paid', fulfillment_status: 'received', tracking_carrier: null, tracking_number: null, tracking_url: null, delivery_address: 'fixture address' },
    { session_id: 'cs_test_two', customer_uid: 'bob', status: 'paid', fulfillment_status: 'received', tracking_carrier: null, tracking_number: null, tracking_url: null, delivery_address: 'other address' },
  ];
  const env = { FIREBASE_PROJECT_ID: 'test-project', ORDER_ADMIN_UIDS: 'staff', ORDERS: { prepare(sql: string) { return { bind(...args: string[]) { return statement(sql, args); }, ...statement(sql, []) }; } } };
  function statement(sql: string, args: string[]) { return {
    all: async () => ({ results: data.filter(order => order.status === 'paid' && (!sql.includes('customer_uid = ?') || order.customer_uid === args[0])).map(({ customer_uid, status, delivery_address, ...order }) => sql.includes('delivery_address') ? { ...order, delivery_address } : order) }),
    run: async () => { const order = data.find(item => item.session_id === args[4] && item.status === 'paid'); if (order) Object.assign(order, { fulfillment_status: args[0], tracking_carrier: args[1], tracking_number: args[2], tracking_url: args[3] }); return { meta: { changes: order ? 1 : 0 } }; },
  }; }
  async function token(uid: string, audience = 'test-project') { return new SignJWT({ auth_time: Math.floor(Date.now() / 1000) - 1 }).setProtectedHeader({ alg: 'RS256', kid: 'fixture' }).setSubject(uid).setAudience(audience).setIssuer('https://securetoken.google.com/test-project').setIssuedAt().setExpirationTime('1h').sign(privateKey); }
  async function request(path: string, jwt?: string, update?: object) { return worker.fetch(new Request(`https://serein.test${path}`, { method: update ? 'PATCH' : 'GET', headers: { ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}), ...(update ? { Origin: 'https://serein.test', 'Content-Type': 'application/json' } : {}) }, ...(update ? { body: JSON.stringify(update) } : {}) }), env as unknown as Parameters<typeof worker.fetch>[1]); }
  try {
    const alice = await token('alice'); const staff = await token('staff');
    assert.equal((await request('/api/account/orders')).status, 401);
    assert.equal((await request('/api/account/orders', await token('alice', 'wrong-project'))).status, 401);
    assert.deepEqual((await (await request('/api/account/orders', alice)).json() as { orders: { session_id: string }[] }).orders.map(order => order.session_id), ['cs_test_one']);
    assert.equal('delivery_address' in (await (await request('/api/account/orders', alice)).json() as { orders: object[] }).orders[0], false);
    assert.equal((await (await request('/api/admin/orders', staff)).json() as { orders: { delivery_address: string }[] }).orders[0].delivery_address, 'fixture address');
    assert.equal((await request('/api/admin/orders', alice)).status, 403);
    assert.equal((await request('/api/admin/products')).status, 401);
    assert.equal((await request('/api/admin/products', alice)).status, 403);
    const update = { sessionId: 'cs_test_one', status: 'shipped', carrier: 'Carrier', trackingNumber: '123', trackingUrl: 'https://carrier.example/123' };
    assert.equal((await request('/api/admin/orders', alice, update)).status, 403);
    assert.equal((await request('/api/admin/orders', staff, { ...update, trackingUrl: 'javascript:alert(1)' })).status, 400);
    assert.equal((await request('/api/admin/orders', staff, update)).status, 200);
    const orders = (await (await request('/api/account/orders', alice)).json() as { orders: { fulfillment_status: string; tracking_number: string }[] }).orders;
    assert.equal(orders[0].fulfillment_status, 'shipped'); assert.equal(orders[0].tracking_number, '123');
    assert.equal(data[1].fulfillment_status, 'received');
  } finally { globalThis.fetch = originalFetch; }
});
