import { Page } from 'playwright';
import { Article } from 'src/utils/interfaces';

export const fetchGermanijakArticles = async (
  page: Page,
): Promise<Article[]> => {
  // Get all articles from the main page
  const articles: Article[] = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('a')).filter((e) => {
      const href = e.getAttribute('href');
      const title = e.getAttribute('title');
      return href?.includes('/nogomet/vijesti/') && !!title;
    });

    return items.map((element) => ({
      title: element.getAttribute('title') || '',
      content: '', // No content since we're not visiting individual articles
      urlPath: element.getAttribute('href') || '',
      externalId:
        element.getAttribute('href')?.split('/').pop()?.split('.')[0] || '',
      likeCount: 0,
      shareCount: 0,
      commentCount: 0,
      totalEngagements: 0,
    }));
  });

  return articles;
};
