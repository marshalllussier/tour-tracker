import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment} from "../../assets/environments/environment.dev";
import { Artist } from "../../assets/models/artist.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = environment.clientId;
  private redirectUri = environment.redirectUri;
  private scope = 'user-library-read user-top-read';

  constructor(private httpClient: HttpClient) {}

  authenticateUser(): void {
    const state = this.generateRandomState();
    localStorage.setItem('spotify_auth_state', state);
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&scope=${encodeURIComponent(this.scope)}&state=${state}`;
  }

  exchangeCodeForToken(code: string): Observable<any> {
    const flaskEndpoint = 'http://localhost:5000/api/exchange-code';
    return this.httpClient.post(flaskEndpoint, { code });
  }

  refreshToken(): Observable<any> {
    const flaskEndpoint = 'http://localhost:5000/api/token/refresh';
    return this.httpClient.post(flaskEndpoint, {});
  }

  saveAuthData(accessToken: string, refreshToken: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  isLoggedIn(): boolean {
    const expiration = localStorage.getItem('expiration');
    return expiration !== null && new Date() < new Date(expiration);
  }

  generateRandomState(): string {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0].toString(16);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('spotify_auth_state');
  }

  getUserData(accessToken: string): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };
    return this.httpClient.get('https://api.spotify.com/v1/me', { headers });
  }

  getTopArtists(accessToken: string, limit: number): Observable<Artist[]> {
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };
    const topArtistsUrl = `https://api.spotify.com/v1/me/top/artists?limit=${limit}`;

    return this.httpClient.get<any>(topArtistsUrl, { headers })
      .pipe(
        map(response => response.items.map((item: any) => {
          const image = item.images.length > 0 ? item.images[0].url : null;
          return new Artist(
            item.name,
            item.id,
            item.genres,
            image,
            []
          );
        }))
      );
  }

}
