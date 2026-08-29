/* Math Arena content.
   Every topic maps to a Florida B.E.S.T. benchmark and generates fresh
   questions each time, so a child can practise the same skill without
   memorising a fixed question list.
   A generator returns: { q, a, choices[], why, sub?, visual? }        */

const R = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

/* four options: the answer plus three plausible near misses */
function opts(answer, wrongs) {
  const A = String(answer);
  const numeric = A.trim() !== '' && !isNaN(Number(A));
  const set = [A];
  for (const w of wrongs) {
    const s = String(w);
    if (s === A || set.includes(s)) continue;
    if (numeric && !(Number(s) >= 0)) continue;   // no negative numbers for young grades
    set.push(s);
    if (set.length === 4) break;
  }
  let guard = 0;
  while (numeric && set.length < 4 && guard++ < 80) {
    const n = Number(A) + R(-9, 9);
    if (n >= 0 && !set.includes(String(n))) set.push(String(n));
  }
  return shuffle(set);
}

const money = (c) => '$' + (c / 100).toFixed(2);
const clock = (h, m) => h + ':' + String(m).padStart(2, '0');
const dots = (n, ch) => new Array(n).fill(ch || '●').join(' ');
const commas = (n) => n.toLocaleString('en-US');

/* ---------------------------------------------------------------- grade 1 */
const G1 = [
  { id: 'g1-count', t: 'Counting and skip counting', b: 'MA.1.NSO.1.1', gen() {
      const mode = pick(['next', 'back', 'skip2', 'skip5', 'skip10']);
      if (mode === 'next') { const n = R(8, 118); return { q: `What number comes right after ${n}?`, a: n + 1, choices: opts(n + 1, [n, n + 2, n + 10]), why: `After ${n} comes ${n + 1}.` }; }
      if (mode === 'back') { const n = R(3, 119); return { q: `What number comes right before ${n}?`, a: n - 1, choices: opts(n - 1, [n, n + 1, n - 2]), why: `Before ${n} comes ${n - 1}.` }; }
      const step = mode === 'skip2' ? 2 : mode === 'skip5' ? 5 : 10;
      const start = step * R(1, 6);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      return { q: `Skip count by ${step}. What comes next?`, sub: seq.join(', ') + ', ___', a: start + step * 4,
        choices: opts(start + step * 4, [start + step * 3 + 1, start + step * 5, start + step * 3]),
        why: `Counting by ${step}s, after ${start + step * 3} comes ${start + step * 4}.` };
    } },
  { id: 'g1-tens', t: 'Tens and ones', b: 'MA.1.NSO.1.3', gen() {
      const t = R(1, 9), o = R(0, 9), n = t * 10 + o;
      if (Math.random() < 0.5) return { q: `${t} tens and ${o} ones make what number?`, a: n, choices: opts(n, [t + o, o * 10 + t, n + 10]), why: `${t} tens is ${t * 10}, plus ${o} ones is ${n}.`, visual: dots(t, '🟦') + '  ' + dots(o, '🟨') };
      return { q: `How many tens are in ${n}?`, a: t, choices: opts(t, [o, t + 1, n]), why: `${n} is ${t} tens and ${o} ones.` };
    } },
  { id: 'g1-add20', t: 'Adding and subtracting to 20', b: 'MA.1.NSO.2.2', gen() {
      if (Math.random() < 0.5) { const a = R(2, 12), b = R(2, 20 - a); return { q: `${a} + ${b} = ?`, a: a + b, choices: opts(a + b, [a + b + 1, a + b - 1, a + b + 2]), why: `${a} + ${b} = ${a + b}.` }; }
      const a = R(6, 20), b = R(1, a - 1);
      return { q: `${a} − ${b} = ?`, a: a - b, choices: opts(a - b, [a - b + 1, a - b - 1, a + b]), why: `${a} − ${b} = ${a - b}.` };
    } },
  { id: 'g1-morless', t: '1 more, 1 less, 10 more, 10 less', b: 'MA.1.NSO.2.3', gen() {
      const n = R(11, 89), k = pick([1, 10]), up = Math.random() < 0.5;
      const ans = up ? n + k : n - k;
      return { q: `What is ${k} ${up ? 'more than' : 'less than'} ${n}?`, a: ans, choices: opts(ans, [up ? n - k : n + k, ans + 1, ans - 1]), why: `${n} ${up ? '+' : '−'} ${k} = ${ans}.` };
    } },
  { id: 'g1-missing', t: 'Find the missing number', b: 'MA.1.AR.2.3', gen() {
      const a = R(2, 9), b = R(2, 9), sum = a + b;
      if (Math.random() < 0.5) return { q: `${a} + ___ = ${sum}`, a: b, choices: opts(b, [sum, a, b + 1]), why: `${sum} − ${a} = ${b}.` };
      return { q: `___ + ${b} = ${sum}`, a: a, choices: opts(a, [sum, b, a + 1]), why: `${sum} − ${b} = ${a}.` };
    } },
  { id: 'g1-truefalse', t: 'True or false equations', b: 'MA.1.AR.2.2', gen() {
      const a = R(2, 9), b = R(2, 9), real = a + b, shown = Math.random() < 0.5 ? real : real + pick([-2, -1, 1, 2]);
      const isTrue = shown === real;
      return { q: `Is this true or false?`, sub: `${a} + ${b} = ${shown}`, a: isTrue ? 'True' : 'False', choices: shuffle(['True', 'False']),
        why: isTrue ? `Correct, ${a} + ${b} really is ${real}.` : `${a} + ${b} = ${real}, not ${shown}.` };
    } },
  { id: 'g1-time', t: 'Telling time to the half hour', b: 'MA.1.M.2.1', gen() {
      const h = R(1, 12), half = Math.random() < 0.5;
      const ans = half ? clock(h, 30) : clock(h, 0);
      return { q: `What time does this clock show?`, a: ans, visual: svgClock(h, half ? 30 : 0),
        choices: opts(ans, [clock(h, half ? 0 : 30), clock(h === 12 ? 1 : h + 1, half ? 30 : 0), clock(h === 1 ? 12 : h - 1, 30)]),
        why: `The short hand tells the hour and the long red hand tells the minutes. It points at ${half ? '6, which is 30 minutes past' : '12, which means o’clock'}, so it is ${ans}.`,
        whyVisual: svgClock(h, half ? 30 : 0) };
    } },
  { id: 'g1-coins', t: 'Coins and their value', b: 'MA.1.M.2.2', gen() {
      const coins = [['penny', 1], ['nickel', 5], ['dime', 10], ['quarter', 25]];
      if (Math.random() < 0.5) { const c = pick(coins); return { q: `How much is one ${c[0]} worth?`, a: c[1] + '¢', choices: shuffle(coins.map(x => x[1] + '¢')), why: `A ${c[0]} is worth ${c[1]} cents.` }; }
      const n = R(2, 5), c = pick(coins), total = n * c[1];
      return { q: `What is the value of ${n} ${c[0]}${n > 1 ? 's' : ''}?`, a: total + '¢', choices: opts(total, [total + c[1], total - c[1], n * 10]).map(v => String(v).replace(/$/, '¢')), why: `${n} × ${c[1]}¢ = ${total}¢.` };
    } },
  { id: 'g1-shapes', t: 'Shapes and their sides', b: 'MA.1.GR.1.1', gen() {
      const shapes = [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6]];
      const s = pick(shapes);
      if (Math.random() < 0.5) return { q: `How many sides does a ${s[0]} have?`, a: s[1], choices: opts(s[1], [s[1] + 1, s[1] - 1, s[1] + 2]), why: `A ${s[0]} has ${s[1]} sides.` };
      const opt = shuffle(shapes.filter(x => x[1] !== s[1]).slice(0, 3).concat([s]));
      return { q: `Which shape has ${s[1]} sides?`, a: s[0], choices: shuffle(opt.map(x => x[0])), why: `A ${s[0]} has ${s[1]} sides.` };
    } },
  { id: 'g1-halves', t: 'Halves and fourths', b: 'MA.1.FR.1.1', gen() {
      const parts = pick([2, 4]);
      if (Math.random() < 0.5) return { q: `A pizza is cut into ${parts} equal parts. What is one part called?`, a: parts === 2 ? 'One half' : 'One fourth', choices: shuffle(['One half', 'One fourth', 'One third', 'One whole']), why: `${parts} equal parts means each one is ${parts === 2 ? 'a half' : 'a fourth'}.` };
      return { q: `How many ${parts === 2 ? 'halves' : 'fourths'} make one whole?`, a: parts, choices: opts(parts, [parts + 1, parts + 2, 1]), why: `It takes ${parts} of them to rebuild the whole.` };
    } },
];

