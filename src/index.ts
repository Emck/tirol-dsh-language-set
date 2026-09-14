import type { Context } from '@deepseek-ai/cordis';
import type {} from '@deepseek-ai/dsh-system-prompt';
import { Config } from './config.ts';

export const name = 'dsh-language-set';

export const inject = ['systemPrompt'];

// systemPrompt section name
const SectionUserName = 'user:language';
const SectionThinkingName = 'thinking:language';

/**
 * make language description
 * @param lang language code
 * @param config plugin config
 * @returns language description
 */
function makeLanguageDesc(lang: string | null, config: Config) {
    lang = lang || config.lang;
    switch (lang) {
        case 'zh-CN':
            return 'Simplified Chinese';
        default:
            return 'English';
    }
}

export async function apply(ctx: Context, config: Config) {
    config = config || Config({});
    if (config.verbose) ctx.logger(name).debug(`plugin config: ${JSON.stringify(config)}`);

    // add systemPrompt section SectionUserName
    const dispose_replylang = await ctx.systemPrompt.section({
        name: SectionUserName,
        order: 1,
        text: config.replytext || `By default, reply to users in ${makeLanguageDesc(config.replylang, config)}.`,
    });
    // add systemPrompt section SectionThinkingName
    const dispose_thinkinglang = await ctx.systemPrompt.section({
        name: SectionThinkingName,
        order: 2,
        text: config.thinkingtext || `By default, think to users in ${makeLanguageDesc(config.thinkinglang, config)}.`,
    });

    // save systemPrompt description
    const systemPrompt: string[] = [];
    if (config.verbose) {
        // console.dir(await ctx.systemPrompt.assemble(), { depth: null, colors: true });
        const assembly = await ctx.systemPrompt.assemble();
        systemPrompt.push(JSON.stringify(assembly.sections.find((section) => section.name === SectionUserName)));
        systemPrompt.push(JSON.stringify(assembly.sections.find((section) => section.name === SectionThinkingName)));
        ctx.logger(name).debug(`systemPrompt: ${systemPrompt.join(', ')}`);
    }

    // register command
    const commands = ctx.get('commands');
    if (commands != null && config.command) {
        commands.register({
            name: 'language', // command name
            description: 'show language description', // command description
            input: { hint: 'config | show' }, // subcommand hint
            async handler(invocation: { rawInput: string }) {
                const raw = invocation.rawInput.trim();
                if (raw === 'config' || raw === '') return { kind: 'success', text: `Config is ${JSON.stringify(config)}` };
                if (raw === 'show') return { kind: 'success', text: `${systemPrompt.join('\n')}` };
                return { kind: 'error', text: `Unknown SubCommand: ${raw}` };
            },
        });
    }

    ctx.effect(() => {
        // returned function runs when the plugin unloads.
        return () => {
            dispose_replylang(); // remove systemPrompt section
            dispose_thinkinglang(); // remove systemPrompt section
            if (config.verbose) {
                ctx.logger(name).debug(`remove systemPrompt: {"name":"${SectionUserName}"}`);
                ctx.logger(name).debug(`remove systemPrompt: {"name":"${SectionThinkingName}"}`);
                ctx.logger(name).debug('plugin unloaded');
            }
        };
    });
}
