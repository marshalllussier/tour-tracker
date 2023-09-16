import {Component} from '@angular/core';
import {Artist, SpotifyService} from "../services/spotify.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthGuardService} from "../services/auth-guard.service";
import {TicketmasterService} from "../services/ticketmaster.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  username: string = '';
  artists: Artist[] = [];
  artistEvents = new Map<string, any[]>();

  constructor(private spotifyService: SpotifyService, private snackbar: MatSnackBar, private authGuardService : AuthGuardService, private ticketmasterService : TicketmasterService) {
  }

  ngOnInit() {
    this.handleSpotifyAuthorization()
  }

  handleSpotifyAuthorization() {
    const code = this.getCodeFromUrl();
    if (!code) return;

    this.spotifyService.exchangeCodeForToken(code)
      .subscribe(
        data => this.handleSuccessfulAuthorization(data),
        err => this.handleError(err)
      );
    window.history.pushState({}, document.title, "/dashboard");

  }

  private getCodeFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
  }

  private handleSuccessfulAuthorization(data: any) {
    const accessToken = data.accessToken;
    this.authGuardService.login();

    this.fetchUserInfo(accessToken);
    this.fetchTopArtists(accessToken);
  }

  private fetchUserInfo(accessToken: string) {
    this.spotifyService.getUserInfo(accessToken)
      .subscribe(
        userInfo => { this.username = userInfo.display_name; },
        err => this.handleError(err)
      );
  }

  private fetchTopArtists(accessToken: string) {
    this.spotifyService.getTopArtists(accessToken)
      .subscribe(
        data => {
          this.handleTopArtists(data);
          this.ticketMasterSearch();
          },err => this.handleError(err)
      );
  }

  private handleTopArtists(data: any) {
    this.artists = data.items.map((item: any) => ({
      name: item.name,
      genres: item.genres,
      imageUrl: item.images && item.images[0] ? item.images[0].url : '',
      followers: item.followers.total
    }));
  }

  private ticketMasterSearch() {
    this.artists.forEach(artist => {
      this.ticketmasterService.searchEventsByArtist(artist.name).subscribe(response => {
        this.artistEvents.set(artist.name, response._embedded ? response._embedded.events : []);
        console.log("response", response)
      }, error => {
        console.log(error)
      });
    });
  }

  private handleError(err: any) {
    console.log("Error occurred: ", err);
    this.snackbar.open('An error occurred. Please try again.', 'Close');
  }


}
