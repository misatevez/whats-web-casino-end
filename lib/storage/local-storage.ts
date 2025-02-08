const PHONE_NUMBER_KEY = 'whatsapp_phone_number';
const CHAT_ID_KEY = 'whatsapp_chat_id';

export function getStoredPhoneNumber(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PHONE_NUMBER_KEY);
}

export function setStoredPhoneNumber(phoneNumber: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PHONE_NUMBER_KEY, phoneNumber);
}

export function getStoredChatId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CHAT_ID_KEY);
}

export function setStoredChatId(chatId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHAT_ID_KEY, chatId);
}

export function clearStoredData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PHONE_NUMBER_KEY);
  localStorage.removeItem(CHAT_ID_KEY);
}