/* ---------------------------------------------------------------- grade 2 */
const G2 = [
  { id: 'g2-place', t: 'Numbers to 1,000', b: 'MA.2.NSO.1.1', gen() {
      const h = R(1, 9), t = R(0, 9), o = R(0, 9), n = h * 100 + t * 10 + o;
      if (Math.random() < 0.5) return { q: `Which number is ${h} hundreds, ${t} tens and ${o} ones?`, a: n, choices: opts(n, [h * 100 + o * 10 + t, n + 100, n - 10]), why: `${h * 100} + ${t * 10} + ${o} = ${n}.` };
      return { q: `In ${n}, what is the value of the digit ${h}?`, a: h * 100, choices: opts(h * 100, [h, h * 10, n]), why: `The ${h} sits in the hundreds place, so it is worth ${h * 100}.` };
    } },
  { id: 'g2-compare', t: 'Compare and order numbers', b: 'MA.2.NSO.1.3', gen() {
      const a = R(100, 999), b = R(100, 999);
      if (a === b) return this.gen();
      return { q: `Which sign makes this true?`, sub: `${a} ___ ${b}`, a: a > b ? '>' : '<', choices: shuffle(['>', '<', '=']), why: `${a} is ${a > b ? 'greater' : 'less'} than ${b}.` };
    } },
  { id: 'g2-round', t: 'Rounding to the nearest 10', b: 'MA.2.NSO.1.4', gen() {
      const n = R(11, 99), ans = Math.round(n / 10) * 10;
      const lo = Math.floor(n / 10) * 10, hi = lo + 10;
      return { q: `Round ${n} to the nearest 10.`, a: ans, choices: opts(ans, [ans + 10, ans - 10, n]),
        why: `${n} sits between ${lo} and ${hi}, and it is closer to ${ans}. Shortcut: the ones digit is ${n % 10}, ${n % 10 >= 5 ? 'which is 5 or more, so round up' : 'which is less than 5, so round down'}.`,
        whyVisual: svgNumberLine(lo, hi, [{ v: n, label: String(n), color: '#C6274B' }, { v: ans, label: 'answer', color: '#12885A' }]) };
    } },
  { id: 'g2-add100', t: 'Adding and subtracting within 100', b: 'MA.2.NSO.2.3', gen() {
      if (Math.random() < 0.5) { const a = R(12, 79), b = R(11, 99 - a); return { q: `${a} + ${b} = ?`, a: a + b, choices: opts(a + b, [a + b + 10, a + b - 1, a + b + 1]), why: `${a} + ${b} = ${a + b}.` }; }
      const a = R(30, 99), b = R(11, a - 5);
      return { q: `${a} − ${b} = ?`, a: a - b, choices: opts(a - b, [a - b + 10, a - b - 1, a - b + 1]), why: `${a} − ${b} = ${a - b}.` };
    } },
  { id: 'g2-tenmore', t: '10 more, 10 less, 100 more, 100 less', b: 'MA.2.NSO.2.2', gen() {
      const n = R(120, 880), k = pick([10, 100]), up = Math.random() < 0.5, ans = up ? n + k : n - k;
      return { q: `What is ${k} ${up ? 'more than' : 'less than'} ${n}?`, a: ans, choices: opts(ans, [up ? n - k : n + k, ans + 1, ans + (k === 10 ? 100 : 10)]), why: `Only the ${k === 10 ? 'tens' : 'hundreds'} digit changes: ${ans}.` };
    } },
  { id: 'g2-word', t: 'Word problems', b: 'MA.2.AR.1.1', gen() {
      const names = ['Aura', 'Sam', 'Maya', 'Leo', 'Nina', 'Omar'];
      const things = ['stickers', 'shells', 'marbles', 'crayons', 'cards'];
      const n1 = R(15, 60), n2 = R(8, 35), name = pick(names), thing = pick(things);
      if (Math.random() < 0.5) return { q: `${name} had ${n1} ${thing} and found ${n2} more. How many now?`, a: n1 + n2, choices: opts(n1 + n2, [n1 - n2, n1 + n2 + 10, n1 + n2 - 1]), why: `${n1} + ${n2} = ${n1 + n2}.` };
      const big = Math.max(n1, n2), small = Math.min(n1, n2);
      return { q: `${name} had ${big} ${thing} and gave away ${small}. How many are left?`, a: big - small, choices: opts(big - small, [big + small, big - small - 1, big - small + 10]), why: `${big} − ${small} = ${big - small}.` };
    } },
  { id: 'g2-evenodd', t: 'Even, odd and arrays', b: 'MA.2.AR.3.2', gen() {
      if (Math.random() < 0.5) { const n = R(10, 99); const even = n % 2 === 0; return { q: `Is ${n} even or odd?`, a: even ? 'Even' : 'Odd', choices: shuffle(['Even', 'Odd']), why: `${n} ends in ${n % 10}, so it is ${even ? 'even' : 'odd'}.` }; }
      const r = R(2, 5), c = R(2, 6), tot = r * c;
      return { q: `How many dots are in this array?`, a: tot, choices: opts(tot, [r + c, tot + c, tot - c]),
        why: `${r} rows of ${c} is ${c} added ${r} times, which is ${r} × ${c} = ${tot}.`, visual: svgArray(r, c), whyVisual: svgArray(r, c) };
    } },
  { id: 'g2-time5', t: 'Telling time to 5 minutes', b: 'MA.2.M.2.1', gen() {
      const h = R(1, 12), m = R(1, 11) * 5, ans = clock(h, m);
      return { q: `What time does this clock show?`, a: ans, visual: svgClock(h, m),
        choices: opts(ans, [clock(h, (m + 5) % 60), clock(h, (m + 55) % 60), clock(h === 12 ? 1 : h + 1, m)]),
        why: `Count by 5s around the clock. The long red hand is on ${m / 5}, and ${m / 5} × 5 = ${m} minutes past ${h}.`,
        whyVisual: svgClock(h, m) };
    } },
  { id: 'g2-money', t: 'Money problems', b: 'MA.2.M.2.2', gen() {
      const a = R(120, 800), b = R(50, 400);
      if (Math.random() < 0.5) return { q: `A toy costs ${money(a)} and a book costs ${money(b)}. What do they cost together?`, a: money(a + b), choices: opts(a + b, [a - b, a + b + 100, a + b - 10]).map(v => money(Number(v))), why: `${money(a)} + ${money(b)} = ${money(a + b)}.` };
      const paid = Math.ceil((a + 1) / 100) * 100;
      return { q: `You buy something for ${money(a)} and pay with ${money(paid)}. What is your change?`, a: money(paid - a), choices: opts(paid - a, [a, paid + a, paid - a + 10]).map(v => money(Number(v))), why: `${money(paid)} − ${money(a)} = ${money(paid - a)}.` };
    } },
  { id: 'g2-perimeter', t: 'Perimeter', b: 'MA.2.GR.2.2', gen() {
      const w = R(2, 12), h = R(2, 12), p = 2 * (w + h);
      return { q: `A rectangle is ${w} cm by ${h} cm. What is the perimeter?`, a: p + ' cm', choices: opts(p, [w * h, p + 2, w + h]).map(v => v + ' cm'), why: `Add all four sides: ${w} + ${h} + ${w} + ${h} = ${p} cm.` };
    } },
  { id: 'g2-data', t: 'Reading graphs', b: 'MA.2.DP.1.2', gen() {
      const cats = shuffle(['cats', 'dogs', 'birds', 'fish']).slice(0, 3);
      const vals = cats.map(() => R(2, 12));
      const rows = cats.map((c, i) => `${c}: ` + dots(vals[i], '⬛') + ` (${vals[i]})`).join('<br>');
      const mode = pick(['most', 'total', 'diff']);
      if (mode === 'most') { const m = Math.max(...vals); return { q: `Which one has the most?`, a: cats[vals.indexOf(m)], choices: shuffle(cats.slice()), why: `${cats[vals.indexOf(m)]} has ${m}, the biggest number.`, visual: rows }; }
      if (mode === 'total') { const t = vals.reduce((x, y) => x + y, 0); return { q: `How many are there altogether?`, a: t, choices: opts(t, [t + 2, t - 2, Math.max(...vals)]), why: vals.join(' + ') + ` = ${t}.`, visual: rows }; }
      const mx = Math.max(...vals), mn = Math.min(...vals);
      return { q: `How many more does the biggest group have than the smallest?`, a: mx - mn, choices: opts(mx - mn, [mx + mn, mx, mn]), why: `${mx} − ${mn} = ${mx - mn}.`, visual: rows };
    } },
];

