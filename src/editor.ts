import { EditorState } from '@codemirror/state'

import { EditorView } from '@codemirror/view'

import { markdown, markdownLanguage } from '@codemirror/lang-markdown'

import { keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor, rectangularSelection, crosshairCursor, lineNumbers, highlightActiveLineGutter } from '@codemirror/view'

import { syntaxHighlighting, indentOnInput, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language'

import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'

import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'

import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'

import { languages } from '@codemirror/language-data'

import DOMPurify from 'dompurify'

import { marked } from 'marked'

import hljs from 'highlight.js'

import katex from 'katex'

import { saveAs } from 'file-saver'

import 'katex/dist/contrib/mhchem.js'

import { basicDarkTheme, basicDarkHighlightStyle } from './theme'

//editor
const editor = new EditorView({
  state: EditorState.create({
    doc: '',
    extensions: [ 
        markdown({
          base: markdownLanguage,
          codeLanguages: languages
        }),
        basicDarkTheme,
        //lineNumbers(),
        //highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        //foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(basicDarkHighlightStyle, {fallback: true}),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          //...searchKeymap,
          ...historyKeymap,
          //...foldKeymap,
          ...completionKeymap,
          ...[indentWithTab]
        ]),
        //listen for changes when EditorView gets updated. registers function for iframe preview delay
        EditorView.updateListener.of(function(e) {
        clearTimeout(previewDelay);
        previewDelay = window.setTimeout(updatePreview, 200);
      })
    ]
  }),
  parent: document.getElementById('editor')!
})

//preview delay variable
let previewDelay: number

