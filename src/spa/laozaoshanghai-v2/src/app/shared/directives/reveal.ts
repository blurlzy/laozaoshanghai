import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Adds `is-in` once the host scrolls into view, triggering its CSS reveal transition. */
@Directive({ selector: '[appReveal]' })
export class Reveal {
  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    let observer: IntersectionObserver | undefined;

    afterNextRender(() => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            host.classList.add('is-in');
            observer?.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      observer.observe(host);
    });

    inject(DestroyRef).onDestroy(() => observer?.disconnect());
  }
}
