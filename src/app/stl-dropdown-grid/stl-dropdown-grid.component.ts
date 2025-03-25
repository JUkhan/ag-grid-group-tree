import { Component, effect, input, output, signal, ViewChild } from '@angular/core';
import { MatFormField, MatOption, MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { RowGroup } from '../row.group';
import { AgGridModule } from 'ag-grid-angular';
import { FullWidthCellRenderer } from '../full-width-cell-renderer.component';
import { ColDef } from 'ag-grid-community';
import { MatChip } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export type Callback = (item: any) => string;
@Component({
  selector: 'stl-dropdown-grid',
  imports: [MatSelectModule, MatFormField, AgGridModule, MatChip, ReactiveFormsModule],
  templateUrl: './stl-dropdown-grid.component.html',
  styleUrl: './stl-dropdown-grid.component.scss'
})
export class StlDropdownGridComponent extends RowGroup {
  @ViewChild(MatSelect) matSelect: MatSelect = null as any;
  private option: MatOption = null as any;
  onSelected = output<any[]>();
  rawData = input.required<any[]>();
  colDefs = input.required<ColDef[]>();
  selectedNodeText = input<Callback>(null as any);
  groupNames = input.required<string[]>();
  multiSelect = input<boolean>(true);
  singleSelect = input<boolean>(false);
  label = input<string>('Select');
  selectedMessage = new FormControl<string[]>(['']);

  constructor() {
    super();
    effect(() => {
      this.columnDefs = this.colDefs();
      this.setOptions(this.rawData(), this.groupNames(), this.singleSelect(), this.singleSelect() ? false : this.multiSelect());
    });
  }
  ngOnInit(): void {
    super.onInit();
    this.selectedItemsEventEmitter.subscribe(it => {
      let values: string[] = [];
      if (this.selectedNodeText() != null) {
        values = it.map(this.selectedNodeText());
      } else {
        values = [`Selected: ${it.length}`];
      }
      this.selectedMessage.setValue(values);
      this.option.value = this.selectedMessage.value?.join('$$$');
      this.option._getHostElement().click();
      if (this.singleSelect()) {
        this.matSelect.toggle();
      }
      this.onSelected.emit(it);
    });

  }
  ngAfterViewInit(): void {
    this.option = this.matSelect.options.find(
      (opt) => opt.value === 'x'
    )!;
  }
  ngOnDestroy(): void {
    super.onDestroy();
  }
  split(value: string[] | null): string[] {
    return value ? value[0].split('$$$') : [];
  }
  onOpened() {
    this.grid.api.setRowData(this.rowData);
  }
  defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true,
    suppressMovable: true,
    flex: 1
  };

  fullWidthCellRenderer: any = FullWidthCellRenderer;
}
