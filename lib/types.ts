export interface Status {
  id: string;
  imageUrl: string;
  timestamp: string;
  caption?: string;
  createdAt: string;
  fileName: string;
}

export interface MessagePreview {
  type: 'image' | 'document';
  name: string;
  url: string;
  size?: string;
}

export interface Message {
  id: string;
  content: string;
  time: string;
  sent: boolean;
  status?: "sent" | "delivered" | "read";
  preview?: MessagePreview;
}

export interface Chat {
  id: string;
  name: string;
  phoneNumber: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
  messages: Message[];
  about?: string;
  statuses?: Status[];
}

export interface UserProfile {
  name: string;
  image: string;
  about: string;
  statuses?: Status[];
}