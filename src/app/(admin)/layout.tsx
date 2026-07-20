import Sidebar from "@/components/layout/sidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0B0B0B] text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
