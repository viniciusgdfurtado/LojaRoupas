
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "./image-upload";
import { Product } from "@/lib/types";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface ProductFormProps {
  product?: Product;
}

const categories = [
  "Camisetas",
  "Calças",
  "Vestidos",
  "Jaquetas",
  "Acessórios",
  "Calçados",
  "Underwear",
  "Esportivo"
];

const sizes = ["PP", "P", "M", "G", "GG", "XG"];
const colors = ["Branco", "Preto", "Azul", "Vermelho", "Verde", "Amarelo", "Rosa", "Cinza"];

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price?.toString() || "",
    description: product?.description || "",
    category: product?.category || "",
    featured: product?.featured || false,
    active: product?.active ?? true
  });

  const [images, setImages] = useState<string[]>(product?.images || []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(product?.sizes || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(product?.colors || []);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (isNaN(parseFloat(formData.price))) {
      toast.error("Preço deve ser um número válido");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        images,
        sizes: selectedSizes,
        colors: selectedColors,
      };

      const url = isEditing ? `/api/products/${product?.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success(`Produto ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
        router.push("/admin");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao salvar produto");
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Erro inesperado ao salvar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao painel
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Atualize as informações do produto" : "Adicione um novo produto à sua loja"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Digite o nome do produto"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Descreva as características do produto"
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Imagens do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload images={images} onImagesChange={setImages} />
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Variações do Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sizes */}
                <div className="space-y-3">
                  <Label>Tamanhos Disponíveis</Label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <Button
                        key={size}
                        type="button"
                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                        onClick={() => toggleSize(size)}
                        className="h-8 px-3"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  {selectedSizes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedSizes.map(size => (
                        <Badge key={size} variant="secondary">
                          {size}
                          <X 
                            className="ml-1 h-3 w-3 cursor-pointer" 
                            onClick={() => toggleSize(size)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div className="space-y-3">
                  <Label>Cores Disponíveis</Label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <Button
                        key={color}
                        type="button"
                        variant={selectedColors.includes(color) ? "default" : "outline"}
                        onClick={() => toggleColor(color)}
                        className="h-8 px-3"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                  {selectedColors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedColors.map(color => (
                        <Badge key={color} variant="secondary">
                          {color}
                          <X 
                            className="ml-1 h-3 w-3 cursor-pointer" 
                            onClick={() => toggleColor(color)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured">Produto em Destaque</Label>
                    <p className="text-sm text-muted-foreground">
                      Aparecerá na seção de destaques
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={formData.featured ? "default" : "outline"}
                    onClick={() => handleInputChange("featured", !formData.featured)}
                    className="h-8 px-3"
                  >
                    {formData.featured ? "Sim" : "Não"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="active">Produto Ativo</Label>
                    <p className="text-sm text-muted-foreground">
                      Visível na loja para clientes
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={formData.active ? "default" : "outline"}
                    onClick={() => handleInputChange("active", !formData.active)}
                    className="h-8 px-3"
                  >
                    {formData.active ? "Sim" : "Não"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? "Atualizar Produto" : "Criar Produto"}
                      </>
                    )}
                  </Button>
                  
                  <Link href="/admin">
                    <Button type="button" variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
