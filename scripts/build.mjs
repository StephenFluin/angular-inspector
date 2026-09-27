import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const options = {
    entryPoints: ['service_worker', 'bridge', 'detector', 'popup', 'options'].map((name) => `src/${name}.ts`),
    outdir: 'src/dist',
    bundle: true,
    format: 'esm',
    target: 'chrome111',
    minify: !watch,
    sourcemap: true,
    logLevel: 'info',
};

// Content scripts are classic scripts, so wrap everything but the (module) service worker in an IIFE.
const builds = [
    { ...options, entryPoints: ['src/service_worker.ts'] },
    { ...options, entryPoints: options.entryPoints.filter((e) => !e.includes('service_worker')), format: 'iife' },
];

if (watch) {
    for (const build of builds) await (await esbuild.context(build)).watch();
} else {
    await Promise.all(builds.map((build) => esbuild.build(build)));
}
