import { Browser, Page } from 'playwright';
import { Article } from 'src/utils/interfaces';

export const fetchGolHrArticles = async (
  browser: Browser,
  url: string,
  page: Page,
): Promise<Article[]> => {
  // First get all articles from the main page
  const articles: Article[] = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('article'));
    return items
      .filter((item) => item.getAttribute('data-ga4-category') === 'nogomet')
      .map((item) => {
        const tagElement = item.querySelector('.subtitle');
        const titleElement = item.querySelector('.title');
        const title =
          tagElement && titleElement
            ? `${tagElement.innerHTML.toUpperCase()} ${titleElement.innerHTML.replace(/[\r\n]+/g, '').trim()}`
            : '';
        const urlElement = item.querySelector('a');
        const externalId = item.getAttribute('data-ga4-article-id') || '';

        return {
          title,
          content: '',
          urlPath: urlElement ? urlElement.getAttribute('href') || '' : '',
          externalId,
          likeCount: 0,
          shareCount: 0,
          commentCount: 0,
          totalEngagements: 0,
        };
      });
  });

  // Then visit each article and get its share count
  const articlesWithShares: Article[] = [];
  for (const article of articles) {
    try {
      await page.goto(url + article.urlPath, {
        waitUntil: 'domcontentloaded',
      });

      // Wait for the Facebook share iframe to load
      await page.waitForSelector(
        'iframe[title="fb:share_button Facebook Social Plugin"]',
      );

      // Get the frame
      const fbFrame = page.frameLocator(
        'iframe[title="fb:share_button Facebook Social Plugin"]',
      );

      // Wait for the share count element and get its text
      const shareCount = await fbFrame
        .locator('span._5n6h')
        .first()
        .evaluate((el: HTMLElement) => parseInt(el.textContent || '0', 10));

      articlesWithShares.push({
        ...article,
        shareCount,
        totalEngagements: shareCount,
      });
    } catch (error: unknown) {
      console.error(
        `Error fetching share count for article: ${article.urlPath}`,
        error,
      );
      articlesWithShares.push(article); // Keep the article even if share count fails
    }
  }

  return articlesWithShares;
};