//preview
function updatePreview() {
  //const previewFrame = document.getElementById('preview') as HTMLIFrameElement;
  //let preview =  previewFrame.contentDocument ||  previewFrame.contentWindow!.document;

  //katex rendering 
  //credit: https://www.jingxuanqu.com/demo/marked/marked-with-katex.html

  const renderer = new marked.Renderer();

  function mathsExpression(expr: string) {
    if(expr.match(/^\$\$[\s\S]*\$\$$/)) {
      expr = expr.substr(2, expr.length - 4);
      return katex.renderToString(expr, { displayMode: true });
    } else if(expr.match(/^\$[\s\S]*\$$/)) {
      expr = expr.substr(1, expr.length - 2);
      return katex.renderToString(expr, { displayMode: false });
    }
  }
  
  const unchanged = new marked.Renderer()
  
  renderer.code = function(code: string, lang: string | undefined, escaped: boolean) {
    if(!lang) {
      const math = mathsExpression(code);
      if(math) {
        return math;
      }
    }
    return unchanged.code(code, lang, escaped);
  };
  
  renderer.codespan = function(text: string) {
    const math = mathsExpression(text);
    if(math) {
      return math;
    }
    return unchanged.codespan(text);
  };

  //set marked options
  marked.setOptions({
    //set renderer to new object renderer function
    renderer: renderer,
    //utilize highlight.js
    highlight: function(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
    langPrefix: '', //language prefix must be empty so highlightjs doesn't take precedence when using other prefixes
    gfm: true,
    breaks: true,
    headerIds: true
  })

  //sanitize html + markdown parsing
  const purifyConfig = { 
    ADD_TAGS: [/*'script',*/ 'style' /*, 'iframe'*/], 
    //FORCE_BODY: true,
    ALLOW_UNKNOWN_PROTOCOLS: true
  };

  const purifyParse = DOMPurify.sanitize(marked.parse(editor.state.doc.toString()), purifyConfig);

  /*
  //write sanitized + parsed output + client-side mermaid script to iframe preview
  preview.open()
  ///preview.write('<!DOCTYPE html>')
  //reinstall mermaid if using script
  //preview.write('<script src="node_modules/mermaid/dist/mermaid.min.js"></script>')
  //preview.write("<script>mermaid.initialize({startOnLoad: true, securityLevel: 'loose', theme: 'dark'});</script>")
  preview.write(purifyParse);
  preview.close();
  */
  
  /*
  //add preview css to iframe
  let cssShared = document.createElement('link') 
  cssShared.href = "styles/preview.css"; 
  cssShared.rel = "stylesheet"; 
  cssShared.type = "text/css";
  preview.head.appendChild(cssShared);
  
  //add katex css to the created element 'link' and append it to the iframe preview header
  let cssKatex = document.createElement('link');
  cssKatex.href = "styles/katex.min.css";
  cssKatex.rel = "stylesheet";
  cssKatex.type = "text/css";
  preview.head.appendChild(cssKatex);
  */

  const prevDiv = document.getElementById('preview');
  prevDiv!.innerHTML = `${purifyParse}`;
}
setTimeout(updatePreview, 200);

//save function (manual save)
function save() {
  let blob = new Blob([editor.state.doc.toString()], { type: "text/plain;charset=utf-8"})
  saveAs(blob, "note.md");
}

const saveButton = document.getElementById('save')!.onclick = () => {
  save();
}

//save hotkey (manual save)
document.addEventListener('keydown', (event) => {
  if(event.metaKey && event.key.toLowerCase() === 's' || event.ctrlKey && event.key.toLowerCase() === 's') {
    event.preventDefault();
    save();
  }
})

//create file (with auto save)
let createFile: { getFile: () => any; queryPermission: () => any; createWritable: () => any; };
document.getElementById('createfile')!.addEventListener('click', async () => {
    try {
        createFile = await (window).showSaveFilePicker({
            suggestedName: 'note.md'
        });
        const file = await createFile.getFile();
        const contents = await file.text();
    } catch(e) {
        console.log(e);
    }
});

document.getElementById('editor')!.addEventListener('keyup', async(e) => {
  if(typeof createFile !== "undefined") {
      if((await createFile.queryPermission()) === 'granted') {
          const writable = await createFile.createWritable();
          await writable.write(editor.state.doc.toString());
          await writable.close();
      }
  }
});

//open file (no auto save)
const open = async () => {
  let fileHandle;
  [fileHandle] = await (window).showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  const newState = EditorState.create({
    doc: contents,
    extensions: [ 
      markdown({
        base: markdownLanguage,
        codeLanguages: languages
      }),
      basicDarkTheme,
      //lineNumbers(),
      //highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      //foldGutter(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      syntaxHighlighting(basicDarkHighlightStyle, {fallback: true}),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        //...searchKeymap,
        ...historyKeymap,
        //...foldKeymap,
        ...completionKeymap,
        ...[indentWithTab]
      ]),
      EditorView.updateListener.of(function(e) {
      clearTimeout(previewDelay);
      previewDelay = window.setTimeout(updatePreview, 200);
    })
  ]
  });
  editor.setState(newState);
};

const openbtn = document.getElementById('open')!.onclick = async () => {
  await open();
}

//preview toggle
const previewToggle = document.getElementById('previewtoggle')!.onclick = () => {
  const previewVar = document.getElementById('preview');
  const editorVar = document.getElementById('editor');

  if(previewVar!.style.display === "none") {
    previewVar!.style.display = "block";
    previewVar!.style.height = "auto";
    previewVar!.style.width = "50%";
    previewVar!.style.left = "";
    editorVar!.style.width = "50%";
  } else {
    previewVar!.style.display = "none";
    previewVar!.style.height = "auto";
    previewVar!.style.width = "";
    editorVar!.style.display = "block";
    editorVar!.style.width = "";
  }
}

//full preview toggle
const fullPreview = document.getElementById('fullpreview')!.onclick = () => {
  const previewVar = document.getElementById('preview');
  const editorVar = document.getElementById('editor');

  if(editorVar!.style.display === "none") {
    editorVar!.style.display = "block";
    editorVar!.style.width = "";
    previewVar!.style.display = "none";
    previewVar!.style.height = "auto";
    previewVar!.style.left = "";
  } else {
    editorVar!.style.display = "none";
    previewVar!.style.display = "block";
    previewVar!.style.height = "auto";
    previewVar!.style.width = "100%";
    previewVar!.style.left = "170px";
  }
}