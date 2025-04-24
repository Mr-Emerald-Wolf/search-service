import Link from "next/link"
import { MainNav } from "./main-nav"
import { ModeToggle } from "./mode-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background px-8">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex-none">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">ATS System</span>
          </Link>
        </div>
        
        <div className="flex-1 flex justify-center">
          <MainNav />
        </div>
        
        <div className="flex-none">
          <nav className="flex items-center">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
