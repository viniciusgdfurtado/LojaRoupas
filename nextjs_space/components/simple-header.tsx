
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, User } from "lucide-react";

export function SimpleHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Moda Virtuosa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Início
            </Link>
            <Link 
              href="/produtos" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Produtos
            </Link>
          </nav>

          {/* Login Button */}
          <div className="flex items-center space-x-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
