import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SpotifyService } from "../services/spotify.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Artist } from "../../assets/models/artist.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public username: string | undefined;
  public topArtists: Artist[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private snackBar: MatSnackBar,
    private authService: SpotifyService
  ) {}


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];

      if (code && !this.authService.isLoggedIn()) {
        this.isLoading = true;
        this.authService.exchangeCodeForToken(code).subscribe(
          data => {
            this.authService.saveAuthData(data.access_token, data.refresh_token, data.expires_in);
            this.getUserData(data.access_token);
            history.replaceState({}, '', '/dashboard');
          },
          error => {
            console.error(error);
            this.isLoading = false;
          }
        );
      } else if (this.authService.isLoggedIn()) {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          this.isLoading = true;
          this.getUserData(accessToken);
          history.replaceState({}, '', '/dashboard');
        }
      }
    });
  }


  logout() {
    this.authService.logout();
    this.snackBar.open('Successfully signed out', 'Close', {
      duration: 4000,
    });
    this.router.navigate(['/']);
  }

  getUserData(accessToken: string) {
    this.authService.getUserData(accessToken).subscribe(
      user => {
        this.username = user.display_name;
        this.getTopArtists(accessToken);
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  getTopArtists(accessToken: string) {
    this.authService.getTopArtists(accessToken, 5).subscribe(
      artists => {
        this.topArtists = artists;
        this.isLoading = false;
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

}
