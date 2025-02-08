"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#111b21] flex flex-col">
      {/* Header */}
      <header className="bg-[#202c33] py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp Logo"
              width={40}
              height={40}
            />
            <span className="text-white text-2xl font-semibold">WhatsApp Admin</span>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#202c33] rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-[#aebac1]">Username</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aebac1]">
                    <User className="w-5 h-5" />
                  </div>
                  <Input
                    type="text"
                    className="pl-10 bg-[#2a3942] border-none text-[#d1d7db] placeholder:text-[#8696a0]"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#aebac1]">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aebac1]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type="password"
                    className="pl-10 bg-[#2a3942] border-none text-[#d1d7db] placeholder:text-[#8696a0]"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00a884] hover:bg-[#02906f] text-white py-6"
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}