import { auth } from "@/auth"; // Import the new `auth()` function from next-auth 15 beta
import { DashboardNav } from "@/components/dashboard-nav";
import { SiteHeader } from "@/components/site-header";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await auth(); // Get session using next-auth 15 beta

  // Redirect authenticated users to dashboard
  if (!session?.user) {
    redirect("/auth");
  }
  return (
      <div className="container mx-auto">
        <SiteHeader />
        <div className="mx-auto px-4 md:px-0">
          <DashboardNav />
          {children}
        </div>
      </div>
  );
}