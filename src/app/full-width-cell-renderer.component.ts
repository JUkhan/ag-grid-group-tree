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
        <div class="flex">
            <div class="mt-2 pl-5 w-40" [style.width.px]="countryWidth()">
              @if (data.children) {
                <button (click)="expandCollapse()" class="font-bold pr-2 hover:text-red-600" [ngStyle]="{'padding-left': (data.level||0) * 20 + 'px'}">
                  {{ data.isExpanded ? '⮟' : '⮞' }}
                  </button>
                  {{ data[data.groupId] }} ({{ data.children.length }})
              }@else {
                {{ data[this.firstColId] }}
              }
               
            </div>
            <div class="pl-5 mt-2" [style.width.px]="makeWidth()">{{ data.make }}</div>
            <div class="pl-5 mt-2" [style.width.px]="modelWidth()">{{ data.model }}</div>
            <div class="pl-5 mt-2" [style.width.px]="priceWidth()">{{ data.price }}</div>
            
        </div>
    `,
})
export class FullWidthCellRenderer implements ICellRendererAngularComp {
  data: any = {};
  params: ICellRendererParams = undefined as any;
  firstColId = '';
  countryWidth = signal(0);
  makeWidth = signal(0);
  modelWidth = signal(0);
  priceWidth = signal(0);
  agInit(params: ICellRendererParams): void {
    this.params = params;
    const cols = params.columnApi.getColumns()!;
    this.firstColId = cols[0].getColId();
    this.countryWidth.set((cols[0] as any).actualWidth);
    this.makeWidth.set((cols[1] as any).actualWidth);
    this.modelWidth.set((cols[2] as any).actualWidth);
    this.priceWidth.set((cols[3] as any).actualWidth);
    cols[0].addEventListener('widthChanged', this.onCountryWidthChanged);
    cols[1].addEventListener('widthChanged', this.onMakeWidthChanged);
    cols[2].addEventListener('widthChanged', this.onModeWidthChanged);
    cols[3].addEventListener('widthChanged', this.onPriceWidthChanged);
    this.refresh(params);
  }
  ngOnDestroy(): void {
    const cols = this.params.columnApi.getColumns()!;
    cols[0].removeEventListener('widthChanged', this.onCountryWidthChanged);
    cols[1].removeEventListener('widthChanged', this.onMakeWidthChanged);
    cols[2].removeEventListener('widthChanged', this.onModeWidthChanged);
    cols[3].removeEventListener('widthChanged', this.onPriceWidthChanged);
  }
  onCountryWidthChanged = (event: any) => {
    this.countryWidth.set(event.column.actualWidth);
  };
  onMakeWidthChanged = (event: any) => {
    this.makeWidth.set(event.column.actualWidth);
  };
  onModeWidthChanged = (event: any) => {
    this.modelWidth.set(event.column.actualWidth);
  };
  onPriceWidthChanged = (event: any) => {
    this.priceWidth.set(event.column.actualWidth);
  };
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