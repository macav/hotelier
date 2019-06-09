import ansi2HTML from 'ansi2html';
import escapeHTML from 'escape-html';

function blankLine(val) {
  return val.trim() === '' ? '&nbsp;' : val;
}

export function formatLines(str) {
  return str
    .replace(/\n$/, '')
    .split('\n')
    .map(escapeHTML)
    .map(blankLine)
    .map(ansi2HTML);
}
