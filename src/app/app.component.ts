import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GetRowIdFunc, GridReadyEvent, IsFullWidthRowParams, RowHeightParams } from 'ag-grid-community';
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
  sortOrder: 'asc' | 'desc' | '' = '';
  colId: string = '';
  colDataType: 'string' | 'number' = 'string';

  dfs(data: any, index: number, changeProp = true) {
    if (data.children) {
      data.children.forEach((child: any) => {
        if (child.isExpanded) {
          this.dfs(child, index + 1);
          if (changeProp) {
            child.isExpanded = false;
            this.metadata.delete(child);
          }
          this.rowData.splice(index + 1, child.children.length);
        }
      });
    }
  }

  sortByMetadata() {
    this.metadata.forEach((it) => {
      if (this.columnDefs[0].field === this.colId) {
        const groupRecord = it.children[0];
        if (!groupRecord['groupId']) {
          return;
        }
        this.colId = groupRecord['groupId'];
        this.colDataType = this.getColDataType(groupRecord['groupId']);
      }
      const index = this.rowData.indexOf(it);
      const sorted = this.sortHelper(it.children.slice());
      this.rowData.splice(index + 1, 0, ...sorted);
    });
  }

  sortHelper(data: any[]): any {
    if (this.sortOrder === 'asc') {
      switch (this.colDataType) {
        case 'string':
          return data.sort((a, b) => a[this.colId].localeCompare(b[this.colId]));
        case 'number':
          return data.sort((a, b) => a[this.colId] - b[this.colId]);
        default:
          return data;
      }
    } else if (this.sortOrder === 'desc') {
      switch (this.colDataType) {
        case 'string':
          return data.sort((a, b) => b[this.colId].localeCompare(a[this.colId]));
        case 'number':
          return data.sort((a, b) => b[this.colId] - a[this.colId]);
        default:
          return data;
      }

    } else {
      return data;
    }
  }
  cleanupRowData(data: any[]) {
    this.metadata.forEach((it) => {
      if (it.level === 0) {
        const rowIndex = data.indexOf(it);
        this.dfs(it, rowIndex, false);
        data.splice(rowIndex + 1, it.children.length);
      }
    });
  }
  sortChanged(event: any) {
    const sortedColumn = event.columnApi.getColumnState().find((col: any) => col.sort);
    if (!sortedColumn) return;
    this.setSortInfo(sortedColumn.sort, sortedColumn.colId, this.getColDataType(sortedColumn.colId));
    this.cleanupRowData(this.rowData);
    this.rowData = this.sortHelper(this.rowData);
    this.sortByMetadata();
    this.grid.api.setRowData(this.rowData);
  }

  setSortInfo(sortOrder: any, colIndex: string, colDataType: 'string' | 'number') {
    this.sortOrder = sortOrder;
    this.colId = colIndex;
    this.colDataType = colDataType;
  }
  metadata = new Set<any>();
  ngOnInit() {
    action$.isA(ExpandCollapseAction).subscribe(action => {
      if (action.data.isExpanded) {
        this.dfs(action.data, action.rowIndex);
        this.rowData.splice(action.rowIndex + 1, action.data.children.length);
        this.metadata.delete(action.data);
      } else {
        if (this.columnDefs[0].field === this.colId) {
          const groupRecord = action.data.children[0];
          if (groupRecord['groupId']) {
            this.colId = groupRecord['groupId'];
            this.colDataType = this.getColDataType(groupRecord['groupId']);
          }
        }
        this.rowData.splice(action.rowIndex + 1, 0, ...this.sortHelper(action.data.children.slice()));
        this.metadata.add(action.data);
      }
      action.data.isExpanded = !action.data.isExpanded;
      this.grid.api.setRowData(this.rowData);
    });
  }
  getColDataType(colId: string): any {
    return this.columnDefs.find((it) => it.field === colId)?.cellDataType ?? 'string';
  }
  title = 'ag-grid-row-group';
  columnDefs: ColDef[] = [
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

  rowData = [
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

  getRowId: GetRowIdFunc = (params: any) => params.data?.id
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