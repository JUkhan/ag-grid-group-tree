import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GridReadyEvent, IsFullWidthRowParams, RowHeightParams } from 'ag-grid-community';
import { ExpandCollapseAction, FullWidthCellRenderer } from './full-width-cell-renderer.component';
import { action$ } from './state';
import { RowGroup } from './row.group';


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
  }
  ngOnDestroy(): void {
    super.onDestroy();
  }
  override columnDefs: ColDef[] = [
    { headerName: 'Group', field: 'country', cellDataType: 'string', comparator: () => 0 },
    { headerName: 'Make', field: 'make', cellDataType: 'string', comparator: () => 0 },
    { headerName: 'Model', field: 'model', cellDataType: 'string', comparator: () => 0 },
    { headerName: 'Price', field: 'price', cellDataType: 'number', comparator: () => 0 },
    { headerName: 'Year', hide: true, field: 'year', cellDataType: 'number', comparator: () => 0 },
  ];

  defaultColDef = {
    sortable: true,
    filter: false,
    flex: 1
  };

  override rowData = [
    {
      country: 'Japan', groupId: 'country', id: 1,
      make: 'Ford', level: 0, model: 'Mondeo1', price: 32000, children: [
        {
          id: 2, make: 'Ford1', level: 1, model: 'child1', price: 35000, year: 2020, groupId: 'year',
          children: [
            { id: 3, make: 'Ford2', model: 'child1-1', price: 35000, year: 2020 },
            { id: 4, make: 'Ford2', model: 'child1-2', price: 3500, year: 2021 }
          ]
        },
        {
          id: 5, make: 'Ford1', level: 1, model: 'child2', price: 3500, groupId: 'year', year: 2021, children: [
            { id: 6, make: 'Ford2', model: 'child2-1', price: 350, year: 2021 },
            { id: 7, make: 'Ford2', model: 'child2-2', price: 35, year: 2022 },
            { id: 8, make: 'Ford2', model: 'child2-3', price: 3500, year: 2022 }
          ]
        },
      ], isExpanded: false
    },
    {
      id: 9, country: 'Bangladesh', groupId: 'country',
      make: 'Ford', level: 0, model: 'Mondeo0', price: 32000, children: [
        {
          id: 10, make: 'Ford1', level: 1, model: 'child1', price: 35000, year: 2020, groupId: 'year',
          children: [
            { id: 11, make: 'Ford2', model: 'child1-1', price: 35000, year: 2020 },
            { id: 12, make: 'Ford2', model: 'child1-2', price: 35000, year: 2021 }
          ]
        },
        {
          id: 13, make: 'Ford1', level: 1, model: 'child2', price: 35000, groupId: 'year', year: 2021, children: [
            { id: 14, make: 'Ford2', model: 'child2-1', price: 35000, year: 2021 },
            { id: 15, make: 'Ford2', model: 'child2-2', price: 35000, year: 2022 },
            { id: 16, make: 'Ford2', model: 'child2-3', price: 35000, year: 2022 }
          ]
        },
      ], isExpanded: false
    },
    {
      id: 17, country: 'China', groupId: 'country',
      make: 'Ford', level: 0, model: 'Mondeo2', price: 32000, children: [
        {
          id: 18, make: 'Ford1', level: 1, model: 'child1', price: 35000, year: 2020, groupId: 'year',
          children: [
            { id: 19, make: 'Ford2', model: 'child1-1', price: 35000, year: 2020 },
            { id: 20, make: 'Ford2', model: 'child1-2', price: 35000, year: 2021 }
          ]
        },
        {
          id: 21, make: 'Ford1', level: 1, model: 'child2', price: 35000, groupId: 'year', year: 2021, children: [
            { id: 22, make: 'Ford2', model: 'child2-1', price: 35000, year: 2021 },
            { id: 23, make: 'Ford2', model: 'child2-2', price: 35000, year: 2022 },
            { id: 24, make: 'Ford2', model: 'child2-3', price: 35000, year: 2022 }
          ]
        },
      ], isExpanded: false
    },
  ];

  fullWidthCellRenderer: any = FullWidthCellRenderer;

}
