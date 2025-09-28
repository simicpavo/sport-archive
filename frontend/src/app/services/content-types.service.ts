import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  ContentType,
  ContentTypeResponse,
  CreateContentTypeDto,
  UpdateContentTypeDto,
} from '../shared/interfaces/content-type.interface';

@Injectable({
  providedIn: 'root',
})
export class ContentTypesService {
  private readonly apiUrl = 'http://localhost:3000/content-types';
  private readonly http = inject(HttpClient);

  getContentTypes(): Observable<ContentTypeResponse> {
    return this.http.get<ContentType[]>(this.apiUrl).pipe(
      map((contentTypes: ContentType[]) => ({
        data: contentTypes,
        meta: {
          total: contentTypes.length,
          page: 1,
          totalPages: 1,
          take: contentTypes.length,
        },
      })),
    );
  }

  getContentTypeById(id: string): Observable<ContentType> {
    return this.http.get<ContentType>(`${this.apiUrl}/${id}`);
  }

  createContentType(contentType: CreateContentTypeDto): Observable<ContentType> {
    return this.http.post<ContentType>(this.apiUrl, contentType);
  }

  updateContentType(id: string, contentType: UpdateContentTypeDto): Observable<ContentType> {
    return this.http.patch<ContentType>(`${this.apiUrl}/${id}`, contentType);
  }

  deleteContentType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
