import { select, event } from 'd3-selection';

type Character = { char: string; count: number };

select('#countButton').on('click', () => {
  event.preventDefault();
  const input = select('input');
  const inputText: string = input.property('value');

  const values: Character[] = inputText
    .split('')
    .sort()
    .reduce(
      (acc: Character[], cur: string) => {
        const index = acc.findIndex(a => a.char === cur);
        const val = { char: cur, count: 1 };
        const newArr = acc.slice();
        if (index >= 0) {
          newArr[index].count += 1;
          return [...newArr];
        }

        return [...newArr, val];
      },
      [] as Character[]
    );
  const letters = select('#letters').selectAll('div');

  const updated = letters.classed('new', false).data(values, d => {
    return (d as Character).char;
  });

  updated.exit().remove();

  updated
    .enter()
    .append('div')
    .classed('letter new', true)
    .merge(updated)
    .style('margin', '0 5px')
    .style('width', '20px')
    .text(d => d.char)
    .style('height', d => d.count * 30 + 'px');

  select('#phrase').text(`Analysis of: ${inputText}`);
  select('#count').text(`(New characters: ${updated.enter().nodes().length})`);
  input.property('value', '');
});
