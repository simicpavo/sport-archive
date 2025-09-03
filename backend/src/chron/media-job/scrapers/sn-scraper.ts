import { Page } from 'playwright';
import { Article } from 'src/utils/interfaces';

export const fetchSnArticles = async (page: Page): Promise<Article[]> => {
  //comments available
  return await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('article'));
    return items.map((item) => {
      const tagElement = item.querySelector('.card__egida');
      const titleElement = item.querySelector('.card__title ');
      const title =
        tagElement && titleElement
          ? `${tagElement.innerHTML} ${titleElement.innerHTML.replace(/[\r\n]+/g, '').trim()}`
          : '';
      const contentElement = item.querySelector('.card__subtitle');
      const urlElement = item.querySelector('a');
      const externalId = item.getAttribute('data-upscore-object-id') || '';

      return {
        title,
        content: contentElement ? contentElement.innerHTML : '',
        urlPath: urlElement ? urlElement.getAttribute('href') || '' : '',
        externalId,
        likeCount: 0,
        shareCount: 0,
        commentCount: 0,
        totalEngagements: 0,
      };
    });
  });
};
