import { describe, expect, it } from 'vitest';

import { name, inject } from '../src/index.ts';

// ---------------------------------------------------------------------------
// Plugin exports
// ---------------------------------------------------------------------------

describe('Plugin exports', () => {
    it('exports name, inject, apply', () => {
        expect(name).toBe('dsh-language-set');
        expect(inject).toEqual(['systemPrompt']);
        expect(typeof require('../src/index.ts').apply).toBe('function');
    });

    it('exports are stable across re-imports', () => {
        const m1 = require('../src/index.ts');
        const m2 = require('../src/index.ts');
        expect(m1.name).toBe(m2.name);
        expect(m1.inject).toEqual(m2.inject);
    });
});
