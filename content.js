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
  { id: 'g1-write100', t: 'Reading and writing numbers to 100', b: 'MA.1.NSO.1.2', gen() {
      const n = R(11, 99), t = Math.floor(n / 10) * 10, o = n % 10;
      const ones = ['zero','one','two','three','four','five','six','seven','eight','nine'];
      const tens = ['','ten','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
      const teens = ['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
      const word = n < 20 ? teens[n - 10] : tens[Math.floor(n / 10)] + (o ? '-' + ones[o] : '');
      if (o === 0) return { q: `What is the expanded form of ${n}?`, a: String(t),
        choices: opts(String(t), [`${t} + 0`, String(t / 10), String(t + 10)]),
        why: `${n} is just ${t}, with no ones left over.` };
      if (Math.random() < 0.5) return { q: `What is the expanded form of ${n}?`, a: `${t} + ${o}`,
        choices: opts(`${t} + ${o}`, [`${o} + ${t}0`, `${t}0 + ${o}`, `${t} + ${o + 1}`]),
        why: `${n} is ${t} and ${o} more, so ${t} + ${o}.` };
      return { q: `Which number is <b>${word}</b>?`, a: n,
        choices: opts(n, [t, o * 10 + Math.floor(n / 10), n + 10]),
        why: `${word} is ${n}.` };
    } },
  { id: 'g1-order100', t: 'Ordering numbers to 100', b: 'MA.1.NSO.1.4', gen() {
      const set = shuffle([R(5, 35), R(36, 66), R(67, 99)]);
      const sorted = [...set].sort((a, b) => a - b).join(', ');
      if (Math.random() < 0.5) return { q: 'Which number is the biggest?', sub: set.join(', '),
        a: Math.max(...set), choices: shuffle(set.map(String)),
        why: `${Math.max(...set)} is the largest of the three.` };
      const ch = [sorted, [...set].sort((a, b) => b - a).join(', '), set.join(', ')].filter((v, i, s) => s.indexOf(v) === i);
      return { q: 'Put them in order, smallest first.', sub: set.join(', '), a: sorted, choices: shuffle(ch),
        why: `Smallest to biggest: ${sorted}.`, visual: svgNumberLine(0, 100, set.map(v => ({ v, label: String(v) }))) };
    } },
  { id: 'g1-facts10', t: 'Facts to 10', b: 'MA.1.NSO.2.1', gen() {
      if (Math.random() < 0.5) { const a = R(1, 9), b = R(0, 10 - a);
        return { q: `${a} + ${b} = ?`, a: a + b, choices: opts(a + b, [a + b + 1, a + b - 1, a * b]),
          why: `${a} + ${b} = ${a + b}.`, visual: dots(a, '🔵') + '  ' + dots(b, '🟠') }; }
      const a = R(2, 10), b = R(1, a);
      return { q: `${a} − ${b} = ?`, a: a - b, choices: opts(a - b, [a + b, a - b + 1, b]),
        why: `Start at ${a} and take away ${b}, leaving ${a - b}.` };
    } },
  { id: 'g1-add2digit', t: 'Adding a small number on', b: 'MA.1.NSO.2.4', gen() {
      const a = R(11, 89), b = R(2, 9);
      return { q: `${a} + ${b} = ?`, a: a + b, choices: opts(a + b, [a + b + 10, a + b - 1, a + b + 1]),
        why: `Start at ${a} and count on ${b} to reach ${a + b}.`,
        visual: svgNumberLine(a - 2, a + 12, [{ v: a, label: String(a) }, { v: a + b, label: String(a + b), color: '#12885A' }]) };
    } },
  { id: 'g1-sub2digit', t: 'Taking a small number away', b: 'MA.1.NSO.2.5', gen() {
      const a = R(21, 89), b = R(1, Math.min(9, a % 10 || 9));
      return { q: `${a} − ${b} = ?`, a: a - b, choices: opts(a - b, [a + b, a - b - 1, a - b + 1]),
        why: `${a} take away ${b} leaves ${a - b}. You can also ask: what added to ${b} makes ${a}?` };
    } },
  { id: 'g1-add3', t: 'Adding three numbers', b: 'MA.1.AR.1.1', gen() {
      const a = R(2, 8), b = R(2, 8), c = 10 - (a + b) % 10;
      const nums = shuffle([a, b, c < 2 ? R(2, 8) : c]);
      const sum = nums.reduce((x, y) => x + y, 0);
      const pair = nums[0] + nums[1] === 10 ? [nums[0], nums[1]] : nums[1] + nums[2] === 10 ? [nums[1], nums[2]] : null;
      return { q: `${nums.join(' + ')} = ?`, a: sum, choices: opts(sum, [sum + 1, sum - 1, sum + 2]),
        why: pair ? `Add the pair that makes 10 first: ${pair[0]} + ${pair[1]} = 10, then + ${sum - 10} = ${sum}.`
                  : `Add them one at a time: ${nums[0]} + ${nums[1]} = ${nums[0] + nums[1]}, then + ${nums[2]} = ${sum}.` };
    } },
  { id: 'g1-story1', t: 'Add and subtract stories', b: 'MA.1.AR.1.2', gen() {
      const a = R(3, 12), b = R(2, 8);
      const s = pick([
        { q: `Amir has ${a} stickers. He gets ${b} more. How many now?`, a: a + b, why: `${a} + ${b} = ${a + b}.` },
        { q: `There are ${a + b} birds. ${b} fly away. How many are left?`, a: a, why: `${a + b} − ${b} = ${a}.` },
        { q: `Zoe has ${a} shells and Sam has ${b}. How many altogether?`, a: a + b, why: `${a} + ${b} = ${a + b}.` },
        { q: `A box holds ${a + b} crayons. ${a} are red and the rest are blue. How many are blue?`, a: b, why: `${a + b} − ${a} = ${b}.` },
      ]);
      return { q: s.q, a: s.a, choices: opts(s.a, [s.a + 1, s.a - 1, a + b + b]), why: s.why };
    } },
  { id: 'g1-relate1', t: 'Adding helps subtracting', b: 'MA.1.AR.2.1', gen() {
      const total = R(8, 20), part = R(2, total - 2);
      return { q: `${total} − ${part} = ?`, sub: `Think: ${part} + ? = ${total}`, a: total - part,
        choices: opts(total - part, [total + part, part, total - part + 1]),
        why: `${part} + ${total - part} = ${total}, so ${total} − ${part} = ${total - part}.` };
    } },
  { id: 'g1-tally', t: 'Tally marks', b: 'MA.1.DP.1.1', gen() {
      const cats = shuffle(['Red', 'Blue', 'Green', 'Yellow']).slice(0, 3);
      const counts = cats.map(() => R(3, 14));
      const rows = cats.map((c, i) => [c, counts[i]]);
      const i = R(0, cats.length - 1);
      return { q: `How many chose ${cats[i]}?`, a: counts[i],
        choices: opts(counts[i], [counts[i] + 1, counts[i] - 1, counts[(i + 1) % cats.length]]),
        why: `Each full bundle of tally marks is 5. Counting them gives ${counts[i]}.`, visual: svgTally(rows) };
    } },
  { id: 'g1-readdata', t: 'Comparing the data', b: 'MA.1.DP.1.2', gen() {
      const cats = shuffle(['Cats', 'Dogs', 'Fish']).slice(0, 3);
      const counts = cats.map(() => R(2, 12));
      const rows = cats.map((c, i) => [c, counts[i]]);
      const mode = pick(['most', 'total', 'diff']);
      if (mode === 'most') { const mx = Math.max(...counts);
        return { q: 'Which one has the most?', a: cats[counts.indexOf(mx)], choices: shuffle([...cats]),
          why: `${cats[counts.indexOf(mx)]} has ${mx}, more than the others.`, visual: svgTally(rows) }; }
      if (mode === 'total') { const t = counts.reduce((x, y) => x + y, 0);
        return { q: 'How many altogether?', a: t, choices: opts(t, [t + 1, t - 2, Math.max(...counts)]),
          why: `${counts.join(' + ')} = ${t}.`, visual: svgTally(rows) }; }
      const [i, j] = [0, 1], d = Math.abs(counts[i] - counts[j]);
      return { q: `How many more ${counts[i] > counts[j] ? cats[i] : cats[j]} than ${counts[i] > counts[j] ? cats[j] : cats[i]}?`,
        a: d, choices: opts(d, [counts[i] + counts[j], d + 1, Math.max(counts[i], counts[j])]),
        why: `${Math.max(counts[i], counts[j])} − ${Math.min(counts[i], counts[j])} = ${d}.`, visual: svgTally(rows) };
    } },
  { id: 'g1-attributes', t: 'Shapes by their sides', b: 'MA.1.GR.1.2', gen() {
      const shapes = [{ k: 'triangle', s: 3, n: 'Triangle' }, { k: 'square', s: 4, n: 'Square' },
        { k: 'rectangle', s: 4, n: 'Rectangle' }, { k: 'hexagon', s: 6, n: 'Hexagon' }];
      const sh = pick(shapes);
      if (Math.random() < 0.5) return { q: `Which shape has ${sh.s} ${sh.s === 4 ? 'sides and 4 square corners' : 'sides'}?`,
        a: sh.n, choices: shuffle(shapes.map(x => x.n)),
        why: `A ${sh.n.toLowerCase()} has ${sh.s} sides.`, visual: svgShape(sh.k) };
      return { q: 'How many sides does this shape have?', a: sh.s, choices: opts(sh.s, [sh.s + 1, sh.s - 1, sh.s + 2]),
        why: `Count the straight edges: ${sh.s}.`, visual: svgShape(sh.k) };
    } },
  { id: 'g1-compose', t: 'Building shapes from shapes', b: 'MA.1.GR.1.3', gen() {
      const q = pick([
        { q: 'How many triangles does it take to build a hexagon?', a: 6, w: [3, 4, 8], why: 'A hexagon splits into 6 equal triangles from the centre.' },
        { q: 'How many triangles make a square, cut corner to corner?', a: 2, w: [3, 4, 6], why: 'One diagonal cuts a square into 2 triangles.' },
        { q: 'How many squares make a rectangle that is 2 squares long and 2 high?', a: 4, w: [2, 3, 6], why: '2 rows of 2 squares is 4.' },
        { q: 'How many halves make one whole circle?', a: 2, w: [3, 4, 1], why: 'Two half circles join to make a whole.' },
      ]);
      return { q: q.q, a: q.a, choices: opts(q.a, q.w), why: q.why };
    } },
  { id: 'g1-realshapes', t: 'Shapes around us', b: 'MA.1.GR.1.4', gen() {
      const q = pick([
        { t: 'a ball', a: 'Sphere' }, { t: 'a dice', a: 'Cube' }, { t: 'a soup can', a: 'Cylinder' },
        { t: 'a party hat', a: 'Cone' }, { t: 'a cereal box', a: 'Rectangular prism' },
      ]);
      const all = ['Sphere', 'Cube', 'Cylinder', 'Cone', 'Rectangular prism'];
      return { q: `Which solid shape is ${q.t} most like?`, a: q.a,
        choices: shuffle([q.a, ...shuffle(all.filter(x => x !== q.a)).slice(0, 3)]),
        why: `${q.t[0].toUpperCase() + q.t.slice(1)} has the shape of a ${q.a.toLowerCase()}.`,
        visual: svgSolid(q.a.toLowerCase()) };
    } },
  { id: 'g1-measure1', t: 'Measuring with a ruler', b: 'MA.1.M.1.1', gen() {
      const len = R(1, 6);
      return { q: 'How many inches long is the blue bar?', a: len + ' in',
        choices: opts(len + ' in', [(len + 1) + ' in', Math.max(1, len - 1) + ' in', (len + 2) + ' in']),
        why: `Start at 0 and count the inches to where the bar stops: ${len}.`, visual: svgRuler(len, 1, 6) };
    } },
  { id: 'g1-compare1', t: 'Longer and shorter', b: 'MA.1.M.1.2', gen() {
      const a = R(2, 9), b = R(2, 9);
      if (a === b) return this.gen();
      const longer = a > b ? 'A' : 'B';
      if (Math.random() < 0.5) return { q: 'Which bar is longer?', a: longer, choices: ['A', 'B'],
        why: `A is ${a} inches and B is ${b} inches, so ${longer} is longer.`,
        visual: svgRuler(a, 1, Math.max(a, b) + 1) + svgRuler(b, 1, Math.max(a, b) + 1) };
      return { q: 'How much longer is the longer bar?', a: Math.abs(a - b) + ' in',
        choices: opts(Math.abs(a - b) + ' in', [(a + b) + ' in', (Math.abs(a - b) + 1) + ' in', Math.max(a, b) + ' in']),
        why: `${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)} inches.`,
        visual: svgRuler(a, 1, Math.max(a, b) + 1) + svgRuler(b, 1, Math.max(a, b) + 1) };
    } },
  { id: 'g1-bills', t: 'Dollar bills', b: 'MA.1.M.2.3', gen() {
      const ones = R(0, 4), fives = R(0, 3), tens = R(0, 4);
      const total = ones + fives * 5 + tens * 10;
      if (total === 0) return this.gen();
      const parts = [];
      if (tens) parts.push(`${tens} ten-dollar bill${tens > 1 ? 's' : ''}`);
      if (fives) parts.push(`${fives} five-dollar bill${fives > 1 ? 's' : ''}`);
      if (ones) parts.push(`${ones} one-dollar bill${ones > 1 ? 's' : ''}`);
      return { q: `How much money is ${parts.join(', ')}?`, a: '$' + total,
        choices: opts('$' + total, ['$' + (total + 5), '$' + (total - 1), '$' + (ones + fives + tens)]),
        why: `${tens ? `${tens} × $10 = $${tens * 10}. ` : ''}${fives ? `${fives} × $5 = $${fives * 5}. ` : ''}${ones ? `${ones} × $1 = $${ones}. ` : ''}Altogether $${total}.` };
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
  { id: 'g2-compose3', t: 'Building three-digit numbers', b: 'MA.2.NSO.1.2', gen() {
      const h = R(1, 9), t = R(0, 9), o = R(0, 9), n = h * 100 + t * 10 + o;
      if (Math.random() < 0.5) return { q: `${h} hundreds, ${t} tens and ${o} ones make what number?`, a: n,
        choices: opts(n, [n + 100, h * 100 + o * 10 + t, n + 10]),
        why: `${h * 100} + ${t * 10} + ${o} = ${n}.` };
      const which = pick([['hundreds', h], ['tens', t], ['ones', o]]);
      return { q: `How many ${which[0]} are in ${n}?`, a: which[1],
        choices: opts(which[1], [h, t, o].filter(v => v !== which[1]).concat([which[1] + 1])),
        why: `${n} is ${h} hundreds, ${t} tens and ${o} ones.` };
    } },
  { id: 'g2-facts20', t: 'Facts to 20', b: 'MA.2.NSO.2.1', gen() {
      if (Math.random() < 0.5) { const a = R(3, 12), b = R(2, 20 - a);
        return { q: `${a} + ${b} = ?`, a: a + b, choices: opts(a + b, [a + b + 1, a + b - 1, a + b + 2]), why: `${a} + ${b} = ${a + b}.` }; }
      const a = R(8, 20), b = R(2, a - 1);
      return { q: `${a} − ${b} = ?`, a: a - b, choices: opts(a - b, [a + b, a - b + 1, a - b - 1]),
        why: `${b} + ${a - b} = ${a}, so ${a} − ${b} = ${a - b}.` };
    } },
  { id: 'g2-add1000', t: 'Adding and subtracting to 1,000', b: 'MA.2.NSO.2.4', gen() {
      const a = R(120, 800), b = R(20, 180);
      if (Math.random() < 0.5) return { q: `${a} + ${b} = ?`, a: a + b, choices: opts(a + b, [a + b + 10, a + b - 10, a + b + 100]),
        why: `Add the hundreds, then the tens, then the ones: ${a} + ${b} = ${a + b}.` };
      return { q: `${a} − ${b} = ?`, a: a - b, choices: opts(a - b, [a + b, a - b + 10, a - b - 10]),
        why: `${a} − ${b} = ${a - b}.` };
    } },
  { id: 'g2-truefalse2', t: 'True or false equations', b: 'MA.2.AR.2.1', gen() {
      const a = R(12, 40), b = R(5, 25);
      const real = Math.random() < 0.5;
      const c = real ? a + 1 : a + 1, d = real ? b - 1 : b + R(1, 3);
      return { q: 'Is this equation true or false?', sub: `${a} + ${b} = ${c} + ${d}`,
        a: (a + b === c + d) ? 'True' : 'False', choices: ['True', 'False'],
        why: `${a} + ${b} = ${a + b} and ${c} + ${d} = ${c + d}. ${a + b === c + d ? 'They match, so true.' : 'They are different, so false.'}` };
    } },
  { id: 'g2-unknown2', t: 'Find the missing number', b: 'MA.2.AR.2.2', gen() {
      const a = R(10, 45), b = R(10, 45);
      const total = a + b;
      if (Math.random() < 0.5) return { q: `${a} + ? = ${total}`, a: b, choices: opts(b, [total, a, b + 1]),
        why: `${total} − ${a} = ${b}.` };
      return { q: `? − ${a} = ${b}`, a: total, choices: opts(total, [b - a, a, total + a]),
        why: `${a} + ${b} = ${total}.` };
    } },
  { id: 'g2-oddgroups', t: 'Why numbers are even or odd', b: 'MA.2.AR.3.1', gen() {
      const half = R(2, 10), even = half * 2, odd = even + 1;
      if (Math.random() < 0.5) return { q: `${even} things are shared into 2 equal groups. How many in each group?`,
        a: half, choices: opts(half, [even, half + 1, half - 1]),
        why: `${even} splits evenly into ${half} and ${half}, which is why ${even} is even.`,
        visual: svgArray(2, half) };
      return { q: `${odd} things are shared into 2 equal groups. How many are left over?`, a: 1,
        choices: opts(1, [0, 2, half]),
        why: `${odd} makes two groups of ${half} with 1 left over, which is why ${odd} is odd.` };
    } },
  { id: 'g2-makebar', t: 'Building a bar graph', b: 'MA.2.DP.1.1', gen() {
      const cats = shuffle(['Apples', 'Pears', 'Plums', 'Figs']).slice(0, 3);
      const vals = cats.map(() => R(2, 10));
      const vis = svgBarGraph(cats, vals, 2);
      const mode = pick(['read', 'total', 'diff']);
      const i = R(0, cats.length - 1);
      if (mode === 'read') return { q: `How many ${cats[i]}?`, a: vals[i], choices: opts(vals[i], [vals[i] + 2, vals[i] - 1, vals[(i + 1) % cats.length]]),
        why: `The ${cats[i]} bar reaches ${vals[i]}.`, visual: vis };
      if (mode === 'total') { const t = vals.reduce((x, y) => x + y, 0);
        return { q: 'How many altogether?', a: t, choices: opts(t, [t + 2, t - 2, Math.max(...vals)]),
          why: `${vals.join(' + ')} = ${t}.`, visual: vis }; }
      const j = (i + 1) % cats.length, d = Math.abs(vals[i] - vals[j]);
      return { q: `How many more ${vals[i] > vals[j] ? cats[i] : cats[j]} than ${vals[i] > vals[j] ? cats[j] : cats[i]}?`,
        a: d, choices: opts(d, [vals[i] + vals[j], d + 1, Math.max(vals[i], vals[j])]),
        why: `${Math.max(vals[i], vals[j])} − ${Math.min(vals[i], vals[j])} = ${d}.`, visual: vis };
    } },
  { id: 'g2-partition', t: 'Halves, thirds and fourths', b: 'MA.2.FR.1.1', gen() {
      const d = pick([2, 3, 4]);
      const names = { 2: 'halves', 3: 'thirds', 4: 'fourths' };
      const single = { 2: 'half', 3: 'third', 4: 'fourth' };
      if (Math.random() < 0.5) return { q: `This shape is cut into equal parts. What is each part called?`,
        a: `One ${single[d]}`, choices: opts(`One ${single[d]}`, ['One half', 'One third', 'One fourth'].filter(x => x !== `One ${single[d]}`).concat(['One fifth'])),
        why: `It is cut into ${d} equal parts, so each one is a ${single[d]}.`, visual: svgPie(1, d) };
      return { q: `How many ${names[d]} make one whole?`, a: d, choices: opts(d, [d + 1, d - 1, d + 2]),
        why: `It takes ${d} ${names[d]} to make a whole.`, visual: svgPie(d, d) };
    } },
  { id: 'g2-equalparts', t: 'Equal parts, different shapes', b: 'MA.2.FR.1.2', gen() {
      const q = pick([
        { q: 'A square cake is cut into 4 equal pieces. Must every piece be the same shape?', a: 'No', why: 'The pieces must be the same size, but they can be four strips or four small squares.' },
        { q: 'A pizza is cut into 4 equal slices. Is each slice one fourth?', a: 'Yes', why: 'Four equal parts of one whole means each part is one fourth.' },
        { q: 'A sandwich is cut into 2 pieces, one big and one small. Is each piece one half?', a: 'No', why: 'Halves have to be equal in size. These are not.' },
        { q: 'Two shapes are cut into 3 equal parts each. Is one third of each the same amount?', a: 'No', why: 'Only if the two wholes are the same size to begin with.' },
      ]);
      return { q: q.q, a: q.a, choices: ['Yes', 'No'], why: q.why };
    } },
  { id: 'g2-identify2d', t: 'Naming flat shapes', b: 'MA.2.GR.1.1', gen() {
      const shapes = [{ k: 'triangle', n: 'Triangle' }, { k: 'square', n: 'Square' }, { k: 'rectangle', n: 'Rectangle' },
        { k: 'pentagon', n: 'Pentagon' }, { k: 'hexagon', n: 'Hexagon' }];
      const sh = pick(shapes);
      return { q: 'What is this shape called?', a: sh.n,
        choices: shuffle([sh.n, ...shuffle(shapes.filter(x => x.n !== sh.n).map(x => x.n)).slice(0, 3)]),
        why: `Count the sides to name it: this is a ${sh.n.toLowerCase()}.`, visual: svgShape(sh.k) };
    } },
  { id: 'g2-vertices', t: 'Sides and corners', b: 'MA.2.GR.1.2', gen() {
      const shapes = [{ k: 'triangle', s: 3 }, { k: 'square', s: 4 }, { k: 'rectangle', s: 4 },
        { k: 'pentagon', s: 5 }, { k: 'hexagon', s: 6 }];
      const sh = pick(shapes);
      const askCorners = Math.random() < 0.5;
      return { q: `How many ${askCorners ? 'corners' : 'sides'} does this shape have?`, a: sh.s,
        choices: opts(sh.s, [sh.s + 1, sh.s - 1, sh.s + 2]),
        why: `This shape has ${sh.s} sides and ${sh.s} corners. They always match.`, visual: svgShape(sh.k) };
    } },
  { id: 'g2-symmetry2', t: 'Lines of symmetry', b: 'MA.2.GR.1.3', gen() {
      const kind = pick(['heart', 'square', 'triangle', 'flag']);
      const correct = Math.random() < 0.5;
      return { q: 'If you fold along the dashed line, do the halves match?', a: correct ? 'Yes' : 'No',
        choices: ['Yes', 'No'],
        why: correct ? 'They match exactly, so the dashed line is a line of symmetry.'
                     : 'The two halves do not match, so it is not a line of symmetry.',
        visual: svgSymmetry(kind, correct) };
    } },
  { id: 'g2-perimcount', t: 'Perimeter by counting', b: 'MA.2.GR.2.1', gen() {
      const w = R(2, 8), h = R(2, 6);
      const p = 2 * (w + h);
      return { q: 'How far is it all the way around this rectangle?', a: p,
        choices: opts(p, [w * h, w + h, p + 2]),
        why: `Add every side: ${w} + ${h} + ${w} + ${h} = ${p} units.`, visual: svgRect(w, h, { grid: true }) };
    } },
  { id: 'g2-measure2', t: 'Measuring in inches and centimeters', b: 'MA.2.M.1.1', gen() {
      const len = R(2, 9);
      return { q: 'How long is the blue bar?', a: len + ' in',
        choices: opts(len + ' in', [(len + 1) + ' in', (len - 1) + ' in', (len + 2) + ' in']),
        why: `Line the bar up with 0 and read where it ends: ${len} inches.`, visual: svgRuler(len, 1, 9) };
    } },
  { id: 'g2-comparelen', t: 'Comparing two lengths', b: 'MA.2.M.1.2', gen() {
      const a = R(3, 11), b = R(3, 11);
      if (a === b) return this.gen();
      return { q: 'How much longer is one bar than the other?', a: Math.abs(a - b) + ' in',
        choices: opts(Math.abs(a - b) + ' in', [(a + b) + ' in', Math.max(a, b) + ' in', (Math.abs(a - b) + 1) + ' in']),
        why: `One is ${a} inches, the other ${b}. ${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(a - b)}.`,
        visual: svgRuler(a, 1, Math.max(a, b) + 1) + svgRuler(b, 1, Math.max(a, b) + 1) };
    } },
  { id: 'g2-lenstory', t: 'Length word problems', b: 'MA.2.M.1.3', gen() {
      const a = R(20, 90), d = R(4, 15);
      if (Math.random() < 0.5) return { q: `Jeff's rope is ${a} inches. Larry's is ${d} inches shorter. How long is Larry's?`,
        a: a - d, choices: opts(a - d, [a + d, d, a]),
        why: `${a} − ${d} = ${a - d} inches.` };
      return { q: `A ribbon is ${a} inches. Another is ${d} inches longer. How long are they together?`,
        a: a + (a + d), choices: opts(a + (a + d), [a + d, a * 2, a + d + 1]),
        why: `The second is ${a} + ${d} = ${a + d}. Together ${a} + ${a + d} = ${a + a + d} inches.` };
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
      const rows = svgPictograph(cats, pics, scale, '📕');
      const i = R(0, cats.length - 1);
      if (Math.random() < 0.5) return { q: `Each 📕 stands for ${scale} books. How many books on ${cats[i]}?`, a: pics[i] * scale, choices: opts(pics[i] * scale, [pics[i], pics[i] * scale + scale, pics[i] + scale]), why: `${pics[i]} pictures × ${scale} = ${pics[i] * scale}.`, visual: rows };
      const tot = pics.reduce((x, y) => x + y, 0) * scale;
      return { q: `Each 📕 stands for ${scale} books. How many books in all?`, a: tot, choices: opts(tot, [tot + scale, tot - scale, pics.reduce((x, y) => x + y, 0)]), why: `Add the pictures, then multiply by ${scale}: ${tot}.`, visual: rows };
    } },
  { id: 'g3-place4', t: 'Place value to 10,000', b: 'MA.3.NSO.1.1', gen() {
      const n = R(1005, 9989), d = String(n);
      const names = ['thousands', 'hundreds', 'tens', 'ones'], vals = [1000, 100, 10, 1];
      const i = R(0, 3), digit = Number(d[i]), val = digit * vals[i];
      if (Math.random() < 0.5) return { q: `In ${commas(n)}, what is the value of the digit ${digit}?`, a: val,
        choices: opts(val, [digit, digit * vals[(i + 1) % 4], val * 10]),
        why: `The ${digit} sits in the ${names[i]} place, so it is worth ${commas(val)}.` };
      const exp = d.split('').map((c, k) => Number(c) * vals[k]).filter(v => v > 0).map(commas).join(' + ');
      return { q: `Which number is ${exp}?`, a: commas(n), choices: opts(commas(n), [commas(n + 100), commas(n - 10), commas(Number(d.split('').reverse().join('')))]),
        why: `${exp} adds up to ${commas(n)}.` };
    } },
  { id: 'g3-compose4', t: 'Building four-digit numbers', b: 'MA.3.NSO.1.2', gen() {
      const th = R(1, 9), hu = R(0, 9), te = R(0, 9), on = R(0, 9), n = th * 1000 + hu * 100 + te * 10 + on;
      if (Math.random() < 0.5) return { q: `${th} thousands, ${hu} hundreds, ${te} tens and ${on} ones make what number?`, a: commas(n),
        choices: opts(commas(n), [commas(n + 1000), commas(n + 100), commas(th * 1000 + te * 100 + hu * 10 + on)]),
        why: `${commas(th * 1000)} + ${hu * 100} + ${te * 10} + ${on} = ${commas(n)}.` };
      return { q: `How many hundreds are in the number ${commas(n)}?`, a: hu,
        choices: opts(hu, [th, te, on]), why: `${commas(n)} has ${th} thousands, ${hu} hundreds, ${te} tens and ${on} ones.` };
    } },
  { id: 'g3-compare4', t: 'Comparing numbers to 10,000', b: 'MA.3.NSO.1.3', gen() {
      const a = R(1000, 9999); let b = a + pick([-1, 1]) * R(1, 900); if (b < 1000) b = a + R(1, 900);
      const big = Math.max(a, b);
      if (Math.random() < 0.5) return { q: `Which number is greater?`, sub: `${commas(a)} or ${commas(b)}`, a: commas(big),
        choices: shuffle([commas(a), commas(b)]).concat([]).slice(0, 2),
        why: `Compare place by place from the left. ${commas(big)} is greater.` };
      if (Math.random() < 0.34) {
        // FAST shows a comparison with a box and asks which values fit.
        const target = R(1200, 8800);
        const gt = Math.random() < 0.5;
        const good = gt ? target + R(10, 900) : target - R(10, 900);
        const bad = [gt ? target - R(10, 900) : target + R(10, 900), target,
                     gt ? target - R(20, 700) : target + R(20, 700)];
        return { q: `Which number could go in the box?`, sub: `☐ ${gt ? '>' : '<'} ${commas(target)}`,
          a: commas(good), choices: opts(commas(good), bad.map(commas)),
          why: `The box has to be ${gt ? 'greater' : 'less'} than ${commas(target)}. ${commas(good)} is, so it fits.` };
      }
      const set = shuffle([a, b, a + R(500, 1500)]);
      const fmt = (arr) => arr.map(commas).join(', ');
      const sorted = fmt([...set].sort((x, y) => x - y));
      // Distractors must be genuinely different orderings, not a shuffle that
      // happened to land on the sorted one.
      const cand = [fmt([...set].sort((x, y) => y - x)), fmt(set), fmt([set[1], set[0], set[2]]), fmt([set[0], set[2], set[1]])];
      const choices = [sorted];
      for (const c of cand) { if (!choices.includes(c)) choices.push(c); if (choices.length === 3) break; }
      return { q: 'Put these in order from smallest to largest.', sub: fmt(set), a: sorted,
        choices: shuffle(choices), why: `Smallest to largest: ${sorted}.` };
    } },
  { id: 'g3-factfamily', t: 'Multiplication and division families', b: 'MA.3.NSO.2.2', gen() {
      const a = R(2, 12), b = R(2, 12), p = a * b;
      if (Math.random() < 0.5) return { q: `${a} × ${b} = ?`, a: p, choices: opts(p, [p + a, p - b, a + b]),
        why: `${a} groups of ${b} is ${p}.`, visual: svgArray(a, b) };
      return { q: `${p} ÷ ${a} = ?`, a: b, choices: opts(b, [a, b + 1, p - a]),
        why: `${a} × ${b} = ${p}, so ${p} ÷ ${a} = ${b}.`, visual: svgArray(a, b) };
    } },
  { id: 'g3-breakapart', t: 'Breaking apart to multiply', b: 'MA.3.AR.1.1', gen() {
      const a = R(3, 9), tens = R(2, 8) * 10, ones = R(1, 9), b = tens + ones;
      return { q: `Use breaking apart to find ${a} × ${b}.`, sub: `${a} × ${b} = (${a} × ${tens}) + (${a} × ${ones})`,
        a: a * b, choices: opts(a * b, [a * tens, a * b + a, a * tens + ones]),
        why: `${a} × ${tens} = ${a * tens} and ${a} × ${ones} = ${a * ones}. Add them: ${a * tens} + ${a * ones} = ${a * b}.` };
    } },
  { id: 'g3-relate', t: 'Multiplication helps division', b: 'MA.3.AR.2.1', gen() {
      const a = R(2, 12), b = R(2, 12), p = a * b;
      return { q: `${p} ÷ ${a} = ?`, sub: `Think: ${a} × ? = ${p}`, a: b,
        choices: opts(b, [a, b + 1, b - 1]),
        why: `Ask what times ${a} makes ${p}. Since ${a} × ${b} = ${p}, the answer is ${b}.` };
    } },
  { id: 'g3-truefalse3', t: 'True or false equations', b: 'MA.3.AR.2.2', gen() {
      const a = R(2, 9), b = R(2, 9), p = a * b;
      const trueEq = Math.random() < 0.5;
      const right = trueEq ? p : p + pick([-2, -1, 1, 2, 3]);
      const c = R(2, 9), d = Math.max(2, Math.round(right / c));
      const eq = `${p} ÷ ${a} = ${trueEq ? b : b + 1}`;
      return { q: 'Is this equation true or false?', sub: eq, a: trueEq ? 'True' : 'False',
        choices: ['True', 'False'],
        why: trueEq ? `${p} ÷ ${a} really is ${b}, so it is true.` : `${p} ÷ ${a} = ${b}, not ${b + 1}, so it is false.` };
    } },
  { id: 'g3-unknown3', t: 'Find the missing number', b: 'MA.3.AR.2.3', gen() {
      const a = R(2, 12), b = R(2, 12), p = a * b;
      const which = pick(['left', 'right', 'div', 'expr', 'expr']);
      // FAST asks which expression finds the unknown, not only what it equals.
      if (which === 'expr') return { q: `Which expression finds the unknown number u?`, sub: `u × ${b} = ${p}`,
        a: `${p} ÷ ${b}`, choices: shuffle([`${p} ÷ ${b}`, `${p} + ${b}`, `${p} − ${b}`, `${p} × ${b}`]),
        why: `u is multiplied by ${b} to give ${p}, so you undo it by dividing: ${p} ÷ ${b} = ${a}.` };
      if (which === 'div') return { q: `${p} ÷ ? = ${b}`, a: a, choices: opts(a, [b, p, a + 1]), why: `${p} ÷ ${a} = ${b}, so the missing number is ${a}.` };
      if (which === 'left') return { q: `? × ${b} = ${p}`, a: a, choices: opts(a, [b, p, a + 2]), why: `${a} × ${b} = ${p}.` };
      return { q: `${a} × ? = ${p}`, a: b, choices: opts(b, [a, p, b + 2]), why: `${a} × ${b} = ${p}.` };
    } },
  { id: 'g3-evenodd3', t: 'Even and odd numbers', b: 'MA.3.AR.3.1', gen() {
      const n = R(11, 999);
      const last = n % 10;
      return { q: `Is ${commas(n)} even or odd?`, a: n % 2 === 0 ? 'Even' : 'Odd', choices: ['Even', 'Odd'],
        why: `Only the last digit matters. It is ${last}, so ${commas(n)} is ${n % 2 === 0 ? 'even' : 'odd'}.` };
    } },
  { id: 'g3-multiples3', t: 'Multiples', b: 'MA.3.AR.3.2', gen() {
      const k = R(2, 9);
      if (Math.random() < 0.5) {
        const m = k * R(2, 11);
        return { q: `Is ${m} a multiple of ${k}?`, a: 'Yes', choices: ['Yes', 'No'], why: `${k} × ${m / k} = ${m}, so yes.` };
      }
      let m = k * R(2, 11) + R(1, k - 1);
      return { q: `Is ${m} a multiple of ${k}?`, a: 'No', choices: ['Yes', 'No'],
        why: `${m} ÷ ${k} does not come out even, so no.` };
    } },
  { id: 'g3-unitcount', t: 'Fractions as unit fractions', b: 'MA.3.FR.1.2', gen() {
      const d = pick([2, 3, 4, 5, 6, 8]), n = R(2, d);
      if (Math.random() < 0.5) return { q: `How many <b>1/${d}</b> pieces make <b>${n}/${d}</b>?`, a: n,
        choices: opts(n, [d, d - n, n + 1]),
        why: `${n}/${d} means ${n} copies of 1/${d}.`,
        visual: (Math.random() < 0.5 ? svgPie(n, d) : svgFractionBar(n, d, `${n}/${d} = ` + new Array(n).fill(`1/${d}`).join(' + '))) };
      const sum = new Array(n).fill(`1/${d}`).join(' + ');
      return { q: `What fraction is this?`, sub: sum, a: `${n}/${d}`,
        choices: opts(`${n}/${d}`, [`${d}/${n}`, `${n}/${n}`, `${n + 1}/${d}`]),
        why: `Adding 1/${d} ${n} times gives ${n}/${d}.`, visual: svgFractionBar(n, d) };
    } },
  { id: 'g3-shaded', t: 'Naming the shaded fraction', b: 'MA.3.FR.1.1', gen() {
      const d = pick([2, 3, 4, 5, 6, 8, 10, 12]), n = R(1, d - 1);
      const circle = Math.random() < 0.5;
      return { q: 'What fraction of the shape is shaded?', a: `${n}/${d}`,
        choices: opts(`${n}/${d}`, [`${d}/${n}`, `${n}/${d - n}`, `${n + 1}/${d}`, `${d - n}/${d}`]),
        why: `The shape is cut into ${d} equal parts and ${n} ${n === 1 ? 'is' : 'are'} shaded, so ${n}/${d}.`,
        visual: circle ? svgPie(n, d) : svgFractionBar(n, d) };
    } },
  { id: 'g3-fracword', t: 'Fractions in words', b: 'MA.3.FR.1.3', gen() {
      const words = { 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths' };
      const d = pick([2, 3, 4, 5, 6, 8]), n = R(1, 7);
      const single = { 2: 'half', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 8: 'eighth' }[d];
      const w = `${n} ${n === 1 ? single : words[d]}`;
      if (Math.random() < 0.5) return { q: `Write <b>${n}/${d}</b> in words.`, a: w,
        choices: opts(w, [`${d} ${words[d]}`, `${n} ${words[Math.min(8, d + 1)] || 'ninths'}`, `${d} ${single}s`]),
        why: `The bottom number ${d} names the pieces (${words[d]}), the top number ${n} counts them.` };
      return { q: `Which fraction is <b>${w}</b>?`, a: `${n}/${d}`,
        choices: opts(`${n}/${d}`, [`${d}/${n}`, `${n}/${d + 1}`, `${n + 1}/${d}`]),
        why: `${w} means ${n} pieces, each one ${single}, so ${n}/${d}.` };
    } },
  { id: 'g3-lines', t: 'Lines, rays and angles', b: 'MA.3.GR.1.1', gen() {
      const kind = pick(['parallel', 'perpendicular', 'intersecting']);
      const name = { parallel: 'Parallel', perpendicular: 'Perpendicular', intersecting: 'Intersecting' }[kind];
      return { q: 'What kind of lines are these?', a: name, choices: shuffle(['Parallel', 'Perpendicular', 'Intersecting']),
        why: kind === 'parallel' ? 'Parallel lines stay the same distance apart and never cross.'
          : kind === 'perpendicular' ? 'Perpendicular lines cross and make a square corner, a right angle.'
          : 'These lines cross, but not at a square corner, so they are just intersecting.',
        visual: svgLines(kind) };
    } },
  { id: 'g3-quads', t: 'Naming quadrilaterals', b: 'MA.3.GR.1.2', gen() {
      const kind = pick(['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid']);
      const label = kind[0].toUpperCase() + kind.slice(1);
      const why = {
        square: 'Four equal sides and four right angles makes it a square.',
        rectangle: 'Four right angles, with opposite sides equal, makes it a rectangle.',
        rhombus: 'Four equal sides but no right angles makes it a rhombus.',
        parallelogram: 'Two pairs of parallel sides, no right angles, makes it a parallelogram.',
        trapezoid: 'Exactly one pair of parallel sides makes it a trapezoid.',
      }[kind];
      if (Math.random() < 0.5) return { q: 'What is this shape called?', a: label,
        choices: shuffle(['Square', 'Rectangle', 'Rhombus', 'Trapezoid']).includes(label)
          ? shuffle(['Square', 'Rectangle', 'Rhombus', 'Trapezoid'])
          : shuffle([label, 'Rectangle', 'Rhombus', 'Trapezoid']),
        why, visual: svgShape(kind) };
      const sides = { square: 4, rectangle: 4, rhombus: 4, parallelogram: 4, trapezoid: 4 }[kind];
      return { q: 'How many sides does this shape have?', a: sides, choices: opts(sides, [3, 5, 6]),
        why: 'A quadrilateral always has 4 sides.', visual: svgShape(kind) };
    } },
  { id: 'g3-symmetry', t: 'Lines of symmetry', b: 'MA.3.GR.1.3', gen() {
      const kind = pick(['heart', 'square', 'triangle', 'flag']);
      const correct = Math.random() < 0.5;
      return { q: 'Is the dashed line a line of symmetry?', a: correct ? 'Yes' : 'No', choices: ['Yes', 'No'],
        why: correct
          ? 'Fold along the dashed line and both halves match exactly, so it is a line of symmetry.'
          : 'Fold along the dashed line and the halves do not match, so it is not a line of symmetry.',
        visual: svgSymmetry(kind, correct) };
    } },
  { id: 'g3-areacount', t: 'Area by counting squares', b: 'MA.3.GR.2.1', gen() {
      const w = R(2, 8), h = R(2, 6);
      return { q: 'How many unit squares cover this rectangle?', a: w * h,
        choices: opts(w * h, [w + h, (w + h) * 2, w * h + w]),
        why: `There are ${h} rows of ${w} squares. ${h} × ${w} = ${w * h} square units.`, visual: svgRect(w, h, { grid: true }) };
    } },
  { id: 'g3-areaformula', t: 'Area with a formula', b: 'MA.3.GR.2.2', gen() {
      const w = R(3, 12), h = R(2, 9);
      if (Math.random() < 0.4) return {
        q: `A rectangle is tiled with unit squares. Instead of counting every tile, what should you do with the side lengths ${w} and ${h}?`,
        a: 'Multiply', choices: shuffle(['Multiply', 'Add', 'Subtract', 'Divide']),
        why: `Multiplying the side lengths gives the area in one step: ${w} × ${h} = ${w * h} square units.`,
        visual: svgRect(w, h, { grid: true }) };
      return { q: `A rectangle is ${w} units long and ${h} units wide. What is its area?`, a: w * h,
        choices: opts(w * h, [2 * (w + h), w + h, w * h + h]),
        why: `Area = length × width = ${w} × ${h} = ${w * h} square units.`, visual: svgRect(w, h, { grid: true }) };
    } },
  { id: 'g3-composite', t: 'Area of L shapes', b: 'MA.3.GR.2.4', gen() {
      const a = R(4, 8), b = R(2, 4), c = R(2, a - 1), d = R(2, 4);
      const area = a * b + c * d;
      return { q: 'What is the area of this L shape?', a: area,
        choices: opts(area, [a * b, c * d, (a + c) * (b + d)]),
        why: `Split it into two rectangles: ${a} × ${b} = ${a * b} and ${c} × ${d} = ${c * d}. Together ${a * b} + ${c * d} = ${area} square units.`,
        visual: svgLShape(a, b, c, d) };
    } },
  { id: 'g3-ruler', t: 'Measuring with a ruler', b: 'MA.3.M.1.1', gen() {
      const mode = pick(['ruler', 'ruler', 'beaker', 'temp']);
      if (mode === 'ruler') {
        const denom = pick([2, 4]);
        const maxIn = pick([6, 6, 12]);
        const eighths = R(3, maxIn * denom - 1);
        const len = eighths / denom;
        const nice = Number.isInteger(len) ? String(len)
          : `${Math.floor(len) ? Math.floor(len) + ' ' : ''}${eighths % denom}/${denom}`.trim();
        const wrong1 = `${Math.floor(len) + 1}`, wrong2 = `${Math.floor(len)}`;
        return { q: `How long is the blue bar, to the nearest ${denom === 2 ? 'half' : 'quarter'} inch?`, a: nice + ' in',
          choices: opts(nice + ' in', [wrong1 + ' in', wrong2 + ' in', `${eighths} in`]),
          why: `The bar ends at ${nice} on the ruler, so it is ${nice} inches.`, visual: svgRuler(len, denom, maxIn) };
      }
      if (mode === 'beaker') {
        const max = pick([200, 400, 800]), ml = (max / 4) * R(1, 4);
        return { q: 'How much liquid is in the beaker?', a: ml + ' mL',
          choices: opts(ml + ' mL', [(ml + max / 4) + ' mL', (ml - max / 4) + ' mL', max + ' mL']),
          why: `The liquid reaches the ${ml} mark, so there are ${ml} millilitres.`, visual: svgBeaker(ml, max) };
      }
      const lo = 0, hi = 100, t = R(1, 4) * 25;
      return { q: 'What temperature does the thermometer show?', a: t + '°',
        choices: opts(t + '°', [(t + 25) + '°', (t - 25) + '°', (t + 10) + '°']),
        why: `The red line stops at the ${t} degree mark.`, visual: svgThermometer(t, lo, hi) };
    } },
  { id: 'g3-measureword', t: 'Measurement word problems', b: 'MA.3.M.1.2', gen() {
      const kind = pick(['liters', 'grams', 'cm']);
      const each = R(2, 9), many = R(3, 9), total = each * many;
      const unit = kind === 'liters' ? 'liter bottles of water' : kind === 'grams' ? 'gram weights' : 'centimeter ribbons';
      if (Math.random() < 0.5) return { q: `${many} students each bring a ${each} ${unit.split(' ')[0]} item. How much is there altogether?`,
        a: total, choices: opts(total, [each + many, total - each, total + each]),
        why: `${many} × ${each} = ${total}.` };
      const used = R(1, total - 1);
      return { q: `There were ${total} ${kind === 'cm' ? 'centimeters' : kind} to start and ${used} got used. How much is left?`,
        a: total - used, choices: opts(total - used, [total + used, used, total]),
        why: `${total} − ${used} = ${total - used}.` };
    } },
  { id: 'g3-ampm', t: 'Time to the minute, a.m. and p.m.', b: 'MA.3.M.2.1', gen() {
      const h = R(1, 12), m = R(0, 59);
      if (Math.random() < 0.5) return { q: 'What time does this clock show?', a: clock(h, m),
        choices: opts(clock(h, m), [clock(h, (m + 5) % 60), clock((h % 12) + 1, m), clock(h, (m + 30) % 60)]),
        why: `The short hand is just past ${h} and the long hand is at ${m} minutes, so it is ${clock(h, m)}.`,
        visual: svgClock(h, m) };
      const ev = pick([
        { t: 'eating breakfast', a: 'a.m.' }, { t: 'the school day starting', a: 'a.m.' },
        { t: 'eating dinner', a: 'p.m.' }, { t: 'going to bed', a: 'p.m.' },
        { t: 'the sun coming up', a: 'a.m.' }, { t: 'watching an evening movie', a: 'p.m.' },
      ]);
      return { q: `Would ${ev.t} happen in the a.m. or the p.m.?`, a: ev.a, choices: ['a.m.', 'p.m.'],
        why: `a.m. is midnight to noon and p.m. is noon to midnight, so ${ev.t} is ${ev.a}.` };
    } },
  { id: 'g3-keygraph', t: 'Picture graphs with a key', b: 'MA.3.DP.1.1', gen() {
      const scale = pick([2, 3, 5]);
      const names = pick([
        { who: 'Ms. Devitt', what: 'favorite book', a: 'Science fiction', b: 'Comic', c: 'Fantasy', icon: '📖' },
        { who: 'Mr. Ruiz', what: 'favorite fruit', a: 'Apples', b: 'Grapes', c: 'Mangoes', icon: '🍎' },
        { who: 'Mrs. Chen', what: 'favorite pet', a: 'Cats', b: 'Dogs', c: 'Rabbits', icon: '🐾' },
      ]);
      const x = scale * R(1, 4), y = scale * R(1, 3), z = scale * R(1, 4);
      const total = x + y + z;
      const mode = pick(['rest', 'symbols', 'read']);
      if (mode === 'rest') return {
        q: `${names.who} asks all ${total} students their ${names.what}. ${x} say ${names.a} and ${y} say ${names.b}. The rest say ${names.c}. How many say ${names.c}?`,
        a: z, choices: opts(z, [total - x, total - y, x + y]),
        why: `${total} − ${x} − ${y} = ${z} students.` };
      if (mode === 'symbols') return {
        q: `On a picture graph each ${names.icon} stands for ${scale} students. How many ${names.icon} are drawn for the ${z} students who chose ${names.c}?`,
        a: z / scale, choices: opts(z / scale, [z, z * scale, z / scale + 1]),
        why: `${z} ÷ ${scale} = ${z / scale} symbols, because each one is worth ${scale}.` };
      const counts = [x / scale, y / scale, z / scale];
      const i = R(0, 2), labels = [names.a, names.b, names.c], vals = [x, y, z];
      return { q: `Each ${names.icon} stands for ${scale} students. How many chose ${labels[i]}?`,
        a: vals[i], choices: opts(vals[i], [counts[i], vals[i] + scale, vals[i] - scale]),
        why: `${counts[i]} symbols × ${scale} = ${vals[i]} students.`,
        visual: svgPictograph(labels, counts, scale, names.icon) };
    } },
  { id: 'g3-makegraph', t: 'Reading bar graphs', b: 'MA.3.DP.1.1', gen() {
      const cats = shuffle(['Cats', 'Dogs', 'Birds', 'Fish']).slice(0, 4);
      const step = pick([2, 5]);
      const vals = cats.map(() => R(1, 8) * step);
      const i = R(0, 3);
      const mode = pick(['read', 'most', 'diff', 'total']);
      const vis = svgBarGraph(cats, vals, step);
      if (mode === 'read') return { q: `How many ${cats[i]}?`, a: vals[i], choices: opts(vals[i], [vals[i] + step, vals[i] - step, vals[(i + 1) % 4]]),
        why: `The ${cats[i]} bar reaches ${vals[i]}.`, visual: vis };
      if (mode === 'most') { const mx = Math.max(...vals); return { q: 'Which one has the most?', a: cats[vals.indexOf(mx)],
        choices: shuffle([...cats]), why: `${cats[vals.indexOf(mx)]} has the tallest bar at ${mx}.`, visual: vis }; }
      if (mode === 'total') { const t = vals.reduce((x, y) => x + y, 0); return { q: 'How many altogether?', a: t,
        choices: opts(t, [t + step, t - step, Math.max(...vals)]), why: `Add every bar: ${vals.join(' + ')} = ${t}.`, visual: vis }; }
      const j = (i + 1) % 4, diff = Math.abs(vals[i] - vals[j]);
      return { q: `How many more ${vals[i] > vals[j] ? cats[i] : cats[j]} than ${vals[i] > vals[j] ? cats[j] : cats[i]}?`,
        a: diff, choices: opts(diff, [vals[i] + vals[j], diff + step, Math.max(vals[i], vals[j])]),
        why: `${Math.max(vals[i], vals[j])} − ${Math.min(vals[i], vals[j])} = ${diff}.`, visual: vis };
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
  { id: 'g4-readwrite', t: 'Reading and writing big numbers', b: 'MA.4.NSO.1.2', gen() {
      const n = R(10000, 999999);
      const d = String(n), vals = [];
      for (let i = 0; i < d.length; i++) vals.push(Number(d[i]) * Math.pow(10, d.length - 1 - i));
      const exp = vals.filter(v => v > 0).map(commas).join(' + ');
      if (Math.random() < 0.5) return { q: `What is the expanded form of ${commas(n)}?`, a: exp,
        choices: opts(exp, [vals.filter(v => v > 0).map(v => commas(v / 10)).join(' + '), vals.map(commas).join(' + '), exp.replace(/ \+ /, ' + 0 + ')]),
        why: `Each digit is worth its face value times its place: ${exp}.` };
      return { q: `Which number is ${exp}?`, a: commas(n),
        choices: opts(commas(n), [commas(n + 10000), commas(n - 1000), commas(n * 10)]),
        why: `${exp} adds up to ${commas(n)}.` };
    } },
  { id: 'g4-order6', t: 'Ordering numbers to a million', b: 'MA.4.NSO.1.3', gen() {
      const base = R(10000, 900000);
      const set = shuffle([base, base + R(50, 900), base + R(1000, 9000)]);
      const fmt = (a) => a.map(commas).join('; ');
      const sorted = fmt([...set].sort((x, y) => x - y));
      const cand = [fmt([...set].sort((x, y) => y - x)), fmt(set), fmt([set[1], set[0], set[2]])];
      const ch = [sorted];
      for (const c of cand) { if (!ch.includes(c)) ch.push(c); if (ch.length === 3) break; }
      return { q: 'Order these from least to greatest.', sub: fmt(set), a: sorted, choices: shuffle(ch),
        why: `Compare from the left, place by place. Least to greatest: ${sorted}.` };
    } },
  { id: 'g4-orderdec', t: 'Comparing decimals', b: 'MA.4.NSO.1.5', gen() {
      const a = (R(100, 999) / 100), b = (R(100, 999) / 100);
      if (Math.abs(a - b) < 0.005) return this.gen();
      const big = Math.max(a, b).toFixed(2), small = Math.min(a, b).toFixed(2);
      if (Math.random() < 0.5) return { q: 'Which decimal is greater?', sub: `${a.toFixed(2)} or ${b.toFixed(2)}`,
        a: big, choices: shuffle([a.toFixed(2), b.toFixed(2)]),
        why: `Compare whole numbers first, then tenths, then hundredths. ${big} is greater.` };
      const c = (R(100, 999) / 100);
      const set = shuffle([a, b, c]).map(v => v.toFixed(2));
      const sorted = [...set].sort((x, y) => Number(x) - Number(y)).join(', ');
      const ch = [sorted, [...set].sort((x, y) => Number(y) - Number(x)).join(', '), set.join(', ')].filter((v, i, s) => s.indexOf(v) === i);
      return { q: 'Order these decimals from least to greatest.', sub: set.join(', '), a: sorted, choices: shuffle(ch),
        why: `Line up the decimal points and compare place by place: ${sorted}.` };
    } },
  { id: 'g4-facts12', t: 'Facts up to 12', b: 'MA.4.NSO.2.1', gen() {
      const a = R(2, 12), b = R(2, 12), p = a * b;
      if (Math.random() < 0.5) return { q: `${a} × ${b} = ?`, a: p, choices: opts(p, [p + a, p - b, p + b]), why: `${a} × ${b} = ${p}.` };
      return { q: `${p} ÷ ${b} = ?`, a: a, choices: opts(a, [b, a + 1, p - b]), why: `${b} × ${a} = ${p}, so ${p} ÷ ${b} = ${a}.` };
    } },
  { id: 'g4-mult3by2', t: 'Multiplying three digits by two', b: 'MA.4.NSO.2.2', gen() {
      const a = R(102, 899), b = R(11, 49), p = a * b;
      return { q: `${a} × ${b} = ?`, a: commas(p),
        choices: opts(commas(p), [commas(p + a), commas(p - b), commas(a * (b + 1))]),
        why: `Multiply by the ones, then by the tens, then add: ${a} × ${b % 10} = ${a * (b % 10)} and ${a} × ${Math.floor(b / 10) * 10} = ${a * Math.floor(b / 10) * 10}. Together ${commas(p)}.` };
    } },
  { id: 'g4-estimate', t: 'Estimating products', b: 'MA.4.NSO.2.5', gen() {
      const a = R(21, 89) * 10 + R(1, 9), b = R(3, 9) * 10 + R(1, 9);
      const ra = Math.round(a / 100) * 100, rb = Math.round(b / 10) * 10;
      const est = ra * rb;
      return { q: `About how much is ${a} × ${b}?`, sub: 'Round each number first.', a: commas(est),
        choices: opts(commas(est), [commas(est * 10), commas(est / 10), commas(est + 1000)]),
        why: `${a} rounds to ${ra} and ${b} rounds to ${rb}. ${ra} × ${rb} = ${commas(est)}, so the answer is about that.` };
    } },
  { id: 'g4-tenthmore', t: 'One tenth and one hundredth more', b: 'MA.4.NSO.2.6', gen() {
      const n = R(100, 899) / 100, up = Math.random() < 0.5, tenth = Math.random() < 0.5;
      const step = tenth ? 0.1 : 0.01;
      const ans = (up ? n + step : n - step).toFixed(2);
      return { q: `What is one ${tenth ? 'tenth' : 'hundredth'} ${up ? 'more than' : 'less than'} ${n.toFixed(2)}?`,
        a: ans, choices: opts(ans, [(up ? n - step : n + step).toFixed(2), (n + (tenth ? 0.01 : 0.1) * (up ? 1 : -1)).toFixed(2), n.toFixed(2)]),
        why: `One ${tenth ? 'tenth is 0.1' : 'hundredth is 0.01'}, so ${n.toFixed(2)} ${up ? '+' : '−'} ${step.toFixed(2)} = ${ans}.` };
    } },
  { id: 'g4-adddec', t: 'Adding and subtracting decimals', b: 'MA.4.NSO.2.7', gen() {
      const a = R(150, 950) / 100, b = R(20, 140) / 100;
      if (Math.random() < 0.5) { const s = (a + b).toFixed(2);
        return { q: `${a.toFixed(2)} + ${b.toFixed(2)} = ?`, a: s,
          choices: opts(s, [(a + b + 0.1).toFixed(2), (a - b).toFixed(2), (a + b + 1).toFixed(2)]),
          why: `Line up the decimal points, then add: ${s}.` }; }
      const d = (a - b).toFixed(2);
      return { q: `${a.toFixed(2)} − ${b.toFixed(2)} = ?`, a: d,
        choices: opts(d, [(a + b).toFixed(2), (a - b + 0.1).toFixed(2), (a - b - 0.01).toFixed(2)]),
        why: `Line up the decimal points, then subtract: ${d}.` };
    } },
  { id: 'g4-remainder', t: 'Division with remainders in a story', b: 'MA.4.AR.1.1', gen() {
      const per = R(6, 12), groups = R(8, 30), extra = R(1, per - 1);
      const total = per * groups + extra;
      const mode = pick(['need', 'full', 'left']);
      if (mode === 'need') return { q: `${total} students are going on a trip. Each van holds ${per}. How many vans are needed so everyone goes?`,
        a: groups + 1, choices: opts(groups + 1, [groups, groups + 2, extra]),
        why: `${total} ÷ ${per} = ${groups} with ${extra} left over. Those ${extra} still need a van, so ${groups + 1} vans.` };
      if (mode === 'full') return { q: `${total} apples are packed ${per} to a box. How many boxes are completely full?`,
        a: groups, choices: opts(groups, [groups + 1, extra, per]),
        why: `${total} ÷ ${per} = ${groups} remainder ${extra}. Only ${groups} boxes are full.` };
      return { q: `${total} pencils are shared equally among ${per} children. How many are left over?`,
        a: extra, choices: opts(extra, [groups, per, 0]),
        why: `${total} ÷ ${per} = ${groups} with ${extra} left over.` };
    } },
  { id: 'g4-fracstory', t: 'Fraction word problems', b: 'MA.4.AR.1.2', gen() {
      const d = pick([3, 4, 5, 6, 8]), a = R(1, d - 1), b = R(1, d - a);
      const sum = a + b;
      return { q: `Megan ate ${a}/${d} of a pie and her brother ate ${b}/${d}. How much did they eat altogether?`,
        a: `${sum}/${d}`, choices: opts(`${sum}/${d}`, [`${sum}/${d * 2}`, `${a * b}/${d}`, `${sum + 1}/${d}`]),
        why: `Same denominator, so add the tops: ${a} + ${b} = ${sum}, giving ${sum}/${d}.`,
        visual: svgFractionBar(sum, d) };
    } },
  { id: 'g4-fractimes', t: 'A fraction of a whole number', b: 'MA.4.AR.1.3', gen() {
      const d = pick([2, 3, 4, 5, 6, 8]), whole = d * R(2, 9), n = R(1, d - 1);
      const ans = whole / d * n;
      return { q: `What is ${n}/${d} of ${whole}?`, a: ans,
        choices: opts(ans, [whole / d, whole - ans, whole * n]),
        why: `Split ${whole} into ${d} equal parts: ${whole} ÷ ${d} = ${whole / d}. Then take ${n} of them: ${whole / d} × ${n} = ${ans}.` };
    } },
  { id: 'g4-truefalse4', t: 'True or false with all four operations', b: 'MA.4.AR.2.1', gen() {
      const a = R(3, 9), b = R(3, 9), p = a * b;
      const real = Math.random() < 0.5;
      const left = `${p} ÷ ${a}`, right = real ? `${b}` : `${b + R(1, 3)}`;
      return { q: 'Is this equation true or false?', sub: `${left} = ${right}`, a: real ? 'True' : 'False',
        choices: ['True', 'False'],
        why: `${left} = ${b}. ${real ? 'Both sides match, so it is true.' : `That is not ${right}, so it is false.`}` };
    } },
  { id: 'g4-unknown4', t: 'Missing number equations', b: 'MA.4.AR.2.2', gen() {
      const a = R(3, 12), b = R(4, 20), p = a * b;
      if (Math.random() < 0.5) return { q: `${p} = ${a} × t. What is t?`, a: b, choices: opts(b, [a, p, b + 1]),
        why: `Divide both sides by ${a}: ${p} ÷ ${a} = ${b}.` };
      return { q: `n ÷ ${a} = ${b}. What is n?`, a: commas(p), choices: opts(commas(p), [commas(b - a), commas(a + b), commas(p + a)]),
        why: `Multiply back: ${a} × ${b} = ${commas(p)}.` };
    } },
  { id: 'g4-rulepattern', t: 'Patterns with a rule', b: 'MA.4.AR.3.2', gen() {
      const start = R(2, 20), step = R(3, 14);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      if (Math.random() < 0.5) return { q: `The rule is add ${step}. What comes next?`, sub: seq.join(', ') + ', ___',
        a: start + step * 4, choices: opts(start + step * 4, [start + step * 3 + 1, start + step * 5, start + step * 3 - step]),
        why: `${start + step * 3} + ${step} = ${start + step * 4}.` };
      return { q: 'What is the rule for this pattern?', sub: seq.join(', '), a: `Add ${step}`,
        choices: opts(`Add ${step}`, [`Add ${step + 1}`, `Subtract ${step}`, `Multiply by ${step}`]),
        why: `Each number is ${step} more than the one before it.` };
    } },
  { id: 'g4-lineplot', t: 'Line plots', b: 'MA.4.DP.1.1', gen() {
      const from = R(1, 4), to = from + 4;
      const vals = []; for (let i = 0; i < R(8, 13); i++) vals.push(R(from, to));
      const vis = svgLinePlot(vals, from, to, 'measurements');
      const mode = pick(['count', 'most', 'total']);
      const target = R(from, to);
      if (mode === 'count') { const n = vals.filter(v => v === target).length;
        return { q: `How many measurements were ${target}?`, a: n, choices: opts(n, [n + 1, n + 2, vals.length]),
          why: `Count the ✕ marks above ${target}: there are ${n}.`, visual: vis }; }
      if (mode === 'total') return { q: 'How many measurements were taken altogether?', a: vals.length,
        choices: opts(vals.length, [vals.length + 2, vals.length - 2, to - from + 1]),
        why: `Count every ✕ on the plot: ${vals.length}.`, visual: vis };
      let best = from, bc = -1;
      for (let v = from; v <= to; v++) { const c = vals.filter(z => z === v).length; if (c > bc) { bc = c; best = v; } }
      return { q: 'Which value came up most often?', a: best, choices: opts(best, [best + 1, best - 1, from]),
        why: `${best} has the tallest stack of ✕ marks, ${bc} of them.`, visual: vis };
    } },
  { id: 'g4-datastory', t: 'Data word problems', b: 'MA.4.DP.1.3', gen() {
      const from = 1, to = 5;
      const vals = []; for (let i = 0; i < 10; i++) vals.push(R(from, to));
      const target = R(from, to), n = vals.filter(v => v === target).length;
      return { q: `Out of the ${vals.length} measurements, what fraction were ${target}?`,
        a: `${n}/${vals.length}`, choices: opts(`${n}/${vals.length}`, [`${vals.length}/${n}`, `${n}/${to}`, `${n + 1}/${vals.length}`]),
        why: `${n} of the ${vals.length} marks are above ${target}, so ${n}/${vals.length}.`,
        visual: svgLinePlot(vals, from, to) };
    } },
  { id: 'g4-tenths100', t: 'Tenths as hundredths', b: 'MA.4.FR.1.1', gen() {
      const n = R(1, 9);
      if (Math.random() < 0.5) return { q: `Write ${n}/10 as a fraction with 100 on the bottom.`, a: `${n * 10}/100`,
        choices: opts(`${n * 10}/100`, [`${n}/100`, `${n * 100}/100`, `${n + 10}/100`]),
        why: `10 × 10 = 100, so multiply the top by 10 too: ${n}/10 = ${n * 10}/100.` };
      return { q: `${n * 10}/100 is the same as which fraction?`, a: `${n}/10`,
        choices: opts(`${n}/10`, [`${n}/100`, `${n * 10}/10`, `${n + 1}/10`]),
        why: `Divide top and bottom by 10: ${n * 10}/100 = ${n}/10.` };
    } },
  { id: 'g4-equivgen', t: 'Making equivalent fractions', b: 'MA.4.FR.1.3', gen() {
      const d = pick([2, 3, 4, 5, 6]), k = R(2, 5);
      const mode = pick(['greater', 'factor', 'effect']);
      if (mode === 'greater') {
        // fractions greater than one, which grade 3 never sees
        const n = d + R(1, d);
        return { q: `Which fraction is equal to ${n}/${d}?`, a: `${n * k}/${d * k}`,
          choices: opts(`${n * k}/${d * k}`, [`${n + k}/${d + k}`, `${n * k}/${d}`, `${n}/${d * k}`]),
          why: `${n}/${d} is greater than one. Multiply top and bottom by the same ${k}: ${n * k}/${d * k}.` };
      }
      const n = R(1, d - 1);
      if (mode === 'factor') return { q: `To turn ${n}/${d} into ${n * k}/${d * k}, what did we multiply both numbers by?`, a: k,
        choices: opts(k, [k + 1, d, n]),
        why: `${d} × ${k} = ${d * k}, and the same ${k} was used on the top.` };
      return { q: `When ${n}/${d} is rewritten as ${n * k}/${d * k}, what happens?`,
        a: 'Both numbers grow, but the amount stays the same',
        choices: shuffle(['Both numbers grow, but the amount stays the same', 'The fraction gets bigger', 'The fraction gets smaller', 'Only the bottom number changes']),
        why: `Numerator and denominator are both multiplied by ${k}, so the pieces get smaller but you have proportionally more of them. The value does not change.`,
        visual: svgFractionBar(n, d) };
    } },
  { id: 'g4-decompose', t: 'Breaking a fraction apart', b: 'MA.4.FR.2.1', gen() {
      const d = pick([4, 5, 6, 8]), n = R(2, d);
      const a = R(1, n - 1), b = n - a;
      return { q: `Which sum makes ${n}/${d}?`, a: `${a}/${d} + ${b}/${d}`,
        choices: opts(`${a}/${d} + ${b}/${d}`, [`${a}/${d} + ${b}/${d * 2}`, `${a + 1}/${d} + ${b}/${d}`, `${a}/${d} × ${b}/${d}`]),
        why: `${a} + ${b} = ${n}, and the denominator stays ${d}.`, visual: svgFractionBar(n, d) };
    } },
  { id: 'g4-tenthhundredth', t: 'Adding tenths and hundredths', b: 'MA.4.FR.2.3', gen() {
      const t = R(1, 8), h = R(1, 90);
      const sum = t * 10 + h;
      if (sum > 100) return this.gen();
      return { q: `${h}/100 + ${t}/10 = ?`, a: `${sum}/100`,
        choices: opts(`${sum}/100`, [`${h + t}/100`, `${sum}/10`, `${h + t}/110`]),
        why: `${t}/10 is the same as ${t * 10}/100. Then ${h}/100 + ${t * 10}/100 = ${sum}/100.` };
    } },
  { id: 'g4-fracmult', t: 'Multiplying a fraction by a whole number', b: 'MA.4.FR.2.4', gen() {
      const d = pick([2, 3, 4, 5, 6, 8]), n = R(1, d - 1), k = R(2, 6);
      const top = n * k;
      const whole = Math.floor(top / d), rem = top % d;
      const nice = whole === 0 ? `${top}/${d}` : rem === 0 ? `${whole}` : `${whole} ${rem}/${d}`;
      return { q: `${k} × ${n}/${d} = ?`, a: nice,
        choices: opts(nice, [`${top}/${d * k}`, `${n}/${d * k}`, `${top + 1}/${d}`]),
        why: `${k} groups of ${n}/${d} is ${top}/${d}${whole ? `, which is ${nice}` : ''}.` };
    } },
  { id: 'g4-anglemeasure', t: 'Measuring angles', b: 'MA.4.GR.1.2', gen() {
      const deg = pick([30, 45, 60, 90, 120, 135, 150, 180]);
      return { q: 'About how many degrees is this angle?', a: deg + '°',
        choices: opts(deg + '°', [(deg + 30) + '°', Math.max(10, deg - 30) + '°', (180 - deg) + '°']),
        why: `A right angle is 90° and a straight line is 180°. This opening is ${deg}°.`,
        visual: svgAngle(deg, false) };
    } },
  { id: 'g4-angleadd', t: 'Angles that add up', b: 'MA.4.GR.1.3', gen() {
      const total = pick([90, 180]), part = R(2, (total / 5) - 2) * 5;
      const rest = total - part;
      return { q: `A ${total}° angle is split into two parts. One is ${part}°. How big is the other?`,
        a: rest + '°', choices: opts(rest + '°', [(total + part) + '°', part + '°', (rest + 10) + '°']),
        why: `The parts add to the whole: ${total} − ${part} = ${rest}°.`, visual: svgAngleSplit(total, part) };
    } },
  { id: 'g4-samearea', t: 'Same area, different shape', b: 'MA.4.GR.2.2', gen() {
      const area = pick([12, 16, 18, 24, 36]);
      const pairs = [];
      for (let w = 1; w <= area; w++) if (area % w === 0) pairs.push([w, area / w]);
      const [a, b] = pick(pairs.filter(p => p[0] !== p[1] && p[0] > 1)) || pairs[1];
      const [c, d] = pick(pairs.filter(p => p[0] !== a && p[0] > 1 && p[0] !== p[1])) || pairs[2];
      const pA = 2 * (a + b), pD = 2 * (c + d);
      if (pA === pD) return this.gen();
      return { q: 'Both rectangles have the same area. Which one has the bigger perimeter?',
        a: pA > pD ? 'A' : 'B', choices: ['A', 'B'],
        why: `A is ${a} × ${b}, perimeter ${pA}. B is ${c} × ${d}, perimeter ${pD}. Same area of ${area}, but ${pA > pD ? 'A' : 'B'} goes further around.`,
        visual: svgTwoRects(a, b, c, d) };
    } },
  { id: 'g4-tools', t: 'Picking the right tool', b: 'MA.4.M.1.1', gen() {
      const q = pick([
        { t: 'how heavy a watermelon is', a: 'A scale', w: ['A ruler', 'A thermometer', 'A clock'] },
        { t: 'how long a pencil is', a: 'A ruler', w: ['A scale', 'A measuring cup', 'A thermometer'] },
        { t: 'how hot the oven is', a: 'A thermometer', w: ['A ruler', 'A scale', 'A measuring cup'] },
        { t: 'how much milk is in a jug', a: 'A measuring cup', w: ['A ruler', 'A thermometer', 'A clock'] },
        { t: 'how long a race took', a: 'A stopwatch', w: ['A ruler', 'A scale', 'A thermometer'] },
      ]);
      return { q: `Which tool would you use to measure ${q.t}?`, a: q.a, choices: shuffle([q.a, ...q.w]),
        why: `${q.a.replace('A ', 'A ')} is the tool made for measuring ${q.t}.` };
    } },
  { id: 'g4-elapsed4', t: 'Time and distance problems', b: 'MA.4.M.2.1', gen() {
      const h = R(1, 6), m = pick([0, 15, 30, 45]), add = R(20, 150);
      const start = h * 60 + m, end = start + add;
      const eh = Math.floor(end / 60) % 12 || 12, em = end % 60;
      if (Math.random() < 0.5) return { q: `A film starts at ${clock(h, m)} and runs ${add} minutes. What time does it end?`,
        a: clock(eh, em), choices: opts(clock(eh, em), [clock(eh, (em + 15) % 60), clock(eh + 1, em), clock(h, em)]),
        why: `${add} minutes is ${Math.floor(add / 60)} hour${Math.floor(add / 60) === 1 ? '' : 's'} and ${add % 60} minutes after ${clock(h, m)}, which is ${clock(eh, em)}.` };
      const legs = [R(120, 480), R(120, 480)];
      const tot = legs[0] + legs[1];
      return { q: `A family drives ${legs[0]} miles one day and ${legs[1]} the next. How far altogether?`,
        a: commas(tot), choices: opts(commas(tot), [commas(Math.abs(legs[0] - legs[1])), commas(tot + 100), commas(legs[0])]),
        why: `${legs[0]} + ${legs[1]} = ${commas(tot)} miles.` };
    } },
  { id: 'g4-money4', t: 'Money and change', b: 'MA.4.M.2.2', gen() {
      const cost = R(105, 1890), paid = Math.ceil(cost / 100) * 100 + pick([0, 100, 500]);
      const change = paid - cost;
      return { q: `Something costs ${money(cost)}. You hand over ${money(paid)}. What is the change?`,
        a: money(change), choices: opts(money(change), [money(paid + cost), money(Math.abs(change - 100)), money(change + 10)]),
        why: `${money(paid)} − ${money(cost)} = ${money(change)}.` };
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
  { id: 'g5-remainder', t: 'Multi-step problems with remainders', b: 'MA.5.AR.1.1', gen() {
      const per = R(12, 40), groups = R(6, 24), extra = R(1, per - 1);
      const total = per * groups + extra;
      if (Math.random() < 0.5) return { q: `${commas(total)} books are packed ${per} to a crate. How many crates are needed to hold them all?`,
        a: groups + 1, choices: opts(groups + 1, [groups, groups + 2, extra]),
        why: `${commas(total)} ÷ ${per} = ${groups} remainder ${extra}. The leftover ${extra} still need a crate, so ${groups + 1}.` };
      return { q: `${commas(total)} seats are set out in rows of ${per}. How many seats are in the last, unfinished row?`,
        a: extra, choices: opts(extra, [groups, per - extra, per]),
        why: `${commas(total)} ÷ ${per} leaves a remainder of ${extra}.` };
    } },
  { id: 'g5-fracstory5', t: 'Fraction and mixed number problems', b: 'MA.5.AR.1.2', gen() {
      const d = pick([2, 3, 4, 6, 8]), w1 = R(1, 3), n1 = R(1, d - 1), n2 = R(1, d - 1);
      const totalTop = (w1 * d + n1) + n2;
      const wh = Math.floor(totalTop / d), rem = totalTop % d;
      const nice = rem === 0 ? `${wh}` : `${wh} ${rem}/${d}`;
      return { q: `A recipe uses ${w1} ${n1}/${d} cups of flour and ${n2}/${d} cups of sugar. How much altogether?`,
        a: nice, choices: opts(nice, [`${wh} ${(rem + 1) % d}/${d}`, `${wh + 1} ${rem}/${d}`, `${totalTop}/${d}`]),
        why: `${w1} ${n1}/${d} is ${w1 * d + n1}/${d}. Add ${n2}/${d} to get ${totalTop}/${d}, which is ${nice}.` };
    } },
  { id: 'g5-writeexpr', t: 'Expressions in words', b: 'MA.5.AR.2.1', gen() {
      const a = R(2, 9), b = R(2, 9), c = R(2, 12);
      const expr = `${c} + (${a} × ${b})`;
      const words = `${c} plus the quantity ${a} times ${b}`;
      if (Math.random() < 0.5) return { q: `Which expression matches: <b>${words}</b>?`, a: expr,
        choices: opts(expr, [`(${c} + ${a}) × ${b}`, `${c} × (${a} + ${b})`, `${a} + (${c} × ${b})`]),
        why: `"The quantity ${a} times ${b}" is the part in brackets, and ${c} is added to it.` };
      return { q: `Say <b>${expr}</b> in words.`, a: words,
        choices: opts(words, [`${c} times ${a} plus ${b}`, `the quantity ${c} plus ${a}, times ${b}`, `${a} times the quantity ${c} plus ${b}`]),
        why: `Brackets first: ${a} × ${b} is "the quantity ${a} times ${b}", then ${c} is added.` };
    } },
  { id: 'g5-truefalse5', t: 'True or false expressions', b: 'MA.5.AR.2.3', gen() {
      const a = R(2, 8), b = R(2, 8), c = R(2, 20);
      const left = c + a * b;
      const real = Math.random() < 0.5;
      const shown = real ? left : left + pick([-2, -1, 1, 2]);
      return { q: 'Is this equation true or false?', sub: `${c} + (${a} × ${b}) = ${shown}`,
        a: real ? 'True' : 'False', choices: ['True', 'False'],
        why: `Brackets first: ${a} × ${b} = ${a * b}, then ${c} + ${a * b} = ${left}. ${real ? 'That matches, so true.' : `That is not ${shown}, so false.`}` };
    } },
  { id: 'g5-unknown5', t: 'Unknowns in bigger equations', b: 'MA.5.AR.2.4', gen() {
      const s = R(3, 12), per = R(4, 15), start = R(60, 300);
      const left = start - per * s;
      return { q: `${start} − (${per} × s) = ${left}. What is s?`, a: s,
        choices: opts(s, [per, start - left, s + 1]),
        why: `${start} − ${left} = ${start - left}, and ${start - left} ÷ ${per} = ${s}.` };
    } },
  { id: 'g5-patternexpr', t: 'Patterns as expressions', b: 'MA.5.AR.3.1', gen() {
      const start = R(2, 12), step = R(2, 9);
      const seq = [start, start + step, start + step * 2, start + step * 3];
      const expr = `${start} + ${step}x`;
      if (Math.random() < 0.5) return { q: 'Which expression describes this pattern, with x starting at 0?', sub: seq.join(', '),
        a: expr, choices: opts(expr, [`${step} + ${start}x`, `${start} × ${step}x`, `${start + step} + ${step}x`]),
        why: `It starts at ${start} and goes up by ${step} each time, so ${expr}.` };
      const x = R(4, 9);
      return { q: `The rule is ${expr}. What is the value when x = ${x}?`, a: start + step * x,
        choices: opts(start + step * x, [start * step * x, start + step + x, step * x]),
        why: `${step} × ${x} = ${step * x}, then + ${start} = ${start + step * x}.` };
    } },
  { id: 'g5-inputoutput', t: 'Input and output tables', b: 'MA.5.AR.3.2', gen() {
      const start = R(2, 10), step = R(2, 8), x = R(3, 8);
      const rows = [0, 1, 2, 3].map(i => `${i} → ${start + step * i}`).join('   ');
      return { q: `The table follows one rule. What is the output when the input is ${x}?`, sub: rows,
        a: start + step * x, choices: opts(start + step * x, [start + x, step * x, start + step * (x + 1)]),
        why: `Each output goes up by ${step}, starting at ${start}. So ${start} + ${step} × ${x} = ${start + step * x}.` };
    } },
  { id: 'g5-linegraph', t: 'Line plots and tables', b: 'MA.5.DP.1.1', gen() {
      const start = R(8, 14), drop = pick([0.5, 1, 1.5, 2.5]);
      const weeks = [0, 1, 2, 3, 4].map(i => (start - drop * i));
      const rows = weeks.map((v, i) => `week ${i}: $${v.toFixed(2)}`).join('   ');
      const k = R(1, 4);
      if (Math.random() < 0.5) return { q: `How much did she have after week ${k}?`, sub: rows,
        a: '$' + weeks[k].toFixed(2), choices: opts('$' + weeks[k].toFixed(2), ['$' + weeks[k - 1].toFixed(2), '$' + (weeks[k] + 1).toFixed(2), '$' + start.toFixed(2)]),
        why: `Read the row for week ${k}: $${weeks[k].toFixed(2)}.` };
      return { q: 'How much does she spend each week?', sub: rows, a: '$' + drop.toFixed(2),
        choices: opts('$' + drop.toFixed(2), ['$' + (drop * 2).toFixed(2), '$' + start.toFixed(2), '$' + (drop + 1).toFixed(2)]),
        why: `Each week the amount drops by the same $${drop.toFixed(2)}.` };
    } },
  { id: 'g5-sharefrac', t: 'Division written as a fraction', b: 'MA.5.FR.1.1', gen() {
      const a = R(2, 9), b = R(3, 12);
      if (a >= b) return this.gen();
      return { q: `${a} gallons of lemonade are shared equally among ${b} friends. How much does each get?`,
        a: `${a}/${b} of a gallon`, choices: opts(`${a}/${b} of a gallon`, [`${b}/${a} of a gallon`, `${a * b} gallons`, `${b - a} gallons`]),
        why: `Sharing ${a} among ${b} is the division ${a} ÷ ${b}, which is written ${a}/${b}.` };
    } },
  { id: 'g5-sizeproduct', t: 'Will it get bigger or smaller?', b: 'MA.5.FR.2.3', gen() {
      const whole = R(6, 40), d = pick([2, 3, 4, 5, 8]);
      const less = Math.random() < 0.5;
      const n = less ? R(1, d - 1) : d + R(1, d);
      return { q: `Without working it out: is ${whole} × ${n}/${d} bigger or smaller than ${whole}?`,
        a: less ? 'Smaller' : 'Bigger', choices: ['Bigger', 'Smaller'],
        why: less
          ? `${n}/${d} is less than 1, and multiplying by less than 1 always makes a number smaller.`
          : `${n}/${d} is more than 1, and multiplying by more than 1 always makes a number bigger.` };
    } },
  { id: 'g5-divunit', t: 'Dividing with unit fractions', b: 'MA.5.FR.2.4', gen() {
      const d = pick([2, 3, 4, 5, 6]), whole = R(2, 9);
      if (Math.random() < 0.5) return { q: `${whole} ÷ 1/${d} = ?`, a: whole * d,
        choices: opts(whole * d, [whole / d, whole + d, d]),
        why: `How many 1/${d} pieces fit in ${whole} wholes? Each whole holds ${d}, so ${whole} × ${d} = ${whole * d}.` };
      return { q: `1/${d} ÷ ${whole} = ?`, a: `1/${d * whole}`,
        choices: opts(`1/${d * whole}`, [`1/${d + whole}`, `${whole}/${d}`, `${d}/${whole}`]),
        why: `Splitting 1/${d} into ${whole} equal parts makes each part 1/${d * whole}.` };
    } },
  { id: 'g5-classify2d', t: 'Sorting triangles and quadrilaterals', b: 'MA.5.GR.1.1', gen() {
      const q = pick([
        { q: 'Is every square also a rectangle?', a: 'Yes', why: 'A rectangle needs four right angles. A square has them, plus equal sides, so every square is a rectangle.' },
        { q: 'Is every rectangle also a square?', a: 'No', why: 'A square needs all four sides equal. A long thin rectangle does not, so no.' },
        { q: 'Can a triangle have two right angles?', a: 'No', why: 'Two right angles already use up 180°, leaving nothing for the third angle.' },
        { q: 'Is every square also a rhombus?', a: 'Yes', why: 'A rhombus needs four equal sides. A square has them, so yes.' },
        { q: 'Does a trapezoid have two pairs of parallel sides?', a: 'No', why: 'A trapezoid has exactly one pair of parallel sides.' },
      ]);
      return { q: q.q, a: q.a, choices: ['Yes', 'No'], why: q.why };
    } },
  { id: 'g5-classify3d', t: 'Naming solid figures', b: 'MA.5.GR.1.2', gen() {
      const kind = pick(['cube', 'rectangular prism', 'sphere', 'cone', 'cylinder', 'pyramid']);
      const label = kind[0].toUpperCase() + kind.slice(1);
      const all = ['Cube', 'Rectangular prism', 'Sphere', 'Cone', 'Cylinder', 'Pyramid'];
      const why = {
        cube: 'Six identical square faces makes it a cube.',
        'rectangular prism': 'Six rectangular faces, not all the same, makes it a rectangular prism.',
        sphere: 'Perfectly round with no faces or edges makes it a sphere.',
        cone: 'One circular base rising to a single point makes it a cone.',
        cylinder: 'Two circular bases joined by a curved surface makes it a cylinder.',
        pyramid: 'A flat base with triangular faces meeting at a point makes it a pyramid.',
      }[kind];
      return { q: 'What is this solid called?', a: label,
        choices: shuffle([label, ...shuffle(all.filter(x => x !== label)).slice(0, 3)]),
        why, visual: svgSolid(kind) };
    } },
  { id: 'g5-fracarea', t: 'Area with fractional sides', b: 'MA.5.GR.2.1', gen() {
      const w = R(2, 9), h = R(2, 9);
      const wl = w + 0.5;   // always fractional: whole sides are the grade 3 benchmark
      const area = wl * h;
      return { q: `A rectangle is ${w} 1/2 units long and ${h} units wide. What is its area?`,
        a: Number.isInteger(area) ? String(area) : `${Math.floor(area)} 1/2`,
        choices: opts(Number.isInteger(area) ? String(area) : `${Math.floor(area)} 1/2`,
          [String(w * h), String(2 * (w + h)), String(Math.ceil(area))]),
        why: `Area = length × width = ${wl} × ${h} = ${area}.` };
    } },
  { id: 'g5-countcubes', t: 'Volume by counting cubes', b: 'MA.5.GR.3.1', gen() {
      const l = R(2, 5), w = R(2, 4), h = R(2, 4);
      return { q: 'How many unit cubes build this box?', a: l * w * h,
        choices: opts(l * w * h, [l + w + h, l * w, 2 * (l * w + w * h + l * h)]),
        why: `One layer is ${l} × ${w} = ${l * w} cubes, and there are ${h} layers: ${l * w} × ${h} = ${l * w * h}.`,
        visual: svgCubes(l, w, h) };
    } },
  { id: 'g5-volstory', t: 'Volume word problems', b: 'MA.5.GR.3.3', gen() {
      const l = R(3, 12), w = R(2, 9), h = R(2, 8);
      const v = l * w * h;
      if (Math.random() < 0.5) return { q: `A box is ${l} by ${w} by ${h} units. What is its volume?`,
        a: commas(v), choices: opts(commas(v), [commas(l * w), commas(l + w + h), commas(v * 2)]),
        why: `Volume = length × width × height = ${l} × ${w} × ${h} = ${commas(v)} cubic units.` };
      return { q: `A box holds ${commas(v)} cubic units. Its base is ${l} by ${w}. How tall is it?`,
        a: h, choices: opts(h, [l, w, h + 1]),
        why: `The base covers ${l} × ${w} = ${l * w}. Then ${commas(v)} ÷ ${l * w} = ${h}.` };
    } },
  { id: 'g5-plotpoints', t: 'Plotting points in a story', b: 'MA.5.GR.4.2', gen() {
      const x1 = R(1, 4), y1 = R(1, 4), x2 = R(5, 9), y2 = R(5, 9);
      const pts = [{ x: x1, y: y1, label: 'A', color: '#C6274B' }, { x: x2, y: y2, label: 'B', color: '#12885A' }];
      const mode = pick(['read', 'right', 'up']);
      if (mode === 'read') return { q: 'What are the coordinates of point B?', a: `(${x2}, ${y2})`,
        choices: opts(`(${x2}, ${y2})`, [`(${y2}, ${x2})`, `(${x2}, ${y2 + 1})`, `(${x1}, ${y1})`]),
        why: `Go across to ${x2} first, then up to ${y2}, so (${x2}, ${y2}).`, visual: svgCoord2(pts) };
      if (mode === 'right') return { q: 'How far to the right is B from A?', a: x2 - x1,
        choices: opts(x2 - x1, [y2 - y1, x2 + x1, x2]),
        why: `${x2} − ${x1} = ${x2 - x1} steps across.`, visual: svgCoord2(pts) };
      return { q: 'How far up is B from A?', a: y2 - y1, choices: opts(y2 - y1, [x2 - x1, y2 + y1, y2]),
        why: `${y2} − ${y1} = ${y2 - y1} steps up.`, visual: svgCoord2(pts) };
    } },
  { id: 'g5-convert', t: 'Multi-step unit conversion', b: 'MA.5.M.1.1', gen() {
      // Grade 4 already does single-step conversion. The grade 5 benchmark
      // chains them, so every question here crosses at least two units.
      const c = pick([
        { q: 'How many minutes are in {n} days?', k: 24 * 60, unit: 'minutes', steps: '24 hours in a day and 60 minutes in an hour, so 24 × 60 = 1,440 minutes a day' },
        { q: 'How many seconds are in {n} hours?', k: 3600, unit: 'seconds', steps: '60 minutes in an hour and 60 seconds in a minute, so 60 × 60 = 3,600 seconds an hour' },
        { q: 'How many inches are in {n} yards?', k: 36, unit: 'inches', steps: '3 feet in a yard and 12 inches in a foot, so 3 × 12 = 36 inches a yard' },
        { q: 'How many hours are in {n} weeks?', k: 7 * 24, unit: 'hours', steps: '7 days in a week and 24 hours in a day, so 7 × 24 = 168 hours a week' },
        { q: 'How many milliliters are in {n} liters, given 1,000 mL in a liter?', k: 1000, unit: 'milliliters', steps: '1,000 millilitres in every litre' },
        { q: 'How many centimeters are in {n} meters?', k: 100, unit: 'centimeters', steps: '100 centimetres in every metre' },
      ]);
      const n = R(2, 9);
      const a = n * c.k;
      return { q: c.q.replace('{n}', String(n)), a: commas(a),
        choices: opts(commas(a), [commas(a * 10), commas(Math.round(a / 10)), commas(n * (c.k / 10))]),
        why: `There are ${c.steps}. Then ${n} × ${commas(c.k)} = ${commas(a)} ${c.unit}.` };
    } },
  { id: 'g5-money5', t: 'Multi-step money problems', b: 'MA.5.M.2.1', gen() {
      const unit = R(120, 480), many = R(3, 8);
      const bundlePrice = Math.round(unit * many * (0.8 + Math.random() * 0.15));
      const separate = unit * many;
      const cheaper = bundlePrice < separate;
      const save = Math.abs(separate - bundlePrice);
      return { q: `One bottle costs ${money(unit)}. A pack of ${many} costs ${money(bundlePrice)}. How much do you save buying the pack?`,
        a: money(save), choices: opts(money(save), [money(separate), money(bundlePrice), money(save + 100)]),
        why: `${many} separate bottles cost ${money(separate)}. The pack costs ${money(bundlePrice)}. The difference is ${money(save)}.` };
    } },
  { id: 'g5-decwrite', t: 'Reading and writing decimals', b: 'MA.5.NSO.1.2', gen() {
      const w = R(1, 99), h = R(1, 99);
      const n = Number(`${w}.${String(h).padStart(2, '0')}`);
      const words = `${w} and ${h} hundredths`;
      if (Math.random() < 0.5) return { q: `Write <b>${words}</b> as a decimal.`, a: n.toFixed(2),
        choices: opts(n.toFixed(2), [`${w}.${h}0`, `${w}.00${h}`, (n + 0.1).toFixed(2)]),
        why: `${w} whole and ${h} hundredths is ${n.toFixed(2)}.` };
      return { q: `How do you say <b>${n.toFixed(2)}</b>?`, a: words,
        choices: opts(words, [`${w} and ${h} tenths`, `${w} and ${h} thousandths`, `${w} point ${h} whole`]),
        why: `Two digits after the point means hundredths, so ${words}.` };
    } },
  { id: 'g5-deccompose', t: 'Building decimals', b: 'MA.5.NSO.1.3', gen() {
      const t = R(1, 9), o = R(0, 9), tn = R(0, 9), hu = R(0, 9), th = R(1, 9);
      const n = t * 10 + o + tn / 10 + hu / 100 + th / 1000;
      const parts = [];
      if (t) parts.push(`${t} tens`);
      if (o) parts.push(`${o} ones`);
      if (tn) parts.push(`${tn} tenths`);
      if (hu) parts.push(`${hu} hundredths`);
      if (th) parts.push(`${th} thousandths`);
      const s = n.toFixed(3);
      return { q: `Which number is ${parts.join(' + ')}?`, a: s,
        choices: opts(s, [(n + 0.1).toFixed(3), (n * 10).toFixed(3), (n / 10).toFixed(3)]),
        why: `Tens are ${t * 10}, ones ${o}, tenths ${tn}/10, hundredths ${hu}/100, thousandths ${th}/1000. Together ${s}.` };
    } },
  { id: 'g5-decorder', t: 'Ordering decimals to thousandths', b: 'MA.5.NSO.1.4', gen() {
      const base = R(1, 9);
      const set = shuffle([
        Number((base + R(100, 999) / 1000).toFixed(3)),
        Number((base + R(100, 999) / 1000).toFixed(3)),
        Number((base + R(100, 999) / 1000).toFixed(3)),
      ]);
      if (new Set(set).size < 3) return this.gen();
      const fmt = (a) => a.map(v => v.toFixed(3)).join('; ');
      const sorted = fmt([...set].sort((x, y) => x - y));
      const ch = [sorted, fmt([...set].sort((x, y) => y - x)), fmt(set)].filter((v, i, s) => s.indexOf(v) === i);
      return { q: 'Order these from least to greatest.', sub: fmt(set), a: sorted, choices: shuffle(ch),
        why: `Compare tenths first, then hundredths, then thousandths: ${sorted}.` };
    } },
  { id: 'g5-estdec', t: 'Estimating with decimals', b: 'MA.5.NSO.2.4', gen() {
      const a = R(150, 900) / 10, b = R(15, 90) / 10;
      const ra = Math.round(a), rb = Math.round(b);
      const est = ra * rb;
      return { q: `About how much is ${a.toFixed(1)} × ${b.toFixed(1)}?`, sub: 'Round each to a whole number first.',
        a: commas(est), choices: opts(commas(est), [commas(est * 10), commas(Math.round(est / 10)), commas(est + 50)]),
        why: `${a.toFixed(1)} rounds to ${ra} and ${b.toFixed(1)} rounds to ${rb}. ${ra} × ${rb} = ${commas(est)}.` };
    } },
  { id: 'g5-divbydec', t: 'Multiplying and dividing by 0.1 and 0.01', b: 'MA.5.NSO.2.5', gen() {
      const n = R(11, 999) / 10;
      const by = pick([0.1, 0.01]);
      const div = Math.random() < 0.5;
      const ans = div ? n / by : n * by;
      const s = Number(ans.toFixed(4)).toString();
      return { q: `${n} ${div ? '÷' : '×'} ${by} = ?`, a: s,
        choices: opts(s, [Number((div ? n * by : n / by).toFixed(4)).toString(), String(n), Number((ans * 10).toFixed(4)).toString()]),
        why: div
          ? `Dividing by ${by} makes a number ${by === 0.1 ? '10' : '100'} times bigger, so the digits shift ${by === 0.1 ? 'one place' : 'two places'} left: ${s}.`
          : `Multiplying by ${by} makes a number ${by === 0.1 ? '10' : '100'} times smaller, so the digits shift ${by === 0.1 ? 'one place' : 'two places'} right: ${s}.` };
    } },
];

const GRADES = { 1: G1, 2: G2, 3: G3, 4: G4, 5: G5 };

/* ---------------------------------------------------- pictures for kids
   Small inline SVGs. A child should be able to see why an answer works,
   not just read it. Function declarations hoist, so generators above can
   call these.                                                            */


/* Labels inside an SVG shrink with the drawing. On a narrow phone a wide
   drawing can land near half scale, which took ruler numerals down to under
   5px. sf() sizes text from the drawing's own coordinate width so it still
   renders near the target pixel size on the narrowest phone we support. */
const PHONE_W = 258;
function sf(vbw, targetPx) {
  return Math.max(targetPx, Math.round(targetPx * vbw / PHONE_W));
}

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
    ticks += `<text x="${lx}" y="${ly}" font-size="${sf(120, 11)}" font-weight="700" fill="#5A6683" text-anchor="middle">${i === 0 ? 12 : i}</text>`;
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
    out += `<text x="${x}" y="66" font-size="${sf(w, 11)}" fill="#5A6683" text-anchor="middle">${Math.round(v * 100) / 100}</text>`;
  }
  (marks || []).forEach((mk) => {
    const x = X(mk.v);
    const col = mk.color || '#2563EB';
    out += `<circle cx="${x}" cy="42" r="7" fill="${col}"/>`;
    if (mk.label) out += `<text x="${x}" y="22" font-size="${sf(w, 12)}" font-weight="800" fill="${col}" text-anchor="middle">${mk.label}</text>`;
  });
  return svgWrap(out, w, h);
}

function svgFractionBar(n, d, label) {
  const w = 300, h = label ? 60 : 44, bw = w - 8, cell = bw / d;
  let out = '';
  for (let i = 0; i < d; i++) {
    // Filled cells get a white divider, otherwise blue-on-blue hides the
    // boundaries and the child cannot count the pieces.
    out += `<rect x="${4 + i * cell}" y="6" width="${cell}" height="32" fill="${i < n ? '#2563EB' : '#EEF3FF'}" stroke="${i < n ? '#FFFFFF' : '#2563EB'}" stroke-width="2"/>`;
  }
  out += `<rect x="4" y="6" width="${bw}" height="32" fill="none" stroke="#2563EB" stroke-width="2.5"/>`;
  if (label) out += `<text x="${w / 2}" y="55" font-size="${sf(w, 13)}" font-weight="800" fill="#2563EB" text-anchor="middle">${label}</text>`;
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
  out += `<text x="${30 + wUnits * s / 2}" y="${8 + hUnits * s + 22}" font-size="${sf(w, 13)}" font-weight="800" fill="#17203A" text-anchor="middle">${wUnits}</text>`;
  out += `<text x="20" y="${8 + hUnits * s / 2 + 5}" font-size="${sf(w, 13)}" font-weight="800" fill="#17203A" text-anchor="middle">${hUnits}</text>`;
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
  out += `<text x="${X(px) + 10}" y="${Y(py) - 8}" font-size="${sf(w, 12)}" font-weight="800" fill="#C6274B">(${px}, ${py})</text>`;
  return svgWrap(out, w, h);
}


/* A ruler marked in whole, half or quarter inches, with a bar to measure
   against it. MA.3.M.1.1 expects a child to read a real tool, not a number. */
function svgRuler(lengthIn, denom, maxIn) {
  const total = maxIn || 6, s = 46, pad = 16;
  const w = total * s + pad * 2, h = 96;
  let out = `<rect x="${pad}" y="40" width="${total * s}" height="42" fill="#FFF7E6" stroke="#A9803A" stroke-width="2" rx="4"/>`;
  for (let i = 0; i <= total * denom; i++) {
    const x = pad + (i / denom) * s;
    const whole = i % denom === 0;
    const half = denom === 4 && i % 2 === 0;
    const len = whole ? 20 : half ? 13 : 8;
    out += `<line x1="${x}" y1="40" x2="${x}" y2="${40 + len}" stroke="#A9803A" stroke-width="${whole ? 2.2 : 1.4}"/>`;
    if (whole) out += `<text x="${x}" y="76" font-size="${sf(w, 12)}" font-weight="800" fill="#A9803A" text-anchor="middle">${i / denom}</text>`;
  }
  out += `<rect x="${pad}" y="14" width="${lengthIn * s}" height="18" fill="#2563EB" rx="4"/>`;
  out += `<text x="${pad + total * s / 2}" y="93" font-size="${sf(w, 11)}" fill="#5A6683" text-anchor="middle">inches</text>`;
  // A 12-inch ruler squeezed into 340px makes the numbers unreadable, so let
  // the longer ruler use the full column width.
  return svgWrap(out, w, h, total > 8 ? 480 : 340);
}

/* Liquid volume in a beaker, MA.3.M.1.1. */
function svgBeaker(ml, max) {
  const w = 120, h = 150, bx = 30, bw = 60, by = 14, bh = 112;
  const fill = Math.max(0, Math.min(1, ml / max));
  let out = `<rect x="${bx}" y="${by + bh * (1 - fill)}" width="${bw}" height="${bh * fill}" fill="#7DD3FC"/>`;
  out += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="none" stroke="#17203A" stroke-width="3" rx="3"/>`;
  for (let i = 0; i <= 4; i++) {
    const y = by + bh - (i / 4) * bh;
    out += `<line x1="${bx}" y1="${y}" x2="${bx + 14}" y2="${y}" stroke="#17203A" stroke-width="2"/>`;
    out += `<text x="${bx + bw + 6}" y="${y + 4}" font-size="${sf(w, 11)}" font-weight="700" fill="#5A6683">${(max / 4) * i}</text>`;
  }
  out += `<text x="${w / 2}" y="146" font-size="${sf(w, 11)}" fill="#5A6683" text-anchor="middle">milliliters</text>`;
  return svgWrap(out, w, h, 150);
}

/* Thermometer, MA.3.M.1.1. */
function svgThermometer(temp, lo, hi) {
  const w = 110, h = 168, x = 34, top = 12, len = 118;
  const f = Math.max(0, Math.min(1, (temp - lo) / (hi - lo)));
  let out = `<rect x="${x}" y="${top}" width="16" height="${len}" fill="#EEF3FF" stroke="#17203A" stroke-width="2.5" rx="8"/>`;
  out += `<rect x="${x + 3}" y="${top + len * (1 - f)}" width="10" height="${len * f}" fill="#C6274B"/>`;
  out += `<circle cx="${x + 8}" cy="${top + len + 12}" r="13" fill="#C6274B" stroke="#17203A" stroke-width="2.5"/>`;
  for (let i = 0; i <= 4; i++) {
    const y = top + len - (i / 4) * len;
    out += `<line x1="${x + 16}" y1="${y}" x2="${x + 26}" y2="${y}" stroke="#17203A" stroke-width="2"/>`;
    out += `<text x="${x + 30}" y="${y + 4}" font-size="${sf(w, 11)}" font-weight="700" fill="#5A6683">${Math.round(lo + (hi - lo) * i / 4)}°</text>`;
  }
  return svgWrap(out, w, h, 130);
}

/* Scaled pictograph. The key is the whole point, so the row totals are NOT
   printed: the child reads the symbols and multiplies by the key. */
function svgPictograph(cats, counts, scale, icon) {
  const rowH = 30, labelW = 96, s = 24;
  const w = labelW + Math.max(...counts) * s + 30, h = cats.length * rowH + 44;
  let out = '';
  cats.forEach((c, i) => {
    const y = i * rowH + 18;
    out += `<text x="0" y="${y + 6}" font-size="${sf(w, 13)}" font-weight="800" fill="#17203A">${c}</text>`;
    for (let k = 0; k < counts[i]; k++) out += `<text x="${labelW + k * s}" y="${y + 8}" font-size="${sf(w, 17)}">${icon}</text>`;
  });
  out += `<line x1="0" y1="${cats.length * rowH + 8}" x2="${w}" y2="${cats.length * rowH + 8}" stroke="#DDE4F5" stroke-width="2"/>`;
  out += `<text x="0" y="${cats.length * rowH + 30}" font-size="${sf(w, 13)}" font-weight="800" fill="#2563EB">Key: ${icon} = ${scale}</text>`;
  return svgWrap(out, w, h, 340);
}

/* Scaled bar graph with a labelled axis. */
function svgBarGraph(cats, vals, step) {
  const bw = 42, gap = 20, left = 40, top = 12, plot = 130;
  const maxV = Math.ceil(Math.max(...vals) / step) * step || step;
  const w = left + cats.length * (bw + gap) + 14, h = plot + 54;
  let out = '';
  for (let v = 0; v <= maxV; v += step) {
    const y = top + plot - (v / maxV) * plot;
    out += `<line x1="${left - 6}" y1="${y}" x2="${w - 8}" y2="${y}" stroke="#E7EDFB" stroke-width="1.5"/>`;
    out += `<text x="${left - 10}" y="${y + 4}" font-size="${sf(w, 11)}" font-weight="700" fill="#5A6683" text-anchor="end">${v}</text>`;
  }
  cats.forEach((c, i) => {
    const x = left + i * (bw + gap) + gap / 2;
    const bh = (vals[i] / maxV) * plot;
    out += `<rect x="${x}" y="${top + plot - bh}" width="${bw}" height="${bh}" fill="#2563EB" rx="3"/>`;
    out += `<text x="${x + bw / 2}" y="${top + plot + 18}" font-size="${sf(w, 12)}" font-weight="700" fill="#17203A" text-anchor="middle">${c}</text>`;
  });
  out += `<line x1="${left - 6}" y1="${top + plot}" x2="${w - 8}" y2="${top + plot}" stroke="#17203A" stroke-width="2.5"/>`;
  return svgWrap(out, w, h, 340);
}

/* Line plot: an X stack over each value, MA.3.DP.1.1 and up. */
function svgLinePlot(values, from, to, label) {
  const w = 320, pad = 26, base = 108, s = (w - pad * 2) / (to - from);
  let out = `<line x1="${pad - 6}" y1="${base}" x2="${w - pad + 6}" y2="${base}" stroke="#17203A" stroke-width="2.5"/>`;
  for (let v = from; v <= to; v++) {
    const x = pad + (v - from) * s;
    out += `<line x1="${x}" y1="${base}" x2="${x}" y2="${base + 6}" stroke="#17203A" stroke-width="2"/>`;
    out += `<text x="${x}" y="${base + 22}" font-size="${sf(w, 11)}" font-weight="700" fill="#5A6683" text-anchor="middle">${v}</text>`;
    const n = values.filter((z) => z === v).length;
    for (let k = 0; k < n; k++) out += `<text x="${x}" y="${base - 6 - k * 15}" font-size="${sf(w, 13)}" font-weight="800" fill="#2563EB" text-anchor="middle">✕</text>`;
  }
  if (label) out += `<text x="${w / 2}" y="${base + 40}" font-size="${sf(w, 11)}" fill="#5A6683" text-anchor="middle">${label}</text>`;
  return svgWrap(out, w, base + 48, 340);
}

/* Parallel, perpendicular and intersecting lines, MA.3.GR.1.1. */
function svgLines(kind) {
  const w = 200, h = 120;
  let out = '';
  const L = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>`;
  if (kind === 'parallel') out = L(20, 38, 180, 38) + L(20, 82, 180, 82);
  else if (kind === 'perpendicular') out = L(20, 60, 180, 60) + L(100, 14, 100, 106) +
    `<rect x="100" y="46" width="14" height="14" fill="none" stroke="#C6274B" stroke-width="2.5"/>`;
  else out = L(20, 24, 180, 96) + L(20, 96, 180, 24);
  return svgWrap(out, w, h, 220);
}

/* Named quadrilaterals and other polygons, MA.3.GR.1.2. */
function svgShape(kind) {
  const w = 190, h = 130;
  const poly = (pts) => `<polygon points="${pts}" fill="#EEF3FF" stroke="#2563EB" stroke-width="3.5" stroke-linejoin="round"/>`;
  const S = {
    square: poly('55,20 145,20 145,110 55,110'),
    rectangle: poly('25,32 165,32 165,98 25,98'),
    rhombus: poly('95,16 168,65 95,114 22,65'),
    parallelogram: poly('45,30 175,30 145,100 15,100'),
    trapezoid: poly('60,30 130,30 168,100 22,100'),
    triangle: poly('95,20 168,108 22,108'),
    pentagon: poly('95,16 165,66 138,114 52,114 25,66'),
    hexagon: poly('62,20 128,20 162,65 128,110 62,110 28,65'),
  };
  return svgWrap(S[kind] || S.square, w, h, 200);
}

/* A figure with a candidate line of symmetry drawn on it, MA.3.GR.1.3. */
function svgSymmetry(kind, correct) {
  const w = 190, h = 130;
  const poly = (pts) => `<polygon points="${pts}" fill="#EEF3FF" stroke="#2563EB" stroke-width="3.5" stroke-linejoin="round"/>`;
  const F = {
    heart: `<path d="M95 112 C 30 70, 40 22, 95 44 C 150 22, 160 70, 95 112 Z" fill="#EEF3FF" stroke="#2563EB" stroke-width="3.5"/>`,
    square: poly('55,20 145,20 145,110 55,110'),
    triangle: poly('95,20 168,108 22,108'),
    flag: poly('40,25 150,25 150,70 40,70'),
  };
  const line = correct
    ? `<line x1="95" y1="8" x2="95" y2="122" stroke="#C6274B" stroke-width="3" stroke-dasharray="7 5"/>`
    : `<line x1="18" y1="34" x2="172" y2="104" stroke="#C6274B" stroke-width="3" stroke-dasharray="7 5"/>`;
  return svgWrap((F[kind] || F.square) + line, w, h, 200);
}

/* An L shape built from two rectangles, MA.3.GR.2.4. */
function svgLShape(a, b, c, d) {
  const s = 20, pad = 14;
  const w = a * s + pad * 2 + 30, h = (b + d) * s + pad * 2 + 20;
  const x0 = pad + 14, y0 = pad;
  let out = `<path d="M${x0} ${y0} h${a * s} v${b * s} h${-(a - c) * s} v${d * s} h${-c * s} Z" fill="#EEF3FF" stroke="#2563EB" stroke-width="3" stroke-linejoin="round"/>`;
  for (let i = 1; i < a; i++) out += `<line x1="${x0 + i * s}" y1="${y0}" x2="${x0 + i * s}" y2="${y0 + (i < c ? (b + d) : b) * s}" stroke="#B9CBF7" stroke-width="1"/>`;
  for (let j = 1; j < b + d; j++) {
    const wid = j < b ? a : c;
    out += `<line x1="${x0}" y1="${y0 + j * s}" x2="${x0 + wid * s}" y2="${y0 + j * s}" stroke="#B9CBF7" stroke-width="1"/>`;
  }
  return svgWrap(out, w, h, 250);
}


/* A circle cut into equal sectors with some shaded. FAST items present
   fractions on a circle at least as often as on a bar. */
function svgPie(n, d) {
  const cx = 78, cy = 78, r = 68;
  let out = '';
  for (let i = 0; i < d; i++) {
    const a0 = (i / d) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + Math.cos(a0) * r, y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r, y1 = cy + Math.sin(a1) * r;
    const big = (a1 - a0) > Math.PI ? 1 : 0;
    const path = d === 1
      ? `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`
      : `M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${big} 1 ${x1} ${y1} Z`;
    out += `<path d="${path}" fill="${i < n ? '#2563EB' : '#FFFFFF'}" stroke="#17203A" stroke-width="2"/>`;
  }
  out += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#17203A" stroke-width="2.5"/>`;
  return svgWrap(out, 156, 156, 190);
}


/* An angle drawn open to a given measure, with the arms labelled.
   MA.4.GR.1.1-1.3 expect a child to see the opening, not just read a number. */
function svgAngle(deg, showArc) {
  const cx = 34, cy = 120, len = 130;
  const a = -deg * Math.PI / 180;
  const x2 = cx + Math.cos(a) * len, y2 = cy + Math.sin(a) * len;
  let out = `<line x1="${cx}" y1="${cy}" x2="${cx + len}" y2="${cy}" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>`;
  out += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>`;
  const r = 34;
  const ax = cx + Math.cos(a) * r, ay = cy + Math.sin(a) * r;
  out += `<path d="M${cx + r} ${cy} A${r} ${r} 0 ${deg > 180 ? 1 : 0} 0 ${ax} ${ay}" fill="none" stroke="#C6274B" stroke-width="2.5"/>`;
  if (showArc) out += `<text x="${cx + 44}" y="${cy - 16}" font-size="${sf(180, 14)}" font-weight="800" fill="#C6274B">${deg}°</text>`;
  out += `<circle cx="${cx}" cy="${cy}" r="4" fill="#17203A"/>`;
  return svgWrap(out, 180, 140, 240);
}

/* Two angles meeting at a point, one known and one unknown. MA.4.GR.1.3. */
function svgAngleSplit(total, part) {
  const cx = 34, cy = 120, len = 128;
  const A = (d) => { const a = -d * Math.PI / 180; return [cx + Math.cos(a) * len, cy + Math.sin(a) * len]; };
  const [x1, y1] = A(0), [x2, y2] = A(part), [x3, y3] = A(total);
  let out = '';
  [[x1, y1], [x2, y2], [x3, y3]].forEach(([x, y]) => {
    out += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>`;
  });
  const lab = (d, txt, col) => {
    const a = -d * Math.PI / 180;
    return `<text x="${cx + Math.cos(a) * 62}" y="${cy + Math.sin(a) * 62 + 4}" font-size="${sf(180, 14)}" font-weight="800" fill="${col}" text-anchor="middle">${txt}</text>`;
  };
  out += lab(part / 2, part + '°', '#C6274B') + lab((part + total) / 2, '?', '#12885A');
  out += `<circle cx="${cx}" cy="${cy}" r="4" fill="#17203A"/>`;
  return svgWrap(out, 180, 140, 240);
}

/* Named 3D solids, MA.1.GR.1.4 and MA.5.GR.1.2. */
function svgSolid(kind) {
  const S = {
    cube: `<polygon points="40,50 110,50 110,120 40,120" fill="#EEF3FF" stroke="#2563EB" stroke-width="3"/>
           <polygon points="40,50 65,26 135,26 110,50" fill="#DCE7FF" stroke="#2563EB" stroke-width="3"/>
           <polygon points="110,50 135,26 135,96 110,120" fill="#CBD9FA" stroke="#2563EB" stroke-width="3"/>`,
    'rectangular prism': `<polygon points="26,58 116,58 116,112 26,112" fill="#EEF3FF" stroke="#2563EB" stroke-width="3"/>
           <polygon points="26,58 52,34 142,34 116,58" fill="#DCE7FF" stroke="#2563EB" stroke-width="3"/>
           <polygon points="116,58 142,34 142,88 116,112" fill="#CBD9FA" stroke="#2563EB" stroke-width="3"/>`,
    sphere: `<circle cx="86" cy="76" r="52" fill="#DCE7FF" stroke="#2563EB" stroke-width="3"/>
           <ellipse cx="86" cy="76" rx="52" ry="17" fill="none" stroke="#2563EB" stroke-width="2" opacity=".6"/>`,
    cone: `<path d="M86 22 L134 112 A48 16 0 0 1 38 112 Z" fill="#EEF3FF" stroke="#2563EB" stroke-width="3"/>
           <ellipse cx="86" cy="112" rx="48" ry="16" fill="#DCE7FF" stroke="#2563EB" stroke-width="3"/>`,
    cylinder: `<path d="M42 44 v64 a44 15 0 0 0 88 0 v-64" fill="#EEF3FF" stroke="#2563EB" stroke-width="3"/>
           <ellipse cx="86" cy="44" rx="44" ry="15" fill="#DCE7FF" stroke="#2563EB" stroke-width="3"/>`,
    pyramid: `<polygon points="86,22 138,110 34,110" fill="#EEF3FF" stroke="#2563EB" stroke-width="3"/>
           <polygon points="86,22 138,110 100,124 34,110" fill="#DCE7FF" stroke="#2563EB" stroke-width="3" opacity=".85"/>`,
  };
  return svgWrap(S[kind] || S.cube, 172, 140, 190);
}

/* A prism drawn as stacked unit cubes, for volume by counting. MA.5.GR.3.1. */
function svgCubes(l, w, h) {
  const s = 17, dx = 9, dy = -7;
  const W = l * s + w * dx + 40, H = h * s + w * Math.abs(dy) + 34;
  const ox = 18, oy = H - 18;
  let out = '';
  for (let y = 0; y < w; y++) for (let z = 0; z < h; z++) for (let x = 0; x < l; x++) {
    const px = ox + x * s + y * dx, py = oy - z * s + y * dy - s;
    out += `<rect x="${px}" y="${py}" width="${s}" height="${s}" fill="#DCE7FF" stroke="#2563EB" stroke-width="1.6"/>`;
  }
  return svgWrap(out, W, H, 260);
}

/* Tally marks in fives, MA.1.DP.1.1. */
function svgTally(rows) {
  const rowH = 34, labelW = 92;
  const maxN = Math.max(...rows.map(r => r[1]));
  const W = labelW + Math.ceil(maxN / 5) * 44 + (maxN % 5 ? 0 : 0) + 40, H = rows.length * rowH + 12;
  let out = '';
  rows.forEach(([name, n], i) => {
    const y = i * rowH + 24;
    out += `<text x="0" y="${y}" font-size="${sf(W, 13)}" font-weight="800" fill="#17203A">${name}</text>`;
    let x = labelW;
    for (let k = 0; k < n; k++) {
      if (k % 5 === 4) { out += `<line x1="${x - 34}" y1="${y - 16}" x2="${x - 2}" y2="${y + 2}" stroke="#17203A" stroke-width="2.4"/>`; x += 14; }
      else { out += `<line x1="${x}" y1="${y - 16}" x2="${x}" y2="${y + 2}" stroke="#17203A" stroke-width="2.4"/>`; x += 8; }
    }
  });
  return svgWrap(out, W, H, 320);
}

/* Two labelled points in quadrant one, MA.5.GR.4.2. */
function svgCoord2(pts) {
  const n = 10, s = 24, pad = 26, w = n * s + pad + 20, h = n * s + pad + 20;
  const X = (v) => pad + v * s, Y = (v) => (n * s + 6) - v * s;
  let out = '';
  for (let i = 0; i <= n; i++) {
    out += `<line x1="${X(i)}" y1="6" x2="${X(i)}" y2="${Y(0)}" stroke="#E7EDFB" stroke-width="1"/>`;
    out += `<line x1="${X(0)}" y1="${Y(i)}" x2="${X(n)}" y2="${Y(i)}" stroke="#E7EDFB" stroke-width="1"/>`;
  }
  out += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(n)}" y2="${Y(0)}" stroke="#17203A" stroke-width="2.5"/>`;
  out += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="6" stroke="#17203A" stroke-width="2.5"/>`;
  pts.forEach((p) => {
    out += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="7" fill="${p.color || '#C6274B'}"/>`;
    if (p.label) out += `<text x="${X(p.x) + 10}" y="${Y(p.y) - 8}" font-size="${sf(w, 13)}" font-weight="800" fill="${p.color || '#C6274B'}">${p.label}</text>`;
  });
  return svgWrap(out, w, h, 300);
}

/* Two rectangles side by side, for comparing area and perimeter. MA.4.GR.2.2. */
function svgTwoRects(a, b, c, d) {
  const s = 15, gap = 34;
  const W = (a + c) * s + gap + 30, H = Math.max(b, d) * s + 40;
  const rect = (x, wU, hU, tag) => {
    let o = `<rect x="${x}" y="10" width="${wU * s}" height="${hU * s}" fill="#EEF3FF" stroke="#2563EB" stroke-width="3"/>`;
    o += `<text x="${x + wU * s / 2}" y="${10 + hU * s + 18}" font-size="${sf(W, 12)}" font-weight="800" fill="#17203A" text-anchor="middle">${tag}: ${wU} × ${hU}</text>`;
    return o;
  };
  return svgWrap(rect(14, a, b, 'A') + rect(14 + a * s + gap, c, d, 'B'), W, H, 320);
}

/* ------------------------------------------------------------ the climb
   Ten levels per grade. Levels 1 to 9 build one idea at a time in the
   order a classroom teaches them; level 10 mixes everything, so finishing
   a grade means every benchmark above has been practised.               */

const LEVELS = {
  1: [
    { n: 1, name: 'Counting Climb', topics: ['g1-count', 'g1-write100'] },
    { n: 2, name: 'Tens and Ones', topics: ['g1-tens', 'g1-order100'] },
    { n: 3, name: 'Facts to 10', topics: ['g1-facts10', 'g1-add20'] },
    { n: 4, name: 'Bigger Adding', topics: ['g1-add2digit', 'g1-sub2digit', 'g1-add3'] },
    { n: 5, name: 'More and Less', topics: ['g1-morless', 'g1-relate1'] },
    { n: 6, name: 'Number Stories', topics: ['g1-story1', 'g1-missing', 'g1-truefalse'] },
    { n: 7, name: 'Shapes', topics: ['g1-shapes', 'g1-attributes', 'g1-compose', 'g1-realshapes'] },
    { n: 8, name: 'Halves and Fourths', topics: ['g1-halves'] },
    { n: 9, name: 'Measuring', topics: ['g1-measure1', 'g1-compare1'] },
    { n: 10, name: 'Time and Money', topics: ['g1-time', 'g1-coins', 'g1-bills'] },
    { n: 11, name: 'Tally and Graphs', topics: ['g1-tally', 'g1-readdata'] },
    { n: 12, name: 'Champion Round', topics: '*', boss: true },
  ],
  2: [
    { n: 1, name: 'Numbers to 1,000', topics: ['g2-place', 'g2-compose3'] },
    { n: 2, name: 'Compare and Round', topics: ['g2-compare', 'g2-round'] },
    { n: 3, name: 'Facts to 20', topics: ['g2-facts20'] },
    { n: 4, name: 'Adding Bigger', topics: ['g2-add100', 'g2-tenmore', 'g2-add1000'] },
    { n: 5, name: 'Equation Detective', topics: ['g2-truefalse2', 'g2-unknown2', 'g2-word'] },
    { n: 6, name: 'Even, Odd and Arrays', topics: ['g2-evenodd', 'g2-oddgroups'] },
    { n: 7, name: 'Fractions', topics: ['g2-partition', 'g2-equalparts'] },
    { n: 8, name: 'Shapes and Symmetry', topics: ['g2-identify2d', 'g2-vertices', 'g2-symmetry2'] },
    { n: 9, name: 'Perimeter', topics: ['g2-perimeter', 'g2-perimcount'] },
    { n: 10, name: 'Measuring', topics: ['g2-measure2', 'g2-comparelen', 'g2-lenstory'] },
    { n: 11, name: 'Time, Money and Graphs', topics: ['g2-time5', 'g2-money', 'g2-data', 'g2-makebar'] },
    { n: 12, name: 'Champion Round', topics: '*', boss: true },
  ],
  3: [
    { n: 1, name: 'Place Value Peak', topics: ['g3-place4', 'g3-compose4', 'g3-compare4'] },
    { n: 2, name: 'Times Tables', topics: ['g3-facts', 'g3-factfamily', 'g3-mult10'] },
    { n: 3, name: 'Add, Subtract, Round', topics: ['g3-addsub', 'g3-round'] },
    { n: 4, name: 'Division Detective', topics: ['g3-relate', 'g3-unknown3', 'g3-truefalse3', 'g3-breakapart'] },
    { n: 5, name: 'Patterns, Even and Odd', topics: ['g3-patterns', 'g3-evenodd3', 'g3-multiples3'] },
    { n: 6, name: 'Fraction Basics', topics: ['g3-unitfrac', 'g3-shaded', 'g3-unitcount', 'g3-fracword'] },
    { n: 7, name: 'Comparing Fractions', topics: ['g3-compfrac', 'g3-equivfrac'] },
    { n: 8, name: 'Shapes and Symmetry', topics: ['g3-lines', 'g3-quads', 'g3-symmetry'] },
    { n: 9, name: 'Area and Perimeter', topics: ['g3-areacount', 'g3-areaformula', 'g3-area', 'g3-composite'] },
    { n: 10, name: 'Measure, Time and Data', topics: ['g3-ruler', 'g3-measureword', 'g3-ampm', 'g3-elapsed', 'g3-data', 'g3-keygraph', 'g3-makegraph', 'g3-2step'] },
    { n: 11, name: 'Champion Round', topics: '*', boss: true },
  ],
  4: [
    { n: 1, name: 'Place Value Peak', topics: ['g4-place', 'g4-readwrite', 'g4-order6'] },
    { n: 2, name: 'Rounding', topics: ['g4-round', 'g4-estimate'] },
    { n: 3, name: 'Multiply Big', topics: ['g4-facts12', 'g4-mult2x2', 'g4-mult3by2'] },
    { n: 4, name: 'Long Division', topics: ['g4-divide', 'g4-remainder'] },
    { n: 5, name: 'Factors and Patterns', topics: ['g4-factors', 'g4-rulepattern'] },
    { n: 6, name: 'Equation Detective', topics: ['g4-truefalse4', 'g4-unknown4'] },
    { n: 7, name: 'Equivalent Fractions', topics: ['g4-equivfrac', 'g4-equivgen', 'g4-decompose'] },
    { n: 8, name: 'Fraction Arithmetic', topics: ['g4-addfrac', 'g4-fracstory', 'g4-fractimes', 'g4-fracmult'] },
    { n: 9, name: 'Decimals', topics: ['g4-decimals', 'g4-orderdec', 'g4-tenths100', 'g4-tenthhundredth', 'g4-tenthmore', 'g4-adddec'] },
    { n: 10, name: 'Angles', topics: ['g4-angles', 'g4-anglemeasure', 'g4-angleadd'] },
    { n: 11, name: 'Area and Perimeter', topics: ['g4-areaperim', 'g4-samearea'] },
    { n: 12, name: 'Measure, Time and Money', topics: ['g4-convert', 'g4-tools', 'g4-elapsed4', 'g4-money4'] },
    { n: 13, name: 'Data', topics: ['g4-data', 'g4-lineplot', 'g4-datastory'] },
    { n: 14, name: 'Champion Round', topics: '*', boss: true },
  ],
  5: [
    { n: 1, name: 'Decimal Place Value', topics: ['g5-decplace', 'g5-decwrite', 'g5-deccompose'] },
    { n: 2, name: 'Compare and Round', topics: ['g5-roundec', 'g5-decorder'] },
    { n: 3, name: 'Multiply and Divide Big', topics: ['g5-multbig', 'g5-divbig', 'g5-remainder'] },
    { n: 4, name: 'Decimal Arithmetic', topics: ['g5-adddec', 'g5-estdec', 'g5-divbydec'] },
    { n: 5, name: 'Unlike Denominators', topics: ['g5-unlikefrac', 'g5-fracstory5'] },
    { n: 6, name: 'Multiplying Fractions', topics: ['g5-multfrac', 'g5-sizeproduct'] },
    { n: 7, name: 'Dividing with Fractions', topics: ['g5-divfrac', 'g5-divunit', 'g5-sharefrac'] },
    { n: 8, name: 'Order of Operations', topics: ['g5-order', 'g5-writeexpr', 'g5-truefalse5', 'g5-unknown5'] },
    { n: 9, name: 'Patterns and Tables', topics: ['g5-patternexpr', 'g5-inputoutput'] },
    { n: 10, name: 'Shapes and Solids', topics: ['g5-classify2d', 'g5-classify3d'] },
    { n: 11, name: 'Area and Volume', topics: ['g5-fracarea', 'g5-countcubes', 'g5-volume', 'g5-volstory'] },
    { n: 12, name: 'The Coordinate Plane', topics: ['g5-coord', 'g5-plotpoints'] },
    { n: 13, name: 'Measure, Money and Data', topics: ['g5-convert', 'g5-money5', 'g5-mean', 'g5-linegraph'] },
    { n: 14, name: 'Champion Round', topics: '*', boss: true },
  ],
};

/* every level resolves to real topic objects, and level 10 pulls the lot */
function topicsFor(grade, level) {
  const all = GRADES[grade];
  if (level.topics === '*') return all.slice();
  return level.topics.map((id) => all.find((t) => t.id === id)).filter(Boolean);
}

/* ------------------------------------------------------------- how to
   One method card per topic, opened from the Help button. It teaches the
   approach the benchmark expects, using different numbers from the question
   on screen, so it guides without handing over the answer.               */

const HOW = {
  'g1-write100': { steps: ['The left digit counts tens, the right digit counts ones.', 'Expanded form splits it: the tens value plus the ones value.', 'Say the tens word first, then the ones word.'], eg: '46 is 40 + 6, and you say it forty-six.' },
  'g1-order100': { steps: ['Look at the tens digit first.', 'A bigger tens digit means a bigger number.', 'If the tens match, compare the ones.'], eg: '58 beats 35 because 5 tens beats 3 tens.' },
  'g1-facts10': { steps: ['Picture the two groups of counters together.', 'Count them all for adding, or take some away for subtracting.', 'Pairs that make 10 are worth memorising.'], eg: '6 + 4 = 10, so 10 − 4 = 6.' },
  'g1-add2digit': { steps: ['Start at the bigger number.', 'Count on by the small number.', 'A number line keeps your place.'], eg: 'For 47 + 5, start at 47 and count 48, 49, 50, 51, 52.' },
  'g1-sub2digit': { steps: ['Start at the bigger number and count back.', 'Or ask what you add to the small number to reach the big one.', 'Only the ones digit changes here.'], eg: '38 − 6: count back to 32.' },
  'g1-add3': { steps: ['Look for two numbers that make 10 first.', 'Add that pair, then add the last number.', 'You can add in any order and still get the same answer.'], eg: '8 + 7 + 2: do 8 + 2 = 10 first, then 10 + 7 = 17.' },
  'g1-story1': { steps: ['Decide whether things are joining or leaving.', 'Joining means add, leaving means subtract.', 'Write the numbers in a number sentence, then solve it.'], eg: '9 birds and 4 fly away is 9 − 4 = 5.' },
  'g1-relate1': { steps: ['Every subtraction has a matching addition.', 'Ask what you add to the small number to reach the big one.', 'That missing part is the answer.'], eg: '12 − 7 becomes 7 + ? = 12, so the answer is 5.' },
  'g1-tally': { steps: ['A single mark is 1.', 'Four marks with a line across them is a bundle of 5.', 'Count the bundles by fives, then add the leftovers.'], eg: 'Two bundles and three marks is 5 + 5 + 3 = 13.' },
  'g1-readdata': { steps: ['Count each row first.', '"How many more" means subtract the smaller from the larger.', '"Altogether" means add every row.'], eg: 'If cats are 7 and dogs are 4, there are 3 more cats.' },
  'g1-attributes': { steps: ['Count the straight sides.', '3 sides is a triangle, 4 a square or rectangle, 6 a hexagon.', 'A square has 4 equal sides; a rectangle can be long.'], eg: 'A shape with 6 straight sides is a hexagon.' },
  'g1-compose': { steps: ['Bigger shapes are made from smaller ones.', 'Picture the small shape fitting inside, again and again.', 'Count how many it takes to fill the big shape.'], eg: 'Six triangles fit round the centre of a hexagon.' },
  'g1-realshapes': { steps: ['Look at the overall form of the object.', 'Round all over is a sphere, tube-like is a cylinder.', 'Boxy is a cube or rectangular prism, pointed is a cone.'], eg: 'A soup can is a cylinder: two circle ends and a curved side.' },
  'g1-measure1': { steps: ['Put the end of the object at 0, not at the edge of the ruler.', 'Read the number where the object stops.', 'That number is the length in inches.'], eg: 'A bar that stops at the 4 is 4 inches long.' },
  'g1-compare1': { steps: ['Measure both objects from 0.', 'The one reaching the bigger number is longer.', 'Subtract to find how much longer.'], eg: '7 inches and 4 inches: the first is 3 inches longer.' },
  'g1-bills': { steps: ['A ten-dollar bill is worth 10, a five is worth 5, a one is worth 1.', 'Count the tens first, then the fives, then the ones.', 'Add the three amounts together.'], eg: '2 tens, 1 five and 3 ones is 20 + 5 + 3 = $28.' },
  'g2-compose3': { steps: ['Places from the right: ones, tens, hundreds.', 'Multiply each digit by its place value.', 'Add the parts to rebuild the number.'], eg: '2 hundreds, 4 tens and 1 one is 200 + 40 + 1 = 241.' },
  'g2-facts20': { steps: ['Use a fact you already know to get to a new one.', 'Making 10 first is often the quickest route.', 'Subtraction is the matching addition asked backwards.'], eg: '9 + 6: take 1 from the 6 to make 10, then 10 + 5 = 15.' },
  'g2-add1000': { steps: ['Add or subtract the hundreds first.', 'Then the tens, then the ones.', 'Regroup when a column goes past 9.'], eg: '340 + 125: 300 + 100 = 400, 40 + 20 = 60, 0 + 5 = 5, giving 465.' },
  'g2-truefalse2': { steps: ['Work out the left side by itself.', 'Work out the right side by itself.', 'Equal means true, different means false.'], eg: '27 + 13 = 26 + 14 is true, because both make 40.' },
  'g2-unknown2': { steps: ['Decide whether the missing number is a part or the whole.', 'Missing part: subtract. Missing whole: add.', 'Put the answer back in to check.'], eg: 'For 23 + ? = 61, subtract: 61 − 23 = 38.' },
  'g2-oddgroups': { steps: ['Try to split the amount into two equal groups.', 'If it splits with nothing over, the number is even.', 'If one is left over, the number is odd.'], eg: '14 splits into 7 and 7, so it is even. 15 leaves 1 over, so it is odd.' },
  'g2-makebar': { steps: ['Check the scale up the side: bars may count by 2s or 5s.', 'Follow the top of a bar across to the scale.', 'Add for a total, subtract for "how many more".'], eg: 'If the scale goes up in 2s and a bar reaches the fourth line, that bar is 8.' },
  'g2-partition': { steps: ['Count how many equal parts the whole is cut into.', '2 parts are halves, 3 are thirds, 4 are fourths.', 'It takes all of them to rebuild one whole.'], eg: 'A circle cut into 4 equal slices has fourths, and 4 fourths make the whole.' },
  'g2-equalparts': { steps: ['Equal parts means equal in size, not always in shape.', 'The whole must be the same size before you compare parts.', 'Unequal pieces are not halves, however many there are.'], eg: 'A square cake can be cut into 4 strips or 4 small squares. Both are fourths.' },
  'g2-identify2d': { steps: ['Count the straight sides.', '3 is a triangle, 4 a square or rectangle, 5 a pentagon, 6 a hexagon.', 'Equal sides and square corners make it a square.'], eg: 'Five straight sides means a pentagon.' },
  'g2-vertices': { steps: ['Sides are the straight edges.', 'Corners, or vertices, are where two sides meet.', 'A flat shape always has the same number of each.'], eg: 'A pentagon has 5 sides and 5 corners.' },
  'g2-symmetry2': { steps: ['Imagine folding the shape along the dashed line.', 'Check whether the halves land exactly on each other.', 'A perfect match means it is a line of symmetry.'], eg: 'Fold a rectangle down the middle and the halves match.' },
  'g2-perimcount': { steps: ['Perimeter is the distance all the way round the edge.', 'Count the unit segments along each side.', 'Add all four sides, or add length and width then double.'], eg: 'A 5 by 3 rectangle has perimeter 5 + 3 + 5 + 3 = 16.' },
  'g2-measure2': { steps: ['Line the object up with the 0 mark.', 'Read the number at the far end.', 'Keep the unit with your answer.'], eg: 'A bar ending at 6 on an inch ruler is 6 inches.' },
  'g2-comparelen': { steps: ['Measure both from 0.', 'Subtract the shorter from the longer.', 'The difference is how much longer one is.'], eg: '9 inches and 5 inches differ by 4 inches.' },
  'g2-lenstory': { steps: ['"Shorter than" means subtract, "longer than" means add.', 'Work out the second length first.', 'Then answer what the question actually asks.'], eg: 'A 48 inch rope and one 9 inches shorter: the second is 39 inches.' },
  'g4-readwrite': { steps: ['Places from the right: ones, tens, hundreds, thousands, ten thousands, hundred thousands.', 'Multiply each digit by its place value.', 'Expanded form leaves out any place holding a zero.'], eg: '275,802 is 200,000 + 70,000 + 5,000 + 800 + 2.' },
  'g4-order6': { steps: ['Give the numbers the same number of digits in your head.', 'Compare from the leftmost place.', 'The first place where they differ decides the order.'], eg: '74,241 and 74,521 match in ten thousands and thousands. 5 beats 2 in hundreds.' },
  'g4-orderdec': { steps: ['Compare the whole-number part first.', 'Then tenths, then hundredths.', 'More digits does not mean bigger: 3.5 is more than 3.24.'], eg: '3.12, 3.2 and 3.24 in order are 3.12, 3.2, 3.24.' },
  'g4-facts12': { steps: ['Times tables up to 12 should come from memory.', 'Every fact gives you a matching division fact.', 'Skip counting rebuilds a fact you have forgotten.'], eg: '7 × 8 = 56, so 56 ÷ 8 = 7.' },
  'g4-mult3by2': { steps: ['Multiply by the ones digit first.', 'Then multiply by the tens digit, remembering the zero.', 'Add the two partial products.'], eg: '213 × 24 = (213 × 4) + (213 × 20) = 852 + 4,260 = 5,112.' },
  'g4-estimate': { steps: ['Round each number to a friendly place.', 'Multiply the rounded numbers.', 'The real answer sits near your estimate.'], eg: '215 × 46 is about 200 × 50 = 10,000.' },
  'g4-tenthmore': { steps: ['One tenth is 0.1 and lives in the first place after the point.', 'One hundredth is 0.01 and lives in the second.', 'Add or subtract in that place only.'], eg: 'One hundredth less than 1.10 is 1.09.' },
  'g4-adddec': { steps: ['Line the decimal points up under each other.', 'Fill any gap with a zero so both have the same digits.', 'Add or subtract as usual and bring the point straight down.'], eg: '4.30 + 1.25 = 5.55.' },
  'g4-remainder': { steps: ['Divide to get the whole number and the remainder.', 'Ask what the remainder means in the story.', 'Leftover people still need a van, so round up. Full boxes only means ignore it.'], eg: '243 students in vans of 9 is 27 vans exactly, but 245 needs 28.' },
  'g4-fracstory': { steps: ['Same denominator means the pieces are the same size.', 'Add or subtract only the top numbers.', 'The bottom number stays put.'], eg: '1/4 + 3/4 = 4/4, which is one whole.' },
  'g4-fractimes': { steps: ['Divide the whole by the bottom number to get one part.', 'Multiply that by the top number.', 'The answer is smaller than the whole when the fraction is less than 1.'], eg: '3/4 of 20: 20 ÷ 4 = 5, then 5 × 3 = 15.' },
  'g4-truefalse4': { steps: ['Work out each side separately.', 'Do brackets and multiplication before adding.', 'Compare the two results.'], eg: '32 ÷ 8 = 32 − 8 − 8 − 8 − 8 is false: 4 is not 0.' },
  'g4-unknown4': { steps: ['Decide whether the unknown is a factor, a product or a dividend.', 'Undo the operation: divide to find a factor, multiply to find a dividend.', 'Substitute back to check.'], eg: '96 = 8 × t means t = 96 ÷ 8 = 12.' },
  'g4-rulepattern': { steps: ['Find the gap between one term and the next.', 'Check the gap is the same all the way along.', 'Apply the rule once more for the next term.'], eg: '5, 19, 33, 47 goes up by 14 each time, so next is 61.' },
  'g4-lineplot': { steps: ['Each ✕ is one measurement.', 'Count the ✕ marks in a stack for that value.', 'Count every ✕ on the plot for the total.'], eg: 'Three ✕ above 4 means three measurements were 4.' },
  'g4-datastory': { steps: ['Count the ✕ marks you are asked about.', 'Count every ✕ for the total.', 'Write the part over the whole as a fraction.'], eg: '3 of 10 measurements were 2, so 3/10 of them.' },
  'g4-tenths100': { steps: ['Tenths and hundredths are the same family.', 'To go from tenths to hundredths, multiply top and bottom by 10.', 'To go back, divide both by 10.'], eg: '3/10 = 30/100.' },
  'g4-equivgen': { steps: ['Multiply the top and the bottom by the same number.', 'The value does not change, only how it is written.', 'Dividing both by the same number simplifies it.'], eg: '2/3 × 4/4 gives 8/12, which is the same amount.' },
  'g4-decompose': { steps: ['Keep the denominator the same.', 'Split the top number into two parts that add back to it.', 'Each part keeps the same bottom number.'], eg: '5/8 can be 2/8 + 3/8 or 1/8 + 4/8.' },
  'g4-tenthhundredth': { steps: ['Convert the tenths into hundredths first.', 'Multiply that top number by 10.', 'Now both have 100 on the bottom, so add the tops.'], eg: '9/100 + 3/10 = 9/100 + 30/100 = 39/100.' },
  'g4-fracmult': { steps: ['Multiplying by a whole number means repeated adding.', 'Multiply the top by the whole number, keep the bottom.', 'Change to a mixed number if the top gets bigger than the bottom.'], eg: '3 × 2/5 = 6/5, which is 1 and 1/5.' },
  'g4-anglemeasure': { steps: ['A square corner is 90 degrees.', 'A straight line is 180 degrees.', 'Compare the opening to those two landmarks.'], eg: 'An opening half of a right angle is about 45 degrees.' },
  'g4-angleadd': { steps: ['Angles that sit side by side add together.', 'The parts must add up to the whole.', 'Subtract the known part from the whole.'], eg: 'A 60 degree angle split with one part 25 degrees leaves 35 degrees.' },
  'g4-samearea': { steps: ['Area is length × width.', 'Perimeter is all four sides added up.', 'Two rectangles can share an area but have different perimeters.'], eg: '6 by 4 and 8 by 3 both have area 24, but perimeters 20 and 22.' },
  'g4-tools': { steps: ['Match the tool to what is being measured.', 'Length uses a ruler, weight a scale, heat a thermometer.', 'Liquid uses a measuring cup, time a clock or stopwatch.'], eg: 'To find how heavy a melon is, use a scale, not a ruler.' },
  'g4-elapsed4': { steps: ['Count on in whole hours first, then the extra minutes.', 'Watch for crossing 12 on the clock.', 'For distance, add each leg of the journey.'], eg: '2:15 plus 90 minutes is 3:15 then 3:45.' },
  'g4-money4': { steps: ['Write both amounts with two decimal places.', 'Subtract the cost from what you handed over.', 'Keep the decimal points lined up.'], eg: '$2.00 − $1.84 = $0.16.' },
  'g5-remainder': { steps: ['Divide to get the whole number and the remainder.', 'Read the story to see what the remainder means.', 'Round up when everything must fit, ignore it when only full groups count.'], eg: '500 books in crates of 40 is 12 full crates and 20 books needing a 13th.' },
  'g5-fracstory5': { steps: ['Turn every mixed number into a single fraction first.', 'Make the denominators match, then add or subtract the tops.', 'Change back to a mixed number at the end.'], eg: '2 1/4 + 3/4 = 9/4 + 3/4 = 12/4 = 3.' },
  'g5-writeexpr': { steps: ['"The quantity" signals a bracket.', 'Brackets are worked out first.', 'Read the whole phrase before choosing.'], eg: '4.5 + (3 × 2) is four and five tenths plus the quantity 3 times 2.' },
  'g5-truefalse5': { steps: ['Work each side out in full.', 'Brackets first, then multiply and divide, then add and subtract.', 'Compare the two results.'], eg: '2.5 + (6 × 2) = 14.5 and 16 − 1.5 = 14.5, so true.' },
  'g5-unknown5': { steps: ['Undo the operations from the outside in.', 'Whatever you do to one side, do to the other.', 'Substitute your answer back to check.'], eg: '250 − (5 × s) = 15 gives 5 × s = 235, so s = 47.' },
  'g5-patternexpr': { steps: ['Find the constant gap between terms.', 'That gap is the number multiplying x.', 'The starting value is what is added on.'], eg: '6, 8, 10, 12 with x from 0 is 6 + 2x.' },
  'g5-inputoutput': { steps: ['Look at how the output changes as the input goes up by 1.', 'That change is the multiplier.', 'The output at input 0 is the number added on.'], eg: 'Outputs 6, 8, 10, 12 for inputs 0 to 3 means 6 + 2x.' },
  'g5-linegraph': { steps: ['Read the row or point for the week you are asked about.', 'To find the change, subtract one week from the next.', 'A steady change means the same amount every time.'], eg: '$10.00 then $7.50 then $5.00 is $2.50 spent each week.' },
  'g5-sharefrac': { steps: ['Sharing means dividing.', 'The amount being shared goes on top.', 'The number of people goes on the bottom.'], eg: '2 gallons among 20 friends is 2/20 of a gallon each.' },
  'g5-sizeproduct': { steps: ['Compare the fraction to 1.', 'Less than 1 makes the answer smaller than the starting number.', 'More than 1 makes it bigger. Exactly 1 leaves it alone.'], eg: '20 × 3/4 is smaller than 20, because 3/4 is under 1.' },
  'g5-divunit': { steps: ['Dividing by a unit fraction asks how many pieces fit.', 'Each whole holds as many pieces as the denominator.', 'Dividing a fraction by a whole number cuts it into more parts.'], eg: '4 ÷ 1/3 = 12, because three thirds fit in each of the 4 wholes.' },
  'g5-classify2d': { steps: ['A shape belongs to a group if it has all of that group\u2019s attributes.', 'Squares meet every rectangle rule, so squares are rectangles.', 'Rectangles do not meet every square rule, so the reverse is false.'], eg: 'Every square is a rhombus, because a rhombus only needs four equal sides.' },
  'g5-classify3d': { steps: ['Count the flat faces and look at their shape.', 'Two matching bases joined by a straight side is a prism or cylinder.', 'A base rising to a single point is a pyramid or cone.'], eg: 'Six identical square faces makes a cube.' },
  'g5-fracarea': { steps: ['Area is still length × width with fractions.', 'Multiply the whole parts, then handle the half.', 'Half of the width, added on, finishes it.'], eg: '4 1/2 × 6 = (4 × 6) + (1/2 × 6) = 24 + 3 = 27.' },
  'g5-countcubes': { steps: ['Count the cubes in one layer: length × width.', 'Count how many layers are stacked up.', 'Multiply the layer by the number of layers.'], eg: '4 by 3 is 12 cubes a layer, and 2 layers makes 24.' },
  'g5-volstory': { steps: ['Volume is length × width × height.', 'To find a missing side, divide the volume by the other two.', 'The answer is in cubic units.'], eg: 'A volume of 120 with a 5 by 4 base is 120 ÷ 20 = 6 tall.' },
  'g5-plotpoints': { steps: ['The first number is across, the second is up.', 'Always start at the origin, the corner where the axes meet.', 'Subtract coordinates to find the distance between points.'], eg: '(7, 3) means 7 across then 3 up.' },
  'g5-convert': { steps: ['Find how many small units make one big unit.', 'Big to small: multiply.', 'Small to big: divide.'], eg: '3 hours is 3 × 60 = 180 minutes.' },
  'g5-money5': { steps: ['Work out the cost of each option separately.', 'Multiply the single price by how many you would need.', 'Subtract to find the saving.'], eg: '5 bottles at $2.40 is $12.00; a pack at $9.60 saves $2.40.' },
  'g5-decwrite': { steps: ['The first place after the point is tenths, the second hundredths.', 'Say the whole part, then "and", then the decimal part with its place name.', 'Two digits after the point means hundredths.'], eg: '67.03 is sixty-seven and three hundredths.' },
  'g5-deccompose': { steps: ['Each place has a value: tens, ones, tenths, hundredths, thousandths.', 'Multiply each digit by its place value.', 'Add every part back together.'], eg: '20.107 is 2 tens + 1 tenth + 7 thousandths.' },
  'g5-decorder': { steps: ['Compare the whole numbers first.', 'Then tenths, then hundredths, then thousandths.', 'Adding zeros on the end changes nothing.'], eg: '4.198, 4.891 and 4.918 are already in order.' },
  'g5-estdec': { steps: ['Round each decimal to a whole number.', 'Multiply the rounded numbers.', 'The real answer lands near that estimate.'], eg: '23.4 × 4.6 is about 23 × 5 = 115.' },
  'g5-divbydec': { steps: ['Multiplying by 0.1 makes a number ten times smaller.', 'Dividing by 0.1 makes it ten times bigger.', '0.01 does the same thing but by a hundred.'], eg: '12.3 ÷ 0.01 = 1,230.' },
  'g3-shaded': { steps: ['Count how many equal parts the whole shape is cut into. That is the bottom number.', 'Count how many parts are shaded. That is the top number.', 'Write the shaded count over the total count.'], eg: 'A circle cut into 10 equal slices with 1 shaded is 1/10.' },
  'g3-keygraph': { steps: ['If a category is missing, subtract the known ones from the total first.', 'The key tells you what one symbol is worth.', 'Symbols to students: multiply. Students to symbols: divide.'], eg: 'With 18 students, 6 and 3 known, the rest is 18 − 6 − 3 = 9. If the key is 3, that is 9 ÷ 3 = 3 symbols.' },
  'g3-place4': { steps: ['Name the places from the right: ones, tens, hundreds, thousands.', 'Find which place your digit is sitting in.', 'Multiply the digit by what that place is worth.'], eg: 'In 4,271 the 2 is in the hundreds place, so it is worth 2 × 100 = 200.' },
  'g3-compose4': { steps: ['Thousands are worth 1,000 each, hundreds 100, tens 10, ones 1.', 'Multiply each digit by its place value.', 'Add all the parts together.'], eg: '3 thousands, 0 hundreds, 6 tens and 2 ones is 3,000 + 0 + 60 + 2 = 3,062.' },
  'g3-compare4': { steps: ['Line the numbers up and start at the leftmost digit.', 'The first place where they differ decides it.', 'A bigger digit in that place means a bigger number.'], eg: '4,743 and 4,753 match in thousands and hundreds. In the tens, 5 beats 4, so 4,753 is greater.' },
  'g3-factfamily': { steps: ['Multiplication makes equal groups; division splits them back up.', 'Picture rows and columns of dots.', 'The same three numbers make two times facts and two division facts.'], eg: '4 × 6 = 24, 6 × 4 = 24, 24 ÷ 4 = 6 and 24 ÷ 6 = 4 all come from one array.' },
  'g3-breakapart': { steps: ['Split the bigger number into its tens and its ones.', 'Multiply each part separately.', 'Add the two answers together.'], eg: '6 × 43 = (6 × 40) + (6 × 3) = 240 + 18 = 258.' },
  'g3-relate': { steps: ['Turn the division into a missing-factor question.', 'Ask what times the divisor makes the total.', 'The times table gives you the answer.'], eg: '42 ÷ 7 means 7 × ? = 42. Since 7 × 6 = 42, the answer is 6.' },
  'g3-truefalse3': { steps: ['Work out the left side on its own.', 'Work out the right side on its own.', 'Same answer means true, different means false.'], eg: '27 ÷ 3 = 3 × 3 is true, because both sides come to 9.' },
  'g3-unknown3': { steps: ['Decide whether the missing number is a factor or the product.', 'If the product is known, divide to find the missing factor.', 'Put your answer back in to check.'], eg: 'For ? × 8 = 56, divide: 56 ÷ 8 = 7.' },
  'g3-evenodd3': { steps: ['Ignore every digit except the last one.', 'Ending in 0, 2, 4, 6 or 8 means even.', 'Ending in 1, 3, 5, 7 or 9 means odd.'], eg: '317 ends in 7, so it is odd, no matter how big the number is.' },
  'g3-multiples3': { steps: ['Multiples of a number are its times table: 4, 8, 12, 16 and so on.', 'Divide the number by the one you are testing.', 'No remainder means it is a multiple.'], eg: '36 ÷ 4 = 9 exactly, so 36 is a multiple of 4. 38 ÷ 4 leaves 2, so it is not.' },
  'g3-unitcount': { steps: ['The bottom number tells you the size of each piece.', 'The top number counts how many of those pieces you have.', 'So 3/4 is just 1/4 + 1/4 + 1/4.'], eg: '5/6 is five one-sixth pieces put together.' },
  'g3-fracword': { steps: ['The bottom number names the pieces: halves, thirds, fourths, fifths.', 'The top number says how many.', 'Say the count, then the name.'], eg: '3/5 is read as three fifths.' },
  'g3-lines': { steps: ['Parallel lines never meet and stay the same distance apart.', 'Perpendicular lines cross at a square corner.', 'Lines that cross at any other angle are just intersecting.'], eg: 'The two long edges of a ruler are parallel; the corner of a book is perpendicular.' },
  'g3-quads': { steps: ['A quadrilateral is any closed shape with four straight sides.', 'Count the right angles and check which sides are equal.', 'Check how many pairs of sides are parallel.'], eg: 'Four equal sides plus four right angles is a square; four right angles alone is a rectangle.' },
  'g3-symmetry': { steps: ['Imagine folding the shape along the line.', 'Check whether the two halves land exactly on top of each other.', 'If they match perfectly it is a line of symmetry.'], eg: 'A square folded straight down the middle matches; folded corner to corner it also matches.' },
  'g3-areacount': { steps: ['Area is how many unit squares cover the shape.', 'Count the squares in one row.', 'Multiply by the number of rows, or count them all.'], eg: '4 rows of 5 squares is 20 square units.' },
  'g3-areaformula': { steps: ['Area of a rectangle is length × width.', 'Multiply the two side lengths.', 'The answer is in square units.'], eg: 'A 7 by 3 rectangle has area 7 × 3 = 21 square units.' },
  'g3-composite': { steps: ['Cut the L shape into two rectangles.', 'Find the area of each one with length × width.', 'Add the two areas together.'], eg: 'A 6 by 2 piece plus a 3 by 4 piece is 12 + 12 = 24 square units.' },
  'g3-ruler': { steps: ['Line the object up with the 0 mark, not the end of the ruler.', 'Find the mark where the object stops.', 'Count the small marks: halves split each inch in two, quarters in four.'], eg: 'A bar ending two small marks past 3 on a quarter-inch ruler is 3 and 2/4, which is 3 and a half inches.' },
  'g3-measureword': { steps: ['Decide whether the parts are being joined or taken away.', 'Joining equal groups means multiply; taking away means subtract.', 'Keep the unit on your answer.'], eg: '8 students each bring 2 litres, so 8 × 2 = 16 litres.' },
  'g3-ampm': { steps: ['The short hand gives the hour, the long hand the minutes.', 'Count by 5s round the clock face, then add the extra minutes.', 'a.m. is midnight to noon, p.m. is noon to midnight.'], eg: 'Short hand just past 2, long hand on the 7, is 2:35. Breakfast is a.m.' },
  'g3-makegraph': { steps: ['Read the scale up the side first: bars may count by 2s, 5s or 10s.', 'Follow the top of the bar across to the scale.', 'For "how many more", subtract the smaller from the larger.'], eg: 'If the scale goes up in 5s and a bar reaches the third line, that bar is 15.' },
  'g1-count': { steps: ['Counting on: start at the number you were given and say the next one.', 'Skip counting by 2s, 5s or 10s means jumping the same size every time.', 'Look at the gap between the numbers shown. That gap is your jump.'], eg: 'Jumps of 5: 10, 15, 20, then 25.' },
  'g1-tens': { steps: ['The left digit counts whole tens. The right digit counts single ones.', 'Tens are bundles of ten. 3 tens is 30.', 'Add the bundles to the singles.'], eg: '5 tens and 2 ones = 50 + 2 = 52.' },
  'g1-add20': { steps: ['Make a ten first. Take from one number to fill the other up to 10.', 'Then add whatever is left over.', 'For subtracting, count back, or think "what do I add to get there?"'], eg: '8 + 5: move 2 across to make 10, then 10 + 3 = 13.' },
  'g1-morless': { steps: ['1 more or 1 less changes only the ones digit.', '10 more or 10 less changes only the tens digit.', 'The other digit stays exactly the same.'], eg: '10 more than 43 is 53. The 3 never moved.' },
  'g1-missing': { steps: ['Ask: how far is it from the number I have to the total?', 'Count up from the smaller number to the total.', 'Check by adding your answer back in.'], eg: '6 + ? = 14. Count 6 up to 14, that is 8.' },
  'g1-truefalse': { steps: ['An equals sign means both sides are worth the same.', 'Work out the side you can, then compare.', 'If the two sides are different, the equation is false.'], eg: '4 + 3 = 8 is false, because 4 + 3 is 7.' },
  'g1-shapes': { steps: ['Count the straight sides around the outside.', '3 sides is a triangle, 4 is a square or rectangle, 5 a pentagon, 6 a hexagon.', 'Corners and sides always come in the same number.'], eg: 'A hexagon has 6 sides and 6 corners.' },
  'g1-halves': { steps: ['Equal parts means every piece is the same size.', '2 equal parts are halves. 4 equal parts are fourths.', 'It always takes all the pieces to rebuild one whole.'], eg: 'Cut into 4, and 4 fourths make the whole back.' },
  'g1-time': { steps: ['The short hand is the hour. The long hand is the minutes.', 'Long hand on 12 means o’clock.', 'Long hand on 6 means half past, so 30 minutes.'], eg: 'Short hand past 4, long hand on 6, is 4:30.' },
  'g1-coins': { steps: ['Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢.', 'For several of one coin, skip count by its value.', 'Four quarters, ten dimes or twenty nickels each make $1.'], eg: '3 dimes: 10, 20, 30, so 30¢.' },

  'g2-place': { steps: ['Each digit has a place: hundreds, tens, ones.', 'A digit is worth its face value times its place.', 'Expanded form writes those values added together.'], eg: 'In 476, the 4 means 400, so 400 + 70 + 6.' },
  'g2-compare': { steps: ['Compare the biggest place first, the hundreds.', 'If they match, move right to the tens, then the ones.', 'The open mouth of < and > always faces the bigger number.'], eg: '512 vs 498: 5 hundreds beats 4 hundreds.' },
  'g2-round': { steps: ['Find the two tens the number sits between.', 'Look at the ones digit only.', '5 or more rounds up, less than 5 rounds down.'], eg: '67 sits between 60 and 70. The 7 sends it up to 70.' },
  'g2-add100': { steps: ['Add the tens, then add the ones, then put them together.', 'If the ones make more than 10, carry a ten across.', 'For subtracting, take away tens first, then ones.'], eg: '46 + 27: 40 + 20 = 60, 6 + 7 = 13, so 73.' },
  'g2-tenmore': { steps: ['10 more or less changes only the tens digit.', '100 more or less changes only the hundreds digit.', 'Watch for a tens digit of 9 rolling over into the hundreds.'], eg: '100 more than 342 is 442.' },
  'g2-word': { steps: ['Read it once for the story, once for the numbers.', 'Found more, altogether, in all means add.', 'Gave away, left, how many more means subtract.'], eg: 'Had 52, gave 18. 52 − 18 = 34 left.' },
  'g2-evenodd': { steps: ['Even numbers split into two equal groups with nothing left over.', 'Look only at the last digit: 0, 2, 4, 6, 8 is even.', 'An array is rows of equal groups, so it is repeated adding.'], eg: '4 rows of 5 is 5 + 5 + 5 + 5 = 20.' },
  'g2-time5': { steps: ['Each number on the clock is 5 minutes apart.', 'Count by 5s from the 12 round to the long hand.', 'The short hand tells you which hour you are inside.'], eg: 'Long hand on 7: 5, 10, 15, 20, 25, 30, 35 minutes.' },
  'g2-money': { steps: ['Line up the decimal points before adding or subtracting.', 'Dollars go with dollars, cents with cents.', 'For change, subtract the price from what you handed over.'], eg: '$5.00 − $3.25 = $1.75.' },
  'g2-perimeter': { steps: ['Perimeter is the distance all the way around the edge.', 'Add every side once.', 'A rectangle has two pairs of equal sides.'], eg: '5 by 3: 5 + 3 + 5 + 3 = 16.' },
  'g2-data': { steps: ['Read the labels first so you know what is being counted.', 'For most or fewest, compare the bar heights or counts.', 'For how many more, subtract the smaller from the larger.'], eg: '9 dogs and 4 cats: 9 − 4 = 5 more dogs.' },

  'g3-facts': { steps: ['Multiplication is equal rows. 6 × 4 is 6 rows of 4.', 'Division shares into equal rows, the opposite job.', 'Every fact family links two multiplications and two divisions.'], eg: '6 × 4 = 24, so 24 ÷ 6 = 4 and 24 ÷ 4 = 6.' },
  'g3-mult10': { steps: ['Multiply the front digits first, ignoring the zeros.', 'Then put the zeros back on the end.', 'One zero for tens, two zeros for hundreds.'], eg: '4 × 60: 4 × 6 = 24, add one zero, 240.' },
  'g3-addsub': { steps: ['Stack the numbers so the places line up.', 'Work right to left, carrying or borrowing as you go.', 'Estimate first so you can spot a silly answer.'], eg: '1,204 + 380 is about 1,200 + 400, so near 1,600.' },
  'g3-round': { steps: ['Underline the place you are rounding to.', 'Look at the digit immediately to its right.', '5 or more rounds up, otherwise stay put. Digits to the right become 0.'], eg: 'Round 472 to the nearest 100: the 7 sends it up to 500.' },
  'g3-unitfrac': { steps: ['The bottom number says how many equal parts the whole is cut into.', 'The top number says how many of those parts you have.', 'Parts must be equal, or it is not a fraction.'], eg: '3 parts shaded out of 8 equal parts is 3/8.' },
  'g3-compfrac': { steps: ['Same bottom number: just compare the tops, more pieces wins.', 'Same top number: the bigger bottom means smaller pieces, so it is less.', 'Picture the bar if you are unsure.'], eg: '1/4 is bigger than 1/8, because fourths are bigger pieces.' },
  'g3-equivfrac': { steps: ['Equivalent fractions cover the same amount of the bar.', 'Multiply the top and the bottom by the same number.', 'Whatever you do to one, you must do to the other.'], eg: '1/2 = 2/4 = 4/8, all the same amount.' },
  'g3-2step': { steps: ['Two steps means two calculations, in order.', 'Do the grouping or multiplying first.', 'Then do the adding or taking away, and check it makes sense.'], eg: '4 packs of 6 is 24, then give away 5, leaves 19.' },
  'g3-area': { steps: ['Area is the squares that fit inside: length × width.', 'Perimeter is the walk around the outside: add all four sides.', 'Area is in square units, perimeter in plain units.'], eg: '6 by 3: area 18 square units, perimeter 18 units.' },
  'g3-elapsed': { steps: ['Start from the beginning time.', 'Jump forward in whole hours first, then the leftover minutes.', 'When minutes pass 60, roll one hour forward.'], eg: '2:45 plus 30 minutes: 15 minutes gets you to 3:00, 15 more is 3:15.' },
  'g3-patterns': { steps: ['Find the rule by looking at the gap between the terms.', 'Multiples of a number are what you land on when you skip count by it.', 'Even numbers end in 0, 2, 4, 6 or 8.'], eg: '3, 7, 11, 15 grows by 4 each time, so next is 19.' },
  'g3-data': { steps: ['Read the key first. One picture usually stands for several things.', 'Multiply the pictures by what the key says.', 'For a total, add the rows after converting each one.'], eg: 'Key = 5 books. 4 pictures means 4 × 5 = 20 books.' },

  'g4-place': { steps: ['Each place is ten times the one to its right.', 'Read the digit, then name its place, then multiply.', 'A digit moving one place left is worth ten times more.'], eg: 'In 253,000 the 5 is in the ten thousands, worth 50,000.' },
  'g4-round': { steps: ['Underline the rounding place.', 'Check the single digit to its right.', '5 or more rounds up, everything after becomes zero.'], eg: 'Round 4,681 to the nearest 100: the 8 sends it up to 4,700.' },
  'g4-mult2x2': { steps: ['Split the second number into tens and ones.', 'Multiply by the tens, then by the ones.', 'Add the two partial products together.'], eg: '23 × 14 = (23 × 10) + (23 × 4) = 230 + 92 = 322.' },
  'g4-divide': { steps: ['Work left to right through the digits.', 'Divide, multiply, subtract, bring down the next digit, repeat.', 'Anything left at the end is the remainder.'], eg: '95 ÷ 4 = 23 with 3 left over, written 23 r3.' },
  'g4-factors': { steps: ['Factors are numbers that divide in with nothing left over.', 'Test 1, 2, 3 upward and pair them off.', 'A prime has exactly two factors, 1 and itself.'], eg: '12 = 1×12, 2×6, 3×4, so it is composite.' },
  'g4-equivfrac': { steps: ['Multiply or divide top and bottom by the same number to make an equal fraction.', 'To compare unlike fractions, rewrite them with a common denominator.', 'Or compare each to a landmark like 1/2.'], eg: '2/3 and 3/4 become 8/12 and 9/12, so 3/4 is bigger.' },
  'g4-addfrac': { steps: ['With the same denominator, the piece size never changes.', 'Add or subtract only the top numbers.', 'Keep the bottom number exactly as it is.'], eg: '3/8 + 2/8 = 5/8, not 5/16.' },
  'g4-decimals': { steps: ['The first place after the point is tenths, the second is hundredths.', 'A fraction with 10 or 100 underneath becomes a decimal directly.', 'Compare decimals place by place, starting at the tenths.'], eg: '7/10 = 0.7 and 45/100 = 0.45.' },
  'g4-angles': { steps: ['A right angle is exactly 90°, the corner of a square.', 'Less than 90° is acute, more than 90° is obtuse.', 'Angles on a straight line add to 180°.'], eg: 'If one angle is 60°, the rest of the straight line is 120°.' },
  'g4-convert': { steps: ['Decide if you are going to smaller units or bigger ones.', 'Smaller units means more of them, so multiply.', 'Learn the pairs: 12 in a foot, 100 cm in a metre, 60 minutes in an hour.'], eg: '5 feet = 5 × 12 = 60 inches.' },
  'g4-areaperim': { steps: ['Area = length × width. Perimeter = add every side.', 'For a missing side, divide the area by the side you know.', 'Same perimeter can give different areas.'], eg: 'Area 48, one side 6, so the other is 48 ÷ 6 = 8.' },
  'g4-data': { steps: ['Median: put the numbers in order and take the middle one.', 'Mode: the value that appears most often.', 'Range: largest minus smallest.'], eg: '3, 5, 5, 8, 12: median 5, mode 5, range 9.' },

  'g5-decplace': { steps: ['After the point: tenths, hundredths, thousandths.', 'Each place is ten times smaller than the one before.', 'Value = the digit multiplied by its place.'], eg: 'In 4.062 the 6 is hundredths, worth 0.06.' },
  'g5-roundec': { steps: ['Underline the place you want.', 'Look at the next digit to the right only.', '5 or more rounds up, then drop the digits after.'], eg: '3.47 to the nearest tenth: the 7 sends it to 3.5.' },
  'g5-multbig': { steps: ['Break the smaller number into tens and ones.', 'Multiply each part, then add the partial products.', 'Estimate first to check the size of your answer.'], eg: '214 × 32 = (214 × 30) + (214 × 2).' },
  'g5-divbig': { steps: ['Estimate how many times the divisor fits into the front digits.', 'Multiply, subtract, bring down, repeat.', 'Check by multiplying your answer back.'], eg: '546 ÷ 14: 14 × 39 = 546, so 39.' },
  'g5-adddec': { steps: ['Line up the decimal points, not the ends of the numbers.', 'Fill gaps with zeros so both have the same length.', 'Add or subtract as usual, keeping the point in place.'], eg: '5.60 + 2.35 = 7.95.' },
  'g5-unlikefrac': { steps: ['Find a common denominator both bottoms divide into.', 'Rewrite each fraction with that denominator.', 'Add or subtract the tops, then simplify.'], eg: '1/2 + 1/3 becomes 3/6 + 2/6 = 5/6.' },
  'g5-multfrac': { steps: ['Multiply the tops together and the bottoms together.', 'No common denominator is needed here.', 'Simplify at the end, or cancel first to keep numbers small.'], eg: '2/3 × 3/4 = 6/12 = 1/2.' },
  'g5-divfrac': { steps: ['A whole divided by a unit fraction asks how many pieces fit inside.', 'That makes the answer bigger than you started with.', 'A unit fraction divided by a whole cuts it into even smaller pieces.'], eg: '3 ÷ 1/4 = 12, because 4 quarters fit in each whole.' },
  'g5-order': { steps: ['Brackets first.', 'Then multiply and divide, left to right.', 'Then add and subtract, left to right.'], eg: '2 + 3 × 4 = 2 + 12 = 14, not 20.' },
  'g5-volume': { steps: ['Volume is length × width × height.', 'Think of one layer of cubes on the base, then stack the layers.', 'For a missing height, divide the volume by the base area.'], eg: 'Base 4 × 3 = 12, height 5, so 60 cubic units.' },
  'g5-coord': { steps: ['Start at the origin, where the axes cross.', 'The first number moves across, the second moves up.', 'Write it as (across, up).'], eg: '(3, 7) means 3 right, then 7 up.' },
  'g5-mean': { steps: ['Mean: add everything, then divide by how many there are.', 'Median: order them and take the middle.', 'Range: largest minus smallest.'], eg: '4, 6, 8: mean is 18 ÷ 3 = 6.' },
};