/* ---------------------------------------------------------------- grade 3 */
const G3 = [
  { id: 'g3-facts', t: 'Multiplication and division facts', b: 'MA.3.NSO.2.4', gen() {
      const a = R(2, 12), b = R(2, 12), p = a * b;
      if (Math.random() < 0.5) return { q: `${a} × ${b} = ?`, a: p, choices: opts(p, [p + a, p - a, p + b]),
        why: `${a} rows of ${b} makes ${p}. Count the dots.`, whyVisual: svgArray(a, b) };
      return { q: `${p} ÷ ${a} = ?`, a: b, choices: opts(b, [a, b + 1, p]),
        why: `Share ${p} dots into ${a} equal rows and each row gets ${b}. Multiplying and dividing are opposites: ${a} × ${b} = ${p}.`,
        whyVisual: svgArray(a, b) };
    } },
  { id: 'g3-mult10', t: 'Multiply by multiples of 10', b: 'MA.3.NSO.2.3', gen() {
      const a = R(2, 9), t = R(2, 9), b = pick([t * 10, t * 100]), p = a * b;
      return { q: `${a} × ${b} = ?`, a: p, choices: opts(p, [p * 10, p / 10, p + b]), why: `${a} × ${t} = ${a * t}, then add the zeros: ${p}.` };
    } },
  { id: 'g3-addsub', t: 'Adding and subtracting big numbers', b: 'MA.3.NSO.2.1', gen() {
      if (Math.random() < 0.5) { const a = R(120, 4800), b = R(120, 4200); return { q: `${commas(a)} + ${commas(b)} = ?`, a: a + b, choices: opts(a + b, [a + b + 100, a + b - 10, a - b]), why: `${a} + ${b} = ${a + b}.` }; }
      const a = R(600, 5000), b = R(120, 590);
      return { q: `${commas(a)} − ${commas(b)} = ?`, a: a - b, choices: opts(a - b, [a + b, a - b - 100, a - b + 10]), why: `${a} − ${b} = ${a - b}.` };
    } },
  { id: 'g3-round', t: 'Rounding to 10 or 100', b: 'MA.3.NSO.1.4', gen() {
      const n = R(105, 989), to = pick([10, 100]), ans = Math.round(n / to) * to;
      const lo = Math.floor(n / to) * to, hi = lo + to;
      return { q: `Round ${n} to the nearest ${to}.`, a: ans, choices: opts(ans, [ans + to, ans - to, n]),
        why: `${n} sits between ${lo} and ${hi}. It is closer to ${ans}.`,
        whyVisual: svgNumberLine(lo, hi, [{ v: n, label: String(n), color: '#C6274B' }, { v: ans, label: 'answer', color: '#12885A' }]) };
    } },
  { id: 'g3-unitfrac', t: 'Understanding fractions', b: 'MA.3.FR.1.1', gen() {
      const d = pick([2, 3, 4, 5, 6, 8]), n = R(1, d - 1);
      if (Math.random() < 0.5) return { q: `What fraction of this bar is shaded?`, a: `${n}/${d}`, choices: opts(`${n}/${d}`, [`${d}/${n}`, `${n}/${d + 1}`, `${n + 1}/${d}`]),
        why: `The bar has ${d} equal parts and ${n} of them are filled, so it is ${n}/${d}. The bottom number counts the parts, the top number counts the filled ones.`,
        visual: svgFractionBar(n, d), whyVisual: svgFractionBar(n, d, `${n}/${d}`) };
      return { q: `How many ${d}ths make one whole?`, a: d, choices: opts(d, [d + 1, d - 1, 1]), why: `${d} parts of size 1/${d} rebuild the whole.` };
    } },
  { id: 'g3-compfrac', t: 'Comparing fractions', b: 'MA.3.FR.2.1', gen() {
      const same = pick(['num', 'den']);
      if (same === 'den') { const d = pick([3, 4, 5, 6, 8]); let a = R(1, d - 1), b = R(1, d - 1); if (a === b) b = a === 1 ? a + 1 : a - 1;
        return { q: `Which sign makes this true?`, sub: `${a}/${d} ___ ${b}/${d}`, a: a > b ? '>' : '<', choices: shuffle(['>', '<', '=']),
          why: `The pieces are the same size, so just count them: ${a} pieces ${a > b ? 'beats' : 'is fewer than'} ${b} pieces.`,
          whyVisual: svgFractionBar(a, d, `${a}/${d}`) + svgFractionBar(b, d, `${b}/${d}`) }; }
      const n = R(1, 3); let d1 = pick([3, 4, 6]), d2 = pick([5, 8, 10]);
      return { q: `Which sign makes this true?`, sub: `${n}/${d1} ___ ${n}/${d2}`, a: d1 < d2 ? '>' : '<', choices: shuffle(['>', '<', '=']),
        why: `Same number of pieces, but a bigger bottom number means the pieces are cut smaller. Look at how much is filled.`,
        whyVisual: svgFractionBar(n, d1, `${n}/${d1}`) + svgFractionBar(n, d2, `${n}/${d2}`) };
    } },
  { id: 'g3-equivfrac', t: 'Equivalent fractions', b: 'MA.3.FR.2.2', gen() {
      const n = R(1, 4), d = pick([2, 3, 4, 5]), k = R(2, 4);
      if (n >= d) return this.gen();
      return { q: `Which fraction is equal to ${n}/${d}?`, a: `${n * k}/${d * k}`, choices: opts(`${n * k}/${d * k}`, [`${n * k}/${d}`, `${n}/${d * k}`, `${n + k}/${d + k}`]),
        why: `Cutting every piece into ${k} smaller pieces fills the same amount of the bar. Multiply top and bottom by ${k}.`,
        whyVisual: svgFractionBar(n, d, `${n}/${d}`) + svgFractionBar(n * k, d * k, `${n * k}/${d * k}`) };
    } },
  { id: 'g3-2step', t: 'Two-step word problems', b: 'MA.3.AR.1.2', gen() {
      const names = ['Aura', 'Jamal', 'Sofia', 'Ben', 'Priya'];
      const nm = pick(names), packs = R(3, 8), per = R(4, 9), used = R(3, 12), total = packs * per;
      return { q: `${nm} buys ${packs} packs of markers with ${per} in each pack, then gives away ${used}. How many markers are left?`,
        a: total - used, choices: opts(total - used, [total, total + used, packs * per - packs]),
        why: `First ${packs} × ${per} = ${total}. Then ${total} − ${used} = ${total - used}.` };
    } },
  { id: 'g3-area', t: 'Area and perimeter', b: 'MA.3.GR.2.3', gen() {
      const w = R(2, 12), h = R(2, 12);
      if (Math.random() < 0.5) return { q: `What is the area of this rectangle?`, a: w * h + ' square units',
        choices: opts(w * h, [2 * (w + h), w + h, w * h + w]).map(v => v + ' square units'),
        why: `Area is how many little squares fit inside: ${w} × ${h} = ${w * h}.`, visual: svgRect(w, h, {}), whyVisual: svgRect(w, h, { grid: true }) };
      return { q: `What is the perimeter of this rectangle?`, a: 2 * (w + h) + ' units',
        choices: opts(2 * (w + h), [w * h, w + h, 2 * (w + h) + 2]).map(v => v + ' units'),
        why: `Perimeter is the walk all the way around the edge: ${w} + ${h} + ${w} + ${h} = ${2 * (w + h)}.`, visual: svgRect(w, h, {}), whyVisual: svgRect(w, h, {}) };
    } },
  { id: 'g3-elapsed', t: 'Time and elapsed time', b: 'MA.3.M.2.2', gen() {
      const h = R(1, 10), m = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]), add = pick([15, 20, 25, 30, 40, 45, 50]);
      let eh = h, em = m + add; if (em >= 60) { em -= 60; eh = eh === 12 ? 1 : eh + 1; }
      return { q: `A movie starts at ${clock(h, m)} and lasts ${add} minutes. What time does it end?`, a: clock(eh, em),
        choices: opts(clock(eh, em), [clock(eh, (em + 10) % 60), clock(h, (m + add + 30) % 60), clock(eh === 12 ? 1 : eh + 1, em)]),
        why: `${clock(h, m)} plus ${add} minutes is ${clock(eh, em)}.` };
    } },
  { id: 'g3-patterns', t: 'Multiples, even, odd and patterns', b: 'MA.3.AR.3.3', gen() {
      const mode = pick(['multiple', 'pattern', 'evenodd']);
      if (mode === 'multiple') {
        const k = R(2, 9);
        const yes = Math.random() < 0.5;
        const n = yes ? k * R(2, 12) : k * R(2, 12) + R(1, k - 1);
        return { q: `Is ${n} a multiple of ${k}?`, a: yes ? 'Yes' : 'No', choices: shuffle(['Yes', 'No']),
          why: yes ? `${k} × ${n / k} = ${n}, so yes.` : `${k} does not divide ${n} evenly. ${k} × ${Math.floor(n / k)} = ${k * Math.floor(n / k)}, with ${n - k * Math.floor(n / k)} left over.` };
      }
      if (mode === 'evenodd') { const n = R(101, 999); return { q: `Is ${n} even or odd?`, a: n % 2 ? 'Odd' : 'Even', choices: shuffle(['Even', 'Odd']), why: `It ends in ${n % 10}, so it is ${n % 2 ? 'odd' : 'even'}.` }; }
      const start = R(2, 9), step = R(2, 9), seq = [start, start + step, start + 2 * step, start + 3 * step];
      return { q: `What comes next in this pattern?`, sub: seq.join(', ') + ', ___', a: start + 4 * step, choices: opts(start + 4 * step, [start + 3 * step + 1, start + 5 * step, start + 3 * step]), why: `The rule is add ${step}, so next is ${start + 4 * step}.` };
    } },
  { id: 'g3-data', t: 'Pictographs and bar graphs', b: 'MA.3.DP.1.2', gen() {
      const scale = pick([2, 5, 10]);
      const cats = shuffle(['Monday', 'Tuesday', 'Wednesday', 'Thursday']).slice(0, 3);
      const pics = cats.map(() => R(2, 7));
      const rows = cats.map((c, i) => `${c}: ` + dots(pics[i], '📕') + ` = ${pics[i] * scale}`).join('<br>');
      const i = R(0, cats.length - 1);
      if (Math.random() < 0.5) return { q: `Each 📕 stands for ${scale} books. How many books on ${cats[i]}?`, a: pics[i] * scale, choices: opts(pics[i] * scale, [pics[i], pics[i] * scale + scale, pics[i] + scale]), why: `${pics[i]} pictures × ${scale} = ${pics[i] * scale}.`, visual: rows };
      const tot = pics.reduce((x, y) => x + y, 0) * scale;
      return { q: `Each 📕 stands for ${scale} books. How many books in all?`, a: tot, choices: opts(tot, [tot + scale, tot - scale, pics.reduce((x, y) => x + y, 0)]), why: `Add the pictures, then multiply by ${scale}: ${tot}.`, visual: rows };
    } },
];

