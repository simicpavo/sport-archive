/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Browser, chromium } from 'playwright';
import { PrismaService } from 'src/prisma/prisma.service';
import { Article, MediaSource } from 'src/utils/interfaces';
import {
  _24SATA,
  FETCHING_COUNT,
  GERMANIJAK,
  GOL_HR,
  INDEX_HR,
  SN,
} from '../../utils/constants';
import { fetch24SataArticles } from './scrapers/24sata-scraper';
import { fetchGermanijakArticles } from './scrapers/germanijak-scraper';
import { fetchGolHrArticles } from './scrapers/golhr-scraper';
import { fetchIndexArticles } from './scrapers/index-scraper';
import { fetchSnArticles } from './scrapers/sn-scraper';

@Injectable()
export class MediaJobService {
  private isRunning = false;

  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    console.log('=== CRON JOB TRIGGERED ===', new Date().toISOString());

    if (this.isRunning) {
      console.log('Previous job still running, skipping this execution');
      return;
    }

    let browser: Browser | null = null;

    try {
      this.isRunning = true;
      console.log('Media job started.');

      const mediaSources = await this.prismaService.mediaSource.findMany();
      console.log(`Found ${mediaSources.length} media sources in database`);

      if (mediaSources.length === 0) {
        console.log(
          'No media sources found in database! Please add some media sources first.',
        );
        return;
      }

      console.log('Launching browser...');
      browser = await chromium.launch({ headless: true });

      for (const mediaSource of mediaSources) {
        console.log(`Fetching articles for ${mediaSource.name}`);
        try {
          await this.fetchArticles(mediaSource, browser);
          console.log('Finished fetching articles for: ', mediaSource.name);
        } catch (error) {
          console.error(
            `Error fetching articles for ${mediaSource.name}:`,
            error,
          );
        }
      }

      console.log('Media job finished.');
    } catch (error) {
      console.error('Error in cron job:', error);
    } finally {
      if (browser) {
        try {
          await browser.close();
          console.log('Browser closed successfully');
        } catch (error) {
          console.error('Error closing browser:', error);
        }
      }
      this.isRunning = false;
    }
  }

  async fetchArticles(mediaSource: MediaSource, browser: Browser) {
    console.log('Fetching articles for: ', mediaSource.name);

    let page;
    try {
      page = await browser.newPage({
        screen: { width: 430, height: 1000 },
      });

      const url = `${mediaSource.baseUrl}/${mediaSource.urlPath ? mediaSource.urlPath : ''}`;
      console.log('Navigating to: ', url);

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      await page.waitForTimeout(5000);

      let articles: Article[] = [];

      switch (mediaSource.name) {
        case INDEX_HR:
          articles = await fetchIndexArticles(
            browser,
            mediaSource.baseUrl,
            url,
            page,
          );
          break;
        case _24SATA:
          articles = await fetch24SataArticles(page);
          break;
        case SN:
          articles = await fetchSnArticles(page);
          break;
        case GOL_HR:
          articles = await fetchGolHrArticles(browser, url, page);
          break;
        case GERMANIJAK:
          articles = await fetchGermanijakArticles(page);
          break;
        default:
          console.warn(`Unknown media source: ${mediaSource.name}`);
          return;
      }

      console.log(`Scraped ${articles.length} articles before filtering`);
      articles = articles.slice(0, FETCHING_COUNT);
      console.log(`Processing ${articles.length} articles after filtering`);

      if (articles.length === 0) {
        console.log('No articles found to process');
        return;
      }

      // Test database connection
      try {
        const testCount = await this.prismaService.mediaNews.count();
        console.log(`Current articles in database: ${testCount}`);
      } catch (error) {
        console.error('Database connection test failed:', error);
        throw error;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const article of articles) {
        try {
          await this.prismaService.mediaNews.upsert({
            where: {
              externalId_mediaSourceId: {
                externalId: article.externalId,
                mediaSourceId: mediaSource.id,
              },
            },
            create: {
              title: article.title,
              content: article.content,
              urlPath: article.urlPath.startsWith('http')
                ? article.urlPath
                : `${mediaSource.baseUrl}${article.urlPath}`,
              externalId: article.externalId,
              mediaSourceId: mediaSource.id,
              likeCount: article.likeCount,
              shareCount: article.shareCount,
              commentCount: article.commentCount,
              totalEngagements: article.totalEngagements,
            },
            update: {
              likeCount: article.likeCount,
              shareCount: article.shareCount,
              commentCount: article.commentCount,
              totalEngagements: article.totalEngagements,
            },
          });
          successCount++;
          console.log(` Successfully upserted: ${article.title}`);
        } catch (error: unknown) {
          errorCount++;
          console.error(` Failed to upsert article: ${article.title}`, error);
        }
      }

      console.log(
        `Results for ${mediaSource.name}: ${successCount} success, ${errorCount} errors`,
      );
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (error) {
          console.error('Error closing page:', error);
        }
      }
    }
  }
}
