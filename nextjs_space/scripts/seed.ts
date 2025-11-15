
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Camiseta Básica Premium",
    price: 89.90,
    description: "Camiseta de algodão 100% orgânico, corte moderno e confortável para o dia a dia. Disponível em várias cores.",
    category: "Camisetas",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=600&fit=crop&crop=center"
    ],
    sizes: ["P", "M", "G", "GG"],
    colors: ["Branco", "Preto", "Cinza"],
    featured: true,
    active: true
  },
  {
    name: "Calça Jeans Slim",
    price: 199.90,
    description: "Calça jeans de corte slim, confeccionada com denim de alta qualidade. Perfeita para looks casuais e sociais.",
    category: "Calças",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500&h=600&fit=crop&crop=center"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: ["Azul", "Preto"],
    featured: true,
    active: true
  },
  {
    name: "Vestido Floral Elegante",
    price: 149.90,
    description: "Vestido midi com estampa floral delicada, ideal para ocasiões especiais e encontros casuais.",
    category: "Vestidos",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop&crop=center",
      "https://img4.dhresource.com/webp/m/0x0/f3/albu/jc/m/24/6ab1f87a-f15d-4bf3-8d1a-df8bf5c66592.jpg"
    ],
    sizes: ["PP", "P", "M", "G"],
    colors: ["Rosa", "Azul", "Verde"],
    featured: false,
    active: true
  },
  {
    name: "Jaqueta de Couro Sintético",
    price: 299.90,
    description: "Jaqueta de couro sintético de alta qualidade, design moderno e versátil para compor looks urbanos.",
    category: "Jaquetas",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop&crop=center"
    ],
    sizes: ["P", "M", "G"],
    colors: ["Preto", "Marrom"],
    featured: true,
    active: true
  },
  {
    name: "Tênis Esportivo Comfort",
    price: 249.90,
    description: "Tênis esportivo com tecnologia de amortecimento, ideal para atividades físicas e uso casual.",
    category: "Calçados",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&h=600&fit=crop&crop=center"
    ],
    sizes: ["36", "37", "38", "39", "40", "41", "42"],
    colors: ["Branco", "Preto", "Cinza"],
    featured: false,
    active: true
  },
  {
    name: "Bolsa de Couro Premium",
    price: 189.90,
    description: "Bolsa de couro legítimo com design atemporal, compartimentos organizados e alças resistentes.",
    category: "Acessórios",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=600&fit=crop&crop=center"
    ],
    sizes: ["Único"],
    colors: ["Marrom", "Preto", "Bege"],
    featured: false,
    active: true
  },
  {
    name: "Conjunto Esportivo Feminino",
    price: 129.90,
    description: "Conjunto esportivo feminino de alta performance, tecido respirável e design moderno para treinos.",
    category: "Esportivo",
    images: [
      "https://m.media-amazon.com/images/I/61TVngSwOfL._AC_UY350_.jpg",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=600&fit=crop&crop=center"
    ],
    sizes: ["PP", "P", "M", "G"],
    colors: ["Rosa", "Preto", "Azul"],
    featured: true,
    active: true
  },
  {
    name: "Camisa Social Slim",
    price: 119.90,
    description: "Camisa social de corte slim, tecido de algodão premium, ideal para ambiente corporativo e eventos.",
    category: "Camisetas",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=600&fit=crop&crop=center"
    ],
    sizes: ["P", "M", "G", "GG"],
    colors: ["Branco", "Azul", "Rosa"],
    featured: false,
    active: true
  }
];

const categories = [
  { name: "Camisetas", description: "Camisetas e camisas para todos os estilos" },
  { name: "Calças", description: "Calças jeans, sociais e casuais" },
  { name: "Vestidos", description: "Vestidos elegantes para todas as ocasiões" },
  { name: "Jaquetas", description: "Jaquetas e casacos modernos" },
  { name: "Calçados", description: "Sapatos, tênis e sandálias" },
  { name: "Acessórios", description: "Bolsas, cintos e acessórios" },
  { name: "Esportivo", description: "Roupas para atividades físicas" },
  { name: "Underwear", description: "Roupas íntimas e lingerie" }
];

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar admin user
  const adminEmail = "admin@loja.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Administrador",
        role: "admin"
      }
    });
    console.log("✅ Usuário administrador criado");
  }

  // Criar usuário de teste obrigatório
  const testEmail = "john@doe.com";
  const existingTest = await prisma.user.findUnique({
    where: { email: testEmail }
  });

  if (!existingTest) {
    const hashedPassword = await bcrypt.hash("johndoe123", 12);
    await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: "John Doe",
        role: "admin"
      }
    });
    console.log("✅ Usuário de teste criado");
  }

  // Criar categorias
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }
  console.log("✅ Categorias criadas");

  // Criar produtos
  for (const product of sampleProducts) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    });
    
    if (!existingProduct) {
      await prisma.product.create({
        data: product
      });
    }
  }
  console.log("✅ Produtos criados");

  console.log("🎉 Seed concluído com sucesso!");
  console.log(`📧 Admin: ${adminEmail} / admin123`);
  console.log(`📧 Teste: ${testEmail} / johndoe123`);
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
