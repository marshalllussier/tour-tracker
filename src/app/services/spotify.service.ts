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

  private artistsData: Artist[] = [];
  private limit : number = 5;

  setArtistsData(artists: Artist[]) {
    this.artistsData = artists;
  }

  getArtistsData(): Artist[] {
    return this.artistsData;
  }

  exchangeCodeForToken(code: string): Observable<any> {
    return this.http.post('http://localhost:3000/dashboard', { code });
  }

  getUserInfo(accessToken: string): Observable<any> {
    return this.http.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
  }

  getTopArtists(accessToken: string) {
    const url = `https://api.spotify.com/v1/me/top/artists?limit=${this.limit}`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    };
    return this.http.get(url, { headers });
  }

  constructor(private http: HttpClient) { }
}
