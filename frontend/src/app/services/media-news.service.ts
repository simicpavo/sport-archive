import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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

  getMediaNewsWithTimeFilter(
    timeFilter: TimeFilter,
    filters: Omit<MediaNewsFilters, 'startDate' | 'endDate'> = {},
  ): Observable<PaginatedMediaNews> {
    const timeFilters = this.getTimeFilterDates(timeFilter);
    const sortingFilters = this.getSortingForTimeFilter(timeFilter);

    const combinedFilters: MediaNewsFilters = {
      ...filters,
      ...timeFilters,
      ...sortingFilters,
    };

    return this.getMediaNews(combinedFilters);
  }

  getTimeFilterDates(timeFilter: TimeFilter): Pick<MediaNewsFilters, 'startDate' | 'endDate'> {
    const now = new Date();

    switch (timeFilter) {
      case '6h':
        return {
          startDate: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          endDate: now.toISOString(),
        };
      case '12h':
        return {
          startDate: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
          endDate: now.toISOString(),
        };
      case '24h':
        return {
          startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          endDate: now.toISOString(),
        };
      case 'all':
      default:
        return {};
    }
  }

  private getSortingForTimeFilter(
    timeFilter: TimeFilter,
  ): Pick<MediaNewsFilters, 'sortBy' | 'sortOrder'> {
    switch (timeFilter) {
      case '6h':
      case '12h':
      case '24h':
        return {
          sortBy: 'totalEngagements',
          sortOrder: 'desc',
        };
      case 'all':
      default:
        return {
          sortBy: 'createdAt',
          sortOrder: 'desc',
        };
    }
  }
}
