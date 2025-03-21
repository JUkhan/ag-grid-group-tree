import { ColDef, GetRowIdFunc, GridReadyEvent, IsFullWidthRowParams, RowHeightParams } from "ag-grid-community";
import { ExpandCollapseAction } from "./full-width-cell-renderer.component";
import { action$ } from "./state";
import { Subject } from "rxjs/internal/Subject";
import { takeUntil } from "rxjs/operators";

export class RowGroup {
  sortOrder: 'asc' | 'desc' | '' = '';
  colId: string = '';
  colDataType: 'string' | 'number' = 'string';
  columnDefs: ColDef[] = []
  rowData: any[] = []
  tearDown$ = new Subject<void>();
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
  onDestroy() {
    this.tearDown$.next();
    this.tearDown$.complete();
  }
  onInit() {
    action$.isA(ExpandCollapseAction).pipe(takeUntil(this.tearDown$)).subscribe(action => {
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
  getRowId: GetRowIdFunc = (params: any) => params.data?.id
  getRowHeight: (params: RowHeightParams) => number | undefined | null = (
    params: RowHeightParams,
  ) => 40;
  isFullWidthRow: (params: IsFullWidthRowParams) => boolean = (
    params: IsFullWidthRowParams,
  ) => true;

  grid: GridReadyEvent = undefined as any

  onGridReady(params: GridReadyEvent) {
    this.grid = params;
  }
}