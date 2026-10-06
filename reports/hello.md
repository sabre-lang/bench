| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `python3 targets/python/hello.py` | 8.8 ± 0.3 | 8.3 | 12.1 | 2.84 ± 0.20 |
| `sabre run targets/sabre/hello.sabre` | 3.1 ± 0.2 | 2.8 | 4.5 | 1.00 |
| `node targets/javascript/hello.js` | 18.2 ± 0.8 | 16.9 | 21.3 | 5.86 ± 0.44 |
| `bun run targets/javascript/hello.js` | 3.8 ± 0.2 | 3.4 | 5.5 | 1.24 ± 0.10 |
| `deno run targets/javascript/hello.js` | 10.6 ± 0.7 | 9.8 | 17.2 | 3.41 ± 0.30 |
