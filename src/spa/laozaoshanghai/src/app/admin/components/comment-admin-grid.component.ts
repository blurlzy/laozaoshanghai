import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
// angular material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
// pipes
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
// models & services
import { Comment } from '../../public/content-item.model';
import { ManagementService } from '../management.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
// components
import { ConfirmComponent } from '../../shared/components/confirm.component';

@Component({
    selector: 'app-comment-admin-grid',
    imports: [CommonModule, MatIconModule, MatButtonModule,
        TruncatePipe],
    template: `
      <table class="table table-striped table-hover">
        <thead>
            <tr>
              <th scope="col">Comment</th>
              <th scope="col">By</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
          @for(item of data;track item.id) {
            <tr>
                <td class="align-middle">{{ item.commentText | truncate:38:false:'...' }}</td>
                <td class="align-middle">{{ item.name }}</td>
                <td class="align-middle">{{ item.dateCreated | date: 'short' }}</td>
                <td>
                  <button type="button" class="btn" *ngIf="!item.reviewed" (click)="approve(item)">
                    <i class="bi bi-check2-square"></i>
                  </button>
                  <button type="button" class="btn" (click)="confirmDelete(item)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
            </tr>
          }
        </tbody>
    </table>
  `,
    styles: ``
})
export class CommentAdminGridComponent {
  @Input({ required: true }) data: any = [];
  @Output() dataChanged = new EventEmitter<any>();

  // ctor
  constructor(private mgrService: ManagementService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog) {

  }

  approve(item: Comment): void {
    const model = {
      id: item.id,
      contentItemId: item.contentItemId,
      approved: true,
    }

    // approve
    this.mgrService.approveComment(model).subscribe(() => {
      this.dataChanged.emit(item.id);
    });
  }

  // confirm delete
  confirmDelete(item: Comment): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        // delete item
        this.mgrService.deleteComment(item.id)
          .subscribe(data => {
            this.snackbarService.success('The item was deleted.');
            this.dataChanged.emit(item.id);
          });
      }
    });
  }
}
