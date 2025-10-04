import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../content-item.model';

@Component({
    selector: 'app-comment-list',
    imports: [CommonModule],
    template: `
	    <div class="list-group list-group-flush scrollarea mt-1">
				<div class="list-group-item list-group-item-action py-3 " *ngFor="let comment of data">
					<div class="d-flex w-100 align-items-center justify-content-between">
						<strong class="mb-1">{{ comment.name}}</strong>
						<small class="text-muted">{{ comment.dateCreated | date: 'shortDate' }}</small>
					</div>
					<div class="col-10 mb-1 small">
						<figcaption style="white-space: pre-line">
							{{ comment.commentText }}
						</figcaption>

					</div>
				</div>
		</div>
  `,
    styles: ``
})
export class CommentListComponent {
  @Input({required: true}) data: Comment[];
}
