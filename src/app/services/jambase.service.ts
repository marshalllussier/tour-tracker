import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JambaseService {
  apiKey = '';
  baseUrl = 'https://www.jambase.com/jb-api/v1/events';

  constructor(private http: HttpClient) {
    http.get('assets/api_key.txt', { responseType: 'text' })
      .subscribe(data => this.apiKey = data.trim());
  }

  searchEventsByArtist(artistName: string): Observable<any> {
    const headers = {
      'Accept': 'application/json',
    };
    const params = {
      artistName: artistName,
      apikey: this.apiKey,
      exactMatch: 'true'
    };
    return this.http.get(this.baseUrl, { headers, params });
  }
}
