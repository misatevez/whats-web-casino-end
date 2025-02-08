"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createOrGetChat } from "@/lib/data";

export default function Home() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 Iniciando proceso de ingreso con número:', phoneNumber);
    
    if (phoneNumber.trim()) {
      setLoading(true);
      try {
        console.log('🔵 Intentando crear/obtener chat...');
        // Crear o obtener el chat
        const chat = await createOrGetChat(phoneNumber);
        console.log('✅ Chat creado/obtenido:', chat);
        
        console.log('🔵 Redirigiendo a /chat...');
        // Redirigir al chat
        router.push("/chat");
      } catch (error) {
        console.error('❌ Error en el proceso de ingreso:', error);
        alert('Error al crear el chat. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#202c33] rounded-lg p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            width={80}
            height={80}
            priority
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+54 9 11 1234 5678"
            className="bg-[#2a3942] border-none text-[#e9edef] placeholder:text-[#8696a0] h-12 text-center"
            disabled={loading}
          />

          <Button
            type="submit"
            className="w-full bg-[#00a884] hover:bg-[#02906f] text-white h-12 font-normal text-lg"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  );
}