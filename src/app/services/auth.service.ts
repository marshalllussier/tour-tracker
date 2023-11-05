import { Injectable } from '@angular/core';
import { environment} from "../../assets/environments/environment.dev";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  getUserData(accessToken: string): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };
    return this.httpClient.get('https://api.spotify.com/v1/me', { headers });
  }

  private generateRandomState(): string {
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

}
