"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MainNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center">
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
      <div className="hidden md:flex items-center justify-center gap-6">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "px-2 py-1 text-lg font-medium rounded-md hover:bg-accent",
                pathname === "/" ? "bg-accent" : ""
              )}
            >
              Home
            </Link>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold px-2">Candidates</h3>
              <Link
                href="/candidates/search"
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-1 rounded-md hover:bg-accent",
                  pathname === "/candidates/search" ? "bg-accent" : ""
                )}
              >
                Search
              </Link>
              <Link
                href="/candidates/add"
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-1 rounded-md hover:bg-accent",
                  pathname === "/candidates/add" ? "bg-accent" : ""
                )}
              >
                Add New
              </Link>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold px-2">Jobs</h3>
              <Link
                href="/jobs/search"
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-1 rounded-md hover:bg-accent",
                  pathname === "/jobs/search" ? "bg-accent" : ""
                )}
              >
                Search
              </Link>
              <Link
                href="/jobs/add"
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-1 rounded-md hover:bg-accent",
                  pathname === "/jobs/add" ? "bg-accent" : ""
                )}
              >
                Add New
              </Link>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold px-2">Applications</h3>
              <Link
                href="/applications/add"
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-1 rounded-md hover:bg-accent",
                  pathname === "/applications/add" ? "bg-accent" : ""
                )}
              >
                Add New
              </Link>
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold px-2">Tools</h3>
              <Link
                href="/migration"
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-1 rounded-md hover:bg-accent",
                  pathname === "/migration" ? "bg-accent" : ""
                )}
              >
                Migration
              </Link>
              <Link
                href="/queue-monitor"
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-1 rounded-md hover:bg-accent",
                  pathname === "/queue-monitor" ? "bg-accent" : ""
                )}
              >
                Queue Monitor
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/" ? "text-primary" : "text-muted-foreground"
          )}
        >
          Home
        </Link>
        
        <NavDropdown 
          title="Candidates" 
          items={[
            { href: "/candidates/search", label: "Search Candidate"},
            { href: "/candidates/add", label: "Add New Candidate"}
          ]} 
          pathname={pathname}
        />
        
        <NavDropdown 
          title="Jobs" 
          items={[
            { href: "/jobs/search", label: "Search Jobs" },
            { href: "/jobs/add", label: "Add New Jobs" }
          ]} 
          pathname={pathname}
        />
        
        <NavDropdown 
          title="Applications" 
          items={[
            { href: "/applications/add", label: "Add New Application" }
          ]} 
          pathname={pathname}
        />
        
        <NavDropdown 
          title="Tools" 
          items={[
            { href: "/migration", label: "Migration MySQL"  },
            { href: "/queue-monitor", label: "Queue Monitor SQS"}
          ]} 
          pathname={pathname}
        />
      </div>
    </div>
  )
}

interface NavDropdownProps {
  title: string;
  items: {
    href: string;
    label: string;
  }[];
  pathname: string;
}

function NavDropdown({ title, items, pathname }: NavDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-4 py-2">
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px]">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className={cn(
                "flex flex-col w-full p-3 cursor-pointer",
                pathname === item.href ? "bg-accent" : ""
              )}
            >
              <span className="font-medium">{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
