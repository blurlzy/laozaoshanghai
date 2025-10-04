import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// angular material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// models & services
import { ContentService } from '../content.service';
import { Loader } from '../../shared/services/loader.service';

@Component({
    selector: 'app-comment-form',
    imports: [CommonModule, ReactiveFormsModule,
        MatFormFieldModule, MatInputModule],
    template: `

  @if(!showCommentForm){
    <button class="btn btn-outline-secondary mt-2 mb-2 full-width" type="button"
      (click)="showCommentForm = true">留言</button>
  }
  @else{
    <form class="full-width" [formGroup]="addCommentForm">
      <div class="mb-2">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>名字</mat-label>
          <input matInput required formControlName="name">
        </mat-form-field>
      </div>

      <div class="mb-2">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>留言</mat-label>
          <textarea matInput rows="2" required #commentTextInput
            formControlName="commentText" maxlength="180"></textarea>
          <!-- <mat-hint>留言在审核后可见</mat-hint> -->
          <mat-hint align="end">{{commentTextInput.value?.length || 0}}/180</mat-hint>
        </mat-form-field>
      </div>

      <button class="btn btn-primary me-2" type="button"
          [disabled]="addCommentForm.invalid || (loader.isLoading | async)" (click)="addComment()">提交</button>
      <button class="btn btn-secondary" type="button"
        (click)="showCommentForm = false">取消</button>
    </form>
  }

  `,
    styles: ``
})
export class CommentFormComponent {
  @Input({required:true}) contentId: string;
  @Output() commentSubmitted = new EventEmitter<any>();

  showCommentForm: boolean = false;

  // comment form
  addCommentForm: FormGroup = new FormGroup({
    contentItemId: new FormControl(''),
    name: new FormControl([], [Validators.required]),
    commentText: new FormControl('', [Validators.required, Validators.maxLength(180), Validators.minLength(3)]),
  });

  // ctor
  constructor(private contentService: ContentService,
    public loader: Loader) {

  }

  addComment(): void {
    // set the content id
    this.addCommentForm.patchValue({ contentItemId: this.contentId });
   
    // add comment
    this.contentService.addComment(this.addCommentForm.value)
      .subscribe(() => {
        this.addCommentForm.reset();
        // notify the parent component
        this.commentSubmitted.emit();
      });
  }

}
