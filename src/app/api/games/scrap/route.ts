import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { z } from 'zod';
import { prisma } from '@/db';

interface Game {
  name: string;
  year: number;
  score: number;
}

export async function POST(request: Request) {
  const res = await request.json();
  const bodySchema = z.object({
    page: z.number().min(1).max(54),
  });

  try {
    const { page } = bodySchema.parse(res);
    const games: Game[] = [];

    for (let i = 14; i < 15; i++) {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(0);
      await page.goto(`https://www.metacritic.com/browse/games/score/metascore/all/pc/filtered?sort=desc&page=${i}`);

      // scrap the data
      const pageData = await page.$$eval('.clamp-summary-wrap', elements =>
        elements.map((e: any) => ({
          name: e.querySelector('a > h3').innerText,
          year: new Date(e.querySelector('.clamp-details > span').innerText).getFullYear(),
          score: parseInt(e.querySelector('.metascore_w').innerText),
        }))
      );

      games.push(...pageData);
      console.log('Scrapped Data for Page #', i + 1);
      await browser.close();
    }

    // saving data to db
    for (let game of games) {
      await prisma.game.upsert({
        where: {
          name: game.name,
        },
        update: {},
        create: game,
      });
    }

    return NextResponse.json({ message: 'Latest Data Scrapped Successfully!' });
  } catch (error) {
    return NextResponse.json(
      { error },
      {
        status: 400,
      }
    );
  }
}
