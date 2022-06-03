import { EditorState } from '@codemirror/state';

import { EditorView } from '@codemirror/view';

import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

import { keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor, rectangularSelection, crosshairCursor,lineNumbers, highlightActiveLineGutter } from '@codemirror/view'

import { syntaxHighlighting, HighlightStyle, indentOnInput, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language'

import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'

import { searchKeymap, highlightSelectionMatches } from '@codemirror/search'

import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'

import { tags } from '@lezer/highlight';

import { languages } from '@codemirror/language-data';

import DOMPurify from 'dompurify';

import { marked } from 'marked';

import hljs from 'highlight.js';

import katex from 'katex';

import { saveAs } from 'file-saver';

import 'katex/dist/contrib/mhchem.js';

//basic-dark theme (modified)
//credit: https://github.com/craftzdog/cm6-themes/tree/main/packages/basic-dark

//theme colours - base
const base00 = '#2E3235',
  base01 = '#DDDDDD',
  base02 = '#5e676e',
  base03 = '#b0b0b0',
  //base04 = '#d0d0d0',
  base05 = '#e0e0e0',
  base06 = '#808080',
  base07 = '#000000',
  base08 = '#A54543',
  base09 = '#fc6d24',
  base0A = '#fda331',
  base0B = '#8abeb7',
  base0C = '#b5bd68',
  base0D = '#6fb3d2',
  base0E = '#cc99cc',
  base0F = '#6987AF'

//theme colours - invalid
const invalid = base09,
  darkBackground = '#292d30',
  highlightBackground = base02 + '30',
  background = base00,
  tooltipBackground = base01,
  selection = '#202325',
  cursor = base01

//editor theme styles
const basicDarkTheme = EditorView.theme(
  {
    '&': {
      color: base01,
      backgroundColor: background,
      fontSize: "14px"
    },

    '.cm-content': {
      caretColor: cursor
    },

    '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor, borderLeft: "0px solid", borderRight: ".5em solid", opacity: "0.7" },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: selection },

    '.cm-panels': { backgroundColor: darkBackground, color: base03 },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

    '.cm-searchMatch': {
      backgroundColor: base02,
      outline: `1px solid ${base03}`,
      color: base07
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: base05,
      color: base07
    },

    '.cm-activeLine': { backgroundColor: highlightBackground },
    '.cm-selectionMatch': { backgroundColor: highlightBackground },

    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      outline: `1px solid ${base03}`
    },

    '&.cm-focused .cm-matchingBracket': {
      backgroundColor: base02,
      color: base07
    },

    '.cm-gutters': {
      borderRight: `1px solid #ffffff10`,
      color: base06,
      backgroundColor: darkBackground
    },

    '.cm-activeLineGutter': {
      backgroundColor: highlightBackground
    },

    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: base02
    },

    '.cm-tooltip': {
      border: 'none',
      backgroundColor: tooltipBackground
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: highlightBackground,
        color: base03
      }
    }
  },
  { dark: true }
)

//editor highlighting
const basicDarkHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: base0A },
  {
    tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
    color: base0C
  },
  { tag: [tags.variableName], color: base0D },
  { tag: [tags.function(tags.variableName)], color: base0A },
  { tag: [tags.labelName], color: base09 },
  {
    tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: base0A
  },
  { tag: [tags.definition(tags.name), tags.separator], color: base0E },
  { tag: [tags.brace], color: base0E },
  {
    tag: [tags.annotation],
    color: invalid
  },
  {
    tag: [tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace],
    color: base0A
  },
  {
    tag: [tags.typeName, tags.className],
    color: base0D
  },
  {
    tag: [tags.operator, tags.operatorKeyword],
    color: base0E
  },
  {
    tag: [tags.tagName],
    color: base0A
  },
  {
    tag: [tags.squareBracket],
    color: base0E
  },
  {
    tag: [tags.angleBracket],
    color: base0E
  },
  {
    tag: [tags.attributeName],
    color: base0D
  },
  {
    tag: [tags.regexp],
    color: base0A
  },
  {
    tag: [tags.quote],
    color: base01
  },
  { tag: [tags.string], color: base0C },
  {
    tag: tags.link,
    color: base0F,
    textDecoration: 'underline',
    textUnderlinePosition: 'under'
  },
  {
    tag: [tags.url, tags.escape, tags.special(tags.string)],
    color: base0B
  },
  { tag: [tags.meta], color: base08 },
  { tag: [tags.comment], color: base06, fontStyle: 'italic' },
  { tag: tags.monospace, color: base01 },
  { tag: tags.strong, fontWeight: 'bold', color: base0A },
  { tag: tags.emphasis, fontStyle: 'italic', color: base0D },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.heading, fontWeight: 'bold', color: base01 },
  { tag: tags.special(tags.heading1), fontWeight: 'bold', color: base01 },
  { tag: tags.heading1, fontWeight: 'bold', color: base01 },
  {
    tag: [tags.heading2, tags.heading3, tags.heading4],
    fontWeight: 'bold',
    color: base01
  },
  {
    tag: [tags.heading5, tags.heading6],
    color: base01
  },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: base0B },
  {
    tag: [tags.processingInstruction, tags.inserted],
    color: base0B
  },
  {
    tag: [tags.contentSeparator],
    color: base0D
  },
  { tag: tags.invalid, color: base02, borderBottom: `1px dotted ${invalid}` }
])

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
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
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
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...[indentWithTab]
        ]),
        //listen for changes when EditorView gets updated. registers function for iframe preview delay
        EditorView.updateListener.of(function(e) {
        clearTimeout(previewDelay);
        previewDelay = window.setTimeout(updatePreview, 250);
      })
    ]
  }),
  parent: document.getElementById('editor')!
})

