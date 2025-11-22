import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TableEmptyMessageComponent } from '../../../shared/components/empty-message.component';
import { PageHeaderComponent } from '../../../shared/components/header.component';
import { Person } from '../../../shared/interfaces/person.interface';
import { personsActions } from '../../../store/persons/persons.actions';
import { personsFeature } from '../../../store/persons/persons.store';

@Component({
  selector: 'app-persons-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule,
    TableEmptyMessageComponent,
    PageHeaderComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './persons-list.component.html',
})
export class PersonsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  readonly persons = this.store.selectSignal(personsFeature.selectPersons);
  readonly isLoading = this.store.selectSignal(personsFeature.selectLoading);

  ngOnInit() {
    this.store.dispatch(personsActions.loadPersons({}));
  }

  addPerson() {
    this.router.navigate(['/cms/persons/create']);
  }

  editPerson(person: Person) {
    this.router.navigate(['/cms/persons/edit', person.id]);
  }

  deletePerson(person: Person) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${person.firstName}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(personsActions.deletePerson({ id: person.id }));
      },
    });
  }
}
