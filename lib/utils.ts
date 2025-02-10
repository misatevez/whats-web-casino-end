import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from "firebase/firestore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(
  timestamp: Timestamp | Date | string | number | { seconds: number; nanoseconds: number },
): string {
  let date: Date

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate()
  } else if (timestamp instanceof Date) {
    date = timestamp
  } else if (typeof timestamp === "string" || typeof timestamp === "number") {
    date = new Date(timestamp)
  } else if (typeof timestamp === "object" && "seconds" in timestamp && "nanoseconds" in timestamp) {
    date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
  } else {
    console.error("Invalid timestamp format:", timestamp)
    return "Invalid date"
  }

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

