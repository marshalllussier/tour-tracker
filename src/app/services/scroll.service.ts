import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private scrollSubject = new Subject<any>();

  scrollObservable = this.scrollSubject.asObservable();

  scrollToElement(targetElement: HTMLElement): void {
    this.scrollSubject.next(targetElement);
  }
}
