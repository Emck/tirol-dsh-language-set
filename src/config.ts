import Schema from '@deepseek-ai/schemastery';

/**
 * @description: language config interface
 */
export interface Config {
    lang: string; // global language
    replylang: string; // reply language
    replytext: string; // reply text
    thinkinglang: string; // thinking language
    thinkingtext: string; // thinking text
    command: boolean; // enable command
    verbose: boolean; // verbose mode
}

/**
 * @description: language config schema
 * @param lang - global language, default is 'en-US'
 * @param replylang - reply language, default is ''
 * @param replytext - reply text, default is ''
 * @param thinkinglang - thinking language, default is ''
 * @param thinkingtext - thinking text, default is ''
 * @param command - enable command, default is false
 * @param verbose - verbose mode, default is false
 */
export const Config = Schema.object({
    lang: Schema.string().default('en-US'),
    replylang: Schema.string().default(''),
    replytext: Schema.string().default(''),
    thinkinglang: Schema.string().default(''),
    thinkingtext: Schema.string().default(''),
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
