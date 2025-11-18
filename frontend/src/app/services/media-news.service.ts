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
  private readonly baseUrl = `${environment?.apiUrl}/media-news`;

  getMediaNews(filters: MediaNewsFilters = {}): Observable<PaginatedMediaNews> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

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
      case 'recent':
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
      case 'recent':
      default:
        return {
          sortBy: 'createdAt',
          sortOrder: 'desc',
        };
    }
  }
}
