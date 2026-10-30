import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { RevealDirective } from './directives/reveal.directive';
import { PageMotionDirective } from './directives/page-motion.directive';
import { CinematicSectionComponent } from './components/cinematic-section/cinematic-section';
import { LightRevealComponent } from './components/light-reveal/light-reveal';

interface Variante {
  medida: string;
  precio: number;
}

interface Cuadro {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  variantes: Variante[];
}

@Component({
  selector: 'app-root',
  imports: [RevealDirective, PageMotionDirective, CinematicSectionComponent, LightRevealComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  readonly modoOscuro = signal(false);
  readonly modoAutomatico = signal(true);

  readonly menuAbierto = signal(false);
  readonly luzEncendida = signal(true);

  private reloj?: ReturnType<typeof setInterval>;

  readonly cuadros: Cuadro[] = [
    {
      id: 'deportivo',
      nombre: 'Coleccion Automotriz',
      categoria: 'Automoviles',
      descripcion: 'Arte automotriz con acabado brillante y luz LED.',
      variantes: [
        { medida: '40 x 50 cm', precio: 450 },
        { medida: '50 x 60 cm', precio: 650 },
        { medida: '60 x 80 cm', precio: 900 },
      ],
    },
    {
      id: 'musica',
      nombre: 'Coleccion Musical',
      categoria: 'Musica',
      descripcion: 'Diseños inspirados en la musica y sus artistas.',
      variantes: [
        { medida: '40 x 50 cm', precio: 400 },
        { medida: '50 x 60 cm', precio: 600 },
        { medida: '60 x 80 cm', precio: 850 },
      ],
    },
    {
      id: 'personalizado',
      nombre: 'Diseno Personalizado',
      categoria: 'Personalizados',
      descripcion: 'Creamos un cuadro especial a tu gusto.',
      variantes: [
        { medida: '40 x 50 cm', precio: 500 },
        { medida: '50 x 60 cm', precio: 700 },
        { medida: '60 x 80 cm', precio: 950 },
      ],
    },
  ];

  readonly idSeleccionado = signal('deportivo');
  readonly medidaSeleccionada = signal('40 x 50 cm');
  readonly cantidad = signal(1);
  readonly pedidoCopiado = signal(false);

  readonly cuadroSeleccionado = computed(
    () => this.cuadros.find((cuadro) => cuadro.id === this.idSeleccionado()) ?? this.cuadros[0],
  );

  readonly varianteSeleccionada = computed(
    () =>
      this.cuadroSeleccionado().variantes.find(
        (variante) => variante.medida === this.medidaSeleccionada(),
      ) ?? this.cuadroSeleccionado().variantes[0],
  );

  readonly total = computed(() => this.varianteSeleccionada().precio * this.cantidad());

  ngOnInit(): void {
    this.actualizarTema();

    this.reloj = setInterval(() => {
      if (this.modoAutomatico()) {
        this.actualizarTema();
      }
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.reloj) {
      clearInterval(this.reloj);
    }
  }

  cambiarTema(): void {
    this.modoAutomatico.set(false);
    this.modoOscuro.update((valor) => !valor);
  }

  activarAutomatico(): void {
    this.modoAutomatico.set(true);
    this.actualizarTema();
  }

  private actualizarTema(): void {
    const hora = new Date().getHours();
    this.modoOscuro.set(hora >= 17 || hora < 6);
  }

  seleccionarCuadro(id: string): void {
    const cuadro = this.cuadros.find((item) => item.id === id);

    if (!cuadro) {
      return;
    }

    this.idSeleccionado.set(id);
    this.medidaSeleccionada.set(cuadro.variantes[0].medida);
    this.cantidad.set(1);
    this.pedidoCopiado.set(false);

    if (typeof document !== 'undefined') {
      const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('personalizar')?.scrollIntoView({
        behavior: reducirMovimiento ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }

  cambiarMedida(evento: Event): void {
    const elemento = evento.target as HTMLSelectElement;
    this.medidaSeleccionada.set(elemento.value);
    this.pedidoCopiado.set(false);
  }

  cambiarCantidad(cambio: number): void {
    this.cantidad.update((valor) => Math.max(1, valor + cambio));
    this.pedidoCopiado.set(false);
  }

  formatearPrecio(precio: number): string {
    return `Q${precio.toLocaleString('es-GT')}`;
  }

  async copiarPedido(): Promise<void> {
    const mensaje =
      `Hola NeoArt, quiero solicitar un cuadro.\n\n` +
      `Modelo: ${this.cuadroSeleccionado().nombre}\n` +
      `Medidas: ${this.medidaSeleccionada()}\n` +
      `Cantidad: ${this.cantidad()}\n` +
      `Precio mostrado: ${this.formatearPrecio(this.total())}\n\n` +
      `Quisiera confirmar mi pedido y el anticipo.`;

    try {
      await navigator.clipboard.writeText(mensaje);
      this.pedidoCopiado.set(true);
    } catch {
      this.pedidoCopiado.set(false);
    }
  }
}
