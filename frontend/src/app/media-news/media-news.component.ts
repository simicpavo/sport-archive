import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';
import { MediaNews, TimeFilter } from '../models/media-news.interface';
import { NewsActions } from '../store/news/news.actions';
import { newsFeature } from '../store/news/news.store';

@Component({
  selector: 'app-media-news',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, SkeletonModule, TagModule, DividerModule],
  templateUrl: './media-news.component.html',
})
export class MediaNewsComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  private subscriptions = new Subscription();
  private store = inject(Store);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private lastLoadTime = 0;
  private readonly LOAD_THROTTLE_MS = 1000;

  news = this.store.selectSignal(newsFeature.selectNews);
  loading = this.store.selectSignal(newsFeature.selectLoading);
  loadingMore = this.store.selectSignal(newsFeature.selectLoadingMore);
  hasMore = this.store.selectSignal(newsFeature.selectHasMore);
  selectedFilter = this.store.selectSignal(newsFeature.selectSelectedFilter);
  error = this.store.selectSignal(newsFeature.selectError);
  total = this.store.selectSignal(newsFeature.selectTotal);

  timeFilters: { label: string; value: TimeFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Last 24h', value: '24h' },
    { label: 'Last 12h', value: '12h' },
    { label: 'Last 6h', value: '6h' },
  ];

  constructor() {
    effect(() => {
      const loading = this.loading();
      const loadingMore = this.loadingMore();

      // Only re-observe when we're not in a loading state
      if (this.observer && !loading && !loadingMore) {
        setTimeout(() => {
          this.observer?.disconnect();
          this.observeScrollTrigger();
        }, 100);
      }
    });
  }

  ngOnInit(): void {
    this.loadInitialNews();

    // Only setup infinite scroll in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.setupInfiniteScroll();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.observer?.disconnect();
  }

  loadInitialNews(): void {
    this.store.dispatch(NewsActions.loadNews({ isLoadMore: false }));
  }

  onTimeFilterChange(filter: TimeFilter): void {
    this.store.dispatch(NewsActions.applyTimeFilter({ timeFilter: filter }));
  }

  loadMoreNews(): void {
    const now = Date.now();

    if (now - this.lastLoadTime < this.LOAD_THROTTLE_MS) {
      return;
    }

    if (!this.loading() && !this.loadingMore() && this.hasMore()) {
      this.lastLoadTime = now;
      this.store.dispatch(NewsActions.loadNews({ isLoadMore: true }));
    }
  }

  private setupInfiniteScroll(): void {
    // Only run in browser environment to avoid SSR issues
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Set up intersection observer for infinite scroll
    this.observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !this.loading() &&
          !this.loadingMore() &&
          this.hasMore() &&
          this.news().length > 0 &&
          target.intersectionRatio > 0
        ) {
          this.loadMoreNews();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      },
    );

    this.observeScrollTrigger();
  }

  private observeScrollTrigger(): void {
    if (!this.observer) return;

    const scrollTrigger = document.getElementById('scroll-trigger');
    if (scrollTrigger) {
      this.observer.observe(scrollTrigger);
    } else {
      console.warn('scroll-trigger element not found');
      setTimeout(() => this.observeScrollTrigger(), 100);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  formatEngagements(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  onReadMore(event: Event, newsItem: MediaNews): void {
    event.stopPropagation();
    if (newsItem.urlPath) {
      window.open(newsItem.urlPath, '_blank');
    }
  }
}
