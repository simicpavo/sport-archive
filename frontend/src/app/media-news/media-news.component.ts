import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Subscription } from 'rxjs';
import { MediaNews, TimeFilter } from '../models/media-news.interface';
import * as NewsActions from '../store/news/news.actions';
import {
  selectHasMore,
  selectIsLoadingInitial,
  selectLoading,
  selectLoadingMore,
  selectNews,
  selectSelectedFilter,
} from '../store/news/news.selectors';

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

  news$ = this.store.select(selectNews);
  loading$ = this.store.select(selectLoading);
  loadingMore$ = this.store.select(selectLoadingMore);
  hasMore$ = this.store.select(selectHasMore);
  selectedFilter$ = this.store.select(selectSelectedFilter);
  isLoadingInitial$ = this.store.select(selectIsLoadingInitial);

  news = toSignal(this.news$, { initialValue: [] as MediaNews[] });
  loading = toSignal(this.loading$, { initialValue: false });
  hasMore = toSignal(this.hasMore$, { initialValue: true });
  selectedFilter = toSignal(this.selectedFilter$, { initialValue: 'all' as TimeFilter });

  displayNews = computed(() => this.news());
  isLoadingInitial = computed(() => this.loading() && this.news().length === 0);
  isLoadingMore = computed(() => this.loading() && this.news().length > 0);

  timeFilters: { label: string; value: TimeFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Last 24h', value: '24h' },
    { label: 'Last 12h', value: '12h' },
    { label: 'Last 6h', value: '6h' },
  ];

  ngOnInit(): void {
    this.loadInitialNews();

    this.news$.subscribe((news) => {
      console.log('News data:', news);
      if (news.length > 0) {
        console.log('First news item:', news[0]);
        console.log('Media source of first item:', news[0].mediaSource);
      }
    });

    // Only setup infinite scroll in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.setupInfiniteScroll();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadInitialNews(): void {
    this.store.dispatch(NewsActions.loadInitialNews({ filters: {} }));
  }

  onTimeFilterChange(filter: TimeFilter): void {
    this.store.dispatch(NewsActions.setSelectedFilter({ selectedFilter: filter }));
    this.store.dispatch(NewsActions.applyTimeFilter({ timeFilter: filter }));
  }

  loadMoreNews(): void {
    if (!this.loading() && this.hasMore()) {
      this.store.dispatch(NewsActions.loadMoreNews());
    }
  }

  private setupInfiniteScroll(): void {
    // Only run in browser environment to avoid SSR issues
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Set up intersection observer for infinite scroll
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !this.loading() && this.hasMore()) {
          this.loadMoreNews();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      },
    );

    // Observe the scroll trigger element
    setTimeout(() => {
      const scrollTrigger = document.getElementById('scroll-trigger');
      if (scrollTrigger) {
        observer.observe(scrollTrigger);
      }
    }, 100);

    // Clean up observer on destroy
    this.subscriptions.add({
      unsubscribe: () => observer.disconnect(),
    });
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
    console.log('Read more clicked:', newsItem.title);
  }
}
