const inquirer = require('inquirer');
const fs = require('fs');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
const { createSVGWindow } = require('svgdom');

const window = createSVGWindow();
const document = window.document;
registerWindow(window, document);

const questions = [
    { type: 'input', name: 'text', message: 'Enter up to three characters:', validate: input => input.length <= 3 && input.length > 0 },
    { type: 'input', name: 'textColor', message: 'Enter text color (you can use keyword or hex code):', validate: input => /^#?([a-f0-9]{6}|[a-f0-9]{3})$/.test(input) },
    { type: 'list', name: 'shape', message: 'Choose a shape:', choices: ['circle', 'triangle', 'square'] },
    { type: 'input', name: 'shapeColor', message: 'Enter a shape color (you can use keyword or hex code):', validate: input => /^#?([a-f0-9]{6}|[a-f0-9]{3})$/.test(input) },
]