import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    outDir: 'lib',
    sourcemap: false,
    minify: false,
    deps: {
        neverBundle: [
            '@deepseek-ai/cordis',
            '@deepseek-ai/schemastery',
        ],
    },
});
