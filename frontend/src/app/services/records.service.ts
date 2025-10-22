import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateRecordDto,
  Record,
  RecordResponse,
  UpdateRecordDto,
} from '../shared/interfaces/record.interface';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  private readonly apiUrl = `${environment?.apiUrl}/records`;
  private readonly http = inject(HttpClient);

  getRecords(): Observable<RecordResponse> {
    return this.http.get<Record[]>(this.apiUrl).pipe(
      map((records: Record[]) => ({
        data: records,
        meta: {
          total: records.length,
          page: 1,
          totalPages: 1,
          take: records.length,
        },
      })),
    );
  }

  getRecordById(id: string): Observable<Record> {
    return this.http.get<Record>(`${this.apiUrl}/${id}`);
  }

  createRecord(record: CreateRecordDto): Observable<Record> {
    return this.http.post<Record>(this.apiUrl, record);
  }

  updateRecord(id: string, record: UpdateRecordDto): Observable<Record> {
    return this.http.patch<Record>(`${this.apiUrl}/${id}`, record);
  }

  deleteRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
