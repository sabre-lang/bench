/// Node Modules
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as util from 'node:util';
import * as cp from 'node:child_process';

/// Vendor Modules
import { Listr, type ListrTask } from 'listr2';

/// Package Modules
import { Dirent } from '../dirent';
import { Target } from '../target';

/** Hyperfine Execution Utilities. */
export namespace Hyper {
    //  TYPEDEFS  //

    /** Input Options Interface. */
    export interface Options {
        readonly targets: Target[];
        readonly benchmarks: string[];
        readonly outfile?: string;
    }

    /** Runner Details Interface. */
    export interface Runner {
        readonly command: string;
        readonly outfile: string;
        readonly benchmark: string;
        readonly execute: () => Promise<any>;
    }

    //  PROPERTIES  //

    /** Handles spawning commands. */
    const m_spawnify = util.promisify(cp.exec);

    //  PUBLIC METHODS  //

    /**
     * Handles preparing a benchmark for running.
     * @param benchmark                 Benchmark to bind.
     * @param targets                   Targets to inherit.
     */
    export function prepare(benchmark: string, targets: Target[] = []): Runner | undefined {
        const outfile = path.resolve(Dirent.reports, `${benchmark}.md`);
        targets = targets.filter((target) => target.exists(benchmark));
        if (targets.length === 0) return; // did not find any valid targets
        const runners = targets.map((target) => target.runner(benchmark));
        const command = `hyperfine --export-markdown "${outfile}" ${runners.join(' ')}`;
        return { outfile, benchmark, command, execute: () => m_spawnify(command) };
    }

    /**
     * Handles executing and collecting all benchmarks/targets.
     * @param options                   Runner options.
     */
    export async function launch({ benchmarks, targets, outfile }: Options) {
        // prepare all the runners that we could be running for our benchmarks
        const runners = benchmarks.map((benchmark) => prepare(benchmark, targets));

        // prepare the base tasks that we require
        const teardown = m_task('Collect Reports', (_, parent) => m_merge(outfile, runners, parent.skip.bind(parent)));
        const initialize = m_task('Prepare Reports', () => fs.promises.mkdir(Dirent.reports, { recursive: true }));

        // convert the runners into subtasks now
        const harness: ListrTask = m_task('Execute Benchmarks', (_, parent) => {
            const bind = (runner: Runner) => m_task(`Benchmark: '${runner.benchmark}'`, runner.execute);
            const subtasks = runners.flatMap((runner) => (runner ? [bind(runner)] : []));
            return parent.newListr(subtasks, { concurrent: true });
        });

        // prepare all the tasks that we require running
        await new Listr([initialize, harness, teardown], { concurrent: false }).run();
    }

    //  PRIVATE METHODS  //

    /**
     * Handles binding tasks.
     * @param title                     Task title.
     * @param execute                   Task executor.
     */
    function m_task(title: string, execute: ListrTask['task']): ListrTask {
        return { title, task: execute };
    }

    /**
     * Handles collecting all reports into a single output.
     * @param outfile                   Outfile to direct.
     * @param runners                   Runners to output.
     */
    async function m_merge(
        outfile: string | undefined,
        runners: Array<Runner | undefined>,
        skip: (message?: string) => void,
    ) {
        // ensure that we can actually collect the reports we requested now
        const filtered = runners.filter((runner): runner is Runner => typeof runner !== 'undefined');
        if (typeof outfile === 'undefined' || filtered.length === 0) return skip('Skipping Reports');

        // prepare a dated title to be shown
        const title = `# Collected Reports \n\nTimestamp: ${new Date().toLocaleString()}\n`;

        // collect all the results we received into a singular output
        const merged = await filtered.reduce(async (promise, runner) => {
            const previous = await promise; // prepare the previous value
            const report = await fs.promises.readFile(runner.outfile, 'utf-8');
            return `${await promise}\n\n## Benchmark '${runner.benchmark}'\n\n${report}`;
        }, Promise.resolve(title));

        // and merge then back together into a singular output
        await fs.promises.rm(Dirent.reports, { recursive: true, force: true });
        await fs.promises.mkdir(Dirent.reports, { recursive: true });
        await fs.promises.writeFile(path.resolve(Dirent.reports, outfile), merged);
    }
}
