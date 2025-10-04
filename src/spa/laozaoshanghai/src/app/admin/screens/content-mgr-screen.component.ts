import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// material
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
// models & services
import { ContentItem } from '../../public/content-item.model';
import { PagedList } from '../../shared/models/paged-list.model';
import { ManagementService } from '../management.service';
import { Loader } from '../../shared/services/loader.service';
// components
import { ContentAdminGridComponent } from '../components/content-admin-grid.component';
import { ContentAdminFormComponent } from '../components/content-admin-form.component';

@Component({
    selector: 'app-content-mgr-screen',
    imports: [CommonModule, ReactiveFormsModule, MatPaginatorModule, MatButtonModule,
        ContentAdminGridComponent],
    template: `
    <div class="container col-sm-12 px-2 py-3">
      <div class="row">      
        <div class="col-md-12">       
          <button type="button" class="btn btn-primary mb-2" (click)="openDialog()">Add new content</button>
          <app-content-admin-grid [data]="pagedList.data" (dataChanged)="reload($event)"></app-content-admin-grid>
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
export class ContentMgrScreenComponent {
  // filter form group
  filterFormGroup = new FormGroup({
    keyword: new FormControl(''),
    pageSize: new FormControl(12), // default page size: 30
    pageIndex: new FormControl(0)
  });
  pagedList: PagedList<ContentItem> = { data: [], total: 0 };

  // ctor
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private mgrService: ManagementService,
    private dialog: MatDialog,
    public loader: Loader) {

  }

  ngOnInit(): void {
    // query params change
    this.activatedRoute.queryParams.subscribe(params => {
      const pageIndex = +params['pageIndex'];
      const keyword = params['keyword'];

      // retrive the query params
      this.filterFormGroup.patchValue({
        pageIndex: pageIndex ? pageIndex : 0,
        keyword: keyword ? keyword : '',
      });

      // clear result
      this.pagedList = { data: [], total: 0 };
      // load data
      this.listContent(this.filterFormGroup.value.keyword, this.filterFormGroup.value.pageIndex, this.filterFormGroup.value.pageSize);
    });
  }

  pageIndexChanged(event: PageEvent): void {
		// update the page index in the query string, which will trigger the query params changes event		
		this.updateQueryParams(event.pageIndex);
	}

  openDialog(): void { 
    const dialogRef = this.dialog.open(ContentAdminFormComponent, {
      width: '680px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        // reload data
        this.listContent(this.filterFormGroup.value.keyword, this.filterFormGroup.value.pageIndex, this.filterFormGroup.value.pageSize);
      }
    });
  }
  
  reload(event): void {
    console.log("updated or deleted item", event);
    // reload
    this.listContent(this.filterFormGroup.value.keyword, this.filterFormGroup.value.pageIndex, this.filterFormGroup.value.pageSize);
  }
  
  // private methods
  private listContent(keyword: string, pageIndex: number, pageSize: number): void {

    this.mgrService.getContent(keyword, pageIndex, pageSize)
      .subscribe(data => {
        this.pagedList = data;
        
      });

  }

  // update query params
	private updateQueryParams(pageIndex: number): void {
		this.router.navigate(['/admin'], {
			queryParams: {
				pageIndex: pageIndex,
				keyword: this.filterFormGroup.value.keyword,
			}
		});
	}
}
