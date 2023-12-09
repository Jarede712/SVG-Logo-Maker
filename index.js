// install required packages: npm install inquirer svg.js svgdom
const inquirer = require('inquirer'); 
const fs = require('fs');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

let createSVGWindow;
import('svgdom').then((svgdom) => {
    createSVGWindow = svgdom.createSVGWindow;
    const window = createSVGWindow(); // create a new window instance
    const document = window.document; // get the document object from window
    registerWindow(window, document); // register window and document

    function isValidColor(input) {
    // Regular expression to check if it's a valid hex color code
    const hexColorRegex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;

    // List of common color keywords
    const colorKeywords = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];

    // Check if the input is a valid hex code or a color keyword
    return hexColorRegex.test(input) || colorKeywords.includes(input.toLowerCase());
}

    const questions = [
        { type: 'input', name: 'text', message: 'Enter up to three characters:', validate: input => input.length <= 3 && input.length > 0 },
        { type: 'input', name: 'textColor', message: 'Enter text color (you can use keyword or hex code):', validate: isValidColor },
        { type: 'list', name: 'shape', message: 'Choose a shape:', choices: ['circle', 'triangle', 'square'] },
        { type: 'input', name: 'shapeColor', message: 'Enter a shape color (you can use keyword or hex code):', validate: isValidColor },
    ];

    function generateSVG({ text, textColor, shape, shapeColor }) {
        const canvas = SVG().size(300, 200);
    
        let shapeElement;
        switch (shape) {
            case 'circle':
                shapeElement = canvas.circle(100).fill(shapeColor);
                break;
            case 'triangle':
                shapeElement = canvas.polygon('0,100 50,0 100,100').fill(shapeColor);
                break;
            case 'square':
                shapeElement = canvas.rect(100, 100).fill(shapeColor);
                break;
        }
        shapeElement.cx(150).cy(100);
    
        const textElement = canvas.text(text)
            .fill(textColor)
            .font({ size: 60 })
            .attr({ 'text-anchor': 'middle' });
        
        // Center the text based on the center of the canvas, not the bounding box of the text
        const textWidth = textElement.length();
        const textHeight = textElement.font('size');
    
        // Center the text by setting the x and y position
        textElement.cx(150).cy(100 + textHeight / 2);
    
        fs.writeFileSync('logo.svg', canvas.svg());
    }function generateSVG({ text, textColor, shape, shapeColor }) {
        const canvas = SVG().size(300, 200);
    
        let shapeElement;
        switch (shape) {
            case 'circle':
                shapeElement = canvas.circle(100).fill(shapeColor);
                break;
            case 'triangle':
                shapeElement = canvas.polygon('0,100 50,0 100,100').fill(shapeColor);
                break;
            case 'square':
                shapeElement = canvas.rect(100, 100).fill(shapeColor);
                break;
        }
        shapeElement.cx(150).cy(100);
    
        const textElement = canvas.text(text)
            .fill(textColor)
            .font({ size: 60, anchor: 'middle' })
            .move(150, 100);
    
        // Get the bounding box of the text element
        const bbox = textElement.bbox();
        // Adjust the position of the text element based on its bounding box
        textElement.move(150 - bbox.width / 2, 100 - bbox.height / 2);
    
        fs.writeFileSync('logo.svg', canvas.svg());
    }
    

    inquirer.prompt(questions).then(answers => {
        generateSVG(answers);
        console.log('Generated logo.svg successfully!')
    });
});