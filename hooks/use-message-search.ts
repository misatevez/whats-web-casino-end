import { useState, useCallback } from 'react';
import { Message } from '@/lib/types';

export function useMessageSearch(messages: Message[]) {
  const [showSearch, setShowSearch] = useState(false);
  const [messageSearchTerm, setMessageSearchTerm] = useState("");
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);

  const filteredMessages = messageSearchTerm
    ? messages.filter(message =>
        message.content?.toLowerCase().includes(messageSearchTerm.toLowerCase())
      )
    : messages;

  const handleNext = useCallback(() => {
    const newIndex = selectedMessageIndex !== null
      ? Math.min(selectedMessageIndex + 1, filteredMessages.length - 1)
      : 0;
    setSelectedMessageIndex(newIndex);
  }, [selectedMessageIndex, filteredMessages.length]);

  const handlePrevious = useCallback(() => {
    const newIndex = selectedMessageIndex !== null
      ? Math.max(selectedMessageIndex - 1, 0)
      : filteredMessages.length - 1;
    setSelectedMessageIndex(newIndex);
  }, [selectedMessageIndex, filteredMessages.length]);

  const handleSearchClose = useCallback(() => {
    setShowSearch(false);
    setMessageSearchTerm("");
    setSelectedMessageIndex(null);
  }, []);

  return {
    showSearch,
    setShowSearch,
    messageSearchTerm,
    setMessageSearchTerm,
    selectedMessageIndex,
    filteredMessages,
    handleSearchClose,
    handleNext,
    handlePrevious
  };
}