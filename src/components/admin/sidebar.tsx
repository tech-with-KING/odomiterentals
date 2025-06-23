"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Users, Package, BarChart3, Settings, Home, X, CreditCard, FileText } from "lucide-react"
import { useEffect } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Email Suscribers", href: "/admin/subscriber", icon: Users },
]

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()

  // Close sidebar on escape key (desktop only)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && window.innerWidth >= 1024) {
        setOpen(false)
      }
    }

    if (open && window.innerWidth >= 1024) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, setOpen])

  return (
    <>
      {/* Mobile bottom navigation bar - Always visible */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-lg">
        <nav className="px-4 py-2">
          <div className="grid grid-cols-3 gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600",
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors text-center min-h-[60px]",
                )}
              >
                <item.icon className="h-5 w-5 mb-1 shrink-0" aria-hidden="true" />
                <span className="text-xs font-medium leading-tight">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Desktop sidebar overlay (when hamburger is clicked) */}
      {open && (
        <div className="fixed inset-0 z-50 hidden lg:block">
          {/* Backdrop */}
          <div
            className={cn(
              "fixed inset-0 bg-gray-900/80 transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0",
            )}
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Desktop sidebar - Keep original vertical layout */}
      <div className={cn(
        "hidden lg:flex lg:w-72 lg:flex-col lg:shrink-0 lg:fixed lg:inset-y-0 lg:z-50 lg:transition-transform lg:duration-300",
        open ? "lg:translate-x-0" : "lg:-translate-x-full"
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <button
              type="button"
              className="lg:flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-4 w-4 text-gray-600" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          pathname === item.href
                            ? "bg-gray-50 text-blue-600"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop content spacer when sidebar is open */}
      <div className={cn(
        "hidden lg:block lg:transition-all lg:duration-300",
        open ? "lg:ml-72" : "lg:ml-0"
      )} />
    </>
  )
}