import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appPageMotion]',
})
export class PageMotionDirective implements AfterViewInit, OnDestroy {
  private readonly root: ElementRef<HTMLElement> = inject(ElementRef);
  private media?: ReturnType<typeof gsap.matchMedia>;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    const container = this.root.nativeElement;
    const element = (selector: string): HTMLElement | null =>
      container.querySelector<HTMLElement>(selector);

    this.media = gsap.matchMedia();
    this.media.add(
      {
        desktop: '(min-width: 1024px)',
        tablet: '(min-width: 640px) and (max-width: 1023px)',
        mobile: '(max-width: 639px)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        if (context.conditions?.['reduced']) return;

        const desktop = Boolean(context.conditions?.['desktop']);
        const mobile = Boolean(context.conditions?.['mobile']);
        const intensity = desktop ? 1 : mobile ? 0.22 : 0.55;
        const cleanup: Array<() => void> = [];

        const hero = element('#inicio');
        const heroText = element('[data-motion-hero-text]');
        const heroFrame = element('[data-motion-hero-frame]');
        if (hero && heroText && heroFrame) {
          gsap.fromTo(heroText, { y: 0 }, {
            y: -54 * intensity,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.65,
            },
          });
          gsap.fromTo(heroFrame, { y: 0, scale: 1 }, {
            y: -75 * intensity,
            scale: 1 - 0.035 * intensity,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
            },
          });
        }

        const story = element('#historia');
        const storyOne = element('[data-motion-story-one]');
        const storyTwo = element('[data-motion-story-two]');
        const storyArt = element('[data-motion-story-art]');
        if (story && storyOne && storyTwo && storyArt) {
          const distance = desktop ? 125 : mobile ? 16 : 62;
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: story,
              start: 'top 88%',
              end: 'bottom 20%',
              scrub: 0.65,
            },
          });
          timeline.fromTo(storyOne, { x: -distance }, { x: distance, duration: 1 }, 0);
          timeline.fromTo(storyTwo, { x: distance }, { x: -distance, duration: 1 }, 0);
          timeline.fromTo(storyArt, { y: 36 * intensity, scale: 0.92 }, {
            y: -26 * intensity,
            scale: 1.035,
            duration: 1,
          }, 0);
        }

        const catalog = element('#catalogo');
        const catalogTitle = element('[data-motion-catalog-title]');
        if (catalog && catalogTitle) {
          gsap.fromTo(catalogTitle, { y: 22 * intensity }, {
            y: -22 * intensity,
            ease: 'none',
            scrollTrigger: {
              trigger: catalog,
              start: 'top bottom',
              end: 'center top',
              scrub: 0.7,
            },
          });
        }

        const final = element('#cierre');
        const finalOne = element('[data-motion-final-one]');
        const finalTwo = element('[data-motion-final-two]');
        if (final && finalOne && finalTwo) {
          const distance = desktop ? 85 : mobile ? 12 : 36;
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: final,
              start: 'top 92%',
              end: 'bottom 18%',
              scrub: 0.7,
            },
          });
          timeline.fromTo(finalOne, { x: -distance }, { x: distance, duration: 1 }, 0);
          timeline.fromTo(finalTwo, { x: distance }, { x: -distance, duration: 1 }, 0);
        }

        // Cursor movement is bound to INNER elements only: never to the element
        // whose transform is being controlled by GSAP or appReveal.
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          const tiles = container.querySelectorAll<HTMLElement>('[data-neo-tilt]');
          tiles.forEach((tile) => {
            const onMove = (event: PointerEvent): void => {
              if (event.pointerType !== 'mouse') return;
              const rect = tile.getBoundingClientRect();
              if (!rect.width || !rect.height) return;
              const xp = (event.clientX - rect.left) / rect.width - 0.5;
              const yp = (event.clientY - rect.top) / rect.height - 0.5;
              tile.style.setProperty('--neo-tilt-x', `${-yp * 9}deg`);
              tile.style.setProperty('--neo-tilt-y', `${xp * 9}deg`);
            };
            const onLeave = (): void => {
              tile.style.setProperty('--neo-tilt-x', '0deg');
              tile.style.setProperty('--neo-tilt-y', '0deg');
            };
            tile.addEventListener('pointermove', onMove);
            tile.addEventListener('pointerleave', onLeave);
            cleanup.push(() => {
              tile.removeEventListener('pointermove', onMove);
              tile.removeEventListener('pointerleave', onLeave);
              onLeave();
            });
          });
        }

        return () => cleanup.forEach((remove) => remove());
      },
    );

    // The pinned cinematic section has its own ScrollTrigger. Refresh after
    // Angular paints to keep positions accurate if images/fonts affect layout.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  ngOnDestroy(): void {
    this.media?.revert();
  }
}
