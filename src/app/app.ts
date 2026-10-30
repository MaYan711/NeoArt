import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { RevealDirective } from './directives/reveal.directive';
import { PageMotionDirective } from './directives/page-motion.directive';
import { CinematicSectionComponent } from './components/cinematic-section/cinematic-section';
import { LightRevealComponent } from './components/light-reveal/light-reveal';
import { ScrollGalleryComponent } from './components/scroll-gallery/scroll-gallery';

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
  imagen: string;
  alt: string;
  horizontal: boolean;
  destacado?: string;
  medidaReferencia: string;
}

@Component({
  selector: 'app-root',
  imports: [RevealDirective, PageMotionDirective, CinematicSectionComponent, LightRevealComponent, ScrollGalleryComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  readonly modoOscuro = signal(false);
  readonly modoAutomatico = signal(true);

  readonly menuAbierto = signal(false);
  readonly luzEncendida = signal(true);

  private reloj?: ReturnType<typeof setInterval>;

  // Fotografias originales de trabajos realizados por NeoArt.
  // Lista real de precios facilitada por NeoArt (quetzales).
  // Todos los tamanos se muestran como opciones; confirmar medidas especiales al recibir el pedido.
  readonly preciosPorMedida: Variante[] = [
    { medida: '40 x 30 cm', precio: 529 },
    { medida: '60 x 40 cm', precio: 629 },
    { medida: '95 x 45 cm', precio: 749 },
    { medida: '80 x 60 cm', precio: 789 },
    { medida: '128 x 55 cm', precio: 929 },
    { medida: '100 x 80 cm', precio: 1029 },
    { medida: '100 x 100 cm', precio: 1149 },
    { medida: '120 x 80 cm', precio: 1209 },
    { medida: '120 x 100 cm', precio: 1479 },
  ];

  // Agrega los enlaces oficiales completos cuando los tengas.
  // Ejemplo: https://www.instagram.com/tu_perfil/
  readonly contacto = {
    envio: 'Envío gratis a toda Guatemala',
    anticipo: '30% de anticipo para agendar',
    whatsapp: '3082-9651',
    handle: '@neoartgt',
  };

  readonly redes = {
    instagram: '',
    facebook: '',
    tiktok: '',
  };
  readonly cuadros: Cuadro[] = [
    {
      id: 'tony-blanco', nombre: 'Tony Montana · Neon blanco', categoria: 'Money Art',
      descripcion: 'Cuadro horizontal estilo billete, con contorno iluminado.',
      imagen: '/images/cuadros/tony-montana-blanco.jpeg',
      alt: 'Cuadro real NeoArt estilo Tony Montana con contorno de neon blanco',
      horizontal: true, destacado: 'Mas solicitado',
      medidaReferencia: '95 x 45 cm',
      variantes: this.preciosPorMedida,
    },
    {
      id: 'messi', nombre: 'Leo Messi · Barcelona', categoria: 'Futbol',
      descripcion: 'Diseño vertical con escudo iluminado, resina y acabado brillante.',
      imagen: '/images/cuadros/messi-barcelona.jpeg',
      alt: 'Cuadro real NeoArt de Messi con iluminacion en el escudo de Barcelona',
      horizontal: false, destacado: 'Mas solicitado',
      medidaReferencia: '40 x 30 cm',
      variantes: this.preciosPorMedida,
    },
    {
      id: 'tony-clasico', nombre: 'Tony Montana · Money Art', categoria: 'Money Art',
      descripcion: 'Formato horizontal con retrato y acabado tipo espejo.',
      imagen: '/images/cuadros/tony-montana-clasico.jpeg',
      alt: 'Cuadro real NeoArt de Tony Montana con fondo de billete y resina brillante',
      horizontal: true, destacado: 'Mas solicitado',
      medidaReferencia: '95 x 45 cm',
      variantes: this.preciosPorMedida,
    },
    {
      id: 'porsche', nombre: 'Porsche GT3 RS', categoria: 'Automoviles',
      descripcion: 'Diseño horizontal con iluminacion roja en la parte trasera.',
      imagen: '/images/cuadros/porsche-gt3rs.jpeg',
      alt: 'Cuadro horizontal real NeoArt de Porsche GT3 RS con luces rojas',
      horizontal: true, destacado: 'Formato horizontal',
      medidaReferencia: '120 x 100 cm',
      variantes: this.preciosPorMedida,
    },
    {
      id: 'mustang', nombre: 'Mustang · Neon rojo', categoria: 'Automoviles',
      descripcion: 'Cuadro vertical con borde rojo y detalles de iluminacion frontal.',
      imagen: '/images/cuadros/mustang-neon.jpeg',
      alt: 'Cuadro real NeoArt de Mustang con borde iluminado rojo',
      horizontal: false,
      medidaReferencia: '120 x 100 cm',
      variantes: this.preciosPorMedida,
    },
    {
      id: 'bad-bunny', nombre: 'Bad Bunny · YHLQMDLG', categoria: 'Musica',
      descripcion: 'Arte inspirado en musica, fotografiado en mano para mostrar su escala.',
      imagen: '/images/cuadros/bad-bunny.jpeg',
      alt: 'Cuadro real NeoArt inspirado en Bad Bunny YHLQMDLG sostenido en mano',
      horizontal: false,
      medidaReferencia: '40 x 30 cm',
      variantes: this.preciosPorMedida,
    },
    {
      id: 'bart-money', nombre: 'Bart · Money Art', categoria: 'Money Art',
      descripcion: 'Composicion horizontal tipo billete con contorno iluminado.',
      imagen: '/images/cuadros/money-bart.jpeg',
      alt: 'Cuadro horizontal real NeoArt con Bart y billete, luz amarilla',
      horizontal: true, destacado: 'Formato horizontal',
      medidaReferencia: '128 x 55 cm',
      variantes: this.preciosPorMedida,
    },
    {
      id: 'money-verde', nombre: 'Money Art · Neon verde', categoria: 'Money Art',
      descripcion: 'Composicion horizontal con contornos verdes iluminados.',
      imagen: '/images/cuadros/money-verde.jpeg',
      alt: 'Cuadro horizontal real NeoArt estilo dinero con luces verdes',
      horizontal: true,
      medidaReferencia: '128 x 55 cm',
      variantes: this.preciosPorMedida,
    },
    {
      id: 'scrooge', nombre: 'Money Art · Pato', categoria: 'Money Art',
      descripcion: 'Formato panoramico con ilustracion y efecto de resina brillante.',
      imagen: '/images/cuadros/money-scrooge.jpeg',
      alt: 'Cuadro horizontal real NeoArt de personaje pato con motivo de dinero',
      horizontal: true,
      medidaReferencia: '128 x 55 cm',
      variantes: this.preciosPorMedida,
    },
    {
      id: 'goku', nombre: 'Anime · Guerrero', categoria: 'Anime',
      descripcion: 'Cuadro vertical de anime con iluminacion azul interior.',
      imagen: '/images/cuadros/goku-neon.jpeg',
      alt: 'Cuadro real NeoArt de personaje anime con zonas iluminadas en azul',
      horizontal: false,
      medidaReferencia: '120 x 100 cm',
      variantes: this.preciosPorMedida,
    },
  ];

  readonly categorias = ['Todos', 'Money Art', 'Futbol', 'Automoviles', 'Musica', 'Anime'];
  readonly categoriaActiva = signal('Todos');
  readonly cuadrosFiltrados = computed(() =>
    this.categoriaActiva() === 'Todos'
      ? this.cuadros
      : this.cuadros.filter(cuadro => cuadro.categoria === this.categoriaActiva())
  );

  readonly idSeleccionado = signal('tony-blanco');
  readonly medidaSeleccionada = signal('95 x 45 cm');
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

  precioReferencia(cuadro: Cuadro): number {
    return cuadro.variantes.find((variante) => variante.medida === cuadro.medidaReferencia)?.precio
      ?? cuadro.variantes[0].precio;
  }


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
    this.medidaSeleccionada.set(cuadro.medidaReferencia);
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
      `Precio segun medidas: ${this.formatearPrecio(this.total())}\n` +
      `Anticipo: 30% para agendar\n` +
      `Envío: gratis a toda Guatemala\n\n` +
      `Quisiera confirmar la disponibilidad, el anticipo y el tiempo de entrega.`;

    try {
      await navigator.clipboard.writeText(mensaje);
      this.pedidoCopiado.set(true);
    } catch {
      this.pedidoCopiado.set(false);
    }
  }
}
