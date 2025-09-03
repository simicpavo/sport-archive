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
    );

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
    console.log('Articles for scan count:', validArticles.length);
    try {
      const articleUrl = article.urlPath.startsWith('http')
        ? article.urlPath
        : `${baseUrl}${article.urlPath}`;

      console.log(`Fetching comments for article: ${articleUrl}`);

      await page.goto(articleUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });

      // Handle cookie consent popup if it appears
      try {
        const acceptButton = await page.waitForSelector(
          '#didomi-notice-agree-button',
          {
            timeout: 5000,
          },
        );
        if (acceptButton) {
          await acceptButton.click();
          await page.waitForTimeout(1000);
          console.log('Cookie popup accepted');
        }
      } catch (error: unknown) {
        // Cookie popup might not appear if already accepted
        console.log(error, 'No cookie popup found or already accepted');
      }

      let commentCount = 0;
      try {
        // Wait for comments container to be in the DOM with timeout
        const commentsContainer = await page.waitForSelector(
          '#comments-container',
          {
            timeout: 8000,
            state: 'attached', // Wait for element to be attached to DOM
          },
        );

        if (commentsContainer) {
          await page.evaluate(async () => {
            const container = document.querySelector('#comments-container');
            if (container) {
              container.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          });

          // Wait for the total count element to appear with timeout
          try {
            await page.waitForSelector('.total-count', {
              timeout: 5000,
              state: 'visible',
            });

            const count = await page.evaluate(() => {
              const totalCountElement = document.querySelector('.total-count');
              if (totalCountElement && totalCountElement.textContent) {
                const countText = totalCountElement.textContent;
                const match = countText.match(/\((\d+)\)/);
                return match ? parseInt(match[1], 10) : 0;
              }
              return 0;
            });

            commentCount = count;
            console.log(
              `Found comment count: ${commentCount} for article: ${article.title}`,
            );
          } catch (totalCountError: unknown) {
            console.log(
              totalCountError,
              'Total count element not found within timeout, using count 0',
            );
          }
        }
      } catch (commentsError: unknown) {
        console.log(
          commentsError,
          'Comments container not found within timeout, using count 0',
        );
      }

      articlesWithComments.push({
        ...article,
        commentCount,
        totalEngagements: commentCount,
      });
    } catch (error: unknown) {
      console.error(
        `Error processing article: ${article.title}`,
        error instanceof Error ? error.message : 'Unknown error',
      );
      // Still add the article without comment count
      articlesWithComments.push({
        ...article,
        commentCount: 0,
        totalEngagements: 0,
      });
    }
  }

  console.log(
    `Processed ${articlesWithComments.length} articles with comments`,
  );
  return articlesWithComments;
};
