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
  metadata = new Set<any>();
  private _colId: string = '';
  private _rawData: any[] = [];
  onInit() {
    action$.isA(ExpandCollapseAction).pipe(takeUntil(this.tearDown$)).subscribe(action => {
      if (this.rowData[action.rowIndex] !== action.data) return;
      if (action.data.isExpanded) {
        this.lookAround(action.data, action.rowIndex);
        this.rowData.splice(action.rowIndex + 1, action.data.children.length);
        this.metadata.delete(action.data);
      } else {
        this.setColIdAndDataType(action.data);
        this.rowData.splice(action.rowIndex + 1, 0, ...this.sortHelper(action.data.children.slice()));
        this.metadata.add(action.data);
      }
      action.data.isExpanded = !action.data.isExpanded;
      this.grid.api.setRowData(this.rowData);
    });
  }
  onDestroy() {
    this.tearDown$.next();
    this.tearDown$.complete();
  }
  setRawDataAndGroupNames(data: any[], groups: string[]) {
    this._rawData = data;
    this.rowData = makeGroups(data, groups);
  }
  setColIdAndDataType(data: any) {
    if (data.children.length > 0 && data.children[0].groupId) {
      this.colId = data.children[0].groupId;
    } else {
      this.colId = this._colId;
    }
    this.colDataType = this.getColDataType(this.colId);
  }
  lookAround(data: any, index: number, changeProp = true) {
    if (data.children) {
      data.children.forEach((child: any) => {
        if (child.isExpanded) {
          this.lookAround(child, index + 1, changeProp);
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
      this.setColIdAndDataType(it);
      this.rowData.splice(this.rowData.indexOf(it) + 1, 0, ...this.sortHelper(it.children.slice()));
    });
  }
  sortHelper(data: any[]): any {
    if (this.sortOrder === 'asc') {
      switch (this.colDataType) {
        case 'string':
          return data.sort((a, b) => a[this.colId]?.localeCompare(b[this.colId]) ?? 0);
        case 'number':
          return data.sort((a, b) => a[this.colId] - b[this.colId]);
        default:
          return data;
      }
    } else if (this.sortOrder === 'desc') {
      switch (this.colDataType) {
        case 'string':
          return data.sort((a, b) => b[this.colId]?.localeCompare(a[this.colId]) ?? 0);
        case 'number':
          return data.sort((a, b) => b[this.colId] - a[this.colId]);
        default:
          return data;
      }

    } else {
      return data;
    }
  }
  reconcileRowData(data: any[]) {
    this.metadata.forEach((it) => {
      if (it.level === 0) {
        const rowIndex = data.indexOf(it);
        this.lookAround(it, rowIndex, false);
        data.splice(rowIndex + 1, it.children.length);
      }
    });
  }
  sortChanged(event: any) {
    const sortedColumn = event.columnApi.getColumnState().find((col: any) => col.sort);
    if (!sortedColumn) return;
    this._colId = sortedColumn.colId;
    this.setSortInfo(sortedColumn.sort, sortedColumn.colId, this.getColDataType(sortedColumn.colId));
    this.reconcileRowData(this.rowData);
    this.rowData = this.sortHelper(this.rowData);
    this.sortByMetadata();
    this.grid.api.setRowData(this.rowData);
  }
  setSortInfo(sortOrder: any, colIndex: string, colDataType: 'string' | 'number') {
    this.sortOrder = sortOrder;
    this.colId = colIndex;
    this.colDataType = colDataType;
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

export function makeGroups(rawData: any[], rawGroups: string[]): any[] {
  function groupData(data: any[], groups: string[]): any[] {
    if (groups.length === 0) return data;

    const [groupBy, ...remainingGroups] = groups;

    const grouped = data.reduce((acc, item) => {
      const key = item[groupBy];
      if (!acc[key]) {
        acc[key] = {
          id: Math.random().toString(),
          [groupBy]: key,
          groupId: groupBy,
          level: rawGroups.indexOf(groupBy),
          isExpanded: false,
          children: []
        };
      }
      acc[key].children.push(item);
      return acc;
    }, {});

    return Object.values(grouped).map((group: any) => ({
      ...group,
      children: groupData(group.children, remainingGroups)
    }));
  }
  return groupData(rawData, rawGroups);
}
