import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MediaNews,
  MediaNewsFilters,
  PaginatedMediaNews,
  TimeFilter,
} from '../models/media-news.interface';

@Injectable({
  providedIn: 'root',
})
export class MediaNewsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment?.apiUrl || 'http://localhost:3000'}/media-news`;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly newsSubject = new BehaviorSubject<MediaNews[]>([]);
  private readonly hasMoreSubject = new BehaviorSubject<boolean>(true);

  public readonly loading$ = this.loadingSubject.asObservable();
  public readonly news$ = this.newsSubject.asObservable();
  public readonly hasMore$ = this.hasMoreSubject.asObservable();

  private currentPage = 1;
  private currentFilters: MediaNewsFilters = {};

  getMediaNews(filters: MediaNewsFilters = {}): Observable<PaginatedMediaNews> {
    let params = new HttpParams();

    if (filters.page) {
      params = params.set('page', filters.page.toString());
    }
    if (filters.take) {
      params = params.set('take', filters.take.toString());
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<PaginatedMediaNews>(this.baseUrl, { params });
  }

  getMediaNewsById(id: string): Observable<MediaNews> {
    return this.http.get<MediaNews>(`${this.baseUrl}/${id}`);
  }

  loadInitialNews(filters: MediaNewsFilters = {}): void {
    this.currentFilters = { ...filters, page: 1, take: 10 };
    this.currentPage = 1;
    this.loadingSubject.next(true);

    this.getMediaNews(this.currentFilters).subscribe({
      next: (response: PaginatedMediaNews) => {
        this.newsSubject.next(response.data);
        const takeAmount = this.currentFilters.take || 10;
        this.hasMoreSubject.next(response.data.length >= takeAmount);
        this.loadingSubject.next(false);
      },
      error: (error: unknown) => {
        console.error('Error loading news:', error);
        this.newsSubject.next([]);
        this.hasMoreSubject.next(false);
        this.loadingSubject.next(false);
      },
    });
  }

  loadMoreNews(): void {
    if (this.loadingSubject.value || !this.hasMoreSubject.value) {
      return;
    }

    this.currentPage++;
    this.loadingSubject.next(true);

    const filters = { ...this.currentFilters, page: this.currentPage };

    this.getMediaNews(filters).subscribe({
      next: (response: PaginatedMediaNews) => {
        const currentNews = this.newsSubject.value;
        const newNews = [...currentNews, ...response.data];
        this.newsSubject.next(newNews);
        const takeAmount = this.currentFilters.take || 10;
        this.hasMoreSubject.next(response.data.length >= takeAmount);
        this.loadingSubject.next(false);
      },
      error: (error: unknown) => {
        console.error('Error loading more news:', error);
        this.hasMoreSubject.next(false);
        this.loadingSubject.next(false);
      },
    });
  }

  applyTimeFilter(timeFilter: TimeFilter): void {
    const now = new Date();
    let startDate: string | undefined;

    switch (timeFilter) {
      case '6h':
        startDate = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
        break;
      case '12h':
        startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString();
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case 'all':
      default:
        startDate = undefined;
        break;
    }

    const filters: MediaNewsFilters = {
      ...this.currentFilters,
      startDate,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    this.loadInitialNews(filters);
  }

  clearNews(): void {
    this.newsSubject.next([]);
    this.hasMoreSubject.next(true);
    this.currentPage = 1;
  }

  refreshNews(): void {
    this.clearNews();
    this.loadInitialNews(this.currentFilters);
  }

  getCurrentFilters(): MediaNewsFilters {
    return { ...this.currentFilters };
  }
}
