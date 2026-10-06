/// Node Modules
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as cp from 'node:child_process';

/// Package Modules
import { Target } from './target';
import { Dirent } from './dirent';

// prepare a set of potential benchmarks to run
const benchmarks = ['empty', 'hello'];

// scan for all the available targets
const targets = await Target.Scan();

// convert the targets into suitable benchmarking commands
const commands = benchmarks.map((benchmark) => {
    const output = path.resolve(Dirent.reports, `${benchmark}.md`);
    const available = targets.filter((target) => target.exists(benchmark));
    if (available.length === 0) return undefined; // ensure empty value
    const runners = available.map((target) => target.runner(benchmark));
    return `hyperfine --export-markdown "${output}" ${runners.join(' ')}`;
});

// ensure that the reports directory is available
await fs.promises.mkdir(Dirent.reports, { recursive: true });

// run each of the benchmarks as required now
for (const command of commands.filter((command) => command !== undefined)) cp.execSync(command, { stdio: 'inherit' });
