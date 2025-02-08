export function AdminChatLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#111b21]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#e9edef]">Cargando conversaciones...</p>
        <p className="text-[#8696a0] text-sm mt-2">Esto puede tomar unos segundos</p>
      </div>
    </div>
  );
}