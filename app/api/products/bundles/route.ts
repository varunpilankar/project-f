import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const bundles = await prisma.product.findMany({
      where: {
        isBundle: true,
      },
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const parsedBundles = bundles.map((bundle) => ({
      ...bundle,
      images: bundle.images ? JSON.parse(bundle.images) : [],
    }));

    return NextResponse.json({ bundles: parsedBundles });
  } catch (error) {
    console.error('Error fetching bundles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