//preview delay variable
let previewDelay: number

//iframe preview
function updatePreview() {
  const previewFrame = document.getElementById('preview') as HTMLIFrameElement;
  let preview =  previewFrame.contentDocument ||  previewFrame.contentWindow!.document;

  //katex rendering 
  //credit: https://www.jingxuanqu.com/demo/marked/marked-with-katex.html

  const renderer = new marked.Renderer();

  function mathsExpression(expr: string) {
    if (expr.match(/^\$\$[\s\S]*\$\$$/)) {
      expr = expr.substr(2, expr.length - 4);
      return katex.renderToString(expr, { displayMode: true });
    } else if (expr.match(/^\$[\s\S]*\$$/)) {
      expr = expr.substr(1, expr.length - 2);
      return katex.renderToString(expr, { displayMode: false });
    }
  }
  
  const unchanged = new marked.Renderer()
  
  renderer.code = function(code: string, lang: string | undefined, escaped: boolean) {
    if (!lang) {
      const math = mathsExpression(code);
      if (math) {
        return math;
      }
    }
    return unchanged.code(code, lang, escaped);
  };
  
  renderer.codespan = function(text: string) {
    const math = mathsExpression(text);
    if (math) {
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
    langPrefix: '',
    gfm: true,
    breaks: true,
    headerIds: true
  })

  //sanitize html + markdown parsing
  const purifyConfig = { 
    ADD_TAGS: ['script', 'style', 'iframe'], 
    FORCE_BODY: true,
    ALLOW_UNKNOWN_PROTOCOLS: true
  };

  let purifyParse = DOMPurify.sanitize(marked.parse(editor.state.doc.toString()), purifyConfig);

  //write sanitized + parsed output + client-side mermaid script to iframe preview
  preview.open()
  ///preview.write('<!DOCTYPE html>')
  preview.write(purifyParse);
  preview.write('<script src="node_modules/mermaid/dist/mermaid.min.js"></script>')
  //Desmos API (remote source) currently causes memory leaks due to the remote source.
  //preview.write('<script src="https://www.desmos.com/api/v1.4/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>')
  //preview.write('<script src="node_modules/chart.js/dist/chart.min.js"></script>')
  preview.write("<script>mermaid.initialize({startOnLoad: true, securityLevel: 'loose', theme: 'dark'});</script>")
  preview.close();

  //share the style.css to the created element 'link'
  let cssShared = document.createElement('link') 
  cssShared.href = "styles/style.css"; 
  cssShared.rel = "stylesheet"; 
  cssShared.type = "text/css";
  //append the shared css of element 'link' to iframe preview
  preview.head.appendChild(cssShared);

  //add katex css to the created element 'link' and append it to the iframe preview header
  let cssKatex = document.createElement('link');
  cssKatex.href = "styles/katex.min.css";
  cssKatex.rel = "stylesheet";
  cssKatex.type = "text/css";
  preview.head.appendChild(cssKatex);

  //chartjs script 
  const chartJsLoad = document.createElement('script');
  chartJsLoad.src = "node_modules/chart.js/dist/chart.min.js";
  preview.body.appendChild(chartJsLoad);
}
setTimeout(updatePreview, 250);

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
        createFile = await (<any>window).showSaveFilePicker({
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
      if ((await createFile.queryPermission()) === 'granted') {
          const writable = await createFile.createWritable();
          await writable.write(editor.state.doc.toString());
          await writable.close();
      }
  }
});

//open file (no auto save)
let fileHandle;
const open = async () => {
  [fileHandle] = await (<any>window).showOpenFilePicker();
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
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
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
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...[indentWithTab]
      ]),
      EditorView.updateListener.of(function(e) {
      clearTimeout(previewDelay);
      previewDelay = window.setTimeout(updatePreview, 250);
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
  if(previewVar!.style.display === "none") {
    previewVar!.style.display = "block";
    previewVar!.style.height = "10000px";
    previewVar!.style.width = "50%";
  } else {
     previewVar!.style.display = "none";
  }
};