/**
 * Simple API smoke test — no dependencies (uses built-in fetch, Node 18+).
 *
 * Usage:
 *   1. Start Postgres and make sure the "StoreDB" database exists.
 *   2. Push the schema:   npx drizzle-kit push   (run from the project root)
 *   3. Start the server:  npm run server
 *   4. In another terminal: node Back-end/smoke-test.mjs
 *
 * Optional env: BASE_URL (defaults to http://localhost:5000)
 */

const BASE = process.env.BASE_URL || 'http://localhost:5000';
let pass = 0, fail = 0;

function ok(name, cond, detail = '') {
  const mark = cond ? '✅' : '❌';
  console.log(`${mark} ${name}${detail ? ' — ' + detail : ''}`);
  cond ? pass++ : fail++;
}

async function json(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  let body = null;
  try { body = await res.json(); } catch { /* non-JSON */ }
  return { status: res.status, body };
}

const run = async () => {
  console.log(`\nRunning smoke test against ${BASE}\n`);

  // 1. Health
  try {
    const h = await json('/api/health');
    ok('GET /api/health', h.status === 200 && h.body?.success === true, `status ${h.status}`);
  } catch (e) {
    ok('GET /api/health', false, `server not reachable: ${e.message}`);
    console.log('\n⚠  Is the server running? Start it with: npm run server\n');
    return summary();
  }

  const email = `smoke_${Date.now()}@test.com`;
  const password = 'Password123!';
  let token = null;

  // 2. Register
  const reg = await json('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Smoke Tester', email, password }),
  });
  ok('POST /api/auth/register', reg.status === 201 && !!reg.body?.token, `status ${reg.status}`);
  token = reg.body?.token;

  // 3. Login
  const login = await json('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  ok('POST /api/auth/login', login.status === 200 && !!login.body?.token, `status ${login.status}`);
  token = login.body?.token || token;

  // 4. Authenticated /me  (verifies JWT id + protect middleware)
  const me = await json('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  ok('GET /api/auth/me (auth)', me.status === 200 && me.body?.user?.email === email, `status ${me.status}`);

  // 5. /me without token should be rejected
  const noAuth = await json('/api/auth/me');
  ok('GET /api/auth/me (no token → 401)', noAuth.status === 401, `status ${noAuth.status}`);

  // 6. Public products list
  const products = await json('/api/products');
  ok('GET /api/products', products.status === 200 && Array.isArray(products.body?.data), `status ${products.status}`);

  // 7. Public categories list
  const cats = await json('/api/categories');
  ok('GET /api/categories', cats.status === 200 && Array.isArray(cats.body?.data), `status ${cats.status}`);

  // 8. Unknown route → 404
  const notFound = await json('/api/does-not-exist');
  ok('GET unknown route → 404', notFound.status === 404, `status ${notFound.status}`);

  summary();
};

function summary() {
  console.log(`\n──────────────\nPassed: ${pass}   Failed: ${fail}\n`);
  process.exit(fail === 0 ? 0 : 1);
}

run();
