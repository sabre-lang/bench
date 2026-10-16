# Collected Reports 

Timestamp: 10/16/2026, 12:55:44 PM


## Benchmark 'empty'

| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `python3 targets/python/empty.py` | 9.2 ± 0.8 | 8.3 | 20.8 | 2.79 ± 0.33 |
| `sabre run targets/sabre/empty.sabre` | 3.3 ± 0.3 | 3.0 | 5.4 | 1.00 |
| `node targets/javascript/empty.js` | 17.5 ± 1.2 | 15.4 | 23.8 | 5.30 ± 0.55 |
| `bun run targets/javascript/empty.js` | 3.9 ± 0.2 | 3.4 | 5.6 | 1.17 ± 0.12 |
| `deno run targets/javascript/empty.js` | 11.1 ± 0.7 | 10.1 | 17.5 | 3.36 ± 0.33 |


## Benchmark 'hello'

| Command | Mean [ms] | Min [ms] | Max [ms] | Relative |
|:---|---:|---:|---:|---:|
| `python3 targets/python/hello.py` | 9.2 ± 0.8 | 8.3 | 20.6 | 2.70 ± 0.34 |
| `sabre run targets/sabre/hello.sabre` | 3.4 ± 0.3 | 3.0 | 5.2 | 1.00 |
| `node targets/javascript/hello.js` | 18.8 ± 1.0 | 16.9 | 22.4 | 5.52 ± 0.56 |
| `bun run targets/javascript/hello.js` | 4.0 ± 0.3 | 3.4 | 5.4 | 1.17 ± 0.13 |
| `deno run targets/javascript/hello.js` | 11.0 ± 0.5 | 10.3 | 13.2 | 3.24 ± 0.32 |
