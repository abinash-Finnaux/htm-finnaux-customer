export function formatDateToYYYYMMDD(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatDateToDDMMYYYY(value?: string): string {
  const raw = (value || '').trim();
  if (!raw) {
    return '';
  }
  const iso = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (iso) {
    const [, y, m, d] = iso;
    return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
  }
  const dmy = raw.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
  }
  return raw;
}

export function maskPan(pan?: string): string {
  const value = (pan || '').trim();
  if (!value) {
    return '';
  }
  if (value.length <= 2) {
    return value;
  }
  const masked = value.slice(1, -1).replace(/[^\s]/g, '•');
  return `${value[0]}${masked}${value[value.length - 1]}`;
}

export function maskAadhaar(aadhaar?: string): string {
  const digits = (aadhaar || '').replace(/\D/g, '');
  if (!digits) {
    return aadhaar || '';
  }
  if (digits.length <= 4) {
    return digits;
  }
  const last4 = digits.slice(-4);
  return `${'•'.repeat(digits.length - 4)}${last4}`;
}
