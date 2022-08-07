import { EditorView } from '@codemirror/view'
import { tags } from '@lezer/highlight'
import { HighlightStyle } from '@codemirror/language'

//basic-dark theme (modified)
//credit: https://github.com/craftzdog/cm6-themes/tree/main/packages/basic-dark

//theme colours - base
const base00 = '#2E3235',
  base01 = '#DDDDDD',
  base02 = '#535c63',
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
export const basicDarkTheme = EditorView.theme(
  {
    '&': {
      color: base01,
      backgroundColor: background,
      fontSize: "14px"
    },

    '.cm-content': {
      caretColor: cursor
    },

    '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor, borderLeft: "0px solid", borderRight: "0.6em solid", opacity: "0.7" },
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
export const basicDarkHighlightStyle = HighlightStyle.define([
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