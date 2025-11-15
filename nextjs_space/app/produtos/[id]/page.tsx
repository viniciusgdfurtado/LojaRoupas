
import { notFound } from "next/navigation";
import { SimpleHeader } from "@/components/simple-header";
import { ProductDetails } from "./_components/product-details";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    return product;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return null;
  }
}

async function getSimilarProducts(categoryy: string, currentId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { 
        active: true,
        category: categoryy,
        id: { not: currentId }
      },
      take: 4,
      orderBy: { createdAt: "desc" }
    });
    return products;
  } catch (error) {
    console.error("Erro ao buscar produtos similares:", error);
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(product.category, product.id);

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <ProductDetails product={product} similarProducts={similarProducts} />
    </div>
  );
}
