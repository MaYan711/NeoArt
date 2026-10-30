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
    const reveal = section.querySelector<HTMLElement>('[data-light-wipe]');
    const stage = section.querySelector<HTMLElement>('[data-light-stage]');
    const halo = section.querySelector<HTMLElement>('[data-light-halo]');
    const title = section.querySelector<HTMLElement>('[data-light-title]');
    const subtitle = section.querySelector<HTMLElement>('[data-light-subtitle]');
    const progress = section.querySelector<HTMLElement>('[data-light-progress]');
    const scan = section.querySelector<HTMLElement>('[data-light-scan]');

    if (!reveal || !stage || !halo || !title || !subtitle || !progress || !scan) {
      console.warn('NeoArt: elementos incompletos en Light Reveal');
      return;
    }

    this.media = gsap.matchMedia();
    this.media.add(
      {
        desktop: '(min-width: 1024px) and (min-height: 700px)',
        compact: '(max-width: 1023px), (max-height: 699px)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const desktop = Boolean(context.conditions?.['desktop']);
        if (context.conditions?.['reduced']) {
          gsap.set(reveal, { clipPath: 'inset(0 0% 0 0)' });
          gsap.set(progress, { scaleX: 1 });
          gsap.set(scan, { opacity: 0 });
          return;
        }

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: desktop ? 'top top' : 'top 88%',
            end: desktop ? '+=1050' : 'bottom 22%',
            scrub: desktop ? 0.8 : 0.5,
            pin: desktop,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // La misma foto aparece en dos capas: una oscurecida y otra original.
        // Solo se anima la mascara de la capa original, no se modifica el JPEG.
        timeline.fromTo(
          reveal,
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1 },
          0,
        );
        timeline.fromTo(
          stage,
          { scale: desktop ? 0.84 : 0.94, y: desktop ? 45 : 16, rotationY: -5 },
          { scale: 1.04, y: desktop ? -20 : 0, rotationY: 2, duration: 1 },
          0,
        );
        timeline.fromTo(
          halo,
          { opacity: 0.12, scale: 0.8 },
          { opacity: 0.85, scale: 1.3, duration: 1 },
          0,
        );
        timeline.fromTo(
          title,
          { y: desktop ? 35 : 14, opacity: 0.55 },
          { y: desktop ? -14 : 0, opacity: 1, duration: 1 },
          0,
        );
        timeline.fromTo(
          subtitle,
          { y: 18, opacity: 0.45 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.2,
        );
        timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
        timeline.fromTo(scan, { left: '0%', opacity: 0.85 }, { left: '100%', opacity: 0, duration: 1 }, 0);
        return () => timeline.kill();
      },
    );
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  movePointer(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const area = event.currentTarget as HTMLElement;
    const rect = area.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const art = this.artwork().nativeElement;
    art.style.setProperty('--neo-x', `${-y * 8}deg`);
    art.style.setProperty('--neo-y', `${x * 8}deg`);
  }

  resetPointer(): void {
    const art = this.artwork().nativeElement;
    art.style.setProperty('--neo-x', '0deg');
    art.style.setProperty('--neo-y', '0deg');
  }
}
