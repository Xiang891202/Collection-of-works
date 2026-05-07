import { config } from './config/index';

async function testFetch() {
  const url = `${config.supabase.url}/rest/v1/projects?limit=1`;
  const key = config.supabase.serviceRoleKey;

  console.log('Testing direct fetch...');
  console.log('URL:', url);
  console.log('Key starts with:', key.substring(0, 20) + '...');

  try {
    const response = await fetch(url, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (err: any) {
    console.log('Fetch error:', err.message);
  }
}

testFetch();