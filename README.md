# Math Arena

Free math practice for grades 1 to 5, aligned to **Florida's B.E.S.T. mathematics
benchmarks**. Live at **https://math.mehdee.com**.

A child types their first name, picks a grade, and climbs ten levels. Each level
drills one idea the way a classroom teaches it, and level ten mixes everything.
Finish the climb and every benchmark cluster for that grade has been practised.

## How it works

- **10 levels per grade.** Levels unlock in order; you need 8 of 10 to clear one.
  Stars: 8 = one, 9 = two, 10 = three.
- **Questions are generated, not stored.** Every round is fresh, so a child can
  repeat a level without memorising answers.
- **Pictures, not just words.** Wrong answers explain themselves with a drawn
  clock, number line, fraction bar, dot array, rectangle or coordinate grid.
- **Report card.** Downloads as a PNG: name, grade, date, stars per level,
  accuracy, benchmark codes and a badge.

## Standards

Benchmarks come from Florida's B.E.S.T. Standards for Mathematics. FAST progress
monitoring covers mathematics in **grades 3 to 8**; grades K to 2 are monitored
with Star Math. Grades 1 and 2 here follow the same B.E.S.T. benchmarks.

This is a practice tool. It is not affiliated with, endorsed by, or connected to
the Florida Department of Education.

## Privacy

No accounts, no ads, no cookies, no advertising or profiling scripts. The child's
name and progress live in `localStorage` on that device only and are never
transmitted. The one server request is an anonymous page-view count through
Cloudflare Web Analytics: cookieless, no fingerprinting, no cross-site tracking,
and it identifies nobody. The game still works offline after the first load; the
beacon simply fails silently.

## Files

| file | what it does |
|---|---|
| `index.html` | screens: start, level map, play, results, report card |
| `styles.css` | bright kid palette, mobile first, WCAG AA contrast |
| `content.js` | benchmarks, question generators, SVG pictures, the level ladder |
| `app.js` | game flow, progress, scoring, report card canvas |

Pure static site. No build step, no dependencies.

## Run locally

```bash
python3 -m http.server 8899   # then open http://localhost:8899
```

## Adding questions

Add a topic to the right grade array in `content.js` with an `id`, a title `t`,
its benchmark code `b`, and a `gen()` returning
`{ q, a, choices, why, sub?, visual?, whyVisual? }`. Then list its `id` in a
level inside `LEVELS`. The level map and report card pick it up automatically.
