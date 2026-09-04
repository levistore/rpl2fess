import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInboxMessages } from "@/lib/queries/messages";
import {
  DashboardSidebar,
  MobileDashboardHeader,
  MobileBottomNav,
} from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  const { unreadCount } = await getInboxMessages();

  return (
    <div className="min-h-screen bg-[#F6F3EA] flex flex-col lg:flex-row text-[#111111]">
      {/* Desktop Sidebar */}
      <DashboardSidebar unreadCount={unreadCount} />

      {/* Mobile Top Header */}
      <MobileDashboardHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-12 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav unreadCount={unreadCount} />
    </div>
  );
}
