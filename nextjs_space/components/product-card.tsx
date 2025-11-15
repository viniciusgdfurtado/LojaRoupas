
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link href={`/produtos/${product.id}`}>
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:shadow-2xl">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Eye className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.featured && (
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
                  Destaque
                </Badge>
              )}
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
            </div>

            {/* Quick View Button */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                <Eye className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {product.sizes?.length > 0 && (
                    <div className="flex gap-1">
                      {product.sizes.slice(0, 3).map((size) => (
                        <span key={size} className="text-xs bg-muted px-2 py-1 rounded">
                          {size}
                        </span>
                      ))}
                      {product.sizes.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{product.sizes.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {product.colors?.length > 0 && (
                <div className="flex items-center gap-1 pt-2">
                  <span className="text-xs text-muted-foreground">Cores:</span>
                  <div className="flex gap-1">
                    {product.colors.slice(0, 4).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
