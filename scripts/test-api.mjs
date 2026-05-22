import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

const run = async () => {
  // 1. GET /api/books/1
  try {
    console.log('[1] GET /api/books/1');
    const r1 = await api.get('/api/books/1');
    console.log('    Status:', r1.status);
    console.log('    Data:', JSON.stringify(r1.data, null, 2).slice(0, 800));
  } catch (e) {
    console.log('    Error:', e.response ? e.response.status + ' ' + JSON.stringify(e.response.data) : String(e.message).slice(0, 120));
  }

  // 2. GET /api/books/999
  try {
    console.log('\n[2] GET /api/books/999');
    const r2 = await api.get('/api/books/999');
    console.log('    Status:', r2.status);
    console.log('    Data:', JSON.stringify(r2.data, null, 2));
  } catch (e) {
    console.log('    Error:', e.response ? e.response.status + ' ' + JSON.stringify(e.response.data) : String(e.message).slice(0, 120));
  }

  // 3. GET /book/1 — full HTML scan
  try {
    console.log('\n[3] GET /book/1');
    const r3 = await api.get('/book/1');
    console.log('    Status:', r3.status);
    const html = r3.data;
    console.log('    "book not found" at index:', html.toLowerCase().indexOf('book not found'));
    console.log('    <title>:', html.split('<title>')[1]?.split('</title>')[0] || 'N/A');
  } catch (e) {
    console.log('    Error:', e.response ? e.response.status + ' ' + JSON.stringify(e.response.data) : String(e.message).slice(0, 120));
  }
};

run();
