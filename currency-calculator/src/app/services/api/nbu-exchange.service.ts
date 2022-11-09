import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IExchange} from "../../models/exchange";

@Injectable({
  providedIn: 'root'
})
export class NbuExchangeService {
  constructor(private httpClient: HttpClient) {}

  getExchangeRates(date: string): Observable<IExchange[]> {
    const query = {
        date
    }
    return this.httpClient.get<IExchange[]>(' https://bank.gov.ua/NBU_Exchange/exchange?json', { params: query })
  }
}
