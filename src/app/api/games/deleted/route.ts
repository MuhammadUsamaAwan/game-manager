import { NextResponse } from 'next/server';
import { prisma } from '@/db';

export async function GET(request: Request) {
  const games = await prisma.game.findMany({
    select: {
      name: true,
      year: true,
      score: true,
      status: true,
    },
    where: {
      isDeleted: true,
    },
    orderBy: {
      score: 'desc',
    },
  });
  return NextResponse.json(games);
}
