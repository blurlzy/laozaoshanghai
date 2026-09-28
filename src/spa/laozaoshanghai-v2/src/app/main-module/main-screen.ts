import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardList} from './card-list';
import { MainSection} from './main-section';

@Component({
  imports: [ CommonModule, CardList, MainSection ],
  selector: 'app-main-screen',
  styles: ``,
  template: ` 
    <app-main-section></app-main-section>
    <app-card-list></app-card-list>
  
  `,
})
export class MainScreen {}
