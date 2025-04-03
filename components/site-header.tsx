"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" })
      toast.success("Signed out successfully")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xs ">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Period Tracker</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          {status !== "loading" && (
            <>
              {session?.user ? (
                <>
                  <Link
                    href="/app-dashboard"
                    className={`text-sm font-medium ${
                      pathname === "/app-dashboard"
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className={`text-sm font-medium ${
                      pathname === "/profile"
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Profile
                  </Link>
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className={`text-sm font-medium ${
                      pathname === "/"
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Home
                  </Link>
                  <Button asChild>
                    <Link href="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
} 