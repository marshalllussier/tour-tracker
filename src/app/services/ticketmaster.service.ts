import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketmasterService {
  apiKey = '';
  baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';

  constructor(private http: HttpClient) {
    http.get('assets/api_key.txt', { responseType: 'text' })
      .subscribe(data => this.apiKey = data);
  }

  searchEventsByArtist(artistName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?keyword=${artistName}&apikey=${this.apiKey}`);
  }
}
