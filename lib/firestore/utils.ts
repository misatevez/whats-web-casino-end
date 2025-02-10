import { Timestamp } from "firebase/firestore"

export function formatTimestamp(
  timestamp?:
    | Timestamp
    | Date
    | string
    | number
    | { seconds: number; nanoseconds: number }
    | null
): string {
  if (!timestamp) return "Invalid Date"

  // Detectamos string tipo "HH:MM:SS"
  if (typeof timestamp === "string" && /^\d{1,2}:\d{2}:\d{2}$/.test(timestamp)) {
    console.log("[formatTimestamp] time-only string detected:", timestamp)
    const [hh, mm, ss] = timestamp.split(":").map(Number)
    const now = new Date()
    now.setHours(hh, mm, ss, 0)
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Firestore Timestamp
  if (timestamp instanceof Timestamp) {
    const date = timestamp.toDate()
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Objeto {seconds, nanoseconds}
  if (
    typeof timestamp === "object" &&
    "seconds" in timestamp &&
    "nanoseconds" in timestamp
  ) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Date nativo de JS
  if (timestamp instanceof Date) {
    return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // String ISO o number parseable
  if (typeof timestamp === "string" || typeof timestamp === "number") {
    const date = new Date(timestamp)
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  }

  // Si no coincide con nada anterior
  return "Invalid Date"
}

