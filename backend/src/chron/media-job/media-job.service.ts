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
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 3000;
  private readonly PAGE_TIMEOUT = 8000;
  private readonly NAVIGATION_TIMEOUT = 10000;

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
      browser = await chromium.launch({ headless: true, timeout: 30000 });

      for (const mediaSource of mediaSources) {
        console.log(`Fetching articles for ${mediaSource.name}`);
        try {
          await this.fetchArticlesWithRetry(mediaSource, browser);
          console.log('Finished fetching articles for: ', mediaSource.name);
        } catch (error) {
          console.error(
            `Failed to fetch articles for ${mediaSource.name} after ${this.MAX_RETRIES} retries:`,
            error instanceof Error ? error.message : 'Unknown error',
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

  private async fetchArticlesWithRetry(
    mediaSource: MediaSource,
    browser: Browser,
    attempt: number = 1,
  ): Promise<void> {
    try {
      await this.fetchArticles(mediaSource, browser);
    } catch (error) {
      if (attempt < this.MAX_RETRIES) {
        console.log(
          `Attempt ${attempt} failed for ${mediaSource.name}, retrying in ${this.RETRY_DELAY}ms...`,
        );
        await this.sleep(this.RETRY_DELAY);
        return this.fetchArticlesWithRetry(mediaSource, browser, attempt + 1);
      }
      throw error; // Re-throw after max retries
    }
  }

  private async upsertArticleWithRetry(
    article: Article,
    mediaSource: MediaSource,
    attempt: number = 1,
  ): Promise<boolean> {
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
      return true;
    } catch (error) {
      if (attempt < this.MAX_RETRIES) {
        console.log(
          `Database upsert attempt ${attempt} failed for article: ${article.title}, retrying...`,
        );
        await this.sleep(this.RETRY_DELAY);
        return this.upsertArticleWithRetry(article, mediaSource, attempt + 1);
      }
      console.error(
        `Failed to upsert article after ${this.MAX_RETRIES} attempts:`,
        error,
      );
      return false;
    }
  }

  private async fetchArticles(mediaSource: MediaSource, browser: Browser) {
    console.log('Fetching articles for: ', mediaSource.name);

    let page;
    try {
      page = await browser.newPage({
        screen: { width: 430, height: 1000 },
      });

      page.setDefaultTimeout(this.PAGE_TIMEOUT);
      page.setDefaultNavigationTimeout(this.NAVIGATION_TIMEOUT);

      const url = `${mediaSource.baseUrl}/${mediaSource.urlPath ? mediaSource.urlPath : ''}`;
      console.log('Navigating to: ', url);

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: this.NAVIGATION_TIMEOUT,
      });

      await page.waitForTimeout(2000);

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

      // Test database connection with retry
      try {
        const testCount = await this.prismaService.mediaNews.count();
        console.log(`Current articles in database: ${testCount}`);
      } catch (error) {
        console.error('Database connection test failed:', error);
        throw error;
      }

      let successCount = 0;
      let errorCount = 0;

      // Process articles with retry logic
      for (const article of articles) {
        const success = await this.upsertArticleWithRetry(article, mediaSource);
        if (success) {
          successCount++;
          console.log(
            `Successfully upserted: ${article.title.substring(0, 50)}...`,
          );
        } else {
          errorCount++;
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

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
