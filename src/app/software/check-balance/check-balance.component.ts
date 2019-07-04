import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CheckBalanceService } from './check-balance.service';
import { ToastrService } from 'ngx-toastr';
import { SoftwareUserFormsService } from '../software.user.forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-balance',
  templateUrl: './check-balance.component.html',
  styleUrls: ['./check-balance.component.css']
})
export class CheckBalanceComponent implements OnInit {
  constructor(
    private checkBalanceService: CheckBalanceService,
    private toastr: ToastrService,
    private softwareUserFormsService: SoftwareUserFormsService,
    private router: Router
  ) { }

  @ViewChild('cardnumberFld') cnfield: ElementRef;

  public focusCNField(): void {
    this.cnfield.nativeElement.focus();
    // const input: HTMLInputElement = this.cnfield.nativeElement as HTMLInputElement;

    // input.focus();
    // input.select();
  }

  public selectCNField(): void {
    this.cnfield.nativeElement.select();
  }

  public getCardSubscription: any;

  public card: any = {
    Id: 0,
    CardNumber: "",
    FullName: "",
    Address: "",
    Email: "",
    ContactNumber: "",
    UserId: 0,
    Balance: 0,
    Particulars: "",
    Status: ""
  };

  public getUserFormsSubscription: any;
  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;

  public isAddButtonHide: boolean = true;
  public isEditButtonHide: boolean = true;
  public isUpdateButtonHide: boolean = true;
  public isDeleteButtonHide: boolean = true;

  public btnLoadCardDetailsOnclick(): void {
    if (this.card.CardNumber != "") {
      this.checkBalanceService.getCardDetails(this.card.CardNumber);
      this.getCardSubscription = this.checkBalanceService.getCardObservable.subscribe(
        data => {
          if (data != null) {
            this.card.FullName = data.FullName;
            this.card.Address = data.Address;
            this.card.Email = data.Email;
            this.card.ContactNumber = data.ContactNumber;
            this.card.UserId = data.UserId;
            this.card.Balance = data.Balance;
            this.card.Particulars = data.Particulars;
            this.card.Status = data.Status;

            this.toastr.success("Card details successfully loaded.");

            setTimeout(()=> {
              this.selectCNField();
            }, 100);

          } else {
            this.toastr.error("No card details for this card number.");

            this.card.FullName = "";
            this.card.Address = "";
            this.card.Email = "";
            this.card.ContactNumber = "";
            this.card.UserId = 0;
            this.card.Balance = 0;
            this.card.Particulars = "";
            this.card.Status = "";

            setTimeout(()=> {
              this.selectCNField();
            }, 100);
          }

          if (this.getCardSubscription != null) this.getCardSubscription.unsubscribe();
        }
      );
    } else {
      this.toastr.error("Please provide a card number.");
    }
  }

  public onCardNumberKeyPress(event: any) {
    if (event.key == "Enter") {
      this.btnLoadCardDetailsOnclick();

      setTimeout(()=> {
        this.selectCNField();
      }, 100);
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.softwareUserFormsService.getCurrentForm("TransactionCheckBalance");
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
    if (this.getCardSubscription != null) this.getCardSubscription.unsubscribe();
    if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
  }
}
