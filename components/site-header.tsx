"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" })
      toast.success("Signed out successfully")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }

  if (!isMounted) {
    return null // Prevent hydration errors
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      isScrolled && "shadow-sm"
    )}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Cycly Logo" width={36} height={36} className="w-9 h-9" />
            <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-purple-500 text-transparent bg-clip-text hidden sm:inline-block">
              Cycly
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {status !== "loading" && (
            <>
              {session?.user ? (
                <>
                  <Link
                    href="/app-dashboard"
                    className={cn(
                      "text-sm font-medium transition-colors", 
                      pathname === "/app-dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className={cn(
                      "text-sm font-medium transition-colors", 
                      pathname === "/profile" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Profile
                  </Link>
                  <Button variant="outline" onClick={handleSignOut} size="sm">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link 
                    href="#features" 
                    className="text-sm font-medium transition-colors hover:text-foreground text-foreground/70"
                  >
                    Features
                  </Link>
                  <Link 
                    href="#how-it-works" 
                    className="text-sm font-medium transition-colors hover:text-foreground text-foreground/70"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/"
                    className={cn(
                      "text-sm font-medium transition-colors", 
                      pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Home
                  </Link>
                  <Button asChild size="sm">
                    <Link href="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>
        
        {/* Mobile Navigation Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <nav className="flex flex-col p-4">
            {status !== "loading" && (
              <>
                {session?.user ? (
                  <>
                    <Link
                      href="/app-dashboard"
                      className={cn(
                        "py-3 px-2 text-base font-medium border-b border-muted", 
                        pathname === "/app-dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className={cn(
                        "py-3 px-2 text-base font-medium border-b border-muted", 
                        pathname === "/profile" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }} 
                      className="mt-4 w-full"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="#features" 
                      className="py-3 px-2 text-base font-medium border-b border-muted hover:text-foreground text-foreground/70"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link 
                      href="#how-it-works" 
                      className="py-3 px-2 text-base font-medium border-b border-muted hover:text-foreground text-foreground/70"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      How It Works
                    </Link>
                    <Link
                      href="/"
                      className={cn(
                        "py-3 px-2 text-base font-medium border-b border-muted", 
                        pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                    <Button 
                      asChild 
                      className="mt-4 w-full"
                    >
                      <Link 
                        href="/auth"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
} 