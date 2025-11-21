"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GraduationCap, BookOpen, Users, User, Info, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavigationProps {
  user: {
    nickname: string
    userType: "student" | "teacher" | "passed out"
  }
  onLogout: () => void
}

const navigationItems = [
  { href: "/", label: "Home", icon: GraduationCap },
  { href: "/materials", label: "Study Materials", icon: BookOpen },
  { href: "/community", label: "Community", icon: Users },
  { href: "/about", label: "About", icon: Info },
  { href: "/profile", label: "Profile", icon: User },
]

export function Navigation({ user, onLogout }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => mobile && setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive ? "bg-cyan-600 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
              mobile && "w-full",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </>
  )

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-6">
            <div className="p-3 bg-cyan-50 rounded-lg">
              <GraduationCap className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-slate-900">CampusConnect</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Suryodaya College Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <NavItems />
          </nav>

          {/* User Info & Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-slate-600">
                Welcome, <span className="font-bold text-slate-900">{user.nickname}</span>
              </span>
              {(user.userType === "teacher" || user.userType === "passed out") && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                  {user.userType === "teacher" ? "Teacher" : "Alumni"}
                </span>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={onLogout} className="hidden sm:flex bg-transparent">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden bg-transparent">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4">
                  <div className="border-b pb-4">
                    <p className="font-bold text-slate-900">{user.nickname}</p>
                    <p className="text-sm text-slate-600">
                      {user.userType === "teacher"
                        ? "Teacher Account"
                        : user.userType === "passed out"
                          ? "Alumni Account"
                          : "Student Account"}
                    </p>
                  </div>

                  <nav className="flex flex-col gap-2">
                    <NavItems mobile />
                  </nav>

                  <div className="border-t pt-4">
                    <Button variant="outline" onClick={onLogout} className="w-full bg-transparent">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
