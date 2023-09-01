import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private signed_in = false;

  constructor(private router: Router, private snackBar : MatSnackBar) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.signed_in) {
      return true;
    } else {
      this.router.navigate(['/home']);
      this.snackBar.open('You must be signed in to access that page.', 'Close', {
        duration: 5000,
      });
    }
    return false;
  }

  public login() {
    this.signed_in = true;
  }

  public getLoginStatus() {
    if (this.signed_in) { return "Logged in"} else { return "Logged out"}
  }
}
