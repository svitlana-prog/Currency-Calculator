import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HistoryComponent} from './history.component';
import {RouterModule} from "@angular/router";
import {historyRoutes} from "./history.routes";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    HistoryComponent
  ],
  exports: [HistoryComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(historyRoutes),
        MatTableModule
    ]
})
export class HistoryModule {
}
