import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-cinematic-section',
  imports: [],
  templateUrl: './cinematic-section.html',
  styleUrl: './cinematic-section.css',
})
export class CinematicSectionComponent {
  private readonly escena = viewChild.required<ElementRef<HTMLElement>>('escena');
  private readonly poster = viewChild.required<ElementRef<HTMLElement>>('poster');
  private readonly destroyRef = inject(DestroyRef);
  private animaciones?: ReturnType<typeof gsap.matchMedia>;

  constructor() {
    afterNextRender(() => this.iniciarAnimaciones());
    this.destroyRef.onDestroy(() => this.animaciones?.revert());
  }

  private iniciarAnimaciones(): void {
    gsap.registerPlugin(ScrollTrigger);

    const seccion = this.escena().nativeElement;
    const lineaUno = seccion.querySelector<HTMLElement>('[data-linea-uno]');
    const lineaDos = seccion.querySelector<HTMLElement>('[data-linea-dos]');
    const marco = seccion.querySelector<HTMLElement>('[data-marco]');
    const iluminacion = seccion.querySelector<HTMLElement>('[data-iluminacion]');
    const descripcion = seccion.querySelector<HTMLElement>('[data-descripcion]');

    if (!lineaUno || !lineaDos || !marco || !iluminacion || !descripcion) {
      console.warn('NeoArt: faltan elementos para la animacion cinematografica');
      return;
    }

    this.animaciones = gsap.matchMedia();
    this.animaciones.add(
      {
        escritorio: '(min-width: 1024px) and (min-height: 760px)',
        tablet: '(min-width: 640px) and (max-width: 1023px)',
        movil: '(max-width: 639px)',
        reducido: '(prefers-reduced-motion: reduce)',
      },
      (contexto) => {
        if (contexto.conditions?.['reducido']) {
          return;
        }

        const escritorio = Boolean(contexto.conditions?.['escritorio']);
        const movil = Boolean(contexto.conditions?.['movil']);
        const distancia = escritorio ? 130 : movil ? 16 : 48;

        const lineaTiempo = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: seccion,
            start: escritorio ? 'top top' : 'top 85%',
            end: escritorio ? '+=950' : 'bottom 15%',
            scrub: 0.7,
            pin: escritorio,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false,
          },
        });

        lineaTiempo.fromTo(lineaUno,
          { x: -distancia },
          { x: distancia, duration: 1 }, 0);

        lineaTiempo.fromTo(lineaDos,
          { x: distancia },
          { x: -distancia, duration: 1 }, 0);

        lineaTiempo.fromTo(marco,
          { y: escritorio ? 48 : 20, rotation: -4, scale: 0.84 },
          { y: escritorio ? -20 : -10, rotation: 2.5, scale: 1.025, duration: 1 }, 0);

        lineaTiempo.fromTo(iluminacion,
          { opacity: 0.2, scale: 0.8 },
          { opacity: 0.95, scale: 1.2, duration: 1 }, 0);

        lineaTiempo.fromTo(descripcion,
          { opacity: 0.35, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 }, 0.15);

        return () => lineaTiempo.kill();
      },
    );

    ScrollTrigger.refresh();
  }

  moverPoster(evento: PointerEvent): void {
    if (evento.pointerType !== 'mouse') {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const area = evento.currentTarget as HTMLElement;
    const rect = area.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const x = (evento.clientX - rect.left) / rect.width;
    const y = (evento.clientY - rect.top) / rect.height;
    const poster = this.poster().nativeElement;

    poster.style.setProperty('--giro-x', `${(0.5 - y) * 14}deg`);
    poster.style.setProperty('--giro-y', `${(x - 0.5) * 14}deg`);
  }

  restaurarPoster(): void {
    const poster = this.poster().nativeElement;
    poster.style.setProperty('--giro-x', '0deg');
    poster.style.setProperty('--giro-y', '0deg');
  }
}
