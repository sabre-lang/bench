/// Node Modules
import * as fs from 'node:fs';
import * as path from 'node:path';

/// Package Modules
import { Dirent } from '../dirent';

/** Defines a binary target for execution. */
export class Target {
    //  CONSTRUCTORS  //

    /**
     * Constructs a target instance.
     * @param m_dirent                  Parent directory.
     * @param m_options                 Options to bind.
     */
    constructor(
        private readonly m_dirent: string,
        private readonly m_options: Target.Options,
    ) {}

    //  PUBLIC METHODS  //

    /** Gets the baseline binary. */
    public binary() {
        return this.m_options.binary;
    }

    /** Gets the internal options available. */
    public options() {
        return this.m_options;
    }

    /**
     * Checks if a particular benchmark exists.
     * @param benchmark             Benchmark to run.
     */
    public exists(benchmark: string) {
        const basename = `${benchmark}.${this.m_options.extension}`;
        return fs.existsSync(path.join(this.m_dirent, basename));
    }

    /**
     * Gets the runner executable output to be used.
     * @param benchmark             Benchmark to run.
     */
    public runner(benchmark: string) {
        const basename = `${benchmark}.${this.m_options.extension}`;
        const file_path = path.relative(process.cwd(), path.join(this.m_dirent, basename));
        return `"${this.m_options.runner.join(' ')} ${file_path}"`; // construct the runner
    }
}

export namespace Target {
    //  TYPEDEFS  //

    /** Target Options Interface. */
    export interface Options {
        readonly binary: string;
        readonly extension: string;
        readonly runner: string[];
    }

    //  PUBLIC METHODS  //

    /** Scans for all potential targets. */
    export async function Scan(): Promise<Target[]> {
        // read the available languages from our targets
        const languages = await fs.promises.readdir(Dirent.targets);

        // attempt reading all the available runtimes now
        const runtimes = languages.map((language) => path.resolve(Dirent.targets, language, '_runtimes.json'));

        // iterate over the available runtimes to be handled
        return Promise.all(runtimes.map(m_scan)).then((targets) => targets.flat());
    }

    //  PRIVATE METHODS  //

    /**
     * Internal scanning for a single runtime configuration.
     * @param runtime               Runtime configuration.
     */
    async function m_scan(runtime: string): Promise<Target[]> {
        const dirent = path.dirname(runtime); // get the language parent directory
        const configuration = JSON.parse(await fs.promises.readFile(runtime, 'utf-8'));
        return configuration.map((options: any) => new Target(dirent, options));
    }
}
