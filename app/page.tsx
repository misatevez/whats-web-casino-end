"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createOrGetChat } from "@/lib/data";
import { getStoredPhoneNumber, setStoredPhoneNumber, setStoredChatId } from "@/lib/storage/local-storage";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    confirmationResult: any;
  }
}

export default function Home() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    // Check if user already has a session
    const storedPhoneNumber = getStoredPhoneNumber();
    if (storedPhoneNumber) {
      router.push("/chat");
    } else {
      setIsInitializing(false);
    }

    // Cleanup reCAPTCHA on unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, [router]);

  const setupRecaptcha = async () => {
    try {
      // Clear existing reCAPTCHA if any
      if (window.recaptchaVerifier) {
        await window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }

      // Create new reCAPTCHA verifier
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
        size: 'invisible',
        callback: () => {
          console.log('✅ reCAPTCHA verificado');
        },
        'expired-callback': () => {
          console.log('❌ reCAPTCHA expirado');
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = undefined;
          }
          toast.error('Verificación expirada, intente nuevamente');
          setLoading(false);
        }
      });

      await window.recaptchaVerifier.render();
    } catch (error) {
      console.error('❌ Error configurando reCAPTCHA:', error);
      toast.error('Error al configurar la verificación');
      throw error;
    }
  };

  const formatPhoneNumber = (number: string) => {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    // Add Argentina country code if not present
    return cleaned.startsWith('54') ? `+${cleaned}` : `+54${cleaned}`;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!phoneNumber.trim()) {
      setError("Por favor, ingrese su número de teléfono");
      return;
    }
    
    try {
      setLoading(true);
      await setupRecaptcha();
      
      if (!window.recaptchaVerifier) {
        throw new Error('Error al inicializar la verificación');
      }

      const formattedNumber = formatPhoneNumber(phoneNumber);
      console.log('🔵 Enviando código a:', formattedNumber);
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedNumber, 
        window.recaptchaVerifier
      );
      
      window.confirmationResult = confirmationResult;
      setShowOTP(true);
      toast.success('Código enviado exitosamente');
    } catch (error: any) {
      console.error('❌ Error enviando código:', error);
      setError(error.message || 'Error al enviar el código');
      toast.error('Error al enviar el código');
      
      // Reset reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!verificationCode.trim()) {
      setError("Por favor, ingrese el código de verificación");
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔵 Verificando código');
      
      if (!window.confirmationResult) {
        throw new Error('No se encontró el resultado de confirmación');
      }

      const result = await window.confirmationResult.confirm(verificationCode);
      console.log('✅ Usuario autenticado:', result.user);
      
      // Create or get chat
      const formattedNumber = formatPhoneNumber(phoneNumber);
      const chat = await createOrGetChat(formattedNumber);
      
      // Save info in localStorage
      setStoredPhoneNumber(formattedNumber);
      setStoredChatId(chat.id);
      
      // Redirect to chat
      router.push("/chat");
    } catch (error: any) {
      console.error('❌ Error verificando código:', error);
      setError(error.message || 'Código inválido');
      toast.error('Código inválido');
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

        {!showOTP ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError("");
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
              id="sign-in-button"
              type="submit"
              className="w-full bg-[#00a884] hover:bg-[#02906f] text-white h-12 font-normal text-lg"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar código"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  setError("");
                }}
                placeholder="Ingresa el código de verificación"
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
              {loading ? "Verificando..." : "Verificar código"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-[#00a884] hover:text-[#02906f] h-12"
              onClick={() => {
                setShowOTP(false);
                setVerificationCode("");
                setError("");
                if (window.recaptchaVerifier) {
                  window.recaptchaVerifier.clear();
                  window.recaptchaVerifier = undefined;
                }
              }}
              disabled={loading}
            >
              Cambiar número
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}