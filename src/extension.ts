import * as vscode from 'vscode';

let hasShownError = false; 
const languages = {
  "Arabic" : "ar",
  "Azerbaijani" : "az",
  "Bengali" : "bn",
  "Czech" : "cs",
  "German" : "de",
  "Greek" : "el",
  "English" : "en",
  "Spanish" : "es",
  "French" : "fr",
  "Hindi" : "hi",
  "Hebrew" : "he",
  "Indonesian" : "id",
  "Italian" : "it",
  "Japanese" : "ja",
  "Korean" : "ko",
  "Latin" : "la",
  "Marathi" : "mr",
  "Polish" : "pl",
  "Portuguese" : "pt",
  "Romanian" : "ro",
  "Russian" : "ru",
  "Swahili" : "sw",
  "Tamil" : "ta",
  "Tegulu" : "te",
  "Turkish" : "tr",
  "Urdu" : "ur",
  "Vietnamese" : "vi"
  }

export function activate(context: vscode.ExtensionContext) {

  let langSelect = vscode.commands.registerCommand('skillissue.selectLanguage', async () => {
    const options = Object.keys(languages);
    const selectedLanguage = await vscode.window.showQuickPick(options, {
      placeHolder: 'SkillIssue: Select a language',
    });

    if (selectedLanguage) {
      const languageCode = languages[selectedLanguage as keyof typeof languages]; 
      vscode.window.showInformationMessage(`You selected: ${selectedLanguage}`);
      vscode.window.showInformationMessage(`Call Skill Issue Function`);

      context.globalState.update('selectedLanguage', languageCode);
    }
  });

  async function fetchInsult(lang: string) {
    const url = `https://evilinsult.com/generate_insult.php?lang=${lang}&type=json`;
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
      const diagnostics = vscode.languages.getDiagnostics(document.uri);

      if (diagnostics.length > 0 && !hasShownError) {
        const errors = diagnostics.filter(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error);
        if (errors.length > 0) {
          const firstError = errors[0];
          const lineNumber = firstError.range.start.line + 1; 
          const lineText = document.lineAt(firstError.range.start.line).text;
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
     } catch (error) {
      console.error('Error checking for errors:', error);
    }

  }

  console.log('Congratulations, your extension "skillissue" is now active!');
  
  
  context.subscriptions.push(
    vscode.commands.registerCommand('skillissue.helloWorld', async () => {
      hasShownError = false;
      // intervalId = setInterval(checkForErrors, 8000);
      vscode.workspace.onDidSaveTextDocument(checkForErrors);
      // const state = vscode.window.terminals;
      // console.log('Terminals: ', state);  
      // vscode.window.showInformationMessage(`Hello World from SkillIssue! ${state}`);
    })
  );
}

