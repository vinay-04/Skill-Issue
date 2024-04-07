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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
let intervalId; // Declare intervalId as a global variable
let hasShownError = false; // Flag to track if error has been shown
function activate(context) {
    async function fetchInsult() {
        const url = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';
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
                const errors = diagnostics.filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error); // Filter errors only
                if (errors.length > 0) {
                    const insult = await fetchInsult();
                    await vscode.window.showErrorMessage(`Found ${errors.length} errors. ${insult}`);
                    hasShownError = true; // Mark error shown
                }
            }
        }
        catch (error) {
            console.error('Error checking for errors:', error);
        }
    }
    console.log('Congratulations, your extension "skillissue" is now active!');
    intervalId = setInterval(checkForErrors, 3000);
    // Register a command (optional)
    context.subscriptions.push(vscode.commands.registerCommand('skillissue.helloWorld', async () => {
        hasShownError = false;
        intervalId = setInterval(checkForErrors, 3000); // Restart interval if needed
    }));
    // const interval = { dispose: () => clearInterval(intervalId) }; // Wrap intervalId in an object with a dispose method
    // context.subscriptions.push(interval); // Ensure interval is cleaned up on deactivation
}
exports.activate = activate;
function deactivate() {
    // clearInterval(interval); // Clear the interval on deactivation
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map