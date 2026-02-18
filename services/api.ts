
/**
 * Cloud Sync Service
 * Menggunakan public test API sebagai relay data agar aplikasi bekerja antar perangkat.
 * Catatan: Karena menggunakan API publik gratis, data mungkin dihapus secara berkala oleh penyedia API.
 */

const BASE_URL = 'https://api.restful-api.dev/objects';

export const syncToCloud = async (sessionId: string, data: any) => {
  try {
    const payload = {
      name: `spotsync_v2_${sessionId}`,
      data: data
    };
    
    // 1. Cari dulu apakah sudah ada di cloud
    const response = await fetch(BASE_URL);
    const allObjects = await response.json();
    const existing = Array.isArray(allObjects) ? allObjects.find((obj: any) => obj.name === `spotsync_v2_${sessionId}`) : null;

    if (existing && existing.id) {
      // 2. Jika ada, lakukan Update (PUT)
      await fetch(`${BASE_URL}/${existing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // 3. Jika tidak ada, buat baru (POST)
      await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    return true;
  } catch (error) {
    console.error('Cloud Sync Error:', error);
    return false;
  }
};

export const getFromCloud = async (sessionId: string) => {
  try {
    // Kita harus fetch semua lalu filter karena API ini tidak dukung query by name secara mendalam
    const response = await fetch(BASE_URL);
    const allObjects = await response.json();
    
    if (!Array.isArray(allObjects)) return null;
    
    const target = allObjects.find((obj: any) => obj.name === `spotsync_v2_${sessionId}`);
    return target ? target.data : null;
  } catch (error) {
    console.error('Cloud Fetch Error:', error);
    return null;
  }
};
