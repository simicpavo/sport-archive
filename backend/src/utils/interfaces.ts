/**
 * Represents a scraped news article from a media source
 */
export interface Article {
  /** The headline/title of the article */
  title: string;

  /** The article summary, excerpt, or subtitle content */
  content: string;

  /**
   * The URL path to the article (can be relative or absolute)
   * If relative, will be combined with MediaSource.baseUrl
   */
  urlPath: string;

  /**
   * Unique identifier from the source website (e.g., article ID, slug)
   * Used to prevent duplicate articles and for upsert operations
   */
  externalId: string;

  /**
   * Number of likes/reactions the article has received
   * Includes Facebook likes, thumbs up, heart reactions, etc.
   */
  likeCount: number;

  /**
   * Number of times the article has been shared on social media
   * Includes Facebook shares, Twitter retweets, etc.
   */
  shareCount: number;

  /**
   * Number of comments posted on the article
   * Includes both on-site comments and social media comments
   */
  commentCount: number;

  /**
   * Total engagement score calculated from all interaction types
   * Usually sum of likeCount + shareCount + commentCount
   * Used for ranking article popularity
   */
  totalEngagements: number;
}

/**
 * Represents a configured media source/website for scraping
 */
export interface MediaSource {
  /** Unique database identifier for the media source */
  id: string;

  /**
   * Base URL of the media website (e.g., "https://www.index.hr")
   * Used as foundation for constructing full article URLs
   */
  baseUrl: string;

  /**
   * Optional path to the sports/news section of the website
   * Combined with baseUrl to create the scraping target URL
   * Example: "sport" or "sport/rubrika/nogomet/1638"
   */
  urlPath?: string | null;

  /**
   * Human-readable name/identifier for the media source
   * Used in logs and for matching scraper implementations
   * Example: "INDEX_HR", "24SATA", "GOL_HR"
   */
  name: string;

  /** Timestamp when this media source was first added to the database */
  createdAt: Date;

  /** Timestamp when this media source configuration was last updated */
  updatedAt: Date;
}
