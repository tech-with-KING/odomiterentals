"use client"
import { MenuIcon, ChevronRight, Fullscreen } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { useState } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Search, Phone, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

function MobileNav() {
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const { user } = useUser()

  const moreItems = [
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Reviews", href: "/reviews" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 hover:bg-accent rounded-md transition-colors">
            <MenuIcon size={24} />
            <span className="sr-only">Open menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] flex flex-col">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          {/* Main Navigation */}
          <nav className="flex-1 mt-6">
            <div className="flex flex-col space-y-1">
              <Link
                href="/chair"
                className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Chair
              </Link>
              <Link
                href="/table"
                className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Table
              </Link>
              <div className="space-y-1">
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="flex items-center justify-between w-full px-3 py-3 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  More
                  <ChevronRight
                    size={16}
                    className={`transform transition-transform duration-200 ${isMoreOpen ? "rotate-90" : ""}`}
                  />
                </button>
                {isMoreOpen && (
                  <div className="ml-3 space-y-1 border-l-2 border-border pl-3">
                    {moreItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/catalogue"
                className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Catalogue
              </Link>
            </div>
          </nav>
          <div className="mt-auto border-t border-border pt-4">
            <div className="px-3">
              <SignedOut>
                <div className="flex flex-col space-y-3">
                  <p className="text-sm text-muted-foreground">Sign in to access your account</p>
                  <SignInButton mode="modal">
                    <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-3 p-3 rounded-md bg-accent/50">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Desktop Navigation Menu
function DesktopNav() {
  const moreItems = [
    { name: "Services", href: "/services", description: "Our professional services" },
    { name: "Gallery", href: "/gallery", description: "View our work portfolio" },
    { name: "Reviews", href: "/reviews", description: "Customer testimonials" },
    { name: "Contact", href: "/contact", description: "Get in touch with us" },
  ]

  return (
    <div className="hidden md:flex justify-centerflex-1">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/chair" passHref>
              <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                Chair
              </NavigationMenuLink>
            </Link>
              {/* More submenu */}
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/table"  passHref>
              <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                Table
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-3 p-4 md:w-[300px] md:grid-cols-2 lg:w-[400px]">
                {moreItems.map((item) => (
                  <li key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">{item.name}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/about"  passHref>
              <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <SearchBar />
    </div>
  )
}

function Header() {
  const { user } = useUser()

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
          <Image src="/logo.png" width={250} height={80} alt="Logo" />
        </Link>
      </div>
      <DesktopNav />
      
      <div className="flex items-center space-x-2">
        <div className="hidden md:block">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-primary hover:bg-accent rounded-md transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            
          </SignedIn>
          
        </div>
        <MobileNav />
      </div>
    </div>
  )
}

export default Header

function SearchBar() {
  return (
    <div className="mx-auto px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Right Section - Icons and Button */}
        <div className="flex items-center gap-3">
          {/* Contact Us Icon */}
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <Phone className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Contact us</span>
          </Button>
          {/* Search Section */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-10 bg-gray-50 border-gray-200 rounded-full h-10"
              />
            </div>
          </div>

          {/* Cart Icon */}
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full relative bg-[#bcd1e5] ">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Cart</span>
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-8">Get A Quote</Button>
        </div>
      </div>
    </div>
  )
}
