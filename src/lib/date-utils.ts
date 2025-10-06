export function formatDateSafe(dateString: string): string {
  if (typeof window === 'undefined') {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  
  return new Date(dateString).toLocaleDateString("pt-BR");
}

export function formatPhoneSafe(phone: string): string {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}