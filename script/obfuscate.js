const { PasteClient } = require('pastebin-api');
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

module.exports.config = {
    name: "obfuscate",
    version: "1.0.0",
    role: 0,
    credits: "cliff",
    description: "Obfuscate JavaScript code",
    aliases: ["ob"],
    cooldown: 0,
    hasPrefix: false,
    usage: "",
};

module.exports.run = async function ({ api, event, args }) {
    const obfuscationResult = JavaScriptObfuscator.obfuscate(args.join(" "), {
        compact: true,
        controlFlowFlattening: false,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: false,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: false,
        debugProtectionInterval: 0,
        disableConsoleOutput: false,
        domainLock: [],
        domainLockRedirectUrl: 'about:blank',
        forceTransformStrings: [],
        identifierNamesCache: null,
        identifierNamesGenerator: 'hexadecimal',
        identifiersDictionary: [],
        identifiersPrefix: '',
        ignoreImports: false,
        inputFileName: '',
        log: false,
        numbersToExpressions: false,
        optionsPreset: 'default',
        renameGlobals: false,
        renameProperties: false,
        renamePropertiesMode: 'safe',
        reservedNames: [],
        reservedStrings: [],
        seed: 0,
        selfDefending: false,
        simplify: true,
        sourceMap: false,
        sourceMapBaseUrl: '',
        sourceMapFileName: '',
        sourceMapMode: 'separate',
        sourceMapSourcesMode: 'sources-content',
        splitStrings: false,
        splitStringsChunkLength: 10,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 0.5,
        stringArrayEncoding: [],
        stringArrayIndexesType: ['hexadecimal-number'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 1,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 2,
        stringArrayWrappersType: 'variable',
        stringArrayThreshold: 0.75,
        target: 'browser',
        transformObjectKeys: false,
        unicodeEscapeSequence: false
    });

    const obfuscatedCode = obfuscationResult.getObfuscatedCode();

    const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");

    const originalPaste = await client.createPaste({
        code: args.join(" "),
        expireDate: 'N',
        format: "javascript",
        publicity: 1
    });

    const obfuscatedPaste = await client.createPaste({
        code: obfuscatedCode,
        expireDate: 'N',
        format: "javascript",
        publicity: 1
    });

    const originalCodeUrl = 'https://pastebin.com/raw/' + originalPaste.split('/')[3];
    const obfuscatedCodeUrl = 'https://pastebin.com/raw/' + obfuscatedPaste.split('/')[3];

    api.sendMessage(`Originalcode: ${originalCodeUrl}\n\nobfuscatedcode: ${obfuscatedCodeUrl}`, event.threadID, event.messageID);
};