import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  CreatePersonDto,
  Person,
  PersonResponse,
  UpdatePersonDto,
} from '../shared/interfaces/person.interface';

@Injectable({ providedIn: 'root' })
export class PersonsService {
  private readonly apiUrl = 'http://localhost:3000/persons';
  http = inject(HttpClient);

  getPersons(): Observable<PersonResponse> {
    return this.http.get<Person[]>(this.apiUrl).pipe(
      map((person: Person[]) => ({
        data: person,
        meta: {
          total: person.length,
          page: 1,
          totalPages: 1,
          take: person.length,
        },
      })),
    );
  }

  getPersonById(id: string): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  createPerson(person: CreatePersonDto): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  updatePerson(id: string, person: UpdatePersonDto): Observable<Person> {
    return this.http.patch<Person>(`${this.apiUrl}/${id}`, person);
  }

  deletePerson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
