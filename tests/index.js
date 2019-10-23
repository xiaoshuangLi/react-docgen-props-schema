const fs = require('fs');
const path = require('path');
const parse = require('../parse');

// const filePath = path.join(__dirname, './tests/TSReactComponent.tsx');
const reactPath = path.join(__dirname, '../tests/ReactComponent.jsx');
const tsReactPath = path.join(__dirname, '../tests/ReactComponent.jsx');
const reactCode = fs.readFileSync(reactPath, 'utf8');
const tsReactCode = fs.readFileSync(tsReactPath, 'utf8');

const resctRes = parse(reactCode);
const tsResctRes = parse(tsReactCode);

console.log('-------------- React Component Props Schema --------------');
console.log(JSON.stringify(resctRes, null, 2));

console.log('\n\n');

console.log('-------------- Typescript/Flow React Component Props Schema --------------');
console.log(JSON.stringify(tsResctRes, null, 2));