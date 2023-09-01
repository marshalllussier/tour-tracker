import { Component } from '@angular/core';
import {ScrollService} from "../services/scroll.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title: string = 'Tour Tracker';

  constructor(private scrollService : ScrollService) { }

  authenticateUser() {
    const clientId = 'ddb750fd92ac45229a5312c00fbef4a2';
    const redirectUri = 'http://localhost:4200/dashboard';
    const scope = 'user-library-read user-top-read';
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
  }

  ngOnInit(): void {
    this.handleScroll();

  }

  handleScroll() {
    this.scrollService.scrollObservable.subscribe(targetElement => {
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const topPosition = window.pageYOffset + rect.top;

        window.scrollTo({
          top: topPosition - 75,
          behavior: 'smooth'
        });
      }
    });
  }

}
