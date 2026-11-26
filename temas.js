(function () {
  "use strict";
  /* ===== EDITA AQUÍ los integrantes del grupo (máx. 5) ===== */
  var INTEGRANTES = ["Dilan Smith Chamorro Diaz", "Integrante 2", "Integrante 3", "Integrante 4", "Integrante 5"];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });
  var m = function (x) { return money.format(x); };
  var N = function (x, d) { return new Intl.NumberFormat("es-EC", { maximumFractionDigits: d == null ? 4 : d }).format(x); };
  var P = function (x) { return N(x * 100, 4) + " %"; };
  var pw = Math.pow, ln = Math.log;
  var g = function (c, msg) { if (!c) throw msg; };
  var fa = function (j, n) { return (1 - pw(1 + j, -n)) / j; };
  var fs = function (j, n) { return (pw(1 + j, n) - 1) / j; };

  var T = [
    { id: "simple", n: "Ejercicios interés simple", ej: [
      { t: "Tasa de interés (clase)", e: "¿A qué tasa estuvo invertido un capital de {C} que en {a} años y {m} meses produjo {I} de interés?",
        f: [["C", "Capital ($)", 110000], ["I", "Interés ($)", 39875], ["a", "Años", 2], ["m", "Meses", 5]], fx: "i = I / (C · n)",
        run: function (v) { var n = v.a + v.m / 12; g(v.C > 0 && n > 0, "El capital y el tiempo deben ser mayores que cero."); var i = v.I / (v.C * n);
          return { r: ["n = " + v.a + " + " + v.m + "/12 = " + N(n, 6) + " años", "i = " + N(v.I, 2) + " / (" + N(v.C, 2) + " × " + N(n, 6) + ")"], z: "i = " + P(i) + " anual" }; } },
      { t: "Valor presente con interés simple (clase)", e: "Encuentra el valor presente, al {i} % de interés simple, de {M} con vencimiento en {t} meses.",
        f: [["M", "Valor al vencimiento ($)", 1500], ["i", "Tasa anual (%)", 6], ["t", "Meses", 9]], fx: "C = M / (1 + i · n)",
        run: function (v) { var n = v.t / 12, d = 1 + v.i / 100 * n; return { r: ["n = " + v.t + "/12 = " + N(n, 6) + " años", "C = " + N(v.M, 2) + " / " + N(d, 6)], z: "C = " + m(v.M / d) }; } },
      { t: "Interés con años, meses y días (clase)", e: "¿Qué interés produce {C} en {a} año, {m} meses y {d} días al {i} % anual? (año comercial de 360 días)",
        f: [["C", "Capital ($)", 40000], ["i", "Tasa anual (%)", 24], ["a", "Años", 1], ["m", "Meses", 7], ["d", "Días", 21]], fx: "I = C · i · (días / 360)",
        run: function (v) { var dias = v.a * 360 + v.m * 30 + v.d, I = v.C * v.i / 100 * dias / 360;
          return { r: ["Días = " + v.a + "×360 + " + v.m + "×30 + " + v.d + " = " + dias, "I = " + N(v.C, 2) + " × " + N(v.i / 100, 4) + " × " + dias + "/360"], z: "I = " + m(I) }; } },
      { t: "Diagrama de tiempo: invertir para tres montos futuros", e: "¿Cuánto debe invertirse hoy al {i} % simple anual para disponer de {M1} en {d1} días, {M2} en {d2} días y {M3} en {d3} días?",
        f: [["i", "Tasa anual (%)", 5.1], ["M1", "Monto 1 ($)", 7000], ["d1", "Días 1", 83], ["M2", "Monto 2 ($)", 15500], ["d2", "Días 2", 125], ["M3", "Monto 3 ($)", 10000], ["d3", "Días 3", 311]],
        fx: "C = M / [1 + i · (días / 360)] para cada monto, y se suman",
        run: function (v) { var s = 0, r = []; [1, 2, 3].forEach(function (k) { var c = v["M" + k] / (1 + v.i / 100 * v["d" + k] / 360); s += c; r.push("C" + k + " = " + N(v["M" + k], 2) + " / (1 + " + N(v.i / 100, 4) + " × " + v["d" + k] + "/360) = " + m(c)); });
          return { r: r, z: "Inversión inicial = " + m(s) }; } },
      { t: "Ecuación de valor con fecha focal (Ayres)", e: "Se debe {D1} con vencimiento en el mes {t1} y {D2} en el mes {t2}. Se paga {P0} hoy y un pago único X en el mes {F}. Rendimiento de {i} % anual, fecha focal en el mes {F}.",
        f: [["D1", "Deuda 1 ($)", 1060], ["t1", "Vence mes", 6], ["D2", "Deuda 2 ($)", 2500], ["t2", "Vence mes", 9], ["P0", "Pago hoy ($)", 2000], ["i", "Tasa anual (%)", 5], ["F", "Fecha focal (mes)", 12]],
        fx: "P0(1 + i·F/12) + X = D1(1 + i·(F−t1)/12) + D2(1 + i·(F−t2)/12)",
        run: function (v) { g(v.t1 <= v.F && v.t2 <= v.F, "Los vencimientos deben ser menores o iguales a la fecha focal."); var i = v.i / 100,
          a = v.D1 * (1 + i * (v.F - v.t1) / 12), b = v.D2 * (1 + i * (v.F - v.t2) / 12), c = v.P0 * (1 + i * v.F / 12);
          return { r: ["Deuda 1 en el mes " + v.F + " = " + m(a), "Deuda 2 en el mes " + v.F + " = " + m(b), "Pago de hoy en el mes " + v.F + " = " + m(c), "X = " + N(a, 2) + " + " + N(b, 2) + " − " + N(c, 2)], z: "X = " + m(a + b - c) }; } }
    ] },
    { id: "desc", n: "Descuento simple",
      c: ["El descuento es el costo de recibir antes el dinero que promete un documento. M es el valor nominal que se cobra al vencimiento y P el valor comercial que recibe quien lo negocia, de modo que D = M − P.",
          "Cuando el interés se cobra por anticipado sobre el valor nominal, la tasa de interés real al vencimiento es mayor que la tasa de descuento. En el ejemplo de clase del chulquero se anota que el cobro de intereses por anticipado está prohibido por ley."],
      fm: [["Descuento", "D = F · d · n"], ["Valor líquido a recibir", "P = F − D = F (1 − d · n)"], ["Tasa de interés real (equivalente)", "i = d / (1 − n · d)"], ["Descuento racional (valor presente)", "VP = F / (1 + i · n)"]],
      ej: [
        { t: "Préstamo con interés por anticipado", e: "Un prestamista ofrece {F} por {t} meses y cobra {d} % de tasa por anticipado. ¿Cuál es el descuento, el capital líquido y la tasa real?",
          f: [["F", "Monto del préstamo ($)", 30000], ["d", "Tasa de descuento anual (%)", 35], ["t", "Meses", 8]], fx: "D = F·d·n  ·  P = F − D  ·  i = d / (1 − n·d)",
          run: function (v) { var n = v.t / 12, d = v.d / 100; g(n * d < 1, "n · d debe ser menor que 1."); var D = v.F * d * n;
            return { r: ["n = " + v.t + "/12 = " + N(n, 6) + " años", "D = " + N(v.F, 2) + " × " + N(d, 4) + " × " + N(n, 6) + " = " + m(D), "P = " + N(v.F, 2) + " − " + N(D, 2) + " = " + m(v.F - D), "i = " + N(d, 4) + " / (1 − " + N(n, 6) + " × " + N(d, 4) + ")"], z: "Descuento " + m(D) + " · Líquido " + m(v.F - D) + " · Tasa real " + P(d / (1 - n * d)) }; } },
        { t: "Valor comercial de un documento", e: "Un documento de {M} vence en {t} días y se descuenta al {d} % anual (año de 360 días). ¿Cuánto se recibe hoy?",
          f: [["M", "Valor nominal ($)", 10000], ["d", "Tasa de descuento anual (%)", 18], ["t", "Días al vencimiento", 90]], fx: "P = M (1 − n·d)  ·  D = M·n·d",
          run: function (v) { var n = v.t / 360, d = v.d / 100; g(n * d < 1, "n · d debe ser menor que 1."); var D = v.M * n * d, rac = v.M / (1 + d * n);
            return { r: ["n = " + v.t + "/360 = " + N(n, 6) + " años", "D = " + m(D), "P = " + N(v.M, 2) + " − " + N(D, 2) + " = " + m(v.M - D), "Comparación: con descuento racional se recibiría " + m(rac)], z: "Valor comercial P = " + m(v.M - D) }; } }
      ] },
    { id: "comp", n: "Interés compuesto",
      c: ["En el interés compuesto los intereses se suman al capital en cada período de capitalización y generan nuevos intereses, por eso el monto crece más rápido que con interés simple (con $1.000 al 10 % anual durante 3 años: $1.300 simple y $1.331 compuesto).",
          "Aquí n es el plazo en años, p el número de capitalizaciones por año, np el total de períodos e i la tasa anual capitalizable p veces por año."],
      fm: [["Monto", "M = C (1 + i/p)^np"], ["Capital", "C = M / (1 + i/p)^np"], ["Interés", "I = M − C"], ["Tiempo", "n = ln(M/C) / [p · ln(1 + i/p)]"], ["Tasa", "i = p [ (M/C)^(1/np) − 1 ]"]],
      ej: [
        { t: "Monto acumulado", e: "Obtenga el monto que se acumula en {a} años si un capital de {C} se invierte al {i} % compuesto, {p} veces por año.",
          f: [["C", "Capital ($)", 65000], ["i", "Tasa anual (%)", 10], ["p", "Capitalizaciones por año", 2], ["a", "Años", 3]], fx: "M = C (1 + i/p)^np",
          run: function (v) { var np = v.a * v.p, M = v.C * pw(1 + v.i / 100 / v.p, np); return { r: ["np = " + v.a + " × " + v.p + " = " + N(np, 4), "M = " + N(v.C, 2) + " × (1 + " + N(v.i / 100 / v.p, 6) + ")^" + N(np, 4), "Interés = M − C = " + m(M - v.C)], z: "M = " + m(M) }; } },
        { t: "Capital para un monto preestablecido", e: "¿Qué capital debe invertirse ahora al {i} % anual capitalizable {p} veces por año para tener {M} en {t} meses? ¿A cuánto ascienden los intereses?",
          f: [["M", "Monto deseado ($)", 40000], ["i", "Tasa anual (%)", 12.69], ["p", "Capitalizaciones por año", 6], ["t", "Meses", 10]], fx: "C = M / (1 + i/p)^np",
          run: function (v) { var np = v.t / 12 * v.p, C = v.M / pw(1 + v.i / 100 / v.p, np); return { r: ["np = " + v.t + "/12 × " + v.p + " = " + N(np, 4), "C = " + N(v.M, 2) + " / (1 + " + N(v.i / 100 / v.p, 6) + ")^" + N(np, 4), "Intereses = M − C = " + m(v.M - C)], z: "C = " + m(C) }; } },
        { t: "Tiempo para que el capital se multiplique", e: "¿En cuánto tiempo se multiplica por {f} un capital invertido al {i} % anual compuesto {p} veces por año?",
          f: [["f", "Veces que crece", 2], ["i", "Tasa anual (%)", 11.2], ["p", "Capitalizaciones por año", 52]], fx: "n = ln(f) / [p · ln(1 + i/p)]",
          run: function (v) { g(v.f > 1 && v.i > 0, "El factor debe ser mayor que 1 y la tasa mayor que 0."); var j = v.i / 100 / v.p, np = ln(v.f) / ln(1 + j);
            return { r: ["np = ln(" + v.f + ") / ln(1 + " + N(j, 6) + ") = " + N(np, 2) + " períodos"], z: "n = " + N(np / v.p, 4) + " años (" + N(np / v.p * 12, 2) + " meses)" }; } },
        { t: "Tasa para un crecimiento dado", e: "¿Con qué tasa anual compuesta {p} veces por año un capital crece {g} % en {a} años?",
          f: [["g", "Crecimiento total (%)", 45], ["a", "Años", 2], ["p", "Capitalizaciones por año", 24]], fx: "i = p [ (1 + g)^(1/np) − 1 ]",
          run: function (v) { var np = v.a * v.p, i = v.p * (pw(1 + v.g / 100, 1 / np) - 1); return { r: ["np = " + v.a + " × " + v.p + " = " + np, "i = " + v.p + " × [(1 + " + N(v.g / 100, 4) + ")^(1/" + np + ") − 1]"], z: "i = " + P(i) + " anual capitalizable " + v.p + " veces" }; } }
      ] },
    { id: "tasas", n: "Tasas equivalentes",
      c: ["Dos tasas de interés son equivalentes si, con diferentes períodos de capitalización, producen iguales intereses en el mismo plazo.",
          "La tasa nominal es una tasa de referencia que no se aplica directamente al capital; la tasa efectiva es la que realmente actúa sobre el capital durante el año."],
      fm: [["Tasa efectiva anual", "e = (1 + i/p)^p − 1"], ["Tasa nominal equivalente", "i₂ = p₂ [ (1 + i₁/p₁)^(p₁/p₂) − 1 ]"], ["Igualdad de montos", "C (1 + i₁/p₁)^(n p₁) = C (1 + i₂/p₂)^(n p₂)"]],
      ej: [
        { t: "Tasa equivalente", e: "¿Cuál es la tasa anual capitalizable {p2} veces por año equivalente al {i} % anual compuesto {p1} veces por año?",
          f: [["i", "Tasa nominal original (%)", 12.96], ["p1", "Capitalizaciones originales", 12], ["p2", "Capitalizaciones nuevas", 2]], fx: "i₂ = p₂ [ (1 + i₁/p₁)^(p₁/p₂) − 1 ]",
          run: function (v) { var e = pw(1 + v.i / 100 / v.p1, v.p1) - 1, i2 = v.p2 * (pw(1 + e, 1 / v.p2) - 1); return { r: ["Efectiva anual e = " + P(e), "i₂ = " + v.p2 + " × [(1 + " + N(e, 6) + ")^(1/" + v.p2 + ") − 1]"], z: "i₂ = " + P(i2) + " capitalizable " + v.p2 + " veces por año" }; } },
        { t: "Tasa efectiva", e: "Una tasa nominal de {i} % se capitaliza {p} veces por año. ¿Cuál es la tasa efectiva anual?",
          f: [["i", "Tasa nominal (%)", 18], ["p", "Capitalizaciones por año", 12]], fx: "e = (1 + i/p)^p − 1",
          run: function (v) { var e = pw(1 + v.i / 100 / v.p, v.p) - 1; return { r: ["e = (1 + " + N(v.i / 100 / v.p, 6) + ")^" + v.p + " − 1"], z: "e = " + P(e) }; } },
        { t: "Toma de decisiones al invertir", e: "Un inversionista compara tres opciones. Se calcula la tasa efectiva anual de cada una para saber cuál conviene.",
          f: [["i1", "Opción 1: tasa (%)", 21.5], ["p1", "Capit. por año", 2], ["i2", "Opción 2: tasa (%)", 20.6], ["p2", "Capit. por año", 52], ["i3", "Opción 3: tasa (%)", 20.68], ["p3", "Capit. por año", 12]], fx: "e = (1 + i/p)^p − 1 y se elige la mayor",
          run: function (v) { var e = [1, 2, 3].map(function (k) { return pw(1 + v["i" + k] / 100 / v["p" + k], v["p" + k]) - 1; }), b = e.indexOf(Math.max.apply(null, e));
            return { r: e.map(function (x, k) { return "Opción " + (k + 1) + ": e = " + P(x); }), z: "Conviene la opción " + (b + 1) + " (efectiva " + P(e[b]) + ")" }; } }
      ] },
    { id: "valor", n: "Ecuaciones de valor",
      c: ["Una ecuación de valor iguala, en una fecha focal, el valor de las obligaciones originales con el de los pagos propuestos. Dos conjuntos de pagos son equivalentes si tienen el mismo valor en esa fecha con la misma tasa.",
          "Cada flujo se traslada a la fecha focal multiplicando por (1 + i)^n hacia adelante o dividiendo hacia atrás. Errores frecuentes: mezclar tasa anual con períodos mensuales, sumar cantidades de fechas distintas, usar un exponente incorrecto y redondear demasiado pronto."],
      fm: [["Trasladar al futuro", "VF = VP (1 + i)^n"], ["Trasladar al presente", "VP = VF / (1 + i)^n"], ["Ecuación de valor", "Σ obligaciones en la fecha focal = Σ pagos en la fecha focal"], ["Interés total pagado", "I = Σ pagos − deuda"]],
      ej: [
        { t: "Préstamo pagado en tres partes (fecha focal al final)", e: "Se reciben {P} prestados al {j} % anual convertible mensual y se liquidan con {a1} a los {t1} meses, {a2} a los {t2} meses y un último pago X a los {T} meses.",
          f: [["P", "Préstamo ($)", 78000], ["j", "Tasa nominal anual (%)", 24], ["a1", "Pago 1 ($)", 18000], ["t1", "Mes pago 1", 1.5], ["a2", "Pago 2 ($)", 30000], ["t2", "Mes pago 2", 4], ["T", "Mes del último pago", 8]],
          fx: "P(1+i)^T = a₁(1+i)^(T−t₁) + a₂(1+i)^(T−t₂) + X, con i = j/12",
          run: function (v) { g(v.t1 <= v.T && v.t2 <= v.T, "Los pagos deben ser anteriores al último."); var i = v.j / 100 / 12, A = v.P * pw(1 + i, v.T), B = v.a1 * pw(1 + i, v.T - v.t1) + v.a2 * pw(1 + i, v.T - v.t2), X = A - B;
            return { r: ["i = " + v.j + "/12 = " + P(i) + " mensual", "Deuda en el mes " + v.T + " = " + m(A), "Pagos 1 y 2 en el mes " + v.T + " = " + m(B), "X = " + N(A, 2) + " − " + N(B, 2), "Interés total = " + m(v.a1 + v.a2 + X - v.P)], z: "Último pago X = " + m(X) }; } },
        { t: "Dos deudas y un pago inicial", e: "Una deuda de {D1} vence hoy y otra de {D2} en {t2} meses. Se pagan {P0} hoy y X en el mes {T}. Tasa de {i} % mensual, fecha focal en el mes {T}.",
          f: [["D1", "Deuda hoy ($)", 2500], ["D2", "Deuda 2 ($)", 1800], ["t2", "Vence en mes", 4], ["P0", "Pago hoy ($)", 2000], ["i", "Tasa mensual (%)", 1.8], ["T", "Mes de X (fecha focal)", 6]],
          fx: "D₁(1+i)^T + D₂(1+i)^(T−t₂) = P₀(1+i)^T + X",
          run: function (v) { g(v.t2 <= v.T, "El vencimiento debe ser menor o igual a la fecha focal."); var i = v.i / 100, a = v.D1 * pw(1 + i, v.T) + v.D2 * pw(1 + i, v.T - v.t2), b = v.P0 * pw(1 + i, v.T);
            return { r: ["Deudas en el mes " + v.T + " = " + m(a), "Pago inicial en el mes " + v.T + " = " + m(b)], z: "X = " + m(a - b) }; } },
        { t: "Comparar dos ofertas", e: "Oferta A: {A} hoy. Oferta B: {B} dentro de {t} meses. Tasa efectiva mensual de {i} %. ¿Cuál vale más hoy?",
          f: [["A", "Oferta A ($)", 3600], ["B", "Oferta B ($)", 4000], ["t", "Meses de B", 9], ["i", "Tasa mensual (%)", 1.1]], fx: "VP = B / (1 + i)^t",
          run: function (v) { var vp = v.B / pw(1 + v.i / 100, v.t); return { r: ["VP de B = " + N(v.B, 2) + " / (1 + " + N(v.i / 100, 4) + ")^" + v.t + " = " + m(vp)], z: vp > v.A ? "Conviene B (" + m(vp) + " frente a " + m(v.A) + ")" : "Conviene A (" + m(v.A) + " frente a " + m(vp) + ")" }; } }
      ] },
    { id: "anu", n: "Anualidades",
      c: ["Una anualidad es una sucesión de pagos generalmente iguales (renta R) que se realizan a intervalos iguales con interés compuesto. El valor equivalente al inicio es el valor presente C y al final es el monto M.",
          "Según los pagos, es ordinaria o vencida (al final de cada período) o anticipada (al inicio). Según la primera renta, es inmediata o diferida. Según los intervalos, es simple (pagos y capitalización coinciden) o general. La perpetuidad tiene pagos por tiempo ilimitado. Si las fechas extremas se conocen es cierta; si no, eventual o contingente."],
      fm: [["Monto ordinaria", "M = R [ ((1 + i/p)^np − 1) / (i/p) ]"], ["Valor presente ordinaria", "C = R [ (1 − (1 + i/p)^−np) / (i/p) ]"], ["Monto anticipada", "M = R (1 + i/p) [ ((1 + i/p)^np − 1) / (i/p) ]"], ["Valor presente anticipada", "C = R (1 + i/p) [ (1 − (1 + i/p)^−np) / (i/p) ]"], ["Diferida k períodos", "C = R [ (1 − (1 + j)^−n) / j ] (1 + j)^−k"], ["Perpetuidad", "C = R / j"]],
      ej: [
        { t: "Monto y valor presente (ordinaria o anticipada)", e: "Se pagan rentas de {R} con una tasa de {i} % anual capitalizable {p} veces por año durante {a} años.",
          f: [["tipo", "Tipo de anualidad", "ord", [["ord", "Ordinaria (vencida)"], ["ant", "Anticipada"]]], ["R", "Renta ($)", 500], ["i", "Tasa anual (%)", 12], ["p", "Pagos por año", 12], ["a", "Años", 3]],
          fx: "M = R·[((1+j)^n − 1)/j]  ·  C = R·[(1 − (1+j)^−n)/j]  (× (1+j) si es anticipada)",
          run: function (v) { g(v.i > 0, "La tasa debe ser mayor que cero."); var j = v.i / 100 / v.p, n = v.a * v.p, k = v.tipo === "ant" ? 1 + j : 1;
            return { r: ["j = " + v.i + "/" + v.p + " = " + P(j) + " por período · n = " + n + " períodos", "Monto M = " + m(v.R * fs(j, n) * k), "Valor presente C = " + m(v.R * fa(j, n) * k)], z: "M = " + m(v.R * fs(j, n) * k) + " · C = " + m(v.R * fa(j, n) * k) }; } },
        { t: "Renta de un crédito", e: "Un crédito de {C} se paga con rentas iguales al final de cada período durante {a} años, a {i} % anual con {p} pagos por año. ¿De cuánto es la renta?",
          f: [["C", "Crédito ($)", 12000], ["i", "Tasa anual (%)", 14], ["p", "Pagos por año", 12], ["a", "Años", 2]], fx: "R = C · j / (1 − (1 + j)^−n)",
          run: function (v) { g(v.i > 0, "La tasa debe ser mayor que cero."); var j = v.i / 100 / v.p, n = v.a * v.p, R = v.C / fa(j, n); return { r: ["j = " + P(j) + " · n = " + n, "Total pagado = " + m(R * n), "Intereses = " + m(R * n - v.C)], z: "Renta R = " + m(R) }; } },
        { t: "Anualidad diferida", e: "Una renta de {R} se paga durante {a} años ({p} por año) y empieza después de {k} períodos de gracia. Tasa de {i} % anual. ¿Cuál es su valor presente?",
          f: [["R", "Renta ($)", 300], ["i", "Tasa anual (%)", 12], ["p", "Pagos por año", 12], ["a", "Años de pagos", 2], ["k", "Períodos de gracia", 6]], fx: "C = R [ (1 − (1+j)^−n) / j ] (1+j)^−k",
          run: function (v) { g(v.i > 0, "La tasa debe ser mayor que cero."); var j = v.i / 100 / v.p, n = v.a * v.p, a = v.R * fa(j, n); return { r: ["Valor al inicio de los pagos = " + m(a), "Se descuenta " + v.k + " períodos: " + N(a, 2) + " × (1 + " + N(j, 6) + ")^−" + v.k], z: "C = " + m(a * pw(1 + j, -v.k)) }; } },
        { t: "Perpetuidad", e: "Una beca de {R} por período se financia con un capital que gana {i} % anual con {p} períodos por año. ¿Qué capital se necesita?",
          f: [["R", "Renta por período ($)", 200], ["i", "Tasa anual (%)", 6], ["p", "Períodos por año", 12]], fx: "C = R / j",
          run: function (v) { g(v.i > 0, "La tasa debe ser mayor que cero."); var j = v.i / 100 / v.p; return { r: ["j = " + v.i + "/" + v.p + " = " + P(j), "C = " + N(v.R, 2) + " / " + N(j, 6)], z: "C = " + m(v.R / j) }; } }
      ] },
    { id: "grad", n: "Gradientes",
      c: ["Un gradiente es una anualidad de renta variable: la renta cambia en cada período. Es aritmético cuando aumenta o disminuye una cantidad fija d (si d es negativa, la renta decrece) y geométrico cuando varía en un porcentaje fijo f (serie en escalera).",
          "R₁ es la primera renta, j = i/p la tasa por período y n el número de períodos. Con una tasa de 0 no aplican estas fórmulas."],
      fm: [["Renta k (aritmético)", "Rₖ = R₁ + (k − 1) d"], ["Valor presente aritmético", "C = R₁ T + d V, con T = (1 − (1+j)^−n)/j"], ["Factor V", "V = [ T − n (1+j)^−n ] / j"], ["Valor presente geométrico", "C = R₁ / (j − f) · [ 1 − ((1+f)/(1+j))^n ]"], ["Monto", "M = C (1 + j)^n"]],
      ej: [
        { t: "Gradiente aritmético", e: "Primera renta de {R1} que cambia {d} en cada período durante {n} períodos, con {i} % anual y {p} períodos por año.",
          f: [["R1", "Primera renta ($)", 1000], ["d", "Variación por período ($)", 100], ["i", "Tasa anual (%)", 12], ["p", "Períodos por año", 12], ["n", "Número de períodos", 12]], fx: "C = R₁·T + d·V",
          run: function (v) { g(v.i > 0, "La tasa debe ser mayor que cero."); var j = v.i / 100 / v.p, t = fa(j, v.n), V = (t - v.n * pw(1 + j, -v.n)) / j, C = v.R1 * t + v.d * V;
            return { r: ["j = " + P(j) + " · T = " + N(t, 6) + " · V = " + N(V, 6), "Última renta = " + m(v.R1 + (v.n - 1) * v.d), "C = " + N(v.R1, 2) + " × " + N(t, 6) + " + " + N(v.d, 2) + " × " + N(V, 6), "Monto M = C(1+j)^n = " + m(C * pw(1 + j, v.n))], z: "Valor presente C = " + m(C) }; } },
        { t: "Gradiente geométrico (serie en escalera)", e: "Primera renta de {R1} que varía {f} % en cada período durante {n} períodos, con {i} % anual y {p} períodos por año.",
          f: [["R1", "Primera renta ($)", 1000], ["f", "Variación por período (%)", 3], ["i", "Tasa anual (%)", 12], ["p", "Períodos por año", 12], ["n", "Número de períodos", 12]], fx: "C = R₁/(j − f) · [1 − ((1+f)/(1+j))^n]",
          run: function (v) { g(v.i > 0, "La tasa debe ser mayor que cero."); var j = v.i / 100 / v.p, f = v.f / 100, C = Math.abs(j - f) < 1e-12 ? v.n * v.R1 / (1 + j) : v.R1 / (j - f) * (1 - pw((1 + f) / (1 + j), v.n));
            return { r: ["j = " + P(j) + " · f = " + P(f), "Última renta = " + m(v.R1 * pw(1 + f, v.n - 1)), "Monto M = C(1+j)^n = " + m(C * pw(1 + j, v.n))], z: "Valor presente C = " + m(C) }; } }
      ] },
    { id: "autores", n: "Autores y fuentes", html: function () {
      return '<div class="card"><h2>Integrantes</h2><ul>' + INTEGRANTES.map(function (x) { return "<li>" + x + "</li>"; }).join("") + '</ul><p class="muted small">Docente: Ing. María del Pilar Avilés Vera · Ingeniería Económica, ciclo 2026-2027 II · Universidad Agraria del Ecuador.</p></div>' +
        '<div class="card"><h2>Fuentes</h2><ul>' +
        "<li>Blank, L., &amp; Tarquin, A. (2020). <em>Ingeniería económica</em> (8.ª ed.). McGraw-Hill Interamericana.</li>" +
        "<li>Villalobos, J. L. <em>Matemáticas financieras</em>. Pearson Educación. (Capítulos 3 y 4: interés simple e interés compuesto).</li>" +
        "<li>Ayres, F. <em>Matemáticas financieras</em>. McGraw-Hill. (Ejercicio de ecuación de valor, p. 44).</li>" +
        "<li>Avilés Vera, M. P. (2026). <em>Ingeniería económica: presentaciones de las semanas 1 a 6</em>. Universidad Agraria del Ecuador.</li></ul></div>";
    } }
  ];

  function field(f) {
    var id = f[0], inp;
    if (f[3]) inp = "<select data-k=\"" + id + "\">" + f[3].map(function (o) { return "<option value=\"" + o[0] + "\"" + (o[0] === f[2] ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select>";
    else inp = "<input type=\"number\" step=\"any\" data-k=\"" + id + "\" value=\"" + f[2] + "\">";
    return "<label>" + f[1] + inp + "</label>";
  }

  function exHtml(x, k) {
    return "<details class=\"ex\"" + (k === 0 ? " open" : "") + "><summary><span class=\"n\">" + (k + 1) + "</span>" + x.t + "</summary><div class=\"body\">" +
      "<p class=\"enun\"></p><div class=\"flds\">" + x.f.map(field).join("") + "</div><div class=\"out\" aria-live=\"polite\"></div></div></details>";
  }

  function update(el, x) {
    var v = {}, bad = false;
    $$("[data-k]", el).forEach(function (i) { var k = i.getAttribute("data-k"); if (i.tagName === "SELECT") v[k] = i.value; else { var n = parseFloat(i.value); if (isNaN(n)) bad = true; v[k] = n; } });
    $(".enun", el).textContent = x.e.replace(/\{(\w+)\}/g, function (_, k) { return typeof v[k] === "number" && !isNaN(v[k]) ? N(v[k]) : "…"; });
    var out = $(".out", el);
    if (bad) { out.innerHTML = '<p class="err">Completa todos los datos.</p>'; return; }
    try {
      var o = x.run(v);
      out.innerHTML = '<div class="step"><h3>Fórmula</h3><span class="formula">' + x.fx + '</span></div><div class="step"><h3>Resolución</h3><ul>' +
        o.r.map(function (s) { return "<li>" + s + "</li>"; }).join("") + '</ul></div><div class="final">' + o.z + "</div>";
    } catch (e) { out.innerHTML = '<p class="err">' + (typeof e === "string" ? e : "No se puede calcular con estos datos.") + "</p>"; }
  }

  var nav = $(".tabs"), main = $("main");
  T.forEach(function (t) {
    var b = document.createElement("button");
    b.setAttribute("role", "tab"); b.setAttribute("aria-selected", "false"); b.setAttribute("aria-controls", "p-" + t.id); b.id = "t-" + t.id; b.textContent = t.n;
    nav.appendChild(b);
    var s = document.createElement("section");
    s.id = "p-" + t.id; s.className = "panel"; s.setAttribute("role", "tabpanel"); s.setAttribute("aria-labelledby", "t-" + t.id);
    var h = "";
    if (t.html) h = t.html();
    else {
      if (t.c) h += '<div class="card"><h2>Conceptos</h2>' + t.c.map(function (p) { return "<p>" + p + "</p>"; }).join("") + "</div>";
      if (t.fm) h += '<div class="card"><h2>Fórmulas</h2><table class="tbl"><thead><tr><th>Qué se busca</th><th>Fórmula</th></tr></thead><tbody>' + t.fm.map(function (r) { return "<tr><td>" + r[0] + '</td><td><span class="formula">' + r[1] + "</span></td></tr>"; }).join("") + "</tbody></table></div>";
      h += '<h2 class="sec">Ejercicios propuestos</h2><p class="lead">Cambia cualquier dato y el resultado se recalcula al instante.</p>' + t.ej.map(exHtml).join("");
    }
    s.innerHTML = h; main.appendChild(s);
    if (t.ej) $$(".ex", s).forEach(function (el, k) {
      update(el, t.ej[k]);
      el.addEventListener("input", function () { update(el, t.ej[k]); });
      el.addEventListener("change", function () { update(el, t.ej[k]); });
    });
  });
})();
