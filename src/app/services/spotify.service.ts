import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Artist {
  name: string;
  id: string;
  genres: string[];
  imageUrl: string;
  followers: number;
}


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private backendUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login() {
    window.location.href = `${this.backendUrl}/login`;
  }

  getUserData(): Observable<any> {
    return this.http.get(`${this.backendUrl}/get-user-data`);
  }
}
