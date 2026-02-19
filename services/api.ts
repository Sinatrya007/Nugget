
/**
 * Cloud Sync Service
 * Menggunakan public test API sebagai relay data agar aplikasi bekerja antar perangkat.
 * Dioptimalkan dengan caching ID untuk mengurangi beban network dan mencegah "Failed to fetch".
 */

const BASE_URL = 'https://api.restful-api.dev/objects';

// Helper untuk mendapatkan ID yang tersimpan agar tidak perlu fetch semua data setiap saat
const getStoredCloudId = (sessionId: string) => localStorage.getItem(`spotsync_cloud_id_${sessionId}`);
const setStoredCloudId = (sessionId: string, id: string) => localStorage.setItem(`spotsync_cloud_id_${sessionId}`, id);

export const syncToCloud = async (sessionId: string, data: any) => {
  try {
    const payload = {
      name: `spotsync_v2_${sessionId}`,
      data: data
    };
    
    let cloudId = getStoredCloudId(sessionId);

    // Jika belum punya ID, kita cari dulu di server
    if (!cloudId) {
      const response = await fetch(BASE_URL, { signal: AbortSignal.timeout(10000) });
      if (response.ok) {
        const allObjects = await response.json();
        const existing = Array.isArray(allObjects) ? allObjects.find((obj: any) => obj.name === `spotsync_v2_${sessionId}`) : null;
        if (existing) {
          cloudId = existing.id;
          setStoredCloudId(sessionId, cloudId!);
        }
      }
    }

    if (cloudId) {
      // Update (PUT)
      const updateRes = await fetch(`${BASE_URL}/${cloudId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      });
      
      if (!updateRes.ok) {
        // Jika gagal (mungkin ID sudah dihapus di server), hapus cache dan coba POST
        localStorage.removeItem(`spotsync_cloud_id_${sessionId}`);
        return await createNewObject(payload, sessionId);
      }
    } else {
      // Create (POST)
      return await createNewObject(payload, sessionId);
    }
    return true;
  } catch (error) {
    console.error('Cloud Sync Error:', error);
    // Fallback: simpan di local jika cloud gagal agar tidak hilang total
    const localKey = `spotsync_fallback_${sessionId}`;
    localStorage.setItem(localKey, JSON.stringify(data));
    return false;
  }
};

const createNewObject = async (payload: any, sessionId: string) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000)
  });
  
  if (response.ok) {
    const result = await response.json();
    if (result.id) setStoredCloudId(sessionId, result.id);
    return true;
  }
  return false;
};

export const getFromCloud = async (sessionId: string) => {
  try {
    let cloudId = getStoredCloudId(sessionId);
    
    // Jika ada ID di cache, ambil langsung (lebih cepat & stabil)
    if (cloudId) {
      const response = await fetch(`${BASE_URL}/${cloudId}`, { signal: AbortSignal.timeout(10000) });
      if (response.ok) {
        const obj = await response.json();
        return obj.data;
      }
    }

    // Fallback: Cari manual jika ID tidak ada atau sudah expired
    const response = await fetch(BASE_URL, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Network response was not ok');
    
    const allObjects = await response.json();
    if (!Array.isArray(allObjects)) return null;
    
    const target = allObjects.find((obj: any) => obj.name === `spotsync_v2_${sessionId}`);
    if (target) {
      setStoredCloudId(sessionId, target.id);
      return target.data;
    }
    
    // Cek local fallback jika cloud benar-benar kosong
    const fallback = localStorage.getItem(`spotsync_fallback_${sessionId}`);
    return fallback ? JSON.parse(fallback) : null;
  } catch (error) {
    console.error('Cloud Fetch Error:', error);
    const fallback = localStorage.getItem(`spotsync_fallback_${sessionId}`);
    return fallback ? JSON.parse(fallback) : null;
  }
};
