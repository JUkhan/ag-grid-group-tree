import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

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
        <div class="flex">
            <div class="flex-1 mt-2 pl-5">
              @if (data.children) {
                <button (click)="expandCollapse()" class="font-bold pr-2 hover:text-red-600" [ngStyle]="{'padding-left': (data.level||0) * 20 + 'px'}">
                  {{ data.isExpanded ? '⮟' : '⮞' }}
                  </button>
                  {{ data[data.groupId] }} ({{ data.children.length }})
              }@else {
                {{ data[this.firstColId] }}
              }
               
            </div>
            <div class="flex-1 pl-5 mt-2">{{ data.make }}</div>
            <div class="flex-1 pl-5 mt-2">{{ data.model }}</div>
            <div class="flex-1 pl-5 mt-2">{{ data.price }}</div>
            
        </div>
    `,
})
export class FullWidthCellRenderer implements ICellRendererAngularComp {
  data: any = {};
  params: ICellRendererParams = undefined as any;
  firstColId = '';
  agInit(params: ICellRendererParams): void {
    this.params = params;
    const cols = params.columnApi.getColumns()!;
    this.firstColId = cols[0].getColId();

    this.refresh(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.data = params.data;
    return true;
  }

  expandCollapse() {
    dispatch(new ExpandCollapseAction(this.data, this.params.node.rowIndex!));
  }
}

export class ExpandCollapseAction implements Action {
  type: any;
  constructor(public data: any, public rowIndex: number) { }
}