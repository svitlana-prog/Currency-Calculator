import {Component, OnInit} from '@angular/core';
import {IHistoryItem} from "../../models/history";
import {LocalStorageService} from "../../services/local-storage.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  public dataSource: IHistoryItem[] = [];
  public displayedColumns: string[] = ['date', 'currencyOriginal', 'currencyTarget', 'amount', 'result'];

  constructor(private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.dataSource = this.localStorageService.getFromLocalStorage();
  }

}
