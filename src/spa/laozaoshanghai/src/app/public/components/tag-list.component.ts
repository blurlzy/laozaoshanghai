import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// material
import { MatChipsModule,  } from '@angular/material/chips';

@Component({
    selector: 'app-tag-list',
    imports: [CommonModule, RouterModule, MatChipsModule],
    template: `
  <div class="mt-2">
    <mat-chip-listbox>
      @for (tag of tags; track tag) {
        <mat-chip-option class="mb-2 mt-2">
          <a class="text-dark text-decoration-none" [routerLink]="['/']" 
            [queryParams]="{ keyword: tag }">{{ tag  }} 
          </a>
        </mat-chip-option>
      }
    </mat-chip-listbox>
  </div>
  `,
    styles: ``
})
export class TagListComponent {
  @Input({ required: true }) tags: string[] = [];
}
