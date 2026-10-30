# NeoArt V6 - Animaciones, precios reales y redes sociales

Esta actualización parte de NeoArt V5.1 (fotografías originales y corrección de orientación).

## Cambios

1. La fotografía de Tony Montana en la sección «NO ES SOLO UN CUADRO» ahora es más grande, con movimiento de desplazamiento y perspectiva.
2. La sección «Cada detalle cobra vida» pasa a llamarse «La luz lo cambia todo»: un barrido horizontal revela progresivamente la fotografía original del Porsche. Es una **simulación visual** del encendido, no una edición del JPEG.
3. Se eliminó el cierre «TU IDEA. NUESTRA LUZ.» y se modificó esa frase en la galería.
4. Los diez productos del catálogo muestran medidas de referencia con los precios facilitados. El selector permite las nueve medidas. Confirma disponibilidad de cada formato para cada diseño antes de fabricar.
5. Pie de página preparado para Instagram, Facebook y TikTok (opcional); los accesos no abren perfiles hasta que se indiquen enlaces oficiales.
6. El tema automático claro/oscuro, los efectos anteriores y el flujo de solicitud por WhatsApp siguen intactos.

## Tarifario

| Medida | Precio |
| --- | ---: |
| 40 x 30 cm | Q529 |
| 60 x 40 cm | Q629 |
| 95 x 45 cm | Q749 |
| 80 x 60 cm | Q789 |
| 128 x 55 cm | Q929 |
| 100 x 80 cm | Q1,029 |
| 100 x 100 cm | Q1,149 |
| 120 x 80 cm | Q1,209 |
| 120 x 100 cm | Q1,479 |

Referencias por foto: Tony Montana (ambos diseños) 95 x 45; otros Money Art (Bart, verde, Pato) 128 x 55; Messi y Bad Bunny 40 x 30; Porsche, Mustang y Goku 120 x 100.

## Cómo aplicar sin perder Git

**Usar PowerShell en Windows.** Trabajar en `C:\Users\mario\Desktop\NeoArt-Git`. NO extraer «proyecto completo» dentro de ese repositorio.

1. Comprobar estado: `git status -sb`.
2. Si ya estás en una rama feature y tienes cambios sin confirmar de V5.1, **continúa en esa rama**. No hagas `git reset`, `git checkout .` ni cambies a develop con cambios pendientes.
3. Guarda un respaldo de los archivos modificados si tienes cambios manuales sin confirmar.
4. Extrae el ZIP **solo-cambios** dentro de `NeoArt-Git`:

```powershell
Expand-Archive `
  -LiteralPath "$HOME\Downloads\NeoArt-V6-solo-cambios.zip" `
  -DestinationPath "C:\Users\mario\Desktop\NeoArt-Git" `
  -Force
```

5. `npm ci` (solo si faltan dependencias) y `npm run build`.
6. `npm start`, abrir el puerto que indique Angular, probar Mac/iPad/iPhone con las herramientas de Chrome.
7. Una vez que compile y se vea correctamente, `git add -A`, revisar `git diff --cached --name-only`, hacer commit en la rama feature y abrir Pull Request hacia `develop`.

## Accesos de redes

En `src/app/app.ts` hay un objeto:

```typescript
readonly redes = {
  instagram: '',
  facebook: '',
  tiktok: '',
};
```

Reemplaza cada cadena vacía con el enlace oficial completo que corresponda, por ejemplo `https://www.instagram.com/tu_usuario/` (es solo ejemplo). Si se deja vacío, el acceso se muestra deshabilitado para no dirigir al visitante a una cuenta equivocada. TikTok es opcional.

## Consideraciones técnicas

- Los JPEG originales permanecen idénticos a V5.1. La orientación se gestiona por CSS.
- Las animaciones usan GSAP/ScrollTrigger, con versión sin pin para pantallas compactas y respeto a `prefers-reduced-motion`.
- El presupuesto `anyComponentStyle` quedó con advertencia de 10 kB y límite de 16 kB. Sigue siendo recomendable optimizar hojas de estilo en una etapa posterior.
- El botón actual **copia** el pedido a WhatsApp; todavía no abre automáticamente un chat. No se requiere backend ni pasarela de pagos.
- **No se ejecutó aquí el build Angular completo** por limitaciones del entorno de ejecución. Comprobar obligatoriamente en Windows con `npm run build` antes del commit.
