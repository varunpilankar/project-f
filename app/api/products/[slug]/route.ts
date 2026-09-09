import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Parse images from JSON string (SQLite limitation workaround)
    const parsedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
    };

    return NextResponse.json({ product: parsedProduct });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
