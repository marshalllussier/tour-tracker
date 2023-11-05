import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public username: string | undefined;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];

      if (code && !this.authService.isLoggedIn()) {
        this.authService.exchangeCodeForToken(code).subscribe(
          data => {
            this.authService.saveAuthData(data.access_token, data.refresh_token, data.expires_in);
            this.getUserData(data.access_token);
            history.replaceState({}, '', '/dashboard');
          },
          error => console.error(error)
        );
      } else if (this.authService.isLoggedIn()) {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          this.getUserData(accessToken);
          history.replaceState({}, '', '/dashboard');
        }
      }
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  getUserData(accessToken: string) {
    this.authService.getUserData(accessToken).subscribe(
      user => {
        this.username = user.display_name;
      },
      error => console.error(error)
    );
  }

  logout() {
    this.authService.logout();
    this.snackBar.open('Successfully signed out', 'Close', {
      duration: 4000,
    });
    this.router.navigate(['/']);
  }

}