/* ---------------------------------------------------------------- grade 4 */
const G4 = [
  { id: 'g4-place', t: 'Place value to 1,000,000', b: 'MA.4.NSO.1.1', gen() {
      const n = R(10000, 999999), s = String(n), i = R(0, s.length - 1), d = Number(s[i]);
      const place = Math.pow(10, s.length - 1 - i), names = { 1: 'ones', 10: 'tens', 100: 'hundreds', 1000: 'thousands', 10000: 'ten thousands', 100000: 'hundred thousands' };
      if (d === 0) return this.gen();
      return { q: `In ${commas(n)}, what is the value of the digit ${d}?`, a: commas(d * place),
        choices: opts(d * place, [d, d * place * 10, d * place / 10]).map(v => commas(Number(v))),
        why: `That ${d} is in the ${names[place]} place, so it is worth ${commas(d * place)}.` };
    } },
  { id: 'g4-round', t: 'Rounding whole numbers', b: 'MA.4.NSO.1.4', gen() {
      const n = R(1050, 9899), to = pick([10, 100, 1000]), ans = Math.round(n / to) * to;
      return { q: `Round ${commas(n)} to the nearest ${commas(to)}.`, a: commas(ans), choices: opts(ans, [ans + to, ans - to, n]).map(v => commas(Number(v))), why: `${commas(n)} rounds to ${commas(ans)}.` };
    } },
  { id: 'g4-mult2x2', t: 'Multiplying 2-digit numbers', b: 'MA.4.NSO.2.3', gen() {
      const a = R(11, 49), b = R(11, 29), p = a * b;
      return { q: `${a} × ${b} = ?`, a: p, choices: opts(p, [p + a, p - b, p + 10]), why: `${a} × ${b} = ${p}. Break it up: ${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10}, plus ${a} × ${b % 10} = ${a * (b % 10)}.` };
    } },
  { id: 'g4-divide', t: 'Long division', b: 'MA.4.NSO.2.4', gen() {
      const d = R(2, 9), q0 = R(12, 240), n = d * q0 + (Math.random() < 0.35 ? R(1, d - 1) : 0);
      const q = Math.floor(n / d), r = n % d;
      return { q: `${commas(n)} ÷ ${d} = ?`, a: r ? `${q} r${r}` : String(q),
        choices: opts(r ? `${q} r${r}` : String(q), [String(q), `${q + 1} r${r}`, `${q} r${(r + 1) % d}`, String(q + 1)]),
        why: r ? `${d} × ${q} = ${d * q}, with ${r} left over.` : `${d} × ${q} = ${n} exactly.` };
    } },
  { id: 'g4-factors', t: 'Factors, prime and composite', b: 'MA.4.AR.3.1', gen() {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
      if (Math.random() < 0.5) { const n = pick([...primes.slice(0, 12), 12, 15, 18, 20, 21, 24, 25, 27, 28, 33, 35, 36]); const isP = primes.includes(n);
        return { q: `Is ${n} prime or composite?`, a: isP ? 'Prime' : 'Composite', choices: shuffle(['Prime', 'Composite']),
          why: isP ? `${n} has only 1 and itself as factors, so it is prime.` : `${n} has more than two factors, so it is composite.` }; }
      const n = pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 48]);
      const fs = []; for (let i = 1; i <= n; i++) if (n % i === 0) fs.push(i);
      const good = pick(fs.filter(f => f !== 1 && f !== n));
      const bad = [];
      for (let i = 2; i < n && bad.length < 3; i++) if (n % i !== 0) bad.push(i);
      return { q: `Which one is a factor of ${n}?`, a: String(good), choices: shuffle([String(good), ...shuffle(bad).slice(0, 3).map(String)]), why: `${good} × ${n / good} = ${n}, so ${good} is a factor.` };
    } },
  { id: 'g4-equivfrac', t: 'Equivalent and comparing fractions', b: 'MA.4.FR.1.4', gen() {
      if (Math.random() < 0.5) { const n = R(1, 5), d = pick([2, 3, 4, 5, 6, 8]), k = R(2, 5); if (n >= d) return this.gen();
        return { q: `Which fraction is equal to ${n}/${d}?`, a: `${n * k}/${d * k}`, choices: opts(`${n * k}/${d * k}`, [`${n}/${d * k}`, `${n * k}/${d}`, `${n + 1}/${d + 1}`]), why: `Multiply top and bottom by ${k}.` }; }
      const pairs = [[1, 2, 1, 3], [2, 3, 3, 4], [3, 5, 1, 2], [5, 6, 3, 4], [2, 5, 1, 3], [7, 8, 5, 6], [1, 4, 2, 5]];
      const [a, b, c, d] = pick(pairs);
      const L = a / b, Rr = c / d;
      return { q: `Which sign makes this true?`, sub: `${a}/${b} ___ ${c}/${d}`, a: L > Rr ? '>' : L < Rr ? '<' : '=', choices: shuffle(['>', '<', '=']),
        why: `${a}/${b} is about ${L.toFixed(2)} and ${c}/${d} is about ${Rr.toFixed(2)}.` };
    } },
  { id: 'g4-addfrac', t: 'Adding fractions with like denominators', b: 'MA.4.FR.2.2', gen() {
      const d = pick([4, 5, 6, 8, 10, 12]), a = R(1, d - 1), b = R(1, d - 1);
      if (Math.random() < 0.5) return { q: `${a}/${d} + ${b}/${d} = ?`, a: `${a + b}/${d}`, choices: opts(`${a + b}/${d}`, [`${a + b}/${d + d}`, `${a * b}/${d}`, `${a + b + 1}/${d}`]), why: `Keep the denominator, add the numerators: ${a} + ${b} = ${a + b}, so ${a + b}/${d}.` };
      const big = Math.max(a, b), small = Math.min(a, b);
      return { q: `${big}/${d} − ${small}/${d} = ?`, a: `${big - small}/${d}`, choices: opts(`${big - small}/${d}`, [`${big + small}/${d}`, `${big - small}/${d - 1}`, `${big}/${d - small}`]), why: `Keep the denominator, subtract the numerators: ${big} − ${small} = ${big - small}.` };
    } },
  { id: 'g4-decimals', t: 'Fractions and decimals', b: 'MA.4.FR.1.2', gen() {
      const mode = pick(['toDec', 'toFrac', 'compare']);
      if (mode === 'toDec') { const n = R(1, 99); const d = n > 9 ? 100 : pick([10, 100]);
        return { q: `Write ${n}/${d} as a decimal.`, a: (n / d).toFixed(d === 10 ? 1 : 2), choices: opts((n / d).toFixed(d === 10 ? 1 : 2), [(n / (d * 10)).toFixed(3), String(n), (n / d + 0.1).toFixed(2)]), why: `${n}/${d} means ${n} ${d === 10 ? 'tenths' : 'hundredths'} = ${(n / d).toFixed(d === 10 ? 1 : 2)}.` }; }
      if (mode === 'toFrac') { const n = R(1, 9); return { q: `Write 0.${n} as a fraction.`, a: `${n}/10`, choices: opts(`${n}/10`, [`${n}/100`, `10/${n}`, `${n}/1`]), why: `0.${n} is ${n} tenths = ${n}/10.` }; }
      const a = (R(10, 99) / 100), b = (R(10, 99) / 100);
      if (a === b) return this.gen();
      return { q: `Which sign makes this true?`, sub: `${a.toFixed(2)} ___ ${b.toFixed(2)}`, a: a > b ? '>' : '<', choices: shuffle(['>', '<', '=']), why: `Compare tenths first, then hundredths.` };
    } },
  { id: 'g4-angles', t: 'Angles', b: 'MA.4.GR.1.1', gen() {
      if (Math.random() < 0.5) { const deg = R(5, 175); const kind = deg < 90 ? 'Acute' : deg === 90 ? 'Right' : 'Obtuse';
        return { q: `An angle measures ${deg}°. What kind of angle is it?`, a: kind, choices: shuffle(['Acute', 'Right', 'Obtuse', 'Straight']), why: `${deg}° is ${deg < 90 ? 'less than' : 'more than'} 90°, so it is ${kind.toLowerCase()}.` }; }
      const whole = pick([90, 180]), part = R(15, whole - 15);
      return { q: `Two angles together make ${whole}°. One is ${part}°. What is the other?`, a: whole - part + '°', choices: opts(whole - part, [whole + part, part, whole - part + 10]).map(v => v + '°'), why: `${whole} − ${part} = ${whole - part}°.` };
    } },
  { id: 'g4-convert', t: 'Measurement conversions', b: 'MA.4.M.1.2', gen() {
      const conv = [['feet', 'inches', 12], ['yards', 'feet', 3], ['meters', 'centimeters', 100], ['kilograms', 'grams', 1000], ['liters', 'milliliters', 1000], ['hours', 'minutes', 60], ['minutes', 'seconds', 60]];
      const [big, small, k] = pick(conv), n = R(2, 12);
      return { q: `How many ${small} are in ${n} ${big}?`, a: commas(n * k), choices: opts(n * k, [n + k, n * k * 10, k]).map(v => commas(Number(v))), why: `1 ${big.replace(/s$/, '')} = ${commas(k)} ${small}, so ${n} × ${commas(k)} = ${commas(n * k)}.` };
    } },
  { id: 'g4-areaperim', t: 'Area and perimeter problems', b: 'MA.4.GR.2.1', gen() {
      const w = R(3, 18), h = R(3, 18);
      if (Math.random() < 0.5) { const p = 2 * (w + h); return { q: `A garden is ${w} m by ${h} m. How much fence goes around it?`, a: p + ' m', choices: opts(p, [w * h, w + h, p + 4]).map(v => v + ' m'), why: `Perimeter = 2 × (${w} + ${h}) = ${p} m.` }; }
      const area = w * h;
      return { q: `A rectangle has an area of ${area} square units and one side is ${w}. What is the other side?`, a: h, choices: opts(h, [area - w, w, h + 1]), why: `${area} ÷ ${w} = ${h}.` };
    } },
  { id: 'g4-data', t: 'Mode, median and range', b: 'MA.4.DP.1.2', gen() {
      const set = Array.from({ length: 5 }, () => R(2, 20));
      set[R(0, 4)] = set[0];
      const sorted = [...set].sort((x, y) => x - y);
      const mode = pick(['median', 'range', 'mode']);
      const counts = {}; set.forEach(v => counts[v] = (counts[v] || 0) + 1);
      const modeVal = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
      const list = set.join(', ');
      if (mode === 'median') return { q: `What is the median of this set?`, sub: list, a: sorted[2], choices: opts(sorted[2], [sorted[0], sorted[4], sorted[3]]), why: `In order: ${sorted.join(', ')}. The middle value is ${sorted[2]}.` };
      if (mode === 'range') return { q: `What is the range of this set?`, sub: list, a: sorted[4] - sorted[0], choices: opts(sorted[4] - sorted[0], [sorted[4], sorted[0], sorted[4] + sorted[0]]), why: `${sorted[4]} − ${sorted[0]} = ${sorted[4] - sorted[0]}.` };
      return { q: `What is the mode of this set?`, sub: list, a: Number(modeVal), choices: opts(Number(modeVal), [sorted[0], sorted[4], sorted[2]]), why: `${modeVal} appears most often.` };
    } },
];

