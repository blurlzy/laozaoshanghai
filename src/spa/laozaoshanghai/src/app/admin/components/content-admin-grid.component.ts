import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// angular material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
// models & services
import { ContentItem } from '../../public/content-item.model';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
// components
import { ContentAdminFormComponent } from '../components/content-admin-form.component';


@Component({
    selector: 'app-content-admin-grid',
    imports: [CommonModule, MatIconModule, MatButtonModule,
        TruncatePipe],
    template: `
      <table class="table table-striped table-hover">
        <thead>
            <tr>
              <th scope="col">Content</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
          @for(item of data;track item.id) {
            <tr>
                <td class="align-middle">{{ item.text | truncate:38:false:'...' }}</td>
                <td class="align-middle">{{ item.dateCreated | date: 'short' }}</td>
                <td>
                  <button type="button" class="btn me-1" (click)="openDialog(item)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                </td>
            </tr>
          }
        </tbody>
      </table>
  `,
    styles: ``
})
export class ContentAdminGridComponent {
  @Input({required: true}) data: any = [];
  @Output() dataChanged = new EventEmitter<any>();

  constructor(private dialog: MatDialog) { 

  }

  openDialog(item:ContentItem): void { 
    const dialogRef = this.dialog.open(ContentAdminFormComponent, {
      width: '680px',
      data: item
    });

    // update or delete successfully
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        // emit id of the updated or deleted content
        this.dataChanged.emit(item.id);
      }
    });
  }
}
