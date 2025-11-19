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
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Toast } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { RecordsFormComponent } from '../cms/records/records-form/records-form.component';
import { MediaNews, TimeFilter } from '../models/media-news.interface';
import { CreateRecordDto } from '../shared/interfaces/record.interface';
import { formatDate } from '../shared/utils/format-date';
import { formatEngagements } from '../shared/utils/format-engagements';
import { NewsActions } from '../store/news/news.actions';
import { newsFeature } from '../store/news/news.store';
import { recordsActions } from '../store/records/records.actions';

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
    RecordsFormComponent,
    Toast,
  ],
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
  private readonly messageService = inject(MessageService);

  news = this.store.selectSignal(newsFeature.selectNews);
  loading = this.store.selectSignal(newsFeature.selectLoading);
  loadingMore = this.store.selectSignal(newsFeature.selectLoadingMore);
  hasMore = this.store.selectSignal(newsFeature.selectHasMore);
  selectedFilter = this.store.selectSignal(newsFeature.selectSelectedFilter);
  error = this.store.selectSignal(newsFeature.selectError);
  total = this.store.selectSignal(newsFeature.selectTotal);

  showDialog = signal(false);
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
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.selectedNewsItem.set(null);
  }

  onSaveRecord(recordData: CreateRecordDto): void {
    this.store.dispatch(recordsActions.createRecord({ record: recordData }));
    this.showDialog.set(false);
    this.selectedNewsItem.set(null);
  }

  onSaveRecordFailure(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save record',
      life: 3000,
    });
  }
}
