import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, IsFullWidthRowParams, RowHeightParams } from 'ag-grid-community';
import { ExpandCollapseAction, FullWidthCellRenderer } from './full-width-cell-renderer.component';
import { action$ } from './state';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AgGridModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  dfs(data: any, index: number) {
    if (data.children) {
      data.children.forEach((child: any) => {
        if (child.isExpanded) {
          this.dfs(child, index + 1);
          child.isExpanded = false;
          this.rowData.splice(index + 1, child.children.length);
        }
      });
    }
  }
  ngOnInit() {
    action$.isA(ExpandCollapseAction).subscribe(action => {
      if (action.data.isExpanded) {
        this.dfs(action.data, action.rowIndex);
        this.rowData.splice(action.rowIndex + 1, action.data.children.length);
      } else {
        this.rowData.splice(action.rowIndex + 1, 0, ...action.data.children);
      }
      action.data.isExpanded = !action.data.isExpanded;
      this.grid.api.setRowData(this.rowData);
    });
  }

  title = 'ag-grid-row-group';
  columnDefs: ColDef[] = [
    { headerName: 'Group', field: 'country' },
    { headerName: 'Make', field: 'make' },
    { headerName: 'Model', field: 'model' },
    { headerName: 'Price', field: 'price' },
  ];

  defaultColDef = {
    sortable: false,
    filter: false,
    flex: 1
  };

  rowData = [
    {
      country: 'Japan', groupId: 'country',
      make: 'Ford', model: 'Mondeo', price: 32000, children: [
        {
          make: 'Ford1', level: 1, model: 'child1', price: 35000, year: 2020, groupId: 'year',
          children: [
            { make: 'Ford2', model: 'child1-1', price: 35000, year: 2020 },
            { make: 'Ford2', model: 'child1-2', price: 35000, year: 2021 }
          ]
        },
        {
          make: 'Ford1', level: 1, model: 'child2', price: 35000, groupId: 'year', year: 2021, children: [
            { make: 'Ford2', model: 'child2-1', price: 35000, year: 2021 },
            { make: 'Ford2', model: 'child2-2', price: 35000, year: 2022 },
            { make: 'Ford2', model: 'child2-3', price: 35000, year: 2022 }
          ]
        },
      ], isExpanded: false
    },
    {
      country: 'Bangladesh', groupId: 'country',
      make: 'Ford', model: 'Mondeo', price: 32000, children: [
        {
          make: 'Ford1', level: 1, model: 'child1', price: 35000, year: 2020, groupId: 'year',
          children: [
            { make: 'Ford2', model: 'child1-1', price: 35000, year: 2020 },
            { make: 'Ford2', model: 'child1-2', price: 35000, year: 2021 }
          ]
        },
        {
          make: 'Ford1', level: 1, model: 'child2', price: 35000, groupId: 'year', year: 2021, children: [
            { make: 'Ford2', model: 'child2-1', price: 35000, year: 2021 },
            { make: 'Ford2', model: 'child2-2', price: 35000, year: 2022 },
            { make: 'Ford2', model: 'child2-3', price: 35000, year: 2022 }
          ]
        },
      ], isExpanded: false
    },
    {
      country: 'China', groupId: 'country',
      make: 'Ford', model: 'Mondeo', price: 32000, children: [
        {
          make: 'Ford1', level: 1, model: 'child1', price: 35000, year: 2020, groupId: 'year',
          children: [
            { make: 'Ford2', model: 'child1-1', price: 35000, year: 2020 },
            { make: 'Ford2', model: 'child1-2', price: 35000, year: 2021 }
          ]
        },
        {
          make: 'Ford1', level: 1, model: 'child2', price: 35000, groupId: 'year', year: 2021, children: [
            { make: 'Ford2', model: 'child2-1', price: 35000, year: 2021 },
            { make: 'Ford2', model: 'child2-2', price: 35000, year: 2022 },
            { make: 'Ford2', model: 'child2-3', price: 35000, year: 2022 }
          ]
        },
      ], isExpanded: false
    },
  ];

  getRowHeight: (params: RowHeightParams) => number | undefined | null = (
    params: RowHeightParams,
  ) => {
    // return 100px height for full width rows
    if (isFullWidth(params.data)) {
      return 40;
    }
    return 40;
  };
  isFullWidthRow: (params: IsFullWidthRowParams) => boolean = (
    params: IsFullWidthRowParams,
  ) => {
    return true;//isFullWidth(params.rowNode.data);
  };
  fullWidthCellRenderer: any = FullWidthCellRenderer;
  grid: GridReadyEvent = undefined as any

  onGridReady(params: GridReadyEvent) {
    this.grid = params;
  }
}

function isFullWidth(data: any) {
  // return true when country is Peru, France or Italy
  return ['Ford'].indexOf(data.make) >= 0;
}