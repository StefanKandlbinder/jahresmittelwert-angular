import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SEOService {
  constructor(@Inject(DOCUMENT) private dom: Document) {}

  updateCanonicalUrl(url: string) {
    const head = this.dom.getElementsByTagName('head')[0];
    let element: HTMLLinkElement;

    if (!this.dom.querySelector(`link[rel='canonical']`)) {
      element = this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    } else {
      element = this.dom.querySelector(
        `link[rel='canonical']`
      ) as HTMLLinkElement;
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', url);
  }
}
