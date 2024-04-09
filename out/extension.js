"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
let intervalId; // Declare intervalId as a global variable
let hasShownError = false; // Flag to track if error has been shown
const languages = {
    "Arabic": "ar",
    "Azerbaijani": "az",
    "Bengali": "bn",
    "Czech": "cs",
    "German": "de",
    "Greek": "el",
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "Hindi": "hi",
    "Hebrew": "he",
    "Indonesian": "id",
    "Italian": "it",
    "Japanese": "ja",
    "Korean": "ko",
    "Latin": "la",
    "Marathi": "mr",
    "Polish": "pl",
    "Portuguese": "pt",
    "Romanian": "ro",
    "Russian": "ru",
    "Swahili": "sw",
    "Tamil": "ta",
    "Tegulu": "te",
    "Turkish": "tr",
    "Urdu": "ur",
    "Vietnamese": "vi"
};
function activate(context) {
    let langSelect = vscode.commands.registerCommand('skillissue.selectLanguage', async () => {
        const options = Object.keys(languages);
        const selectedLanguage = await vscode.window.showQuickPick(options, {
            placeHolder: 'SkillIssue: Select a language',
        });
        if (selectedLanguage) {
            const languageCode = languages[selectedLanguage];
            vscode.window.showInformationMessage(`You selected: ${selectedLanguage}`);
            vscode.window.showInformationMessage(`Call Skill Issue Function`);
            context.globalState.update('selectedLanguage', languageCode);
        }
    });
    async function fetchInsult(lang) {
        const url = `https://evilinsult.com/generate_insult.php?lang=${lang}&type=json`;
        return fetch(url)
            .then(response => response.json())
            .then((data) => data.insult);
    }
    async function checkForErrors() {
        try {
            const activeTextEditor = vscode.window.activeTextEditor;
            if (!activeTextEditor) {
                return;
            }
            const document = activeTextEditor.document;
            const diagnostics = await vscode.languages.getDiagnostics(document.uri);
            if (diagnostics.length > 0 && !hasShownError) {
                const errors = diagnostics.filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error);
                if (errors.length > 0) {
                    const firstError = errors[0];
                    const lineNumber = firstError.range.start.line + 1;
                    const lineText = await document.lineAt(firstError.range.start.line).text;
                    const wordStartIndex = Math.max(0, firstError.range.start.character - 1);
                    const wordEndIndex = Math.min(lineText.length, firstError.range.end.character);
                    const errorWord = lineText.slice(wordStartIndex, wordEndIndex);
                    const lang = context.globalState.get('selectedLanguage') || 'en';
                    const insult = await fetchInsult(lang.toString());
                    await vscode.window.showErrorMessage(`${insult}`);
                    hasShownError = true;
                }
                // 
            }
        }
        catch (error) {
            console.error('Error checking for errors:', error);
        }
    }
    console.log('Congratulations, your extension "skillissue" is now active!');
    intervalId = setInterval(checkForErrors, 3000);
    context.subscriptions.push(vscode.commands.registerCommand('skillissue.helloWorld', async () => {
        hasShownError = false;
        // intervalId = setInterval(checkForErrors, 8000);
        vscode.workspace.onDidSaveTextDocument(checkForErrors);
        const state = vscode.window.terminals;
        console.log('Terminals: ', state);
        vscode.window.showInformationMessage(`Hello World from SkillIssue! ${state}`);
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map