
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminProductList } from "./admin-product-list";
import { Product } from "@/lib/types";
import { 
  Package, 
  Plus, 
  TrendingUp, 
  Star, 
  ShoppingBag,
  BarChart3
} from "lucide-react";

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    categories: 0,
    active: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        
        // Calculate stats
        const categories = new Set(data.map((p: Product) => p.category)).size;
        const featured = data.filter((p: Product) => p.featured).length;
        const active = data.filter((p: Product) => p.active).length;
        
        setStats({
          total: data.length,
          featured,
          categories,
          active
        });
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = () => {
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Painel <span className="text-primary">Administrativo</span>
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus produtos e visualize estatísticas da loja
          </p>
        </div>
        
        <Link href="/admin/produtos/novo">
          <Button size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Produtos
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                produtos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Produtos Ativos
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                visíveis na loja
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Destaque
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.featured}</div>
              <p className="text-xs text-muted-foreground">
                produtos destacados
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categorias
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
              <p className="text-xs text-muted-foreground">
                categorias ativas
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product List */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl">Gerenciar Produtos</CardTitle>
            <Badge variant="secondary">
              {products.length} produto(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <AdminProductList 
            products={products} 
            onUpdate={handleProductUpdate}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
