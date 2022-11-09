import {Injectable} from "@angular/core";
import {IHistoryItem} from "../models/history";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public setToLocalStorage(value: IHistoryItem): void {
    const data = this.getFromLocalStorage();

    data.unshift(value);
    data.splice(10, data.length - 10);
    localStorage.setItem('history', JSON.stringify(data));
  }

  public getFromLocalStorage(): IHistoryItem[] {
    const data = localStorage.getItem('history');

    return data ? JSON.parse(data) : []
  }
}
