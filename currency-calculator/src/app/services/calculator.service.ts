import {Inject, Injectable, LOCALE_ID} from "@angular/core";
import {IExchange} from "../models/exchange";
import {formatDate, formatNumber} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  constructor(@Inject(LOCALE_ID) public locale: string) {
  }
  public uahCurrency: IExchange = {
    StartDate: '',
    TimeSign: '',
    CurrencyCode: '980',
    CurrencyCodeL: 'UAH',
    Units: 1,
    Amount: 1
  }

  public calculateRate(amount: number, original: IExchange, target: IExchange): string {
    const result = (original.Amount / target.Amount / original.Units) * amount * target.Units;
    return formatNumber(result, this.locale, '1.1-3');
  }

  public requestFormatDate(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }
}
