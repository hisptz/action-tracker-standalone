import _ from 'lodash';


export function formatSvg(svg = "", {size, color}) {
    return _.replace(_.replace(svg, 'width="48"', `width="${size}"`), 'height="48"', `height="${size}"`).replaceAll('fill="#333333"', `fill="${color}"`);
}
