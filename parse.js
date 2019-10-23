const ReactDocgen = require('react-docgen');
const handlers = require('./handlers');

const {
  parse: baseParse,
  defaultHandlers: baseDefaultHandlers = []
} = ReactDocgen;

const moreHandlers = Object.values(handlers);
const defaultHandlers = [...baseDefaultHandlers, ...moreHandlers];

const parse = (src, resolver, handlers = defaultHandlers, options) => baseParse(src, resolver, handlers);

module.exports = parse;