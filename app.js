(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var money = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });
  var m = function (x) { return money.format(x); };
  var num = function (x, d) {
    return new Intl.NumberFormat("es-EC", { maximumFractionDigits: d == null ? 4 : d }).format(x);
  };
  var pct = function (x) { return num(x * 100, 4) + " %"; };

  /* ---------- Pestañas ---------- */
  var tabs = $$(".tabs button");
  tabs.forEach(function (b) {
    b.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      $$(".panel").forEach(function (p) { p.classList.remove("active"); });
      b.classList.add("active");
      b.setAttribute("aria-selected", "true");
      $("#" + b.getAttribute("aria-controls")).classList.add("active");
    });
  });

  /* ---------- Utilidades de tiempo ---------- */
  function yearsOf(valor, unidad, base) {
    if (unidad === "d") return valor / base;
    return valor * parseFloat(unidad);
  }
  function tiempoTexto(anios, base) {
    return num(anios, 4) + " años = " + num(anios * 12, 2) + " meses = " + num(anios * base, 2) + " días";
  }
  function step(titulo, html) {
    return '<div class="step"><h3>' + titulo + "</h3>" + html + "</div>";
  }
  function fx(t) { return '<span class="formula">' + t + "</span>"; }

  /* ---------- Calculadora ---------- */
  var VISIBLE = {
    I: ["C", "i", "n"],
    M: ["C", "i", "n"],
    C_M: ["M", "i", "n"],
    C_I: ["I", "i", "n"],
    i: ["C", "I", "n"],
    n: ["C", "I", "i"]
  };

  function actualizarCampos() {
    var modo = $("#modo").value;
    var usa = VISIBLE[modo];
    $$("[data-f]").forEach(function (el) {
      var k = el.getAttribute("data-f");
      if (k === "base") el.hidden = !(usa.indexOf("n") >= 0 || modo === "n");
      else el.hidden = usa.indexOf(k) < 0;
    });
  }

  function leer(id) {
    var v = parseFloat($("#" + id).value);
    return isNaN(v) ? null : v;
  }

  function calcular() {
    var modo = $("#modo").value;
    var base = parseInt($("#base").value, 10);
    var out = $("#salida");
    var usa = VISIBLE[modo];
    var C = leer("C"), M = leer("Mf"), I = leer("If");
    var iRaw = leer("i"), nRaw = leer("n");
    var iAnual = iRaw == null ? null : (iRaw / 100) / parseFloat($("#iper").value);
    var n = nRaw == null ? null : yearsOf(nRaw, $("#nuni").value, base);

    var falta = false;
    if (usa.indexOf("C") >= 0 && C == null) falta = true;
    if (usa.indexOf("M") >= 0 && M == null) falta = true;
    if (usa.indexOf("I") >= 0 && I == null) falta = true;
    if (usa.indexOf("i") >= 0 && iRaw == null) falta = true;
    if (usa.indexOf("n") >= 0 && nRaw == null) falta = true;
    if (falta) { out.innerHTML = '<p class="err">Faltan datos por completar.</p>'; return; }
    if ((usa.indexOf("i") >= 0 && iAnual <= 0) || (usa.indexOf("n") >= 0 && n <= 0)) {
      out.innerHTML = '<p class="err">La tasa y el tiempo deben ser mayores que cero.</p>'; return;
    }
    if ((modo === "i" || modo === "n") && (C <= 0 || I < 0)) {
      out.innerHTML = '<p class="err">El capital debe ser mayor que cero.</p>'; return;
    }
    if (modo === "C_I" && I <= 0) {
      out.innerHTML = '<p class="err">El interés debe ser mayor que cero.</p>'; return;
    }

    var datos = [], formula, sust, res, extra = "";
    var tiempoDato = function () {
      return "n = " + num(nRaw) + " " + $("#nuni").selectedOptions[0].text +
        (nRaw != null && $("#nuni").value !== "1" ? " = " + num(n, 6) + " años" : "");
    };
    var tasaDato = function () {
      return iAnual === iRaw / 100
        ? "i = " + num(iRaw) + " % anual"
        : "i = " + num(iRaw) + " % por " + $("#iper").selectedOptions[0].text + " = " + pct(iAnual) + " anual";
    };

    if (modo === "I") {
      var Ir = C * iAnual * n;
      datos = ["C = " + m(C), tasaDato(), tiempoDato()];
      formula = "I = C · i · n";
      sust = "I = " + num(C, 2) + " × " + num(iAnual, 6) + " × " + num(n, 6);
      res = "I = " + m(Ir);
      extra = "<p class='muted small'>Monto: M = C + I = " + m(C + Ir) + "</p>";
    } else if (modo === "M") {
      var Mr = C * (1 + iAnual * n);
      datos = ["C = " + m(C), tasaDato(), tiempoDato()];
      formula = "M = C (1 + i · n)";
      sust = "M = " + num(C, 2) + " × (1 + " + num(iAnual, 6) + " × " + num(n, 6) + ")";
      res = "M = " + m(Mr);
      extra = "<p class='muted small'>Interés ganado: I = M − C = " + m(Mr - C) + "</p>";
    } else if (modo === "C_M") {
      var Cm = M / (1 + iAnual * n);
      datos = ["M = " + m(M), tasaDato(), tiempoDato()];
      formula = "C = M / (1 + i · n)";
      sust = "C = " + num(M, 2) + " / (1 + " + num(iAnual, 6) + " × " + num(n, 6) + ")";
      res = "C = " + m(Cm);
    } else if (modo === "C_I") {
      var Ci = I / (iAnual * n);
      datos = ["I = " + m(I), tasaDato(), tiempoDato()];
      formula = "C = I / (i · n)";
      sust = "C = " + num(I, 2) + " / (" + num(iAnual, 6) + " × " + num(n, 6) + ")";
      res = "C = " + m(Ci);
    } else if (modo === "i") {
      var ir = I / (C * n);
      datos = ["C = " + m(C), "I = " + m(I), tiempoDato()];
      formula = "i = I / (C · n)";
      sust = "i = " + num(I, 2) + " / (" + num(C, 2) + " × " + num(n, 6) + ")";
      res = "i = " + pct(ir) + " anual";
      extra = "<p class='muted small'>Equivale a " + pct(ir / 12) + " mensual.</p>";
    } else {
      var nr = I / (C * iAnual);
      datos = ["C = " + m(C), "I = " + m(I), tasaDato()];
      formula = "n = I / (C · i)";
      sust = "n = " + num(I, 2) + " / (" + num(C, 2) + " × " + num(iAnual, 6) + ")";
      res = "n = " + tiempoTexto(nr, base);
    }

    out.innerHTML =
      step("1 · Datos", "<ul>" + datos.map(function (d) { return "<li>" + d + "</li>"; }).join("") + "</ul>") +
      step("2 · Fórmula", fx(formula)) +
      step("3 · Resolución", "<p>" + sust + "</p><div class='final'>" + res + "</div>" + extra);
  }

  $("#modo").addEventListener("change", function () { actualizarCampos(); $("#salida").innerHTML = '<p class="muted">Completa los datos y pulsa «Calcular».</p>'; });
  $("#calc").addEventListener("click", calcular);
  actualizarCampos();

  /* ---------- Ejercicios resueltos ---------- */
  function ejercicios() {
    var L = [];

    // 1. Interés
    (function () {
      var C = 5000, i = 0.12, n = 9 / 12, I = C * i * n;
      L.push({
        t: "Interés ganado por un depósito",
        e: "Una persona deposita $5.000 en una cooperativa que paga 12 % anual de interés simple. ¿Cuánto interés gana en 9 meses y cuál es el monto final?",
        d: ["C = $5.000", "i = 12 % anual = 0,12", "n = 9 meses = 9/12 = 0,75 años"],
        f: "I = C · i · n",
        r: ["I = 5.000 × 0,12 × 0,75 = " + m(I), "M = C + I = 5.000 + " + num(I, 2) + " = " + m(C + I)],
        z: "Interés = " + m(I) + " · Monto = " + m(C + I)
      });
    })();

    // 2. Capital
    (function () {
      var M = 8400, i = 0.18, n = 1.5, C = M / (1 + i * n);
      L.push({
        t: "Capital que se debe invertir",
        e: "¿Qué capital debe invertirse hoy al 18 % anual de interés simple para tener $8.400 dentro de año y medio?",
        d: ["M = $8.400", "i = 18 % anual = 0,18", "n = 1,5 años"],
        f: "C = M / (1 + i · n)",
        r: ["C = 8.400 / (1 + 0,18 × 1,5)", "C = 8.400 / 1,27 = " + m(C)],
        z: "Capital = " + m(C)
      });
    })();

    // 3. Tasa
    (function () {
      var C = 3000, M = 3360, n = 8 / 12, I = M - C, i = I / (C * n);
      L.push({
        t: "Tasa de interés aplicada",
        e: "Un préstamo de $3.000 se cancela con $3.360 al cabo de 8 meses. ¿Qué tasa de interés simple anual se aplicó?",
        d: ["C = $3.000", "M = $3.360", "n = 8 meses = 8/12 años", "I = M − C = $360"],
        f: "i = I / (C · n)",
        r: ["i = 360 / (3.000 × 0,6667)", "i = 360 / 2.000 = " + num(i, 4) + " = " + pct(i) + " anual"],
        z: "Tasa = " + pct(i) + " anual (" + pct(i / 12) + " mensual)"
      });
    })();

    // 4. Tiempo
    (function () {
      var C = 2000, I = 150, i = 0.15, n = I / (C * i);
      L.push({
        t: "Tiempo para ganar cierto interés",
        e: "¿Cuánto tiempo debe estar invertido un capital de $2.000 al 15 % anual para ganar $150 de interés simple?",
        d: ["C = $2.000", "I = $150", "i = 15 % anual = 0,15"],
        f: "n = I / (C · i)",
        r: ["n = 150 / (2.000 × 0,15)", "n = 150 / 300 = " + num(n, 4) + " años = " + num(n * 12, 0) + " meses = " + num(n * 360, 0) + " días (año comercial)"],
        z: "Tiempo = " + num(n * 12, 0) + " meses"
      });
    })();

    // 5. Comercial vs exacto
    (function () {
      var C = 10000, i = 0.09, d = 90;
      var Ic = C * i * d / 360, Ie = C * i * d / 365;
      L.push({
        t: "Interés comercial frente a interés exacto",
        e: "Calcula el interés simple de $10.000 al 9 % anual durante 90 días, usando año comercial (360) y año exacto (365).",
        d: ["C = $10.000", "i = 9 % anual = 0,09", "n = 90 días"],
        f: "I = C · i · (días / base)",
        r: ["Comercial: I = 10.000 × 0,09 × 90/360 = " + m(Ic),
            "Exacto: I = 10.000 × 0,09 × 90/365 = " + m(Ie),
            "Diferencia = " + m(Ic - Ie)],
        z: "Comercial " + m(Ic) + " · Exacto " + m(Ie)
      });
    })();

    // 6. Ecuación de valor
    (function () {
      var i = 0.12;
      var v1 = 2000 * (1 + i * 3 / 12);
      var v2 = 3000 / (1 + i * 2 / 12);
      var S = v1 + v2, f = 1 + i * 4 / 12, x = S * f;
      L.push({
        t: "Ecuación de valor: reemplazar dos deudas por un pago",
        e: "Una empresa debe $2.000 que vencen en 3 meses y $3.000 que vencen en 8 meses. Quiere saldarlas con un solo pago en el mes 10. Con tasa de 12 % anual y fecha focal en el mes 6, ¿de cuánto es el pago?",
        d: ["Deuda 1: $2.000 en el mes 3", "Deuda 2: $3.000 en el mes 8", "i = 12 % anual", "Fecha focal: mes 6 · Pago único: mes 10"],
        f: "Deudas en la fecha focal = Pago en la fecha focal",
        r: ["Deuda 1 (3 → 6): 2.000 × (1 + 0,12 × 3/12) = " + m(v1),
            "Deuda 2 (8 → 6): 3.000 / (1 + 0,12 × 2/12) = " + m(v2),
            "Suma en el mes 6 = " + m(S),
            "x / (1 + 0,12 × 4/12) = " + num(S, 2) + "  →  x = " + num(S, 2) + " × 1,04 = " + m(x)],
        z: "Pago único en el mes 10 = " + m(x)
      });
    })();

    return L;
  }

  function pintarEjercicios() {
    var cont = $("#lista-ej");
    cont.innerHTML = ejercicios().map(function (e, k) {
      return '<details class="ex"' + (k === 0 ? " open" : "") + "><summary><span class='n'>" + (k + 1) + "</span>" + e.t + "</summary>" +
        '<div class="body"><p class="enun">' + e.e + "</p><div class='cols'>" +
        "<div><h3>2 · Datos</h3><ul>" + e.d.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>" +
        "<div><h3>3 · Fórmula</h3>" + fx(e.f) + "</div>" +
        "<div><h3>4 · Resolución</h3><ul>" + e.r.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>" +
        "</div><div class='final'>" + e.z + "</div></div></details>";
    }).join("");
  }
  pintarEjercicios();

  /* ---------- Ecuación de valor ---------- */
  var deudas = [{ monto: 2000, mes: 3 }, { monto: 3000, mes: 8 }];

  function pintarDeudas() {
    $("#deudas").innerHTML = deudas.map(function (d, k) {
      return '<div class="drow"><label>Deuda ' + (k + 1) + ' ($)<input type="number" min="0" step="any" data-k="' + k + '" data-c="monto" value="' + d.monto + '"></label>' +
        '<label>Vence en el mes<input type="number" min="0" step="any" data-k="' + k + '" data-c="mes" value="' + d.mes + '"></label>' +
        '<button type="button" class="x" data-del="' + k + '" aria-label="Quitar deuda ' + (k + 1) + '">✕</button></div>';
    }).join("");
    $$("#deudas input").forEach(function (inp) {
      inp.addEventListener("input", function () {
        var v = parseFloat(inp.value);
        deudas[+inp.getAttribute("data-k")][inp.getAttribute("data-c")] = isNaN(v) ? 0 : v;
      });
    });
    $$("#deudas [data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (deudas.length > 1) { deudas.splice(+b.getAttribute("data-del"), 1); pintarDeudas(); }
      });
    });
  }

  function aFocal(monto, mes, focal, i) {
    var t = Math.abs(focal - mes) / 12;
    return mes <= focal ? monto * (1 + i * t) : monto / (1 + i * t);
  }

  function resolverEV() {
    var i = (parseFloat($("#ev-i").value) || 0) / 100;
    var focal = parseFloat($("#ev-f").value) || 0;
    var p = parseFloat($("#ev-p").value) || 0;
    var out = $("#ev-out");
    if (i <= 0) { out.innerHTML = '<p class="err">La tasa debe ser mayor que cero.</p>'; return; }

    var filas = deudas.map(function (d, k) {
      var v = aFocal(d.monto, d.mes, focal, i);
      return { k: k + 1, monto: d.monto, mes: d.mes, v: v, sentido: d.mes <= focal ? "hacia adelante" : "hacia atrás" };
    });
    var S = filas.reduce(function (a, f) { return a + f.v; }, 0);
    var t = Math.abs(focal - p) / 12;
    var factor = p <= focal ? 1 + i * t : 1 / (1 + i * t);
    var x = S / factor;

    var tabla = '<table class="tbl"><thead><tr><th>Deuda</th><th>Monto</th><th>Mes</th><th style="text-align:right">En mes ' + num(focal, 2) + '</th></tr></thead><tbody>' +
      filas.map(function (f) {
        return "<tr><td>" + f.k + " <span class='muted small'>(" + f.sentido + ")</span></td><td>" + m(f.monto) + "</td><td>" + num(f.mes, 2) + '</td><td class="r">' + m(f.v) + "</td></tr>";
      }).join("") +
      '<tr><td colspan="3"><strong>Suma</strong></td><td class="r"><strong>' + m(S) + "</strong></td></tr></tbody></table>";

    out.innerHTML = step("1 · Llevar cada deuda a la fecha focal", tabla) +
      step("2 · Ecuación", fx("Σ deudas = x · " + (p <= focal ? "(1 + i · t)" : "1 / (1 + i · t)")) +
        "<p class='small muted'>t = |" + num(focal, 2) + " − " + num(p, 2) + "| / 12 = " + num(t, 4) + " años</p>") +
      step("3 · Resolución", "<p>x = " + num(S, 2) + " / " + num(factor, 6) + "</p><div class='final'>Pago único = " + m(x) + "</div>");

    dibujar(filas, focal, p, x);
  }

  function dibujar(filas, focal, p, x) {
    var svg = $("#diagrama");
    var W = 760, x0 = 40, x1 = 720, y = 150;
    var maxMes = Math.max(focal, p, Math.max.apply(null, filas.map(function (f) { return f.mes; })), 1);
    maxMes = Math.ceil(maxMes);
    var px = function (mes) { return x0 + (mes / maxMes) * (x1 - x0); };
    var s = '<line x1="' + x0 + '" y1="' + y + '" x2="' + x1 + '" y2="' + y + '" stroke="currentColor" stroke-width="2" opacity=".7"/>';
    var paso = maxMes > 24 ? Math.ceil(maxMes / 12) : 1;
    for (var k = 0; k <= maxMes; k += paso) {
      s += '<line x1="' + px(k) + '" y1="' + (y - 5) + '" x2="' + px(k) + '" y2="' + (y + 5) + '" stroke="currentColor" opacity=".7"/>' +
        '<text x="' + px(k) + '" y="' + (y + 22) + '" text-anchor="middle" font-size="12" fill="currentColor" opacity=".75">' + k + "</text>";
    }
    s += '<text x="' + x1 + '" y="' + (y + 42) + '" text-anchor="end" font-size="12" fill="currentColor" opacity=".7">meses</text>';
    // fecha focal
    s += '<line x1="' + px(focal) + '" y1="22" x2="' + px(focal) + '" y2="' + y + '" stroke="#c98a00" stroke-width="2" stroke-dasharray="6 5"/>' +
      '<text x="' + px(focal) + '" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#c98a00">fecha focal (mes ' + num(focal, 2) + ")</text>";
    function flecha(mes, texto, color, alto) {
      var cx = px(mes);
      return '<line x1="' + cx + '" y1="' + (y - alto) + '" x2="' + cx + '" y2="' + (y - 4) + '" stroke="' + color + '" stroke-width="3"/>' +
        '<polygon points="' + (cx - 6) + "," + (y - 12) + " " + (cx + 6) + "," + (y - 12) + " " + cx + "," + (y - 2) + '" fill="' + color + '"/>' +
        '<text x="' + cx + '" y="' + (y - alto - 6) + '" text-anchor="middle" font-size="12" font-weight="600" fill="' + color + '">' + texto + "</text>";
    }
    filas.forEach(function (f, idx) {
      s += flecha(f.mes, m(f.monto), "#c0392b", 58 + (idx % 2) * 26);
    });
    s += flecha(p, "x = " + m(x), "#1b8a4a", 84);
    svg.innerHTML = s;
  }

  $("#add-deuda").addEventListener("click", function () { deudas.push({ monto: 1000, mes: 12 }); pintarDeudas(); });
  $("#ev-calc").addEventListener("click", resolverEV);
  pintarDeudas();
  resolverEV();
  calcular();
})();
