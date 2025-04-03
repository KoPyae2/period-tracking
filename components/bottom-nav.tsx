"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, ClipboardList, Baby, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

export function BottomNav() {
  const pathname = usePathname()
  
  const navItems: NavItem[] = [
    {
      name: "Period",
      href: "/dashboard",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      name: "Symptoms",
      href: "/dashboard/symptoms",
      icon: <ClipboardList className="w-6 h-6" />,
    },
    {
      name: "Pregnancy",
      href: "/dashboard/pregnancy",
      icon: <Baby className="w-6 h-6" />,
    },
    {
      name: "Insights",
      href: "/dashboard/insights",
      icon: <BookOpen className="w-6 h-6" />,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = 
            (item.href === "/dashboard" && pathname === "/dashboard") ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href))
            
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "mb-1",
                isActive && "text-primary"
              )}>
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.name}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
} 