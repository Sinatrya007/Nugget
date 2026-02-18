
/**
 * Cloud Sync Service
 * Menggunakan public test API sebagai relay data agar aplikasi bekerja antar perangkat.
 */

const BASE_URL = 'https://api.restful-api.dev/objects';

export const syncToCloud = async (sessionId: string, data: any) => {
  try {
    // Kita menyimpan data dengan ID unik yang diawali 'spotsync_'
    const payload = {
      name: `spotsync_${sessionId}`,
      data: data
    };
    
    // Coba cari apakah sudah ada
    const searchResponse = await fetch(`${BASE_URL}?id=spotsync_${sessionId}`);
    const existing = await searchResponse.json();

    if (existing && existing.id) {
      // Update jika sudah ada
      await fetch(`${BASE_URL}/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Create baru jika belum ada
      await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
  } catch (error) {
    console.error('Cloud Sync Error:', error);
  }
};

export const getFromCloud = async (sessionId: string) => {
  try {
    const response = await fetch(BASE_URL);
    const allData = await response.json();
    // Filter manual karena public API ini punya keterbatasan query
    const sessionData = allData.find((item: any) => item.name === `spotsync_${sessionId}`);
    return sessionData ? sessionData.data : null;
  } catch (error) {
    console.error('Cloud Fetch Error:', error);
    return null;
  }
};
