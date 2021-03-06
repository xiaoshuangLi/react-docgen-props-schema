const ReactDocgen = require('react-docgen');
const handlers = require('./handlers');

const {
  parse: baseParse,
  defaultHandlers: baseDefaultHandlers = []
} = ReactDocgen;

const moreHandlers = [handlers.propDocHandler, handlers.schemaHandler];
const defaultHandlers = [...baseDefaultHandlers, ...moreHandlers];

const parse = (src, resolver, handlers, ...rest) => baseParse(src, resolver, handlers || defaultHandlers, ...rest);

module.exports = parse;