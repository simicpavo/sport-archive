import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Competition,
  CompetitionResponse,
  CreateCompetitionDto,
  UpdateCompetitionDto,
} from '../shared/interfaces/competition.interface';

@Injectable({ providedIn: 'root' })
export class CompetitionsService {
  private readonly apiUrl = `${environment?.apiUrl}/competitions`;
  private readonly http = inject(HttpClient);

  getCompetitions(): Observable<CompetitionResponse> {
    return this.http.get<Competition[]>(this.apiUrl).pipe(
      map((competitions: Competition[]) => ({
        data: competitions,
        meta: {
          total: competitions.length,
          page: 1,
          totalPages: 1,
          take: competitions.length,
        },
      })),
    );
  }

  getCompetitionById(id: string): Observable<Competition> {
    return this.http.get<Competition>(`${this.apiUrl}/${id}`);
  }

  createCompetition(competition: CreateCompetitionDto): Observable<Competition> {
    return this.http.post<Competition>(this.apiUrl, competition);
  }

  updateCompetition(id: string, competition: UpdateCompetitionDto): Observable<Competition> {
    return this.http.patch<Competition>(`${this.apiUrl}/${id}`, competition);
  }

  deleteCompetition(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
