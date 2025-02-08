"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createOrGetChat } from "@/lib/data";
import { getStoredPhoneNumber, setStoredPhoneNumber, setStoredChatId } from "@/lib/storage/local-storage";

export default function Home() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user already has a session
    const storedPhoneNumber = getStoredPhoneNumber();
    if (storedPhoneNumber) {
      router.push("/chat");
    } else {
      setIsInitializing(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!phoneNumber.trim()) {
      setError("Por favor, ingrese su número de teléfono");
      return;
    }
    
    console.log('🔵 Iniciando proceso de ingreso con número:', phoneNumber);
    
    setLoading(true);
    try {
      console.log('🔵 Intentando crear/obtener chat...');
      // Crear o obtener el chat
      const chat = await createOrGetChat(phoneNumber);
      console.log('✅ Chat creado/obtenido:', chat);
      
      // Guardar información en localStorage
      setStoredPhoneNumber(phoneNumber);
      setStoredChatId(chat.id);
      
      console.log('🔵 Redirigiendo a /chat...');
      // Redirigir al chat
      router.push("/chat");
    } catch (error) {
      console.error('❌ Error en el proceso de ingreso:', error);
      setError('Error al crear el chat. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#111b21] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

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
          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    setError(""); // Clear error when user types
                  }}
                  placeholder="Ingresa tu número de WhatsApp"
                  className={`bg-[#2a3942] border-none text-[#e9edef] placeholder:text-[#8696a0] h-12 text-center ${
                    error ? "ring-2 ring-red-500" : ""
                  }`}
                  disabled={loading}
                />
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00a884] hover:bg-[#02906f] text-white h-12 font-normal text-lg"
                disabled={loading}
              >
                Continuar
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}