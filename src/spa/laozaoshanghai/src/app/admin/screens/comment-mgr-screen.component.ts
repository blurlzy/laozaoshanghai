import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// material
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
// models & services
import { ContentItem, Comment } from '../../public/content-item.model';
import { PagedList } from '../../shared/models/paged-list.model';
import { ManagementService } from '../management.service';
import { Loader } from '../../shared/services/loader.service';
// components
import { CommentAdminGridComponent } from '../components/comment-admin-grid.component';

@Component({
    selector: 'app-comment-mgr-screen',
    imports: [CommonModule, ReactiveFormsModule, MatPaginatorModule, MatRadioModule,
        CommentAdminGridComponent],
    template: `
    <div class="container col-sm-12 px-2 py-3">
     <div class="row">
        <div class="col-lg-3 col-md-12">
          <select class="form-select" [formControl]="statusCtrl">            
              <option value="1">Pending</option>
              <option value="2">Reviewed</option>
          </select>
        </div>
     </div>

      <div class="row mt-2"> 
        <div class="col-md-12">
          <app-comment-admin-grid [data]="pagedList.data" (dataChanged)="reload($event)"></app-comment-admin-grid>
        </div>
        <div class="col-md-12">
            <mat-paginator #paginator 
              [pageSize]="filterFormGroup.value.pageSize"
              [pageIndex]="filterFormGroup.value.pageIndex" 
              [length]="pagedList.total"
              [hidePageSize]="true" 
              [disabled]="loader.isLoading | async"
              (page)="pageIndexChanged($event)" 
              showFirstLastButtons>
            </mat-paginator> 
        </div>
      </div>
    </div>
  `,
    styles: ``
})
export class CommentMgrScreenComponent {
  // filter form group
  filterFormGroup = new FormGroup({
    // reviewed: new FormControl(false, Validators.nullValidator),
    pageSize: new FormControl(12), // default page size: 30
    pageIndex: new FormControl(0)
  });
  statusCtrl = new FormControl('1');
  pagedList: PagedList<Comment> = { data: [], total: 0 };

  // ctor
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private mgrService: ManagementService,
    public loader: Loader) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const pageIndex = +params['pageIndex'];
			// update the filter form group
			this.filterFormGroup.patchValue({
				pageIndex: pageIndex && pageIndex > 0 ? pageIndex : 0,
			});
      this.statusCtrl.setValue(params['reviewed'] === 'true' ? '2' : '1');
      // reset data
      this.pagedList = { data: [], total: 0 };

      // list comments
      this.listComments();
    });

    this.statusCtrl.valueChanges.subscribe(value => {
    
      this.router.navigate(['/admin/comments'], {
        queryParams: {
          reviewed: value === '2' ? true : false,
          pageIndex: this.filterFormGroup.value.pageIndex,
        }
      });
    });
  }

  pageIndexChanged(event: PageEvent): void {
		// update the page index in the query string, which will trigger the query params changes event		
    this.router.navigate(['/admin/comments'], {
			queryParams: {
        reviewed: this.statusCtrl.value === '2' ? true : false,
				pageIndex: event.pageIndex,
			}
		});
	}

  reload(event:any): void {
    console.log('updated id:', event);
    this.listComments();
  }

  private listComments() {
    this.mgrService.listComments(this.statusCtrl.value === '2' ? true : false, this.filterFormGroup.value.pageIndex, this.filterFormGroup.value.pageSize)
      .subscribe(data => {
        this.pagedList = data;
      });
  }

}
