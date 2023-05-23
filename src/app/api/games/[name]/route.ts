import { NextResponse } from 'next/server';
import { prisma } from '@/db';
import { z } from 'zod';

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: { name: string };
  }
) {
  const res = await request.json();
  const bodySchema = z.object({
    status: z.string().nonempty(),
  });

  try {
    const { status } = bodySchema.parse(res);
    await prisma.game.update({
      where: {
        name: params.name,
      },
      data: {
        status,
      },
    });
    return NextResponse.json({ message: 'Game Updated' });
  } catch (error) {
    return NextResponse.json(
      { error },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
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
        isDeleted: true,
      },
    });
    return NextResponse.json({ message: 'Game Deleted' });
  } catch (error) {
    return NextResponse.json(
      { error },
      {
        status: 400,
      }
    );
  }
}
