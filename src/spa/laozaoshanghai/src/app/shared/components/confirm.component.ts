import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// angular material
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'app-confirm',
    imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule],
    template: `
      <h2  mat-dialog-title class="text-danger"><i class="bi bi-exclamation-lg"></i></h2>
      <div mat-dialog-content>
            <span>Are you sure you want to continue?</span>
      </div>
      <div mat-dialog-actions>
        <button mat-flat-button [mat-dialog-close]="false" cdkFocusInitial class="ms-2">Close</button>
        <button mat-flat-button  (click)="confirm()" color="warn" class="ms-2">Delete</button>
      </div>
  
  `,
    styles: ``
})
export class ConfirmComponent {
  //  ctor
  constructor(public dialogRef: MatDialogRef<ConfirmComponent>) { 

  }

  confirm(): void {
	  // emit true value to the caller
	  this.dialogRef.close(true);
  }
}
