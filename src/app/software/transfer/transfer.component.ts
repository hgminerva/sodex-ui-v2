import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TransferService } from './transfer.service';
import { ToastrService } from 'ngx-toastr';
import { SoftwareUserFormsService } from '../software.user.forms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  constructor(
    private modalService: BsModalService,
    private transferService: TransferService,
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

  public modalRef: BsModalRef;

  public getMotherCardBalanceSubscription: any;
  public getCardSubscription: any;
  public transferAmountSubscription: any;

  public amountToBeTransfered: number = 0;
  public motherCardBalance: number = 0;

  public isCardDetailLoaded: Boolean = false;
  public isBtnTransferDisable: Boolean = true;

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

  public cboTransferType: String = "Cash";

  public getUserFormsSubscription: any;
  public isLoadingSpinnerHidden: boolean = false;
  public isContentHidden: boolean = true;

  @ViewChild('trasnferModalTemplate') trasnferModalTemplate: TemplateRef<any>;

  public isAddButtonHide: boolean = true;
  public isEditButtonHide: boolean = true;
  public isUpdateButtonHide: boolean = true;
  public isDeleteButtonHide: boolean = true;

  public canTransfer: boolean = false;

  public openTransferModal(template: TemplateRef<any>): void {

    if (this.card.CardNumber != "") {
      this.amountToBeTransfered = 0;

      this.transferService.getMotherCardBalance();
      this.getMotherCardBalanceSubscription = this.transferService.getMotherCardBalancedObservable.subscribe(
        data => {
          this.modalRef = this.modalService.show(template, {backdrop: 'static', keyboard: false});

          if (data != null) {
            this.motherCardBalance = data;
          }

          if (this.getMotherCardBalanceSubscription != null) this.getMotherCardBalanceSubscription.unsubscribe();
        }
      );
    } else {
      this.toastr.error("Please provide a card number.");
    }
  }

  public btnLoadCardDetailsOnclick(): void {
    if (this.card.CardNumber != "") {
      this.transferService.getCardDetails(this.card.CardNumber);
      this.getCardSubscription = this.transferService.getCardObservable.subscribe(
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

            this.isCardDetailLoaded = true;
            this.isBtnTransferDisable = false;

            setTimeout(()=> {
              this.selectCNField();
            }, 100);
            // if (this.canTransfer) {
            //   this.openTransferModal(this.trasnferModalTemplate);
            // }
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

            this.isCardDetailLoaded = false;
            this.isBtnTransferDisable = false;

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

  public btnTransferAmountOnclick() {
    let btnTransferAmount: Element = document.getElementById("btnTransferAmount");
    btnTransferAmount.innerHTML = "<i class='fa fa-credit-card fa-fw'></i> Transferring...";
    btnTransferAmount.setAttribute("disabled", "disabled");

    let btnTransferAmountCloseModal: Element = document.getElementById("btnTransferAmountCloseModal");
    btnTransferAmountCloseModal.setAttribute("disabled", "disabled");

    let objTransferData: any = {
      DestinationCardNumber: this.card.CardNumber,
      Amount: this.amountToBeTransfered,
      Particulars: this.cboTransferType
    }

    this.transferService.transferAmount(objTransferData);
    this.transferAmountSubscription = this.transferService.transferAmountObservable.subscribe(
      data => {
        if (data[0] == "success") {
          this.toastr.success('Transfer Successful!');

          setTimeout(() => {
            btnTransferAmount.innerHTML = "<i class='fa fa-credit-card fa-fw'></i> Transfer";
            btnTransferAmount.removeAttribute("disabled");
            btnTransferAmountCloseModal.removeAttribute("disabled");
          }, 500);

          this.modalRef.hide();

          this.btnLoadCardDetailsOnclick();

          setTimeout(()=> {
            this.selectCNField();
          }, 100);

        } else if (data[0] == "failed") {
          this.toastr.error(data[1]);

          btnTransferAmount.innerHTML = "<i class='fa fa-credit-card fa-fw'></i> Transfer";
          btnTransferAmount.removeAttribute("disabled");
          btnTransferAmountCloseModal.removeAttribute("disabled");
        }

        if (this.transferAmountSubscription != null) this.transferAmountSubscription.unsubscribe();
      }
    );
  }

  public onCardNumberKeyPress(event: any) {
    this.isBtnTransferDisable = true;

    if (event.key == "Enter") {
      this.btnLoadCardDetailsOnclick();

      setTimeout(()=> {
        this.selectCNField();
      }, 100);
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.softwareUserFormsService.getCurrentForm("TransactionTransfer");
      this.getUserFormsSubscription = this.softwareUserFormsService.getCurrentUserFormsObservable.subscribe(
        data => {
          if (data != null) {
            this.isLoadingSpinnerHidden = true;
            this.isContentHidden = false;

            this.isCardDetailLoaded = false;

            if (data.CanAdd) {
              this.isAddButtonHide = false;
            }

            if (data.CanEdit) {
              this.isEditButtonHide = false;
            }

            if (data.CanUpdate) {
              this.isUpdateButtonHide = false;
              this.canTransfer = true;
            }

            if (data.CanDelete) {
              this.isDeleteButtonHide = false;
            }
          } else {
            this.router.navigateByUrl("/software/forbidden", { skipLocationChange: true });
          }

          setTimeout(() => {
            this.focusCNField();
          }, 100);

          if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
        }
      );
    }, 1000);
  }

  ngOnDestroy() {
    if (this.getMotherCardBalanceSubscription != null) this.getMotherCardBalanceSubscription.unsubscribe();
    if (this.getCardSubscription != null) this.getCardSubscription.unsubscribe();
    if (this.transferAmountSubscription != null) this.transferAmountSubscription.unsubscribe();
    if (this.getUserFormsSubscription != null) this.getUserFormsSubscription.unsubscribe();
  }
}
