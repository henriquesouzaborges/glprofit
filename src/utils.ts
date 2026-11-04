export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  if (dateString.includes('Hoje') || dateString.includes('Ontem')) return dateString;
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export interface OpenInternalWhatsAppDetail {
  phone: string;
  text?: string;
  contactName?: string;
  studentId?: string;
}

export function sendWhatsAppMessage(phone: string, text?: string, contactName?: string, studentId?: string) {
  if (!phone && !contactName) return;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<OpenInternalWhatsAppDetail>('gl_pro_fit_open_whatsapp', {
        detail: {
          phone: phone || '',
          text: text || '',
          contactName: contactName || '',
          studentId: studentId || ''
        }
      })
    );
  }
}

export function generateAccessCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}
