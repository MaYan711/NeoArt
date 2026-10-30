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
  selector: 'app-light-reveal',
  imports: [],
  templateUrl: './light-reveal.html',
  styleUrl: './light-reveal.css',
})
export class LightRevealComponent {
  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly artwork = viewChild.required<ElementRef<HTMLElement>>('artwork');
  private readonly destroyRef = inject(DestroyRef);
  private media?: ReturnType<typeof gsap.matchMedia>;

  constructor() {
    afterNextRender(() => this.initialize());
    this.destroyRef.onDestroy(() => this.media?.revert());
  }

  private initialize(): void {
    gsap.registerPlugin(ScrollTrigger);
    const section = this.section().nativeElement;
    const poster = section.querySelector<HTMLElement>('[data-light-poster]');
    const halo = section.querySelector<HTMLElement>('[data-light-halo]');
    const neon = section.querySelector<HTMLElement>('[data-light-neon]');
    const captions = Array.from(section.querySelectorAll<HTMLElement>('[data-light-caption]'));
    const progress = section.querySelector<HTMLElement>('[data-light-progress]');

    if (!poster || !halo || !neon || captions.length !== 3 || !progress) {
      console.warn('NeoArt: no se encontraron los elementos de Light Reveal');
      return;
    }

    this.media = gsap.matchMedia();
    this.media.add({
      desktop: '(min-width: 1024px)',
      reduced: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      if (context.conditions?.['reduced']) {
        gsap.set(halo, { opacity: 0.8, scale: 1.2 });
        gsap.set(neon, { opacity: 1 });
        gsap.set(captions, { opacity: 0 });
        gsap.set(captions[2], { opacity: 1 });
        return;
      }

      const desktop = Boolean(context.conditions?.['desktop']);
      gsap.set(captions, { opacity: 0, y: 20 });
      gsap.set(captions[0], { opacity: 1, y: 0 });
      gsap.set(halo, { opacity: 0.04, scale: 0.7 });
      gsap.set(neon, { opacity: 0.08 });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: desktop ? 'top top' : 'top 80%',
          end: desktop ? '+=1500' : 'bottom 15%',
          scrub: 0.65,
          pin: desktop,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Activar temporalmente para diagnosticar: markers: true
        },
      });

      timeline.fromTo(poster,
        { scale: desktop ? 0.72 : 0.92, y: desktop ? 55 : 25, rotationY: -12, rotationX: 5 },
        { scale: 1.02, y: 0, rotationY: 3, rotationX: -2, duration: 1 }, 0);
      timeline.to(halo, { opacity: 0.95, scale: 1.3, duration: 0.65 }, 0.27);
      timeline.to(neon, { opacity: 1, duration: 0.65 }, 0.27);
      timeline.to(captions[0], { opacity: 0, y: -20, duration: 0.15 }, 0.22);
      timeline.to(captions[1], { opacity: 1, y: 0, duration: 0.2 }, 0.38);
      timeline.to(captions[1], { opacity: 0, y: -20, duration: 0.15 }, 0.65);
      timeline.to(captions[2], { opacity: 1, y: 0, duration: 0.2 }, 0.8);
      timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  movePointer(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const art = this.artwork().nativeElement;
    art.style.setProperty('--neo-x', `${-y * 10}deg`);
    art.style.setProperty('--neo-y', `${x * 10}deg`);
  }

  resetPointer(): void {
    const art = this.artwork().nativeElement;
    art.style.setProperty('--neo-x', '0deg');
    art.style.setProperty('--neo-y', '0deg');
  }
}
