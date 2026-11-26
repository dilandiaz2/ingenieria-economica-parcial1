# Ingeniería Económica · Primer parcial

Proyecto grupal de Ingeniería Económica (Universidad Agraria del Ecuador, Computación en Línea).
Web interactiva con conceptos, fórmulas y ejercicios propuestos por tema. Los datos de cada ejercicio se pueden cambiar y el resultado se recalcula.

## Qué incluye

- **Temas**: interés simple, descuento simple, diagrama de tiempo, ecuaciones de valor, interés compuesto, tasas equivalentes/efectiva/nominal, anualidades y gradientes.
- **Gráficos**: cada tema muestra su gráfico (simple vs. compuesto, saldo del crédito, rentas del gradiente, etc.).
- **Mis ejercicios**: botón «Guardar en mi historial»; se guarda en el navegador (localStorage) y se puede exportar/importar en JSON.
- **Autores y fuentes**: edita la lista `INTEGRANTES` al inicio de `temas.js`.

- **Calculadora**: interés, monto, capital, tasa y tiempo, con datos, fórmula y resolución.
- **Ejercicios resueltos**: seis ejercicios paso a paso (interés, capital, tasa, tiempo, comercial vs. exacto, ecuación de valor).
- **Ecuación de valor**: deudas con fecha focal, pago único y diagrama de tiempo.
- **Fórmulas**: resumen de todo lo usado.

## Cómo verla en local

Abre `index.html` en el navegador. No necesita instalar nada.

## Publicar en GitHub Pages

1. Crea un repositorio público en GitHub llamado `interes-simple-ingenieria-economica`.
2. Sube estos archivos (desde la carpeta del proyecto):

   ```bash
   git init
   git add .
   git commit -m "Proyecto de interés simple"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/interes-simple-ingenieria-economica.git
   git push -u origin main
   ```

3. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
4. En uno o dos minutos la página queda en:
   `https://TU-USUARIO.github.io/interes-simple-ingenieria-economica/`

## Tecnologías

HTML, CSS y JavaScript puro, sin librerías externas.
