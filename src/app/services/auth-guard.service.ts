import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const code = route.queryParams['code'];

    if (this.authService.isLoggedIn() || code) {
      return true;
    }

    this.snackBar.open('You must login first', 'Close', { duration: 3000 });
    this.router.navigate(['/']);
    return false;
  }
}
