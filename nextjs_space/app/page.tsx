
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleHeader } from "@/components/simple-header";
import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/db";
import { 
  ShoppingBag, 
  Star, 
  Truck, 
  Shield, 
  ArrowRight,
  Sparkles,
  TrendingUp
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { 
        active: true,
        featured: true 
      },
      take: 6,
      orderBy: { createdAt: "desc" }
    });
    return products;
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    return [];
  }
}

async function getLatestProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      take: 8,
      orderBy: { createdAt: "desc" }
    });
    return products;
  } catch (error) {
    console.error("Erro ao buscar produtos recentes:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, latestProducts] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts()
  ]);

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Nova Coleção Disponível
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Descubra o seu
                <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  estilo único
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore nossa coleção cuidadosamente curada de roupas elegantes e modernas para todas as ocasiões
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produtos">
                <Button size="lg" className="px-8 py-6 text-lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Ver Produtos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/produtos?featured=true">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                  <Star className="mr-2 h-5 w-5" />
                  Destaques
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Entrega Rápida</h3>
                <p className="text-muted-foreground">
                  Entregamos seus produtos com agilidade e segurança
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Qualidade Garantida</h3>
                <p className="text-muted-foreground">
                  Produtos selecionados com os melhores materiais
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Atendimento Premium</h3>
                <p className="text-muted-foreground">
                  Suporte dedicado para uma experiência excepcional
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center space-y-4 mb-12">
              <Badge variant="outline" className="px-4 py-2">
                <Star className="mr-2 h-4 w-4" />
                Produtos em Destaque
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Coleção <span className="text-primary">Premium</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Selecionamos especialmente para você as peças mais desejadas da nossa coleção
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/produtos?featured=true">
                <Button variant="outline" size="lg">
                  Ver Todos os Destaques
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      {latestProducts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center space-y-4 mb-12">
              <Badge variant="outline" className="px-4 py-2">
                <TrendingUp className="mr-2 h-4 w-4" />
                Últimos Lançamentos
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Novidades da <span className="text-primary">Temporada</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fique por dentro das últimas tendências com nossos lançamentos mais recentes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/produtos">
                <Button size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Ver Todos os Produtos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <div className="space-y-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto para renovar seu guarda-roupa?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Descubra peças únicas que combinam com sua personalidade
            </p>
            <Link href="/produtos">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explorar Coleção
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Moda Virtuosa</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 GF Tech. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <Link href="/produtos" className="text-sm text-muted-foreground hover:text-primary">
                Produtos
              </Link>
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                Início
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
