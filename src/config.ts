import Schema from '@deepseek-ai/schemastery';

/**
 * @description: language config interface
 */
export interface Config {
    lang: string; // global language
    replylang: string | null; // reply language
    replytext: string | null; // reply text
    thinkinglang: string | null; // thinking language
    thinkingtext: string | null; // thinking text
    command: boolean; // enable command
    verbose: boolean; // verbose mode
}

/**
 * @description: language config schema
 * @param lang - global language, default is 'en-US'
 * @param replylang - reply language, default is null
 * @param replytext - reply text, default is null
 * @param thinkinglang - thinking language, default is null
 * @param thinkingtext - thinking text, default is null
 * @param command - enable command, default is false
 * @param verbose - verbose mode, default is false
 */
export const Config = Schema.object({
    lang: Schema.string().default('en-US'),
    replylang: Schema.string().default(null),
    replytext: Schema.string().default(null),
    thinkinglang: Schema.string().default(null),
    thinkingtext: Schema.string().default(null),
    command: Schema.boolean().default(false),
    verbose: Schema.boolean().default(false),
});

/**
 * @description: language config merge method
 */
declare module '@deepseek-ai/schemastery' {
    interface Schemastery<Config> {
        merge?: (...configs: Partial<Config>[]) => Partial<Config>;
    }
}

Config.merge = Object.assign;
