import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appReveal]',
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly elemento = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  private observador?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducirMovimiento || !('IntersectionObserver' in window)) {
      return;
    }

    const elemento = this.elemento.nativeElement;

    this.renderer.addClass(elemento, 'neo-reveal');

    this.observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) {
          this.renderer.addClass(elemento, 'neo-reveal-visible');
          this.observador?.unobserve(elemento);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      },
    );

    this.observador.observe(elemento);
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
  }
}
