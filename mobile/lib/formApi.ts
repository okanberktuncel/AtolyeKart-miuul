const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

type ApiErrorBody = { error?: string; errors?: Record<string, string> };

// Formlar n8n'e doğrudan değil, web sitesiyle aynı Vercel API route'ları üzerinden gider;
// doğrulama, rate limit ve webhook secret'ı sunucuda kalır.
export async function postForm(path: '/api/order' | '/api/stock-notify', payload: Record<string, unknown>) {
  if (!API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL ayarlanmadı (mobile/.env.example dosyasına bakın).');
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, source: 'mobile' }),
    });
  } catch {
    throw new Error('Sunucuya ulaşılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
  }

  const data: ApiErrorBody = await res.json().catch(() => ({}));
  if (!res.ok) {
    const firstFieldError = data.errors ? Object.values(data.errors)[0] : undefined;
    throw new Error(firstFieldError ?? data.error ?? 'Bir hata oluştu, lütfen tekrar deneyin.');
  }
  return data;
}
