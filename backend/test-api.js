(async () => {
  const base = 'http://localhost:5000';
  const now = Date.now();
  const email = `smoketest+${now}@example.com`;

  // Register
  let res = await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'smoketest', email, password: 'TestPass123' })
  });
  const reg = await res.json();
  if (!reg || !reg.token) {
    console.error('Register failed', reg);
    process.exit(1);
  }
  console.log('REGISTERED', reg.userId);
  const token = reg.token;

  // Create request
  res = await fetch(`${base}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ serviceType: 'Repair', description: 'Smoke test: device broken', priority: 'High', location: 'Test Location' })
  });
  const create = await res.json();
  if (!create || !create.data) {
    console.error('Create request failed', create);
    process.exit(1);
  }
  console.log('CREATED', create.data.id);

  // Fetch requests
  res = await fetch(`${base}/api/requests`, { headers: { 'Authorization': `Bearer ${token}` } });
  const all = await res.json();
  console.log('TOTAL_REQUESTS', all.data ? all.data.length : 0);
  console.log(JSON.stringify(all.data && all.data.slice(0,5), null, 2));

  process.exit(0);
})().catch(err => {
  console.error('Smoke test error:', err);
  process.exit(1);
});
