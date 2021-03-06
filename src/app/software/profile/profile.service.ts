import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { AppSettings } from './../../app.settings';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
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

  public getProfileSource = new Subject<any>();
  public getProfileObservable = this.getProfileSource.asObservable();

  public updateProfileSource = new Subject<string[]>();
  public updateProfileObservable = this.updateProfileSource.asObservable();

  public getProfile(): void {
    let profile: any = {
      Id: 0,
      FullName: "",
      Address: "",
      Email: "",
      ContactNumber: "",
      MotherCardNumber: "",
      MotherCardBalance: 0
    };

    this.getProfileSource.next(profile);
    this.http.get(this.defaultAPIURLHost + "/api/profile/detail", this.options).subscribe(
      response => {
        var results = response.json();
        if (results != null) {
          profile.FullName = results.FullName;
          profile.Address = results.Address;
          profile.Email = results.Email;
          profile.ContactNumber = results.ContactNumber;
          profile.MotherCardNumber = results.MotherCardNumber;
          profile.MotherCardBalance = results.MotherCardBalance;
        }

        this.getProfileSource.next(profile);
      }
    );
  }

  public updateProfile(objProfile: any): void {
    this.http.put(this.defaultAPIURLHost + "/api/profile/update", JSON.stringify(objProfile), this.options).subscribe(
      response => {
        let responseResults: string[] = ["success", ""];
        this.updateProfileSource.next(responseResults);
      },
      error => {
        let errorResults: string[] = ["failed", error.json()];
        this.updateProfileSource.next(errorResults);
      }
    )
  }
}
