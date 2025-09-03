import { Page } from 'playwright';
import { Article } from 'src/utils/interfaces';

export const fetch24SataArticles = async (page: Page): Promise<Article[]> => {
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
      // Wait a bit for the popup to disappear
      await page.waitForTimeout(1000);
    }
  } catch (e: unknown) {
    // Cookie popup might not appear if already accepted
    console.log(e, 'No cookie popup found or already accepted');
  }

  return await page.evaluate(() => {
    const articles = Array.from(document.querySelectorAll('.article_wrap'));

    return articles.map((article) => {
      const cardElement = article.querySelector('.card');
      const titleElement = article.querySelector('.card__title');
      const labelElement = article.querySelector('.card__label');
      const linkElement = article.querySelector('.card__link');

      // Get engagement counts
      const totalReactionsElement = article.querySelector(
        '.engagement_bar__meta_item--reaction .total-count',
      );
      const commentsElement = article.querySelector(
        '.engagement_bar__meta_item--comment .engagement_bar__meta_item--count',
      );

      const externalId = cardElement?.getAttribute('data-article-id') || '';
      const totalReactions = totalReactionsElement
        ? parseInt(totalReactionsElement.textContent.trim() || '0', 10) || 0
        : 0;
      const commentCount = commentsElement
        ? parseInt(commentsElement.textContent.trim() || '0', 10) || 0
        : 0;

      return {
        title: titleElement ? titleElement.textContent.trim() || '' : '',
        content: labelElement ? labelElement.textContent.trim() || '' : '',
        urlPath: linkElement ? linkElement.getAttribute('href') || '' : '',
        externalId,
        likeCount: totalReactions,
        shareCount: 0,
        commentCount,
        totalEngagements: totalReactions + commentCount,
      };
    });
  });
};
