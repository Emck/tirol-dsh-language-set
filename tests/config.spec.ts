import { describe, expect, it } from 'vitest';

import { Config, type Config as ConfigType } from '../src/config.ts';

// ---------------------------------------------------------------------------
// Config interface type check
// ---------------------------------------------------------------------------

describe('Config interface', () => {
    it('Config type is assignable from Config() result', () => {
        const config: ConfigType = Config({ lang: 'zh-CN' });
        expect(config.lang).toBe('zh-CN');
    });

    it('Config type allows string values for text fields', () => {
        const config: ConfigType = Config({
            replylang: 'en-US',
            thinkinglang: 'zh-CN',
            replytext: 'Hello',
            thinkingtext: 'Think',
        });
        expect(config.replylang).toBe('en-US');
        expect(config.thinkinglang).toBe('zh-CN');
        expect(config.replytext).toBe('Hello');
        expect(config.thinkingtext).toBe('Think');
    });
});

// ---------------------------------------------------------------------------
// Config defaults
// ---------------------------------------------------------------------------

describe('Config defaults', () => {
    it('all defaults', () => {
        const config: ConfigType = Config({});
        expect(config).toMatchObject({ lang: 'en-US', command: false, verbose: false });
        expect(config.replylang).toBe('');
        expect(config.thinkinglang).toBe('');
        expect(config.replytext).toBe('');
        expect(config.thinkingtext).toBe('');
    });

    it('explicit string values are preserved', () => {
        const config: ConfigType = Config({
            replylang: 'en-US',
            thinkinglang: 'zh-CN',
            replytext: 'Hello',
            thinkingtext: 'Think',
        });
        expect(config.replylang).toBe('en-US');
        expect(config.thinkinglang).toBe('zh-CN');
        expect(config.replytext).toBe('Hello');
        expect(config.thinkingtext).toBe('Think');
    });

    it('explicit false values are preserved', () => {
        const config: ConfigType = Config({ command: false, verbose: false });
        expect(config.command).toBe(false);
        expect(config.verbose).toBe(false);
    });

    it('empty string values are preserved', () => {
        const config: ConfigType = Config({
            replylang: '',
            thinkinglang: '',
            replytext: '',
            thinkingtext: '',
        });
        expect(config.replylang).toBe('');
        expect(config.thinkinglang).toBe('');
        expect(config.replytext).toBe('');
        expect(config.thinkingtext).toBe('');
    });
});

// ---------------------------------------------------------------------------
// Config Custom values
// ---------------------------------------------------------------------------

describe('Config custom values', () => {
    it('accepts all custom fields together', () => {
        const config: ConfigType = Config({
            lang: 'zh-CN',
            replylang: 'it-IT',
            thinkinglang: 'ko-KR',
            replytext: 'Please respond in English.',
            thinkingtext: 'Think in Korean.',
            command: true,
            verbose: true,
        });
        expect(config).toEqual({
            lang: 'zh-CN',
            replylang: 'it-IT',
            thinkinglang: 'ko-KR',
            replytext: 'Please respond in English.',
            thinkingtext: 'Think in Korean.',
            command: true,
            verbose: true,
        });
    });

    it('accepts empty string for text fields', () => {
        expect(Config({ replylang: '' }).replylang).toBe('');
        expect(Config({ thinkinglang: '' }).thinkinglang).toBe('');
        expect(Config({ replytext: '' }).replytext).toBe('');
        expect(Config({ thinkingtext: '' }).thinkingtext).toBe('');
    });

    it('undefined values are included in result', () => {
        const config: ConfigType = Config({ replylang: undefined, thinkinglang: undefined });
        expect('replylang' in config).toBe(true);
        expect(config.replylang).toBe('');
    });

    it('omitted values are included in result', () => {
        const config: ConfigType = Config({});
        expect('replylang' in config).toBe(true);
        expect(config.replylang).toBe('');
    });

    it('accepts various language codes', () => {
        for (const code of ['en-US', 'zh-CN', 'it-IT', 'ko-KR', 'fr-FR']) {
            expect(Config({ lang: code }).lang).toBe(code);
        }
    });

    it('default text fields are empty strings', () => {
        const config: ConfigType = Config({});
        expect(config.replylang).toBe('');
        expect(config.thinkinglang).toBe('');
        expect(config.replytext).toBe('');
        expect(config.thinkingtext).toBe('');
    });
});

// ---------------------------------------------------------------------------
// Config Merge
// ---------------------------------------------------------------------------

describe('merge', () => {
    it('merges two configs (override lang)', () => {
        const merged = Config.merge(Config({ lang: 'base' }), { lang: 'override' });
        expect(merged.lang).toBe('override');
    });

    it('merges replylang / thinkinglang', () => {
        expect(Config.merge(Config({ replylang: 'en-US' }), { replylang: 'zh-CN' }).replylang).toBe('zh-CN');
        expect(Config.merge(Config({ thinkinglang: 'en-US' }), { thinkingtext: 'fr-FR' }).thinkinglang).toBe('en-US');
    });

    it('merges replytext / thinkingtext', () => {
        expect(Config.merge(Config({ replytext: 'A' }), { replytext: 'B' }).replytext).toBe('B');
        expect(Config.merge(Config({ thinkingtext: 'A' }), { thinkingtext: 'B' }).thinkingtext).toBe('B');
    });

    it('merges command / verbose flags', () => {
        expect(Config.merge(Config({ command: false }), { command: true }).command).toBe(true);
        expect(Config.merge(Config({ verbose: false }), { verbose: true }).verbose).toBe(true);
    });

    it('merges all fields together', () => {
        const merged = Config.merge(Config({ lang: 'en-US', replylang: 'it-IT' }), { thinkinglang: 'ko-KR' });
        expect(merged.lang).toBe('en-US');
        expect(merged.replylang).toBe('it-IT');
        expect(merged.thinkinglang).toBe('ko-KR');
    });

    it('merge with empty string values preserves empty string', () => {
        expect(Config.merge(Config({ lang: 'en-US' }), { replylang: '' }).replylang).toBe('');
    });

    it('merge with undefined values', () => {
        expect(Config.merge(Config({ lang: 'en-US' }), { replylang: undefined }).replylang).toBeUndefined();
    });

    it('merge with empty object returns base', () => {
        const base = Config({ lang: 'en-US' });
        expect(Config.merge(base, {}).lang).toBe('en-US');
    });

    it('merge preserves base values not overridden', () => {
        const merged = Config.merge(Config({ lang: 'en-US', replylang: 'it-IT' }), { thinkinglang: 'ko-KR' });
        expect(merged.lang).toBe('en-US');
        expect(merged.replylang).toBe('it-IT');
        expect(merged.thinkinglang).toBe('ko-KR');
    });

    it('merge multiple configs', () => {
        const merged = Config.merge(Config({ lang: 'en-US' }), { replylang: 'it-IT' }, { thinkinglang: 'ko-KR' });
        expect(merged).toMatchObject({ lang: 'en-US', replylang: 'it-IT', thinkinglang: 'ko-KR' });
    });
});
