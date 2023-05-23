import { NextResponse } from 'next/server';
import { prisma } from '@/db';

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: { name: string };
  }
) {
  try {
    await prisma.game.update({
      where: {
        name: params.name,
      },
      data: {
        isDeleted: false,
      },
    });
    return NextResponse.json({ message: 'Game Recovered' });
  } catch (error) {
    return NextResponse.json(
      { error },
      {
        status: 400,
      }
    );
  }
}