/* ---------------------------------------------------------------- grade 5 */
const G5 = [
  { id: 'g5-decplace', t: 'Decimal place value', b: 'MA.5.NSO.1.1', gen() {
      const whole = R(1, 99), dec = String(R(100, 999));
      const n = `${whole}.${dec}`;
      const i = R(0, 2), d = Number(dec[i]);
      if (d === 0) return this.gen();
      const names = ['tenths', 'hundredths', 'thousandths'], vals = [0.1, 0.01, 0.001];
      return { q: `In ${n}, what is the value of the digit ${d}?`, a: (d * vals[i]).toFixed(i + 1),
        choices: opts((d * vals[i]).toFixed(i + 1), [String(d), (d * vals[Math.max(0, i - 1)]).toFixed(Math.max(1, i)), (d * 10 * vals[i]).toFixed(i + 1)]),
        why: `That ${d} is in the ${names[i]} place, so it is worth ${(d * vals[i]).toFixed(i + 1)}.` };
    } },
  { id: 'g5-roundec', t: 'Rounding decimals', b: 'MA.5.NSO.1.5', gen() {
      const n = Number((R(100, 9999) / 100).toFixed(2));
      const to = pick(['tenth', 'whole']);
      const ans = to === 'tenth' ? n.toFixed(1) : String(Math.round(n));
      return { q: `Round ${n.toFixed(2)} to the nearest ${to === 'tenth' ? 'tenth' : 'whole number'}.`, a: ans,
        choices: opts(ans, [to === 'tenth' ? (Math.floor(n * 10) / 10 + 0.2).toFixed(1) : String(Math.round(n) + 1), String(Math.floor(n)), n.toFixed(2)]),
        why: `Look at the digit to the right of the ${to === 'tenth' ? 'tenths' : 'ones'} place to decide.` };
    } },
  { id: 'g5-multbig', t: 'Multiplying multi-digit numbers', b: 'MA.5.NSO.2.1', gen() {
      const a = R(112, 899), b = R(12, 49), p = a * b;
      return { q: `${commas(a)} × ${b} = ?`, a: commas(p), choices: opts(p, [p + a, p - b, p + 100]).map(v => commas(Number(v))), why: `${a} × ${b} = ${commas(p)}.` };
    } },
  { id: 'g5-divbig', t: 'Dividing by 2-digit numbers', b: 'MA.5.NSO.2.2', gen() {
      const d = R(11, 40), q = R(12, 200), n = d * q;
      return { q: `${commas(n)} ÷ ${d} = ?`, a: q, choices: opts(q, [q + 1, q - 1, q + 10]), why: `${d} × ${q} = ${commas(n)}.` };
    } },
  { id: 'g5-adddec', t: 'Adding and subtracting decimals', b: 'MA.5.NSO.2.3', gen() {
      const a = R(100, 9999) / 100, b = R(100, 4999) / 100;
      if (Math.random() < 0.5) { const s = (a + b).toFixed(2); return { q: `${a.toFixed(2)} + ${b.toFixed(2)} = ?`, a: s, choices: opts(s, [(a + b + 0.1).toFixed(2), (a - b).toFixed(2), (a + b + 1).toFixed(2)]), why: `Line up the decimal points: ${s}.` }; }
      const big = Math.max(a, b), small = Math.min(a, b), s = (big - small).toFixed(2);
      return { q: `${big.toFixed(2)} − ${small.toFixed(2)} = ?`, a: s, choices: opts(s, [(big + small).toFixed(2), (big - small + 0.1).toFixed(2), (big - small - 1).toFixed(2)]), why: `Line up the decimal points: ${s}.` };
    } },
  { id: 'g5-unlikefrac', t: 'Fractions with unlike denominators', b: 'MA.5.FR.2.1', gen() {
      const gcd = (x, y) => y ? gcd(y, x % y) : x;
      const pairs = [[2, 3], [3, 4], [2, 5], [4, 6], [3, 8], [5, 6], [2, 8], [4, 10]];
      const [d1, d2] = pick(pairs);
      const n1 = R(1, d1 - 1), n2 = R(1, d2 - 1);
      const den = d1 * d2 / gcd(d1, d2);
      let num = n1 * (den / d1) + n2 * (den / d2);
      const g = gcd(num, den);
      const ans = `${num / g}/${den / g}`;
      return { q: `${n1}/${d1} + ${n2}/${d2} = ?`, a: ans,
        choices: opts(ans, [`${n1 + n2}/${d1 + d2}`, `${num}/${den}` === ans ? `${num + 1}/${den}` : `${num}/${den}`, `${n1 + n2}/${den}`]),
        why: `Use a common denominator of ${den}: ${n1 * (den / d1)}/${den} + ${n2 * (den / d2)}/${den} = ${num}/${den}${g > 1 ? ` = ${ans}` : ''}.` };
    } },
  { id: 'g5-multfrac', t: 'Multiplying fractions', b: 'MA.5.FR.2.2', gen() {
      const gcd = (x, y) => y ? gcd(y, x % y) : x;
      const d1 = pick([2, 3, 4, 5, 6]), d2 = pick([2, 3, 4, 5, 8]);
      const n1 = R(1, d1 - 1), n2 = R(1, d2 - 1);
      const num = n1 * n2, den = d1 * d2, g = gcd(num, den);
      const ans = `${num / g}/${den / g}`;
      return { q: `${n1}/${d1} × ${n2}/${d2} = ?`, a: ans, choices: opts(ans, [`${num}/${den}` === ans ? `${num + 1}/${den}` : `${num}/${den}`, `${n1 + n2}/${d1 + d2}`, `${n1 * n2}/${d1 + d2}`]),
        why: `Multiply across: ${n1} × ${n2} = ${num} and ${d1} × ${d2} = ${den}${g > 1 ? `, then simplify to ${ans}` : ''}.` };
    } },
  { id: 'g5-divfrac', t: 'Dividing with unit fractions', b: 'MA.5.AR.1.3', gen() {
      const w = R(2, 8), d = pick([2, 3, 4, 5, 6]);
      if (Math.random() < 0.5) return { q: `${w} ÷ 1/${d} = ?`, a: w * d, choices: opts(w * d, [w / d, w + d, d]), why: `There are ${d} pieces of size 1/${d} in each whole, so ${w} × ${d} = ${w * d}.` };
      return { q: `1/${d} ÷ ${w} = ?`, a: `1/${d * w}`, choices: opts(`1/${d * w}`, [`1/${d + w}`, `${w}/${d}`, `${d}/${w}`]), why: `Splitting 1/${d} into ${w} equal parts gives 1/${d * w}.` };
    } },
  { id: 'g5-order', t: 'Order of operations', b: 'MA.5.AR.2.2', gen() {
      const a = R(2, 9), b = R(2, 9), c = R(2, 9);
      const form = pick(['a+b*c', '(a+b)*c', 'a*b-c', 'a+b*c-a']);
      let expr, val;
      if (form === 'a+b*c') { expr = `${a} + ${b} × ${c}`; val = a + b * c; }
      else if (form === '(a+b)*c') { expr = `(${a} + ${b}) × ${c}`; val = (a + b) * c; }
      else if (form === 'a*b-c') { expr = `${a} × ${b} − ${c}`; val = a * b - c; }
      else { expr = `${a} + ${b} × ${c} − ${a}`; val = a + b * c - a; }
      return { q: `${expr} = ?`, a: val, choices: opts(val, [(a + b) * c, a + b + c, a * b * c]), why: `Do parentheses first, then multiply, then add and subtract left to right. Answer: ${val}.` };
    } },
  { id: 'g5-volume', t: 'Volume of rectangular prisms', b: 'MA.5.GR.3.2', gen() {
      const l = R(2, 12), w = R(2, 10), h = R(2, 9), v = l * w * h;
      if (Math.random() < 0.5) return { q: `A box is ${l} by ${w} by ${h}. What is its volume?`, a: v + ' cubic units',
        choices: opts(v, [l + w + h, l * w, 2 * (l * w + l * h + w * h)]).map(x => x + ' cubic units'),
        why: `One layer of the base holds ${l} × ${w} = ${l * w} cubes. Stack ${h} layers: ${l * w} × ${h} = ${v}.`, whyVisual: svgRect(l, w, { grid: true }) };
      return { q: `A box has a volume of ${v} cubic units. Its base is ${l} by ${w}. How tall is it?`, a: h, choices: opts(h, [v - l * w, l * w, h + 1]), why: `${v} ÷ (${l} × ${w}) = ${v} ÷ ${l * w} = ${h}.` };
    } },
  { id: 'g5-coord', t: 'The coordinate plane', b: 'MA.5.GR.4.1', gen() {
      const x = R(0, 10), y = R(0, 10);
      if (Math.random() < 0.5) return { q: `Start at the origin, move ${x} right and ${y} up. What is the ordered pair?`, a: `(${x}, ${y})`,
        choices: opts(`(${x}, ${y})`, [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y + 1})`]),
        why: `Always walk across first, then climb up. Across ${x}, up ${y}, so (${x}, ${y}).`, whyVisual: svgCoord(x, y) };
      return { q: `In the point (${x}, ${y}), which number tells you how far to move up?`, a: String(y), choices: opts(y, [x, x + y, Math.abs(x - y)]), why: `The second number, the y-coordinate, is ${y}.` };
    } },
  { id: 'g5-mean', t: 'Mean, median, mode and range', b: 'MA.5.DP.1.2', gen() {
      const n = 5, base = R(4, 16);
      const set = Array.from({ length: n }, () => base + R(-3, 3)).map(v => Math.max(1, v));
      const sum = set.reduce((x, y) => x + y, 0);
      const sorted = [...set].sort((a, b) => a - b);
      if (Math.random() < 0.5 && sum % n === 0) return { q: `What is the mean of this set?`, sub: set.join(', '), a: sum / n, choices: opts(sum / n, [sorted[2], sum, sorted[4]]), why: `${set.join(' + ')} = ${sum}, then ${sum} ÷ ${n} = ${sum / n}.` };
      return { q: `What is the median of this set?`, sub: set.join(', '), a: sorted[2], choices: opts(sorted[2], [sorted[0], sorted[4], Math.round(sum / n)]), why: `In order: ${sorted.join(', ')}. The middle one is ${sorted[2]}.` };
    } },
];

const GRADES = { 1: G1, 2: G2, 3: G3, 4: G4, 5: G5 };

/* ---------------------------------------------------- pictures for kids
   Small inline SVGs. A child should be able to see why an answer works,
   not just read it. Function declarations hoist, so generators above can
   call these.                                                            */

function svgWrap(inner, w, h, maxW) {
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${maxW || w}px;height:auto" role="img" aria-hidden="true">${inner}</svg>`;
}

function svgClock(h, m) {
  const cx = 60, cy = 60, r = 52;
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    const x1 = cx + Math.cos(a) * (r - 8), y1 = cy + Math.sin(a) * (r - 8);
    const x2 = cx + Math.cos(a) * (r - 2), y2 = cy + Math.sin(a) * (r - 2);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/>`;
    const lx = cx + Math.cos(a) * (r - 18), ly = cy + Math.sin(a) * (r - 18) + 4;
    ticks += `<text x="${lx}" y="${ly}" font-size="11" font-weight="700" fill="#5A6683" text-anchor="middle">${i === 0 ? 12 : i}</text>`;
  }
  const ma = (m * 6 - 90) * Math.PI / 180;
  const ha = ((h % 12) * 30 + m * 0.5 - 90) * Math.PI / 180;
  return svgWrap(
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#2563EB" stroke-width="3"/>${ticks}
     <line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(ha) * (r - 26)}" y2="${cy + Math.sin(ha) * (r - 26)}" stroke="#17203A" stroke-width="5" stroke-linecap="round"/>
     <line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(ma) * (r - 14)}" y2="${cy + Math.sin(ma) * (r - 14)}" stroke="#C6274B" stroke-width="3" stroke-linecap="round"/>
     <circle cx="${cx}" cy="${cy}" r="4" fill="#17203A"/>`, 120, 120, 200);
}

function svgNumberLine(from, to, marks) {
  const w = 340, h = 74, pad = 22, span = to - from || 1;
  const X = (v) => pad + ((v - from) / span) * (w - pad * 2);
  let out = `<line x1="${pad}" y1="42" x2="${w - pad}" y2="42" stroke="#B9CBF7" stroke-width="3" stroke-linecap="round"/>`;
  const step = span <= 10 ? 1 : span <= 100 ? span / 10 : span / 10;
  for (let v = from; v <= to + 0.0001; v += step) {
    const x = X(v);
    out += `<line x1="${x}" y1="35" x2="${x}" y2="49" stroke="#B9CBF7" stroke-width="2"/>`;
    out += `<text x="${x}" y="66" font-size="11" fill="#5A6683" text-anchor="middle">${Math.round(v * 100) / 100}</text>`;
  }
  (marks || []).forEach((mk) => {
    const x = X(mk.v);
    const col = mk.color || '#2563EB';
    out += `<circle cx="${x}" cy="42" r="7" fill="${col}"/>`;
    if (mk.label) out += `<text x="${x}" y="22" font-size="12" font-weight="800" fill="${col}" text-anchor="middle">${mk.label}</text>`;
  });
  return svgWrap(out, w, h);
}

function svgFractionBar(n, d, label) {
  const w = 300, h = label ? 60 : 44, bw = w - 8, cell = bw / d;
  let out = '';
  for (let i = 0; i < d; i++) {
    out += `<rect x="${4 + i * cell}" y="6" width="${cell}" height="32" fill="${i < n ? '#2563EB' : '#EEF3FF'}" stroke="#2563EB" stroke-width="2"/>`;
  }
  if (label) out += `<text x="${w / 2}" y="55" font-size="13" font-weight="800" fill="#2563EB" text-anchor="middle">${label}</text>`;
  return svgWrap(out, w, h);
}

function svgArray(rows, cols) {
  const s = 22, pad = 6, w = cols * s + pad * 2, h = rows * s + pad * 2;
  let out = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
    out += `<circle cx="${pad + c * s + s / 2}" cy="${pad + r * s + s / 2}" r="8" fill="#2563EB"/>`;
  return svgWrap(out, w, h);
}

function svgRect(wUnits, hUnits, opts2) {
  const o = opts2 || {};
  const max = 260, s = Math.max(10, Math.min(26, Math.floor(max / Math.max(wUnits, hUnits))));
  const w = wUnits * s + 60, h = hUnits * s + 46;
  let out = `<rect x="30" y="8" width="${wUnits * s}" height="${hUnits * s}" fill="#EEF3FF" stroke="#2563EB" stroke-width="3"/>`;
  if (o.grid) {
    for (let i = 1; i < wUnits; i++) out += `<line x1="${30 + i * s}" y1="8" x2="${30 + i * s}" y2="${8 + hUnits * s}" stroke="#B9CBF7" stroke-width="1"/>`;
    for (let j = 1; j < hUnits; j++) out += `<line x1="30" y1="${8 + j * s}" x2="${30 + wUnits * s}" y2="${8 + j * s}" stroke="#B9CBF7" stroke-width="1"/>`;
  }
  out += `<text x="${30 + wUnits * s / 2}" y="${8 + hUnits * s + 22}" font-size="13" font-weight="800" fill="#17203A" text-anchor="middle">${wUnits}</text>`;
  out += `<text x="20" y="${8 + hUnits * s / 2 + 5}" font-size="13" font-weight="800" fill="#17203A" text-anchor="middle">${hUnits}</text>`;
  return svgWrap(out, w, h);
}

function svgCoord(px, py) {
  const n = 10, s = 24, pad = 26, w = n * s + pad + 14, h = n * s + pad + 14;
  const X = (v) => pad + v * s, Y = (v) => (n * s + 6) - v * s;
  let out = '';
  for (let i = 0; i <= n; i++) {
    out += `<line x1="${X(i)}" y1="6" x2="${X(i)}" y2="${Y(0)}" stroke="#E7EDFB" stroke-width="1"/>`;
    out += `<line x1="${X(0)}" y1="${Y(i)}" x2="${X(n)}" y2="${Y(i)}" stroke="#E7EDFB" stroke-width="1"/>`;
  }
  out += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(n)}" y2="${Y(0)}" stroke="#17203A" stroke-width="2.5"/>`;
  out += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="6" stroke="#17203A" stroke-width="2.5"/>`;
  out += `<circle cx="${X(px)}" cy="${Y(py)}" r="7" fill="#C6274B"/>`;
  out += `<text x="${X(px) + 10}" y="${Y(py) - 8}" font-size="12" font-weight="800" fill="#C6274B">(${px}, ${py})</text>`;
  return svgWrap(out, w, h);
}

/* ------------------------------------------------------------ the climb
   Ten levels per grade. Levels 1 to 9 build one idea at a time in the
   order a classroom teaches them; level 10 mixes everything, so finishing
   a grade means every benchmark above has been practised.               */

const LEVELS = {
  1: [
    { n: 1, name: 'Counting Climb', topics: ['g1-count'] },
    { n: 2, name: 'Tens and Ones', topics: ['g1-tens'] },
    { n: 3, name: 'Add and Subtract', topics: ['g1-add20'] },
    { n: 4, name: 'One More, Ten More', topics: ['g1-morless'] },
    { n: 5, name: 'Missing Numbers', topics: ['g1-missing'] },
    { n: 6, name: 'True or False', topics: ['g1-truefalse'] },
    { n: 7, name: 'Shape Spotter', topics: ['g1-shapes'] },
    { n: 8, name: 'Halves and Fourths', topics: ['g1-halves'] },
    { n: 9, name: 'Clocks and Coins', topics: ['g1-time', 'g1-coins'] },
    { n: 10, name: 'Champion Round', topics: '*', boss: true },
  ],
  2: [
    { n: 1, name: 'Numbers to 1,000', topics: ['g2-place'] },
    { n: 2, name: 'Compare and Order', topics: ['g2-compare'] },
    { n: 3, name: 'Rounding', topics: ['g2-round'] },
    { n: 4, name: 'Add and Subtract', topics: ['g2-add100'] },
    { n: 5, name: 'Ten and Hundred Jumps', topics: ['g2-tenmore'] },
    { n: 6, name: 'Even, Odd and Arrays', topics: ['g2-evenodd'] },
    { n: 7, name: 'Story Problems', topics: ['g2-word'] },
    { n: 8, name: 'Clocks and Money', topics: ['g2-time5', 'g2-money'] },
    { n: 9, name: 'Perimeter and Graphs', topics: ['g2-perimeter', 'g2-data'] },
    { n: 10, name: 'Champion Round', topics: '*', boss: true },
  ],
  3: [
    { n: 1, name: 'Times Tables', topics: ['g3-facts'] },
    { n: 2, name: 'Tens and Hundreds', topics: ['g3-mult10'] },
    { n: 3, name: 'Big Add and Subtract', topics: ['g3-addsub'] },
    { n: 4, name: 'Rounding', topics: ['g3-round'] },
    { n: 5, name: 'Patterns and Multiples', topics: ['g3-patterns'] },
    { n: 6, name: 'Fraction Basics', topics: ['g3-unitfrac'] },
    { n: 7, name: 'Comparing Fractions', topics: ['g3-compfrac', 'g3-equivfrac'] },
    { n: 8, name: 'Area and Perimeter', topics: ['g3-area'] },
    { n: 9, name: 'Time, Graphs and Stories', topics: ['g3-elapsed', 'g3-data', 'g3-2step'] },
    { n: 10, name: 'Champion Round', topics: '*', boss: true },
  ],
  4: [
    { n: 1, name: 'Place Value', topics: ['g4-place', 'g4-round'] },
    { n: 2, name: 'Multiplying 2-Digit', topics: ['g4-mult2x2'] },
    { n: 3, name: 'Long Division', topics: ['g4-divide'] },
    { n: 4, name: 'Factors and Primes', topics: ['g4-factors'] },
    { n: 5, name: 'Equal Fractions', topics: ['g4-equivfrac'] },
    { n: 6, name: 'Adding Fractions', topics: ['g4-addfrac'] },
    { n: 7, name: 'Decimals', topics: ['g4-decimals'] },
    { n: 8, name: 'Angles', topics: ['g4-angles'] },
    { n: 9, name: 'Measure, Area and Data', topics: ['g4-convert', 'g4-areaperim', 'g4-data'] },
    { n: 10, name: 'Champion Round', topics: '*', boss: true },
  ],
  5: [
    { n: 1, name: 'Decimal Place Value', topics: ['g5-decplace'] },
    { n: 2, name: 'Rounding Decimals', topics: ['g5-roundec'] },
    { n: 3, name: 'Multiply and Divide Big', topics: ['g5-multbig', 'g5-divbig'] },
    { n: 4, name: 'Decimal Add and Subtract', topics: ['g5-adddec'] },
    { n: 5, name: 'Unlike Denominators', topics: ['g5-unlikefrac'] },
    { n: 6, name: 'Multiplying Fractions', topics: ['g5-multfrac'] },
    { n: 7, name: 'Dividing with Fractions', topics: ['g5-divfrac'] },
    { n: 8, name: 'Order of Operations', topics: ['g5-order'] },
    { n: 9, name: 'Volume and Coordinates', topics: ['g5-volume', 'g5-coord', 'g5-mean'] },
    { n: 10, name: 'Champion Round', topics: '*', boss: true },
  ],
};

/* every level resolves to real topic objects, and level 10 pulls the lot */
function topicsFor(grade, level) {
  const all = GRADES[grade];
  if (level.topics === '*') return all.slice();
  return level.topics.map((id) => all.find((t) => t.id === id)).filter(Boolean);
}
