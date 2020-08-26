import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportsService } from './reports.service';
import { ToastrService } from 'ngx-toastr';
import { ObservableArray, CollectionView } from 'wijmo/wijmo';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { SoftwareUserFormsService } from '../software.user.forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(
    private reportsService: ReportsService,
    private toastr: ToastrService,
    private softwareUserFormsService: SoftwareUserFormsService,
    private router: Router
  ) { }

  @ViewChild('cardnumberFld') cnfield: ElementRef;

  public focusCNField(): void {
    this.cnfield.nativeElement.focus();
  }

  public selectCNField(): void {
    this.cnfield.nativeElement.select();
  }

  public cardNumber: string;
  public dateStartValue = new Date();
  public dateEndValue = new Date();

  public getLedgersSubscription: any;

  public ledgersData: ObservableArray = new ObservableArray();
  public ledgersCollectionView: CollectionView = new CollectionView(this.ledgersData);
  public ledgersNumberOfPageIndex: number = 15;

  public isProgressBarHidden = true;

  @ViewChild('ledgersFlexGrid') ledgersFlexGrid: WjFlexGrid;

  public totalDebitAmount: number = 0;
  public totalCreditAmount: number = 0;
  public totalBalanceAmount: number = 0;

  public isBtnGenerateDisabled: Boolean = true;

  public cboShowNumberOfRows: ObservableArray = new ObservableArray();

  public ledgerDebitDateStartValue = new Date();
  public ledgerDebitDateEndValue = new Date();

  public getLedgerDebitSubscription: any;

  public ledgerDebitData: ObservableArray = new ObservableArray();
  public ledgerDebitCollectionView: CollectionView = new CollectionView(this.ledgersData);
  public ledgerDebitNumberOfPageIndex: number = 15;

  public isLedgerDebitProgressBarHidden = true;

  @ViewChild('ledgerDebitFlexGrid') ledgerDebitFlexGrid: WjFlexGrid;

  public totalLedgerDebitDebitAmount: number = 0;
  public isBtnLedgerDebitGenerateDisabled: Boolean = false;

  public cboLedgerDebitShowNumberOfRows: ObservableArray = new ObservableArray();

  public ledgerCreditDateStartValue = new Date();
  public ledgerCreditDateEndValue = new Date();

  public getLedgerCreditSubscription: any;

  public ledgerCreditData: ObservableArray = new ObservableArray();
  public ledgerCreditCollectionView: CollectionView = new CollectionView(this.ledgersData);
  public ledgerCreditNumberOfPageIndex: number = 15;

  public isLedgerCreditProgressBarHidden = true;

  @ViewChild('ledgerCreditFlexGrid') ledgerCreditFlexGrid: WjFlexGrid;

  public totalLedgerCreditCreditAmount: number = 0;
  public isBtnLedgerCreditGenerateDisabled: Boolean = false;

  public cboLedgerCreditShowNumberOfRows: ObservableArray = new ObservableArray();

  public getUserFormsSubscription: any;
  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;

  public isAddButtonHide: boolean = true;
  public isEditButtonHide: boolean = true;
  public isUpdateButtonHide: boolean = true;
  public isDeleteButtonHide: boolean = true;

  public dailySummaryReportDateAsOfValue = new Date();

  public beginningBalance: number = 0;
  public totalDebit: number = 0;
  public totalCredit: number = 0;
  public endingBalance: number = 0;
  public motherCardEndingBalance: number = 0;

  public getDailySummaryReportSubscription: any;

  public createCboShowNumberOfRows(): void {
    for (var i = 0; i <= 4; i++) {
      var rows = 0;
      var rowsString = "";

      if (i == 0) {
        rows = 15;
        rowsString = "15 Rows";
      } else if (i == 1) {
        rows = 50;
        rowsString = "50 Rows";
      } else if (i == 2) {
        rows = 100;
        rowsString = "100 Rows";
      } else if (i == 3) {
        rows = 150;
        rowsString = "150 Rows";
      } else {
        rows = 200;
        rowsString = "200 Rows";
      }

      this.cboShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });

      this.cboLedgerDebitShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });

      this.cboLedgerCreditShowNumberOfRows.push({
        rowNumber: rows,
        rowString: rowsString
      });
    }
  }

  public cboShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.ledgersNumberOfPageIndex = selectedValue;

    this.ledgersCollectionView.pageSize = this.ledgersNumberOfPageIndex;
    this.ledgersCollectionView.refresh();
    this.ledgersFlexGrid.refresh();
  }

  public cboLedgerDebitShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.ledgerDebitNumberOfPageIndex = selectedValue;

    this.ledgerDebitCollectionView.pageSize = this.ledgerDebitNumberOfPageIndex;
    this.ledgerDebitCollectionView.refresh();
    this.ledgerDebitFlexGrid.refresh();
  }

  public cboLedgerCreditShowNumberOfRowsOnSelectedIndexChanged(selectedValue: any): void {
    this.ledgerCreditNumberOfPageIndex = selectedValue;

    this.ledgerCreditCollectionView.pageSize = this.ledgerCreditNumberOfPageIndex;
    this.ledgerCreditCollectionView.refresh();
    this.ledgerCreditFlexGrid.refresh();
  }

  public getCardsData(): void {
    this.isBtnGenerateDisabled = true;

    this.totalDebitAmount = 0;
    this.totalCreditAmount = 0;
    this.totalBalanceAmount = 0;

    let startDate = ('0' + (this.dateStartValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.dateStartValue.getDate()).slice(-2) + '-' + this.dateStartValue.getFullYear();
    let endDate = ('0' + (this.dateEndValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.dateEndValue.getDate()).slice(-2) + '-' + this.dateEndValue.getFullYear();

    this.reportsService.getLedgers(this.cardNumber, startDate, endDate);
    this.getLedgersSubscription = this.reportsService.getLedgerObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.ledgersData = data;
          this.ledgersCollectionView = new CollectionView(this.ledgersData);
          this.ledgersCollectionView.pageSize = this.ledgersNumberOfPageIndex;
          this.ledgersCollectionView.trackChanges = true;
          this.ledgersCollectionView.refresh();
          this.ledgersFlexGrid.refresh();

          for (let p = 1; p <= this.ledgersCollectionView.pageCount; p++) {
            for (let i = 0; i < this.ledgersCollectionView.items.length; i++) {
              this.totalDebitAmount += this.ledgersCollectionView.items[i].DebitAmount;
              this.totalCreditAmount += this.ledgersCollectionView.items[i].CreditAmount;
              this.totalBalanceAmount += this.ledgersCollectionView.items[i].BalanceAmount;
            }

            if (p == this.ledgersCollectionView.pageCount) {
              this.ledgersCollectionView.moveToFirstPage();
            } else {
              this.ledgersCollectionView.moveToNextPage();
            }
          }

          this.toastr.success("Generate Successful!");
        } else {
          this.toastr.error("No data!");
        }

        this.isProgressBarHidden = true;
        this.isBtnGenerateDisabled = false;

        let btnGenerate: Element = document.getElementById("btnGenerate");
        btnGenerate.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generate";
        btnGenerate.removeAttribute("disabled");

        if (this.getLedgersSubscription != null) this.getLedgersSubscription.unsubscribe();
      }
    );
  }

  public getLedgerDebitData(): void {
    this.isBtnLedgerDebitGenerateDisabled = true;

    this.totalLedgerDebitDebitAmount = 0;

    let startDate = ('0' + (this.ledgerDebitDateStartValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.ledgerDebitDateStartValue.getDate()).slice(-2) + '-' + this.ledgerDebitDateStartValue.getFullYear();
    let endDate = ('0' + (this.ledgerDebitDateEndValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.ledgerDebitDateEndValue.getDate()).slice(-2) + '-' + this.ledgerDebitDateEndValue.getFullYear();

    this.reportsService.getDebitLedgers(startDate, endDate);
    this.getLedgerDebitSubscription = this.reportsService.getDebitLedgersObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.ledgerDebitData = data;
          this.ledgerDebitCollectionView = new CollectionView(this.ledgerDebitData);
          this.ledgerDebitCollectionView.pageSize = this.ledgerDebitNumberOfPageIndex;
          this.ledgerDebitCollectionView.trackChanges = true;
          this.ledgerDebitCollectionView.refresh();
          this.ledgerDebitFlexGrid.refresh();

          for (let p = 1; p <= this.ledgerDebitCollectionView.pageCount; p++) {
            for (let i = 0; i < this.ledgerDebitCollectionView.items.length; i++) {
              this.totalLedgerDebitDebitAmount += this.ledgerDebitCollectionView.items[i].DebitAmount;
            }

            if (p == this.ledgerDebitCollectionView.pageCount) {
              this.ledgerDebitCollectionView.moveToFirstPage();
            } else {
              this.ledgerDebitCollectionView.moveToNextPage();
            }
          }

          this.toastr.success("Generate Successful!");
        } else {
          this.toastr.error("No data!");
        }

        this.isLedgerDebitProgressBarHidden = true;
        this.isBtnLedgerDebitGenerateDisabled = false;

        let btnGenerateLedgerDebit: Element = document.getElementById("btnGenerateLedgerDebit");
        btnGenerateLedgerDebit.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generate";
        btnGenerateLedgerDebit.removeAttribute("disabled");

        if (this.getLedgerDebitSubscription != null) this.getLedgerDebitSubscription.unsubscribe();
      }
    );
  }

  public getLedgerCreditData(): void {
    this.isBtnLedgerCreditGenerateDisabled = true;

    this.totalLedgerCreditCreditAmount = 0;

    let startDate = ('0' + (this.ledgerCreditDateStartValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.ledgerCreditDateStartValue.getDate()).slice(-2) + '-' + this.ledgerCreditDateStartValue.getFullYear();
    let endDate = ('0' + (this.ledgerCreditDateEndValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.ledgerCreditDateEndValue.getDate()).slice(-2) + '-' + this.ledgerCreditDateEndValue.getFullYear();

    this.reportsService.getCreditLedgers(startDate, endDate);
    this.getLedgerCreditSubscription = this.reportsService.getCreditLedgersObservable.subscribe(
      data => {
        if (data.length > 0) {
          this.ledgerCreditData = data;
          this.ledgerCreditCollectionView = new CollectionView(this.ledgerCreditData);
          this.ledgerCreditCollectionView.pageSize = this.ledgerCreditNumberOfPageIndex;
          this.ledgerCreditCollectionView.trackChanges = true;
          this.ledgerCreditCollectionView.refresh();
          this.ledgerCreditFlexGrid.refresh();

          for (let p = 1; p <= this.ledgerCreditCollectionView.pageCount; p++) {
            for (let i = 0; i < this.ledgerCreditCollectionView.items.length; i++) {
              this.totalLedgerCreditCreditAmount += this.ledgerCreditCollectionView.items[i].CreditAmount;
            }

            if (p == this.ledgerCreditCollectionView.pageCount) {
              this.ledgerCreditCollectionView.moveToFirstPage();
            } else {
              this.ledgerCreditCollectionView.moveToNextPage();
            }
          }

          this.toastr.success("Generate Successful!");
        } else {
          this.toastr.error("No data!");
        }

        this.isLedgerCreditProgressBarHidden = true;
        this.isBtnLedgerCreditGenerateDisabled = false;

        let btnGenerateLedgerCredit: Element = document.getElementById("btnGenerateLedgerCredit");
        btnGenerateLedgerCredit.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generate";
        btnGenerateLedgerCredit.removeAttribute("disabled");

        if (this.getLedgerCreditSubscription != null) this.getLedgerCreditSubscription.unsubscribe();
      }
    );
  }

  public btnGenerateLedgerOnclick() {
    if (this.cardNumber != "") {
      let btnGenerate: Element = document.getElementById("btnGenerate");
      btnGenerate.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generating...";
      btnGenerate.setAttribute("disabled", "disabled");

      this.isProgressBarHidden = false;

      this.ledgersData = new ObservableArray();
      this.ledgersCollectionView = new CollectionView(this.ledgersData);
      this.ledgersCollectionView.pageSize = 15;
      this.ledgersCollectionView.trackChanges = true;
      this.ledgersCollectionView.refresh();
      this.ledgersFlexGrid.refresh();

      this.getCardsData();
    } else {
      this.toastr.error("Please provide a card number.");
    }
  }

  public btnGenerateLedgerDebitOnclick() {
    let btnGenerateLedgerDebit: Element = document.getElementById("btnGenerateLedgerDebit");
    btnGenerateLedgerDebit.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generating...";
    btnGenerateLedgerDebit.setAttribute("disabled", "disabled");

    this.isLedgerDebitProgressBarHidden = false;

    this.ledgerDebitData = new ObservableArray();
    this.ledgerDebitCollectionView = new CollectionView(this.ledgerDebitData);
    this.ledgerDebitCollectionView.pageSize = 15;
    this.ledgerDebitCollectionView.trackChanges = true;
    this.ledgerDebitCollectionView.refresh();
    this.ledgerDebitFlexGrid.refresh();

    this.getLedgerDebitData();
  }

  public btnGenerateLedgerCreditOnclick() {
    let btnGenerateLedgerCredit: Element = document.getElementById("btnGenerateLedgerCredit");
    btnGenerateLedgerCredit.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generating...";
    btnGenerateLedgerCredit.setAttribute("disabled", "disabled");

    this.isLedgerCreditProgressBarHidden = false;

    this.ledgerCreditData = new ObservableArray();
    this.ledgerCreditCollectionView = new CollectionView(this.ledgerCreditData);
    this.ledgerCreditCollectionView.pageSize = 15;
    this.ledgerCreditCollectionView.trackChanges = true;
    this.ledgerCreditCollectionView.refresh();
    this.ledgerCreditFlexGrid.refresh();

    this.getLedgerCreditData();
  }

  public onCardNumberKeyPress(event: any) {
    if (this.cardNumber != "") {
      this.isBtnGenerateDisabled = false;
      if (event.key == "Enter") {
        this.btnGenerateLedgerOnclick();

        setTimeout(() => {
          this.selectCNField();
        }, 100);
      }
    } else {
      this.isBtnGenerateDisabled = true;
    }
  }

  public btnExportLedgerOnclick(): void {
    let data: any[] = [{
      Date: "Date",
      Payee: "Payee",
      Particulars: "Particulars",
      DebitAmount: "Debit",
      CreditAmount: "Credit",
      RunningBalance: "Running Balance"
    }];

    if (this.ledgersCollectionView.items.length > 0) {
      for (let p = 1; p <= this.ledgersCollectionView.pageCount; p++) {
        for (let i = 0; i < this.ledgersCollectionView.items.length; i++) {
          data.push({
            Date: this.ledgersCollectionView.items[i].LedgerDateTime,
            Payee: this.ledgersCollectionView.items[i].Payee,
            Particulars: this.ledgersCollectionView.items[i].Particulars,
            DebitAmount: this.ledgersCollectionView.items[i].DebitAmount,
            CreditAmount: this.ledgersCollectionView.items[i].CreditAmount,
            RunningBalance: this.ledgersCollectionView.items[i].RunningBalance,
          });
        }

        if (p == this.ledgersCollectionView.pageCount) {
          this.ledgersCollectionView.moveToFirstPage();
        } else {
          this.ledgersCollectionView.moveToNextPage();
        }
      }
    }

    let cardNumber = this.cardNumber;
    let startDate = ('0' + (this.dateStartValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.dateStartValue.getDate()).slice(-2) + '-' + this.dateStartValue.getFullYear();
    let endDate = ('0' + (this.dateEndValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.dateEndValue.getDate()).slice(-2) + '-' + this.dateEndValue.getFullYear();

    new Angular5Csv(data, cardNumber + '_From(' + startDate + ")_To(" + endDate + ")");
  }

  public btnExportLedgerDebitOnclick(): void {
    let data: any[] = [{
      Date: "Date",
      Payee: "Payee",
      Particulars: "Particulars",
      DebitAmount: "Debit"
    }];

    if (this.ledgerDebitCollectionView.items.length > 0) {
      for (let p = 1; p <= this.ledgerDebitCollectionView.pageCount; p++) {
        for (let i = 0; i < this.ledgerDebitCollectionView.items.length; i++) {
          data.push({
            Date: this.ledgerDebitCollectionView.items[i].LedgerDateTime,
            Payee: this.ledgerDebitCollectionView.items[i].Payee,
            Particulars: this.ledgerDebitCollectionView.items[i].Particulars,
            DebitAmount: this.ledgerDebitCollectionView.items[i].DebitAmount
          });
        }

        if (p == this.ledgerDebitCollectionView.pageCount) {
          this.ledgerDebitCollectionView.moveToFirstPage();
        } else {
          this.ledgerDebitCollectionView.moveToNextPage();
        }
      }
    }

    let startDate = ('0' + (this.ledgerDebitDateStartValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.ledgerDebitDateStartValue.getDate()).slice(-2) + '-' + this.ledgerDebitDateStartValue.getFullYear();
    let endDate = ('0' + (this.ledgerDebitDateEndValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.ledgerDebitDateEndValue.getDate()).slice(-2) + '-' + this.ledgerDebitDateEndValue.getFullYear();

    new Angular5Csv(data, 'Debit_Ledgers_From(' + startDate + ")_To(" + endDate + ")");
  }

  public btnExportLedgerCreditOnclick(): void {
    let data: any[] = [{
      Date: "Date",
      Payee: "Payee",
      Particulars: "Particulars",
      CreditAmount: "Credit"
    }];

    if (this.ledgerCreditCollectionView.items.length > 0) {
      for (let p = 1; p <= this.ledgerCreditCollectionView.pageCount; p++) {
        for (let i = 0; i < this.ledgerCreditCollectionView.items.length; i++) {
          data.push({
            Date: this.ledgerCreditCollectionView.items[i].LedgerDateTime,
            Payee: this.ledgerCreditCollectionView.items[i].Payee,
            Particulars: this.ledgerCreditCollectionView.items[i].Particulars,
            CreditAmount: this.ledgerCreditCollectionView.items[i].CreditAmount
          });
        }

        if (p == this.ledgerCreditCollectionView.pageCount) {
          this.ledgerCreditCollectionView.moveToFirstPage();
        } else {
          this.ledgerCreditCollectionView.moveToNextPage();
        }
      }
    }

    let startDate = ('0' + (this.ledgerCreditDateStartValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.ledgerCreditDateStartValue.getDate()).slice(-2) + '-' + this.ledgerCreditDateStartValue.getFullYear();
    let endDate = ('0' + (this.ledgerCreditDateEndValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.ledgerCreditDateEndValue.getDate()).slice(-2) + '-' + this.ledgerCreditDateEndValue.getFullYear();

    new Angular5Csv(data, 'Credit_Ledgers_From(' + startDate + ")_To(" + endDate + ")");
  }

  public btnGenerateDailySummaryReportOnclick(): void {
    let btnGenerateDailySummaryReport: Element = document.getElementById("btnGenerateDailySummaryReport");
    btnGenerateDailySummaryReport.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generating...";
    btnGenerateDailySummaryReport.setAttribute("disabled", "disabled");

    this.geDailyReportSummaryData();
  }

  public geDailyReportSummaryData(): void {
    let dateAsOfValue = ('0' + (this.dailySummaryReportDateAsOfValue.getMonth() + 1)).slice(-2) + '-' + ('0' + this.dailySummaryReportDateAsOfValue.getDate()).slice(-2) + '-' + this.dailySummaryReportDateAsOfValue.getFullYear();

    this.reportsService.getDailySummaryReport(dateAsOfValue);
    this.getDailySummaryReportSubscription = this.reportsService.getDailySummaryReportObservable.subscribe(
      data => {

        this.beginningBalance = data.BeginningBalance;
        this.totalDebit = data.TotalDebit;
        this.totalCredit = data.TotalCredit;
        this.endingBalance = data.EndingBalance;
        this.motherCardEndingBalance = data.MotherCardEndingBalance;

        let btnGenerateDailySummaryReport: Element = document.getElementById("btnGenerateDailySummaryReport");
        btnGenerateDailySummaryReport.innerHTML = "<i class='fa fa-refresh fa-fw'></i> Generate";
        btnGenerateDailySummaryReport.removeAttribute("disabled");
      }
    );
  }

  ngOnInit() {
    this.createCboShowNumberOfRows();
    setTimeout(() => {
      this.softwareUserFormsService.getCurrentForm("ReportLedger");
      this.getUserFormsSubscription = this.softwareUserFormsService.getCurrentUserFormsObservable.subscribe(
        data => {
          if (data != null) {
            this.isLoadingSpinnerHidden = true;
            this.isContentHidden = false;

            if (data.CanAdd) {
              this.isAddButtonHide = false;
            }

            if (data.CanEdit) {
              this.isEditButtonHide = false;
            }

            if (data.CanUpdate) {
              this.isUpdateButtonHide = false;
            }

            if (data.CanDelete) {
              this.isDeleteButtonHide = false;
            }
          } else {
            this.router.navigateByUrl("/software/forbidden", { skipLocationChange: true });
          }

          if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();

          setTimeout(() => {
            this.focusCNField();
          }, 100);
        }
      );
    }, 1000);
  }

  ngOnDestroy() {
    if (this.getLedgersSubscription != null) this.getLedgersSubscription.unsubscribe();
    if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
    if (this.getLedgerDebitSubscription != null) this.getLedgerDebitSubscription.unsubscribe();
    if (this.getLedgerCreditSubscription != null) this.getLedgerCreditSubscription.unsubscribe();
  }
}
