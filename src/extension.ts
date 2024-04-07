import * as vscode from 'vscode';

let intervalId: NodeJS.Timer; // Declare intervalId as a global variable
let hasShownError = false; // Flag to track if error has been shown

export function activate(context: vscode.ExtensionContext) {

  async function fetchInsult() {
    const url = 'https://evilinsult.com/generate_insult.php?lang=en&type=json';
     return fetch(url)
     .then(response => response.json())
     .then((data: any) => data.insult);

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
          const firstError = errors[0]; // Get the first error
          const lineNumber = firstError.range.start.line + 1; // Lines start from 0, so add 1
          const lineText = await document.lineAt(firstError.range.start.line).text;
          const wordStartIndex = Math.max(0, firstError.range.start.character - 1); // Handle word at beginning of line
          const wordEndIndex = Math.min(lineText.length, firstError.range.end.character);
          const errorWord = lineText.slice(wordStartIndex, wordEndIndex);

          const insult = await fetchInsult();
          await vscode.window.showErrorMessage(`${insult} @${lineNumber} on '${errorWord}'`);
          hasShownError = true; // Mark error shown
        }

      }
     } catch (error) {
      console.error('Error checking for errors:', error);
    }
  }

  console.log('Congratulations, your extension "skillissue" is now active!');
  intervalId = setInterval(checkForErrors, 3000);
  
  // Register a command (optional)
  context.subscriptions.push(
    vscode.commands.registerCommand('skillissue.helloWorld', async () => {
      hasShownError = false;
      intervalId = setInterval(checkForErrors, 3000); // Restart interval if needed
    })
  );
  // const interval = { dispose: () => clearInterval(intervalId) }; // Wrap intervalId in an object with a dispose method

  // context.subscriptions.push(interval); // Ensure interval is cleaned up on deactivation
}

export function deactivate() {
  // clearInterval(interval); // Clear the interval on deactivation
}