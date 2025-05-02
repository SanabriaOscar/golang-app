  import { Component } from '@angular/core';
  import { RouterOutlet } from '@angular/router';
  import { CategoryListComponent } from "./categories/components/category-list.component";

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [RouterOutlet, CategoryListComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
  })
  export class AppComponent {
    title = 'front';
  }
