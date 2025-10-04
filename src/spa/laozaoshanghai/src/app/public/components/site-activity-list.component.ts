import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// angular material
import { MatIconModule } from '@angular/material/icon';
// models & services
import { ContentService } from '../content.service';

@Component({
    selector: 'app-site-activity-list',
    imports: [CommonModule, MatIconModule],
    template: `
      <h5>更新日志</h5>
      <div class="card">										
        <ol class="list-group list-group-flush">
          @for(log of siteLogs; track log.dateCreated) {
            <li class="list-group-item d-flex justify-content-between align-items-start list-group-item-action py-2">
              <div class="me-auto">
                <div>{{ log.text }}</div>
                <label class="valign-center mt-1">
                  <i class="bi bi-calendar me-2"></i> {{ log.dateCreated | date: 'mediumDate' }}
                </label>
              </div>
            </li>
          }
        </ol>
      </div>	
  `,
    styles: ``
})
export class SiteActivityListComponent {
  // site update logs
	siteLogs: any = [];

  // ctor
  constructor(private contentService: ContentService) { 

  }

  ngOnInit(): void {
    this.getSiteUpdates();
  }

  private getSiteUpdates(): void {
    this.contentService.getSiteUpdates()
      .subscribe(result => {
        this.siteLogs = result;
      });
	}

}
