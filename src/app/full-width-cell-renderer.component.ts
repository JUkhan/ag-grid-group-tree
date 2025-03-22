import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { Action, dispatch } from './state';
import { NgStyle } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    NgStyle
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    
    `],
  template: `
        <div class="flex hover:bg-blue-50 h-full items-center">
        @if (data.children) {
            <div class="pl-5 mb-1" [style.width.px]="colsWidth()[vpCols[0].colId]">
                <span (click)="expandCollapse()" class="font-bold pr-1 cursor-pointer hover:text-red-600" [ngStyle]="{'margin-left': (data.level||0) * 20 + 'px'}">
                  {{ data.isExpanded ? '⮟' : '⮞' }}
              </span>
                  {{ data[data.groupId] }} ({{ data.children.length }})
            </div>
        } @else {
          @for (vpc of vpCols; track vpc.colId;let idx = $index) {
            <div class="pl-5 mb-1" [style.width.px]="colsWidth()[vpc.colId]">{{ idx>0? data[vpc.colId]:'' }}</div>
          }  
        }
        </div>
    `,
})
export class FullWidthCellRenderer implements ICellRendererAngularComp {
  data: any = {};
  params: ICellRendererParams = undefined as any;
  countryWidth = signal(0);
  makeWidth = signal(0);
  priceWidth = signal(0);
  colsWidth = signal<Record<string, number>>({});
  vpCols: any[] = [];
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.data = params.data;
    //@ts-ignore
    this.vpCols = params.columnApi.columnModel.viewportColumns;
    const withObj: any = {};
    this.vpCols.forEach((col: any) => {
      withObj[col.colId] = col.actualWidth;
      col.addEventListener('widthChanged', this.onColumnWidthChanged);
    });
    this.colsWidth.set(withObj);
  }
  ngOnDestroy(): void {
    this.vpCols.forEach((col: any) => {
      col.removeEventListener('widthChanged', this.onColumnWidthChanged);
    });
  }
  onColumnWidthChanged = (event: any) => {
    this.colsWidth.update((prev: Record<string, number>) => ({
      ...prev,
      [event.column.colId]: event.column.actualWidth
    }));
  };

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  expandCollapse() {
    dispatch(new ExpandCollapseAction(this.data, this.params.node.rowIndex!));
  }
}

export class ExpandCollapseAction implements Action {
  type: any;
  constructor(public data: any, public rowIndex: number) { }
}