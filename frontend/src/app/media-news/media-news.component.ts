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
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { MediaNews, TimeFilter } from '../models/media-news.interface';
import { formatDate } from '../shared/utils/format-date';
import { formatEngagements } from '../shared/utils/format-engagements';
import { NewsActions } from '../store/news/news.actions';
import { newsFeature } from '../store/news/news.store';
import { recordsActions } from '../store/records/records.actions';
import { recordsFeature } from '../store/records/records.store';
import { RecordFormComponent } from './components/record-form/record-form.component';

@Component({
  selector: 'app-media-news',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    TagModule,
    DividerModule,
    DialogModule,
    RecordFormComponent,
  ],
  templateUrl: './media-news.component.html',
  providers: [RecordFormComponent],
})
export class MediaNewsComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  @ViewChild(RecordFormComponent, { static: false }) recordForm!: RecordFormComponent;

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
  dialogVisible = this.store.selectSignal(recordsFeature.selectRecordDialogVisible);

  selectedNewsItem = signal<MediaNews | null>(null);
  formatDate = formatDate;
  formatEngagements = formatEngagements;

  timeFilters: { label: string; value: TimeFilter }[] = [
    { label: 'Recent', value: 'recent' },
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
    this.observer?.disconnect();
    this.store.dispatch(recordsActions.changeRecordDialogVisibility({ isVisible: false }));
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
    if (!this.observer) {
      return;
    }

    const scrollTrigger = document.getElementById('scroll-trigger');
    if (scrollTrigger) {
      this.observer.observe(scrollTrigger);
    } else {
      console.warn('scroll-trigger element not found');
      setTimeout(() => this.observeScrollTrigger(), 100);
    }
  }

  onReadMore(newsItem: MediaNews): void {
    if (newsItem.urlPath) {
      window.open(newsItem.urlPath, '_blank');
    }
  }

  onSaveArticle(newsItem: MediaNews): void {
    this.selectedNewsItem.set(newsItem);

    this.store.dispatch(recordsActions.changeRecordDialogVisibility({ isVisible: true }));
  }

  closeDialog(): void {
    this.recordForm?.recordsForm.reset({
      title: this.selectedNewsItem()?.title || '',
      description: this.selectedNewsItem()?.content || '',
    });
    this.store.dispatch(recordsActions.changeRecordDialogVisibility({ isVisible: false }));
  }
}
