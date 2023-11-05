import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public username: string | undefined;

  constructor(
    private route: ActivatedRoute,
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
  }

  getUserData(accessToken: string) {
    this.authService.getUserData(accessToken).subscribe(
      user => {
        this.username = user.display_name;
      },
      error => console.error(error)
    );
  }

}
