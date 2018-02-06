import { select } from 'd3-selection';
import { birthData2011 } from './birthData';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { axisBottom, axisLeft, Axis } from 'd3-axis';

const width = 500;
const height = 500;
const padding = 40;
const [xMin, xMax] = extent(birthData2011, d => d.births / d.population) as [number, number];
const [yMin, yMax] = extent(birthData2011, d => d.lifeExpectancy) as [number, number];
const [resMin, resMax] = extent(birthData2011, d => d.population / d.area) as [number, number];
const [birMin, birMax] = extent(birthData2011, d => d.births) as [number, number];

const xScale = scaleLinear()
  .domain([xMin, xMax])
  .range([padding, width - padding]);

const xAxis: any = axisBottom(xScale)
  .tickSize(-height + padding * 2)
  .tickSizeOuter(0);

const yScale = scaleLinear()
  .domain([yMin, yMax])
  .range([height - padding, padding]);

const yAxis: any = axisLeft(yScale)
  .tickSize(-height + padding * 2)
  .tickSizeOuter(0);

const colorScale = scaleLinear()
  .domain([resMin, resMax])
  .range(['lightsalmon' as any, 'lightgreen' as any]);

const circleScale = scaleLinear()
  .domain([birMin, birMax])
  .range([5, 30]);

const svg = select('svg')
  .attr('width', width)
  .attr('height', height);

svg
  .selectAll('circle')
  .data(birthData2011)
  .enter()
  .append('circle')
  .attr('fill', d => colorScale(d.population / d.area))
  .attr('cx', d => xScale(d.births / d.population))
  .attr('cy', d => yScale(d.lifeExpectancy))
  .attr('r', d => circleScale(d.births));

svg
  .append('g')
  .call(xAxis)
  .attr('transform', `translate(0, ${height - padding})`);

svg
  .append('g')
  .call(yAxis)
  .attr('transform', `translate(${padding}, 0)`);

svg
  .selectAll('g')
  .select('text')
  .style('font-size', '1.2em');

svg
  .selectAll('g')
  .selectAll('line')
  .attr('stroke', '#ccc')
  .attr('stroke-dasharray', '10 5');

svg
  .append('text')
  .attr('x', width / 2)
  .attr('y', height - padding / 4)
  .style('text-anchor', 'middle')
  .style('alignment-baseline', 'middle')
  .style('font-size', '1.3em')
  .text('Births per Capital');

svg
  .append('text')
  .attr('x', -height / 2)
  .attr('y', padding / 4)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle')
  .style('font-size', '1.3em')
  .text('Life Expectancy');

svg
  .append('text')
  .attr('x', width / 2)
  .attr('y', padding / 2)
  .style('text-anchor', 'middle')
  .style('font-size', '1.5em')
  .text('Data on Births by Country in 2011');
