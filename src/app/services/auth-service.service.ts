import {Injectable} from "@angular/core";
import {SpotifyService} from "./spotify.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSource = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSource.asObservable();
  private accessToken: any;
  isAuthenticating = false;

  constructor(private spotifyService: SpotifyService) {}

  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticating = false;
    this.isAuthenticatedSource.next(isAuthenticated);
  }

  get isAuthenticated() {
    return this.isAuthenticatedSource.value;
  }

  authenticate(code: string) {
    this.isAuthenticating = true;
    this.spotifyService.exchangeCodeForToken(code).subscribe(
      data => {
        // Save access token and set authentication state to true
        this.setAuthenticated(true);
        // ... (save the token in a secure place)
        this.accessToken = data.accessToken;
        localStorage.setItem('accessToken', data.accessToken)
      },
      error => {
        console.error('Failed to authenticate', error);
        this.setAuthenticated(false);
      }
    );
  }
}

