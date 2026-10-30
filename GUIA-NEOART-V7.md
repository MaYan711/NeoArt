# NeoArt V7 - banda informativa y modo claro corregido

## Cambios incluidos

1. Se agrego una banda visual debajo del hero con:
   - Envio gratis a toda Guatemala
   - 30% de anticipo para agendar
   - WhatsApp 3082-9651
   - Redes: @neoartgt

2. Se mejoro el footer con chips informativos y presencia de redes.

3. Se corrigio el cambio de tema para que el modo claro tambien afecte:
   - seccion cinematografica
   - seccion de historia
   - light reveal
   - scroll gallery

4. El mensaje copiado para WhatsApp ahora incluye anticipo y envio gratis.

## Archivos que se reemplazan
- src/app/app.ts
- src/app/app.html
- src/app/app.css
- src/app/components/cinematic-section/cinematic-section.html
- src/app/components/cinematic-section/cinematic-section.css
- src/app/components/light-reveal/light-reveal.html
- src/app/components/light-reveal/light-reveal.css
- src/app/components/scroll-gallery/scroll-gallery.css

## Importante
Los botones de redes en el footer quedaron listos visualmente, pero si quieres enlaces reales debes completar estas propiedades en `src/app/app.ts`:

```ts
readonly redes = {
  instagram: '',
  facebook: '',
  tiktok: '',
};
```

Ejemplo:

```ts
readonly redes = {
  instagram: 'https://www.instagram.com/neoartgt/',
  facebook: 'https://www.facebook.com/neoartgt',
  tiktok: 'https://www.tiktok.com/@neoartgt',
};
```
