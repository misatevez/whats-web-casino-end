export const STORAGE_KEYS = {
  PHONE_NUMBER: 'whatsapp_phone_number',
  CHAT_ID: 'whatsapp_chat_id',
  USER_PROFILE: 'whatsapp_user_profile'
} as const;

export function getStoredPhoneNumber(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.PHONE_NUMBER);
}

export function setStoredPhoneNumber(phoneNumber: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.PHONE_NUMBER, phoneNumber);
}

export function getStoredChatId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.CHAT_ID);
}

export function setStoredChatId(chatId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CHAT_ID, chatId);
}

export function clearChatSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PHONE_NUMBER);
  localStorage.removeItem(STORAGE_KEYS.CHAT_ID);
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
}