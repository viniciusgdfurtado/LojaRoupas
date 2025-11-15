
import { LoginForm } from "./_components/login-form";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Moda Virtuosa</span>
          </Link>
          <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground mt-2">
            Entre com suas credenciais para acessar a área administrativa
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
