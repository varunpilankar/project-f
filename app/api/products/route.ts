import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let ageBracket = searchParams.get('ageBracket'); // e.g., M_0_6 or 0_6M
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const isBundle = searchParams.get('isBundle');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort'); // price_asc, price_desc, newest

    let where: Prisma.ProductWhereInput = {};

    if (ageBracket) {
      // Map 0_6M to M_0_6 for database query
      if (ageBracket === '0_6M') ageBracket = 'M_0_6';
      else if (ageBracket === '6_12M') ageBracket = 'M_6_12';
      else if (ageBracket === '1_2Y') ageBracket = 'Y_1_2';
      else if (ageBracket === '3_5Y') ageBracket = 'Y_3_5';
      
      where.ageBracket = ageBracket;
    }
    
    if (category) {
      where.category = category;
    }

    if (gender) {
      where.gender = gender;
    }

    if (isBundle !== null) {
      where.isBundle = isBundle === 'true';
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } }
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        variants: true,
      }
    });

    // Parse images since they are stored as JSON strings in SQLite
    const parsedProducts = products.map((product) => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    }));

    return NextResponse.json({ products: parsedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
