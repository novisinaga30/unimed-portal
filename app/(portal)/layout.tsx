import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <Sidebar />

      <div className="flex-1">
        <Topbar />
        {children}
      </div>
    </main>
  );
}