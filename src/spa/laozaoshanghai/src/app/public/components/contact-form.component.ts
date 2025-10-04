import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// angular material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// models & services
import { ContentService } from '../content.service';
import { Loader } from '../../shared/services/loader.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
    selector: 'app-contact-form',
    imports: [CommonModule, ReactiveFormsModule,
        MatFormFieldModule, MatInputModule],
    template: `
      <form [formGroup]="contactForm">
        <div class="col-md-12 mt-3">
          <mat-form-field class="full-width">
            <mat-label>名字</mat-label>
            <input matInput type="text" required formControlName="name">
          </mat-form-field>
        </div>

        <div class="col-md-12 mb-3">
          <mat-form-field class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" required formControlName="email">
          </mat-form-field>
        </div>

        <div class="col-md-12 mb-3">
          <mat-form-field class="full-width">
            <mat-label>内容</mat-label>
            <textarea rows="3" maxlength="500" matInput required formControlName="content"></textarea>
          </mat-form-field>
        </div>

        <div class="col-md-12 mb-3">
          <button class="btn btn-primary btn-lg px-4"
            [disabled]="contactForm.invalid || (loader.isLoading | async)" (click)="send()">提交</button>
        </div>
      </form>
  `,
    styles: ``
})
export class ContactFormComponent {
  // send contact message form
  contactForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    content: new FormControl('', [Validators.required, Validators.maxLength(500)])
  });

  // ctor
  constructor(private contentService: ContentService,
          private snackbarService: SnackbarService,
          public loader: Loader) { }

  // send message
  send(): void {
    this.contentService.sendMessage(this.contactForm.value)
      .subscribe(result => {
        // reset form
        this.contactForm.reset();
        this.snackbarService.success('提交成功!');
      });

  }
}
