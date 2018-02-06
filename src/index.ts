import { select, event, selectAll } from 'd3-selection';
import { birthData } from './birthData';

type Character = {
  char: string;
  count: number;
};

let width = 700;
let height = 300;
let padding = 20;

select('#reset').on('click', function() {
  selectAll('.letter').remove();

  select('#phrase').text('');

  select('#count').text('');
});

select('form').on('submit', function() {
  event.preventDefault();
  let input = select('input');
  let text = input.property('value');
  let freq = getFrequencies(text);

  let letters = select('svg')
    .attr('width', width)
    .attr('height', height)
    .selectAll('g')
    .data(freq, function(d) {
      return (d as Character).char;
    });

  letters.select('rect').attr('fill', 'yellow');

  letters.exit().remove();

  const bar = letters.enter().append('g');

  bar.append('rect').attr('fill', 'green');
  bar.append('text');

  bar
    .merge(letters)
    .select('rect')
    .attr('x', (d, i) => {
      return i * width / freq.length;
    })
    .attr('width', () => width / freq.length - padding)
    .attr('y', d => {
      return height - d.count * 20;
    })
    .attr('height', d => d.count * 20);

  bar
    .merge(letters)
    .select('text')
    .text(d => d.char)
    .attr('x', (d, i) => i * width / freq.length + (width / freq.length - padding) / 2)
    .attr('y', d => height - d.count * 20 - 6)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'baseline')
    .attr('font-size', '1.5em');

  select('#phrase').text('Analysis of: ' + text);

  select('#count').text('(New characters: ' + letters.enter().nodes().length + ')');

  input.property('value', '');
});

function getFrequencies(str: string) {
  let sorted = str.split('').sort();
  let data: Character[] = [];
  for (let i = 0; i < sorted.length; i++) {
    let last = data[data.length - 1];
    if (last && last.char === sorted[i]) last.count++;
    else data.push({ char: sorted[i], count: 1 });
  }
  return data;
}
