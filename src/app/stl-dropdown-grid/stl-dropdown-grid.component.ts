import { Component, signal, ViewChild } from '@angular/core';
import { MatFormField, MatOption, MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { RowGroup } from '../row.group';
import { AgGridModule } from 'ag-grid-angular';
import { FullWidthCellRenderer } from '../full-width-cell-renderer.component';
import { ColDef } from 'ag-grid-community';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'stl-dropdown-grid',
  imports: [MatSelectModule, MatFormField, AgGridModule, MatChip],
  templateUrl: './stl-dropdown-grid.component.html',
  styleUrl: './stl-dropdown-grid.component.scss'
})
export class StlDropdownGridComponent extends RowGroup {
  @ViewChild(MatSelect) matSelect: MatSelect = null as any;
  private option: MatOption = null as any;
  ngOnInit(): void {
    super.onInit();
  }
  ngAfterViewInit(): void {
    if (!this.option) {
      this.option = this.matSelect.options.find(
        (opt) => opt.value === 'x'
      )!;
    }
  }
  ngOnDestroy(): void {
    super.onDestroy();
  }

  onOpened(event: any) {
    this.setRawDataAndGroupNames(this.rawData, ['country', 'model', 'year']);
    this.selected.set(['country', 'model', 'year']);
    this.option._getHostElement().click();
  }
  selected = signal<string[]>([]);
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
    suppressMovable: true,
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

  fullWidthCellRenderer: any = FullWidthCellRenderer;
}
