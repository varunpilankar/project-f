import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.product.create({
    data: {
      title: "Organic Cotton Onesie", slug: "organic-cotton-onesie", description: "Soft onesie", category: "CLOTHES", ageBracket: "M_0_6", gender: "UNISEX", price: 15.99, images: "[]",
      variants: { create: [{ size: "0-3M", sku: "ONESIE-0-3M", stockQuantity: 50 }] }
    }
  })
}
main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect() })
