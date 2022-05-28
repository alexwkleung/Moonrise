//import { basicSetup } from '@codemirror/basic-setup';

import { EditorState } from '@codemirror/state';

import { EditorView } from '@codemirror/view';

import { markdown } from '@codemirror/lang-markdown';

//import { oneDark } from '@codemirror/theme-one-dark';

import { keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor, rectangularSelection, crosshairCursor,lineNumbers, highlightActiveLineGutter } from "@codemirror/view"

import { syntaxHighlighting, HighlightStyle, indentOnInput, bracketMatching, foldGutter, foldKeymap } from "@codemirror/language"

import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"

import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"

import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete"

import { tags } from '@lezer/highlight';

//modified one dark theme.
//credit: https://github.com/codemirror/theme-one-dark
//base theme was taken from the npm install version.

//colours
const chalky = "#e5c07b", 
    coral = "#e06c75", 
    cyan = "#56b6c2",
    invalid = "#ffffff", 
    ivory = "#abb2bf", 
    stone = "#7d8799",
    malibu = "#61afef", 
    sage = "#98c379", 
    whiskey = "#d19a66", 
    violet = "#c678dd", 
    darkBackground = "#21252b", 
    highlightBackground = "#2c313a",
    background = "#282c34", 
    tooltipBackground = "#353a42", 
    selection = "#3E4451", 
    cursor = "#528bff"

//theme - base
const oneDarkTheme = /*@__PURE__*/EditorView.theme({
    "&": {
        color: ivory,
        backgroundColor: background,
        fontSize: "14px"
    },
    ".cm-content": {
        caretColor: cursor
    },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor, borderLeft: "1px solid", borderRight: ".5em solid", opacity: "0.7"},
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: selection },
    ".cm-panels": { backgroundColor: darkBackground, color: ivory },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
    ".cm-searchMatch": {
        backgroundColor: "#72a1ff59",
        outline: "1px solid #457dff"
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: "#6199ff2f"
    },
    ".cm-activeLine": { backgroundColor: highlightBackground },
    ".cm-selectionMatch": { backgroundColor: "#aafe661a" },
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
        backgroundColor: "#bad0f847",
        outline: "1px solid #515a6b"
    },
    ".cm-gutters": {
        backgroundColor: background,
        color: stone,
        border: "none"
    },
    ".cm-activeLineGutter": {
        backgroundColor: highlightBackground
    },
    ".cm-foldPlaceholder": {
        backgroundColor: "transparent",
        border: "none",
        color: "#ddd"
    },
    ".cm-tooltip": {
        border: "none",
        backgroundColor: tooltipBackground
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
        borderTopColor: "transparent",
        borderBottomColor: "transparent"
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
        borderTopColor: tooltipBackground,
        borderBottomColor: tooltipBackground
    },
    ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
            backgroundColor: highlightBackground,
            color: ivory
        }
    }
}, { dark: true });

//highlighting 
const oneDarkHighlightStyle = /*@__PURE__*/HighlightStyle.define([
    { tag: tags.keyword,
        color: violet },
    { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
        color: coral },
    { tag: [/*@__PURE__*/tags.function(tags.variableName), tags.labelName],
        color: malibu },
    { tag: [tags.color, /*@__PURE__*/tags.constant(tags.name), /*@__PURE__*/tags.standard(tags.name)],
        color: whiskey },
    { tag: [/*@__PURE__*/tags.definition(tags.name), tags.separator],
        color: ivory },
    { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace],
        color: chalky },
    { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, /*@__PURE__*/tags.special(tags.string)],
        color: cyan },
    { tag: [tags.meta, tags.comment],
        color: stone },
    { tag: tags.strong,
        fontWeight: "bold" },
    { tag: tags.emphasis,
        fontStyle: "italic" },
    { tag: tags.strikethrough,
        textDecoration: "line-through" },
    { tag: tags.link,
        color: stone,
        textDecoration: "underline" },
    { tag: tags.heading,
        fontWeight: "bold",
        color: coral },
    { tag: [tags.atom, tags.bool, /*@__PURE__*/tags.special(tags.variableName)],
        color: whiskey },
    { tag: [tags.processingInstruction, tags.string, tags.inserted],
        color: sage },
    { tag: tags.invalid,
        color: invalid },
]);

//editor
let editor = new EditorView({
  state: EditorState.create({
    extensions: [
        //basicSetup, 
        markdown(),
        oneDarkTheme,
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(oneDarkHighlightStyle, {fallback: true}),
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
        ])
    ]
  }),
  parent: document.body
})