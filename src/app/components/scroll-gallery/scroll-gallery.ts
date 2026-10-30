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
  selector: 'app-scroll-gallery',
  imports: [],
  templateUrl: './scroll-gallery.html',
  styleUrl: './scroll-gallery.css',
})
export class ScrollGalleryComponent {
  private readonly scene = viewChild.required<ElementRef<HTMLElement>>('scene');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly destroyRef = inject(DestroyRef);
  private media?: ReturnType<typeof gsap.matchMedia>;

  constructor() {
    afterNextRender(() => this.initialize());
    this.destroyRef.onDestroy(() => this.media?.revert());
  }

  private initialize(): void {
    gsap.registerPlugin(ScrollTrigger);
    const root = this.scene().nativeElement;
    const track = this.track().nativeElement;
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-gallery-slide]'));
    const progress = root.querySelector<HTMLElement>('[data-gallery-progress]');

    if (slides.length !== 3 || !progress) {
      console.warn('NeoArt: faltan elementos de la galeria cinematografica');
      return;
    }

    this.media = gsap.matchMedia();

    this.media.add(
      {
        desktop: '(min-width: 1024px) and (min-height: 650px)',
        mobile: '(max-width: 1023px), (max-height: 649px)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        if (context.conditions?.['reduced']) return;

        const isDesktop = Boolean(context.conditions?.['desktop']);
        if (isDesktop) {
          // Never transform the pinned element itself: only its inner slides.
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: track,
              start: 'top top',
              end: '+=1900',
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              // For debugging only: markers: true,
            },
          });

          gsap.set(slides[0], { autoAlpha: 1, xPercent: 0, scale: 1, rotationY: 0 });
          gsap.set(slides.slice(1), { autoAlpha: 0, xPercent: 22, scale: 0.84, rotationY: 12 });
          gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });

          timeline.to(slides[0], { xPercent: -24, scale: 0.84, rotationY: -12, autoAlpha: 0, duration: 0.9 }, 0.85);
          timeline.to(slides[1], { xPercent: 0, scale: 1, rotationY: 0, autoAlpha: 1, duration: 0.9 }, 0.85);
          timeline.to(slides[1], { xPercent: -24, scale: 0.84, rotationY: -12, autoAlpha: 0, duration: 0.9 }, 2.65);
          timeline.to(slides[2], { xPercent: 0, scale: 1, rotationY: 0, autoAlpha: 1, duration: 0.9 }, 2.65);
          timeline.to(progress, { scaleX: 1, duration: 4.4 }, 0);
          timeline.to({}, { duration: 0.85 }, 3.55);
        } else {
          // Phones and tablets: no pinning, readable stacked sections.
          slides.forEach((slide) => {
            gsap.fromTo(
              slide,
              { autoAlpha: 0.65, y: 42 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.85,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: slide,
                  start: 'top 90%',
                  end: 'top 45%',
                  scrub: 0.5,
                },
              },
            );
          });
        }
      },
    );

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  moveTilt(event: PointerEvent): void {
    if (
      event.pointerType !== 'mouse' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    const stage = event.currentTarget as HTMLElement;
    const piece = stage.querySelector<HTMLElement>('[data-gallery-art]');
    if (!piece) return;
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    piece.style.setProperty('--tilt-x', `${-y * 10}deg`);
    piece.style.setProperty('--tilt-y', `${x * 10}deg`);
  }

  resetTilt(event: PointerEvent): void {
    const stage = event.currentTarget as HTMLElement;
    const piece = stage.querySelector<HTMLElement>('[data-gallery-art]');
    piece?.style.setProperty('--tilt-x', '0deg');
    piece?.style.setProperty('--tilt-y', '0deg');
  }
}
