# NeoArt V2: movimiento e interactividad

## Qué se modificó

- `src/app/app.ts`: incorpora `PageMotionDirective` y el control `luzEncendida`.
- `src/app/app.html`: portada con parallax, nueva historia interactiva, efectos 3D en tarjetas y CTA final.
- `src/app/app.css`: diseño de nuevas secciones y movimiento del cursor.
- `src/app/directives/page-motion.directive.ts`: GSAP ScrollTrigger reutilizable en toda la página.
- `src/styles.css`: fuente del sistema y soporte para reducir movimiento.

**No se han cambiado** la lógica de precios, el selector de medidas, el copiado de pedidos ni el cambio automático de tema.

## Ejecutar en Mac

```sh
cd ~/Documents/neoart
npm install
npm run build
npm start
```

## Comprobar

1. Arrastrar el scroll en el hero: ligero parallax.
2. «NO ES SOLO UN CUADRO»: mantiene su animación 3D original.
3. «NO LLENES PAREDES / DALES VIDA»: texto horizontal que avanza y retrocede.
4. Pulsar «Sin luz» / «Encender luz»: cambia la simulación.
5. Mover el cursor en escritorio: inclinación sutil en la portada, en el cuadro y en miniaturas del catálogo.
6. En el catálogo: seleccionar diseño y ajustar precio.
7. CTA final dirige a personalización.
8. Comprobar iPhone 390 px, iPad 820 px y Mac 1440 px.

**Nota:** cuadros y precios son demostrativos. No se ha conectado aún el WhatsApp de NeoArt. La iluminación es una simulación CSS, no fotografía de un producto.
