import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  BehaviorSubject, catchError,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  takeUntil,
  tap
} from "rxjs";
import {NbuExchangeService} from "../../services/api/nbu-exchange.service";
import {IExchange} from "../../models/exchange";
import {BaseAutoUnsubscribe} from "../../shared/classes/base-auto-unsubscribe";
import {CalculatorService} from "../../services/calculator.service";
import {LocalStorageService} from "../../services/local-storage.service";
import {IHistoryItem} from "../../models/history";

interface ISelectedObj {
  amount: number,
  original?: IExchange,
  target?: IExchange
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent extends BaseAutoUnsubscribe implements OnInit, OnDestroy {
  public form!: FormGroup;
  public exchangeRates$: BehaviorSubject<IExchange[]> = new BehaviorSubject<IExchange[]>([]);
  public isLoading = true;
  public error = '';
  public maxDate: Date = new Date();
  private isInitial = true;


  constructor(private fb: FormBuilder,
              private nbuExchangeService: NbuExchangeService,
              private calculatorService: CalculatorService,
              private localStorageService: LocalStorageService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [],
      originalCurrency: [''],
      originalAmount: ['', Validators.required],
      targetCurrency: [''],
      targetAmount: ['']
    });

    this.handleDateChange();
    this.exchangeRates$.pipe(takeUntil(this.destroy$)).subscribe(() => this.setFormData());

    this.form.get('date')?.setValue(new Date());
  }


  override ngOnDestroy(): void {
    super.ngOnDestroy()
  }

  public storeToHistory(): void {
    if (this.isInitial) {
      return;
    }

    const item: IHistoryItem = {
      Date: this.form.get('date')?.value,
      CurrencyOriginal: this.form.get('originalCurrency')?.value,
      CurrencyTarget: this.form.get('targetCurrency')?.value,
      Amount: this.form.get('originalAmount')?.value,
      Result: this.form.get('targetAmount')?.value
    };

    this.localStorageService.setToLocalStorage(item)
  }

  private handleDateChange(): void {
    this.form.get('date')?.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap((date) => this.getExchangeRates(this.calculatorService.requestFormatDate(date))),
      tap(() => this.isInitial && this.calculateRate()),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  private getExchangeRates(date: string = '') {
    this.toggleDisable(true);

    this.error = '';

    return this.nbuExchangeService.getExchangeRates(date)
      .pipe(
        map((res) => this.exchangeRates$.next([this.calculatorService.uahCurrency, ...res])),
        finalize(() => this.toggleDisable(false)),
        catchError((e) => this.error = 'Something went wrong, please try again later'),
        takeUntil(this.destroy$)
      );
  }


  private setFormData(): void {
    const value = this.getValues();

    if (!value.original) {
      const uah = this.exchangeRates$.value.find((el) => el.CurrencyCodeL.toUpperCase() == 'UAH');

      if (uah) {
        this.form.get('targetCurrency')?.setValue(this.exchangeRates$.value[0].CurrencyCodeL);
        this.form.get('originalAmount')?.setValue('1');
      }
    }

    if (!value.target) {
      const usd = this.exchangeRates$.value.find((el) => el.CurrencyCodeL.toUpperCase() == 'USD');

      if (usd) {
        this.form.get('originalCurrency')?.setValue(usd.CurrencyCodeL);
      }
    }
  }

  public calculateRate(): void {
    const value = this.getValues();

    if (!value.amount || !value.original || !value.target) {
      this.form.get('targetAmount')?.setValue('0');
      return;
    }

    this.form.get('targetAmount')?.setValue(this.calculatorService.calculateRate(value.amount, value.original, value.target));

    this.storeToHistory();
    this.isInitial = false;
  }

  private getValues(): ISelectedObj {
    const amount = this.form.get('originalAmount')?.value;
    const original = this.exchangeRates$.value.find((el) => el.CurrencyCodeL == this.form.get('originalCurrency')?.value);
    const target = this.exchangeRates$.value.find((el) => el.CurrencyCodeL == this.form.get('targetCurrency')?.value);

    return {amount, original, target};
  }

  private toggleDisable(disabled: boolean): void {
    for (let key in this.form.controls) {
      disabled ? this.form.get(key)?.disable() : this.form.get(key)?.enable();
    }
  }
}
