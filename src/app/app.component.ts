import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { FullWidthCellRenderer } from './full-width-cell-renderer.component';
import { makeGroups, RowGroup } from './row.group';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AgGridModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent extends RowGroup implements OnInit, OnDestroy {

  ngOnInit(): void {
    super.onInit();
    this.rowData = makeGroups(this.rawData, ['country', 'model', 'year']);
  }
  ngOnDestroy(): void {
    super.onDestroy();
  }
  override columnDefs: ColDef[] = [
    { headerName: 'Group', field: 'country', cellDataType: 'string', comparator: () => 0 },
    { headerName: 'Make', field: 'make', cellDataType: 'string', comparator: () => 0 },
    { headerName: 'Model', hide: true, field: 'model', cellDataType: 'string', comparator: () => 0 },
    { headerName: 'Price', field: 'price', cellDataType: 'number', comparator: () => 0 },
    { headerName: 'Year', hide: true, field: 'year', cellDataType: 'number', comparator: () => 0 },
  ];

  defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    flex: 1
  };

  rawData = [
    { id: 1, country: 'Japan', make: 'Ford', model: 'Mondeo', price: 3200, year: 2020 },
    { id: 2, country: 'Japan', make: 'Ford', model: 'Mondeo', price: 320, year: 2021 },
    { id: 3, country: 'Japan', make: 'Ford', model: 'Mondeo', price: 32, year: 2022 },
    { id: 4, country: 'Japan', make: 'Ford', model: 'Tesla', price: 3200, year: 2020 },
    { id: 5, country: 'Japan', make: 'Ford', model: 'Tesla', price: 320, year: 2021 },
    { id: 6, country: 'Japan', make: 'Ford', model: 'Tesla', price: 32, year: 2022 },
    { id: 7, country: 'Japan', make: 'Ford2', model: 'Tesla', price: 13200, year: 2020 },
    { id: 8, country: 'Japan', make: 'Ford2', model: 'Tesla', price: 1320, year: 2021 },
    { id: 9, country: 'Japan', make: 'Ford2', model: 'Tesla', price: 145332, year: 2022 },

    { id: 10, country: 'China', make: 'Ford', model: 'Mondeo', price: 100, year: 2020 },
    { id: 11, country: 'China', make: 'Ford', model: 'Mondeo', price: 200, year: 2021 },
    { id: 12, country: 'China', make: 'Ford', model: 'Mondeo', price: 300, year: 2022 },
    { id: 13, country: 'China', make: 'Ford', model: 'Bogadi', price: 300, year: 2020 },
    { id: 14, country: 'China', make: 'Ford', model: 'Bogadi', price: 200, year: 2021 },
    { id: 15, country: 'China', make: 'Ford', model: 'Bogadi', price: 600, year: 2022 },

    { id: 16, country: 'Bangladesh', make: 'Ford', model: 'Mondeo', price: 10, year: 2020 },
    { id: 17, country: 'Bangladesh', make: 'Ford', model: 'Mondeo', price: 30, year: 2021 },
    { id: 18, country: 'Bangladesh', make: 'Ford', model: 'Mondeo', price: 45, year: 2022 },
    { id: 19, country: 'Bangladesh', make: 'Ford', model: 'Lemborg', price: 34, year: 2020 },
    { id: 20, country: 'Bangladesh', make: 'Ford', model: 'Lemborg', price: 67, year: 2021 },
    { id: 21, country: 'Bangladesh', make: 'Ford', model: 'Lemborg', price: 21, year: 2022 },
  ]

  //(columnResized)="onColumnResized($event)"
  /*onColumnResized(event: any) {
    if (event.finished) {
      event.api.refreshCells({ force: true });
      this.grid.api.redrawRows();
    }
  }*/

  fullWidthCellRenderer: any = FullWidthCellRenderer;

}

