import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AppSettings } from './../../app.settings';
import { Subject } from 'rxjs';
import { ObservableArray } from 'wijmo/wijmo';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(
    private http: Http,
    private appSettings: AppSettings
  ) { }

  public headers = new Headers({
    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json'
  });
  public options = new RequestOptions({ headers: this.headers });
  private defaultAPIURLHost: string = this.appSettings.defaultAPIURLHost;

  public getLedgerSource = new Subject<ObservableArray>();
  public getLedgerObservable = this.getLedgerSource.asObservable();

  public getDebitLedgersSource = new Subject<ObservableArray>();
  public getDebitLedgersObservable = this.getDebitLedgersSource.asObservable();

  public getCreditLedgersSource = new Subject<ObservableArray>();
  public getCreditLedgersObservable = this.getCreditLedgersSource.asObservable();

  public getLedgers(cardNumber: string, dateStart: string, dateEnd: string): void {
    let ledgersObservableArray = new ObservableArray();
    this.getLedgerSource.next(ledgersObservableArray);

    this.http.get(this.defaultAPIURLHost + "/api/reportLedger/list/" + cardNumber + "/" + dateStart + "/" + dateEnd, this.options).subscribe(
      response => {
        var results = new ObservableArray(response.json());
        if (results.length > 0) {
          for (var i = 0; i <= results.length - 1; i++) {
            let ledgerDate = new Date(results[i].LedgerDateTime);
            let ledgerDateTime = ('0' + (ledgerDate.getMonth() + 1)).slice(-2) + '-' + ('0' + ledgerDate.getDate()).slice(-2) + '-' + ledgerDate.getFullYear();

            let balanceAmount = results[i].DebitAmount - results[i].CreditAmount;

            ledgersObservableArray.push({
              Id: results[i].Id,
              CardId: results[i].CardId,
              CardNumber: results[i].CardNumber,
              LedgerDateTime: ledgerDateTime,
              Payee: results[i].CardOwner,
              DebitAmount: results[i].DebitAmount,
              DebitAmountDisplay: results[i].DebitAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              CreditAmount: results[i].CreditAmount,
              CreditAmountDisplay: results[i].CreditAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              Particulars: results[i].Particulars,
              RunningBalance: results[i].RunningBalance,
              RunningBalanceDisplay: results[i].RunningBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              BalanceAmount: balanceAmount,
              BalanceAmountDisplay: balanceAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            });
          }
        }

        this.getLedgerSource.next(ledgersObservableArray);
      }
    );
  }

  public getDebitLedgers(dateStart: string, dateEnd: string) {
    let debitLedgersObservableArray = new ObservableArray();
    this.getDebitLedgersSource.next(debitLedgersObservableArray);

    this.http.get(this.defaultAPIURLHost + "/api/reportLedger/list/debit/" + dateStart + "/" + dateEnd, this.options).subscribe(
      response => {
        var results = new ObservableArray(response.json());
        if (results.length > 0) {
          for (var i = 0; i <= results.length - 1; i++) {
            let ledgerDate = new Date(results[i].LedgerDateTime);
            let ledgerDateTime = ('0' + (ledgerDate.getMonth() + 1)).slice(-2) + '-' + ('0' + ledgerDate.getDate()).slice(-2) + '-' + ledgerDate.getFullYear();

            debitLedgersObservableArray.push({
              Id: results[i].Id,
              CardId: results[i].CardId,
              CardNumber: results[i].CardNumber,
              LedgerDateTime: ledgerDateTime,
              Payee: results[i].CardOwner,
              DebitAmount: results[i].DebitAmount,
              DebitAmountDisplay: results[i].DebitAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              Particulars: results[i].Particulars,
            });
          }
        }

        this.getDebitLedgersSource.next(debitLedgersObservableArray);
      }
    );
  }

  public getCreditLedgers(dateStart: string, dateEnd: string) {
    let creditLedgersObservableArray = new ObservableArray();
    this.getCreditLedgersSource.next(creditLedgersObservableArray);

    this.http.get(this.defaultAPIURLHost + "/api/reportLedger/list/credit/" + dateStart + "/" + dateEnd, this.options).subscribe(
      response => {
        var results = new ObservableArray(response.json());
        if (results.length > 0) {
          for (var i = 0; i <= results.length - 1; i++) {
            let ledgerDate = new Date(results[i].LedgerDateTime);
            let ledgerDateTime = ('0' + (ledgerDate.getMonth() + 1)).slice(-2) + '-' + ('0' + ledgerDate.getDate()).slice(-2) + '-' + ledgerDate.getFullYear();

            creditLedgersObservableArray.push({
              Id: results[i].Id,
              CardId: results[i].CardId,
              CardNumber: results[i].CardNumber,
              LedgerDateTime: ledgerDateTime,
              Payee: results[i].CardOwner,
              CreditAmount: results[i].CreditAmount,
              CreditAmountDisplay: results[i].CreditAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              Particulars: results[i].Particulars,
            });
          }
        }

        this.getCreditLedgersSource.next(creditLedgersObservableArray);
      }
    );
  }
}
