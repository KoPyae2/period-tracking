import { auth } from "@/auth"; // Import the new `auth()` function from next-auth 15 beta
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const session = await auth(); // Get session using next-auth 15 beta

  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect("/app-dashboard");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        {children}
      </div>
    </div>
  );
}
