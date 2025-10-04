import { Component,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// angular material
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule,  MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
// models & services
import { ContentItem } from '../../public/content-item.model';
import { ManagementService } from '../management.service';
import { Loader } from '../../shared/services/loader.service';
import { UtilService } from '../../shared/services/util.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
// components
import { ConfirmComponent } from '../../shared/components/confirm.component';

@Component({
    selector: 'app-content-admin-form',
    imports: [CommonModule, ReactiveFormsModule,
        MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule, MatCardModule, MatButtonModule, MatDialogModule],
    template: `
  <mat-card class="mat-elevation-z0">
    <mat-card-content>
      <form [formGroup]="contentItemForm">
        <div class="mb-2">
          <mat-form-field appearance="fill" class="full-width">
          <mat-label>Content Text</mat-label>
            <textarea matInput rows="6" formControlName="text" required></textarea>
          </mat-form-field>
        </div>

        <div class="mb-4">
          <label class="form-label">Images</label>
          <input #fileInput class="form-control" type="file" multiple (change)="setFilename($event)" [disabled]="editing">
          <ul class="list-group list-group-flush mt-2">
            <li class="list-group-item" *ngFor="let file of selectedFiles">
              <label class="valign-center"> <i class="bi bi-image"></i> {{ file.name }}</label>
            </li>
          </ul>
        </div>
        
        <div class="mb-2 row">
          @for(item of data?.mediaItems; track item.fileName) {
            <div class="col-2">
              <img [src]="item.url" class="img-fluid" alt="laozaoshanghai" >
            </div>	
          }				
        </div>

        <div class="mb-2">
          <mat-form-field class="full-width" appearance="fill">
            <mat-label>Tags</mat-label>
            <mat-chip-grid #chipList>
              <mat-chip-row *ngFor="let tag of tags" (removed)="remove(tag)">
                {{tag}}
                <button matChipRemove>
                  <i class="bi bi-x-circle-fill"></i>
                </button>
              </mat-chip-row>
              <input [matChipInputFor]="chipList"
                [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                [matChipInputAddOnBlur]="addOnBlur"
                (matChipInputTokenEnd)="add($event)">
            </mat-chip-grid>
          </mat-form-field>
        </div>

        <div class="mb-2">
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Source</mat-label>
            <input matInput formControlName="source">
          </mat-form-field>
        </div>

        @if(editing) {
          <button type="button" class="btn btn-danger float-end" (click)="confirmDel()"> 
            <i class="bi bi-trash-fill"></i> Delete
          </button>
        }

      </form>
    </mat-card-content>
    <mat-card-actions>
      <button type="button" class="btn btn-secondary me-2 ms-2" [mat-dialog-close]="false" cdkFocusInitial>Close</button>
      <button type="button" class="btn btn-primary"
        [disabled]="contentItemForm.invalid || (loader.isLoading | async)" (click)="save()">Save</button>
    </mat-card-actions>
  </mat-card>
  `,
    styles: ``
})
export class ContentAdminFormComponent {
  editing: boolean = false;
  // content item form
  contentItemForm: FormGroup = new FormGroup({
    id: new FormControl('', [Validators.nullValidator]),
    text: new FormControl('', [Validators.required]),
    tags: new FormControl([], [Validators.nullValidator]),
    source: new FormControl('', [Validators.nullValidator])
  });

  // multiple files ( up to 3 photos)
	selectedFiles: any = [];
	// mat chip list configs
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	addOnBlur = true;
	tags: string[] = [];

  // ctor
  constructor(public dialogRef: MatDialogRef<ContentAdminFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private mgrService: ManagementService,
    private utilService: UtilService,
		private snackbarService: SnackbarService,
    public loader: Loader) {

  }

  ngOnInit(): void {
    if(this.data && this.data.id) {
        // set the form vals
			this.contentItemForm.patchValue({
				id: this.data.id,
				text: this.data.text,
				source: this.data.source,
			});

			// tags
			this.tags = this.data.tags ? this.data.tags : [];
      this.editing = true;
    }
    else{
      // reset form
      this.contentItemForm.reset();
      this.editing = false;
    }
  }

  	// add a tag into tag list
	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		// Add our fruit
		if (value) {
			this.tags.push(value);
		}

		// Clear the input value
		event.chipInput!.clear();
	}

	// remove a tag from the tag list
	remove(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}
	}

  // select the file to upload
	setFilename(event: any) {
		// reset
		this.selectedFiles = [];
		const files = event.target.files;
		
		if (files && files.length > 0) {
			// validate the file type, ONLY images are allowed
			for (let i = 0; i < files.length; i++) {
				if (!this.utilService.isValidPhoto(files[i].name)) {
					this.snackbarService.error(`Invalid file type: ${files[i].name}.`);
					return;
				}
			}
			this.selectedFiles = files;
		}	

	}


  save(): void {
    if(this.editing){
      this.update();
      return;
    }

    // add 
    this.create();
  }

  create(): void {
		// add file data into form data
		const formData = new FormData();

		if (this.selectedFiles.length === 0) {
			this.snackbarService.error('At least one image is required.');
			return;
		}

		// add the files
		for(let i = 0; i < this.selectedFiles.length;  i ++) {
			formData.append('files', this.selectedFiles[i]);	
		}
		// add form data
		formData.append('text', this.contentItemForm.value.text);
		formData.append('tags', this.tags.toString()); // comma seperated string
		formData.append('source', this.contentItemForm.value.source);

		// submit
    this.mgrService.addContentItem(formData)
      .subscribe(data => {
        this.snackbarService.success('Saved!');
        // close
        this.dialogRef.close(true);
      });
	}

  update(): void {
    // set the tags
		this.contentItemForm.patchValue({
			tags: this.tags
		})
  
    this.mgrService.updateContentItem(this.contentItemForm.value)
      .subscribe(data => {
        this.snackbarService.success('Saved!');
        // close
        this.dialogRef.close(true);
      });
  }

  confirmDel(): void {
    const confirmDialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px'
    });
    
    confirmDialogRef.afterClosed().subscribe(result => {
      if(result === true){
        // delete item
        this.mgrService.deleteContentItem(this.data.id)
          .subscribe(data => {
            this.snackbarService.success('The item was deleted.');
            // close
            this.dialogRef.close(true);
          });
      }
    });
  } 
}
