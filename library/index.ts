/// Package Modules
import { Hyper } from './hyper';
import { Target } from './target';

//  TOOL RUNNER  //

await Hyper.launch({
    outfile: 'merged.md',
    targets: await Target.Scan(),
    benchmarks: ['empty', 'hello'],
});
