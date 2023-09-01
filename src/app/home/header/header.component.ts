import {Component, HostListener} from '@angular/core';
import {ScrollService} from "../../services/scroll.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  buttonSelection : string = '';

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    const logoElement = document.querySelector('.logo') as HTMLElement;
    const scrollHeight = window.scrollY;

    if (scrollHeight > 100) {
      logoElement.style.height = '40px';
      logoElement.style.width = '40px';
      logoElement.style.marginTop = '0px'
      if (scrollHeight < 530) { this.buttonSelection = ""}
      if (scrollHeight > 530) { this.buttonSelection = "overview"}
      if (scrollHeight > 930) { this.buttonSelection = "how-it-works"}
      if (scrollHeight > 1330) { this.buttonSelection = "support-us"}
      if (scrollHeight > 1650) { this.buttonSelection = "contact-us"}

    } else {
      logoElement.style.height = '80px';
      logoElement.style.width = '80px';
      logoElement.style.marginTop = '25px'
    }
  }


  constructor(private scrollService: ScrollService) { }

  scrollToElement(target : string): void {
    const targetElement = document.getElementById(target) as HTMLElement;
    this.scrollService.scrollToElement(targetElement);
  }

}
