"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/chat?phone=${encodeURIComponent(phoneNumber)}`)
  }

  return (
    <div className="min-h-screen bg-[#111b21] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#202c33] rounded-2xl p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp Logo"
            width={80}
            height={80}
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="tel"
            placeholder="Número de WhatsApp"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full h-12 bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0]"
          />
          <Button type="submit" className="w-full h-12 bg-[#00a884] hover:bg-[#02906f] text-white font-semibold">
            Ir al chat
          </Button>
        </form>
      </div>
    </div>
  )
}

