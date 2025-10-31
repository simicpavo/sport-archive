import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateMediaSourceDto,
  MediaSource,
  MediaSourceResponse,
  UpdateMediaSourceDto,
} from '../shared/interfaces/media-source.interface';

@Injectable({ providedIn: 'root' })
export class MediaSourcesService {
  private readonly apiUrl = `${environment?.apiUrl}/media-sources`;
  private readonly http = inject(HttpClient);

  getMediaSources(): Observable<MediaSourceResponse> {
    return this.http.get<MediaSource[]>(this.apiUrl).pipe(
      map((mediaSources: MediaSource[]) => ({
        data: mediaSources,
        meta: {
          total: mediaSources.length,
          page: 1,
          totalPages: 1,
          take: mediaSources.length,
        },
      })),
    );
  }

  getMediaSourceById(id: string): Observable<MediaSource> {
    return this.http.get<MediaSource>(`${this.apiUrl}/${id}`);
  }

  createMediaSource(mediaSource: CreateMediaSourceDto): Observable<MediaSource> {
    return this.http.post<MediaSource>(this.apiUrl, mediaSource);
  }

  updateMediaSource(id: string, mediaSource: UpdateMediaSourceDto): Observable<MediaSource> {
    return this.http.patch<MediaSource>(`${this.apiUrl}/${id}`, mediaSource);
  }

  deleteMediaSource(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
