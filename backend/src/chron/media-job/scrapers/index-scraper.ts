import { Browser, Page } from 'playwright';
import { Article } from 'src/utils/interfaces';

export const fetchIndexArticles = async (
  browser: Browser,
  baseUrl: string,
  url: string,
  page: Page,
): Promise<Article[]> => {
  // First get all articles from the main page
  const articles: Article[] = await page.evaluate(() => {
    const firstNewsHolder = document.querySelector('.first-news-holder');
    const titleElement = firstNewsHolder?.querySelector('.title');
    const summaryElement = firstNewsHolder?.querySelector('.summary');
    const linkElement = firstNewsHolder?.querySelector('a');
    const externalId = linkElement
      ? linkElement.href.split('/').pop()?.split('.')[0] || ''
      : '';

    const firstArticle = {
      title: titleElement ? titleElement.innerHTML : '',
      content: summaryElement ? summaryElement.innerHTML : '',
      urlPath: linkElement ? linkElement.getAttribute('href') || '' : '',
      externalId,
      likeCount: 0,
      shareCount: 0,
      commentCount: 0,
      totalEngagements: 0,
    };

    // Limit the number of grid items to fetch
    const items = Array.from(document.querySelectorAll('.grid-item')).slice(
      0,
      9,
    ); // 9 + 1 first article = 10 total

    const nextArticles = items.map((item) => {
      const titleElement = item.querySelector('.title');
      const summaryElement = item.querySelector('.summary');
      const linkElement = item.querySelector('a');
      const externalId = linkElement
        ? linkElement.href.split('/').pop()?.split('.')[0] || ''
        : '';

      return {
        title: titleElement ? titleElement.innerHTML : '',
        content: summaryElement ? summaryElement.innerHTML : '',
        urlPath: linkElement ? linkElement.getAttribute('href') || '' : '',
        externalId,
        likeCount: 0,
        shareCount: 0,
        commentCount: 0,
        totalEngagements: 0,
      };
    });

    return [firstArticle, ...nextArticles];
  });

  console.log(`Found ${articles.length} articles on main page`);

  const validArticles = articles.filter(
    (article) => article.urlPath && article.externalId && article.title,
  );

  console.log(`${validArticles.length} valid articles after filtering`);

  // Then visit each article and get its comment count
  const articlesWithComments: Article[] = [];
  for (const article of validArticles) {
    console.log('Articles for scan count:', articles.length);
    try {
      // Construct proper URL - check if urlPath is already full URL or relative
      const articleUrl = article.urlPath.startsWith('http')
        ? article.urlPath
        : `${baseUrl}${article.urlPath}`;

      console.log(`Fetching comments for article: ${articleUrl}`);

      await page.goto(articleUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 8000,
      });

      // Handle cookie consent popup if it appears
      try {
        const acceptButton = await page.waitForSelector(
          '#didomi-notice-agree-button',
          {
            timeout: 3000,
          },
        );
        if (acceptButton) {
          await acceptButton.click();
          // Wait a bit for the popup to disappear
          await page.waitForTimeout(1000);
        }
      } catch (error) {
        // Cookie popup might not appear if already accepted
        console.log(error, 'No cookie popup found or already accepted');
      }

      let commentCount = 0;
      try {
        // Wait for comments container to be in the DOM
        await page.waitForSelector('#comments-container', { timeout: 10000 });

        // Scroll to the comments container
        await page.evaluate(async () => {
          const commentsContainer = document.querySelector(
            '#comments-container',
          );
          if (commentsContainer) {
            commentsContainer.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            // Additional wait to ensure content loads
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        });

        // Now try to get the comment count
        const count = await page.evaluate(() => {
          const totalCountElement = document.querySelector('.total-count');
          if (totalCountElement) {
            const countText = totalCountElement.textContent;
            const match = countText.match(/\((\d+)\)/);
            return match ? parseInt(match[1]) : 0;
          }
          return 0;
        });

        commentCount = count;
        console.log(
          `Found comment count: ${commentCount} for article: ${article.title}`,
        );
      } catch (error: unknown) {
        console.log('Failed to get comments, using count 0:', error);
      }

      articlesWithComments.push({
        ...article,
        commentCount,
        totalEngagements: commentCount,
      });
    } catch (error: unknown) {
      console.error(
        `Error fetching comment count for article: ${article.urlPath}`,
        error,
      );
      articlesWithComments.push(article);
    }
  }
  console.log(
    `Processed ${articlesWithComments.length} articles with comments`,
  );
  return articlesWithComments;
};
