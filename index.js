// import inquirer, fs, and svg.js
const inquirer = require('inquirer'); 
const fs = require('fs');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

// Import svgdom to create SVG window
let createSVGWindow;
import('svgdom').then((svgdom) => {
    createSVGWindow = svgdom.createSVGWindow;
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);

    //  Validate color input
    function isValidColor(input) {
        const hexColorRegex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;
        const colorKeywords = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
        return hexColorRegex.test(input) || colorKeywords.includes(input.toLowerCase());
    }

    // Questions to ask user
    const questions = [
        { type: 'input', name: 'text', message: 'Enter up to three characters:', validate: input => input.length <= 3 && input.length > 0 },
        { type: 'input', name: 'textColor', message: 'Enter text color (you can use keyword or hex code):', validate: isValidColor },
        { type: 'list', name: 'shape', message: 'Choose a shape:', choices: ['circle', 'triangle', 'square'] },
        { type: 'input', name: 'shapeColor', message: 'Enter a shape color (you can use keyword or hex code):', validate: isValidColor },
    ];

    // Generate SVG based on user input
    function generateSVG({ text, textColor, shape, shapeColor }) {
        const canvas = SVG().size(300, 200);
        let shapeElement;
        let shapeSize = 100; 
        let textSize = shapeSize / 3; 

        // Adjust shape size and text size based on shape type
        switch (shape) {
            case 'circle':
                shapeElement = canvas.circle(shapeSize).fill(shapeColor).cx(150).cy(100); // Create circle
                break;
            case 'triangle':
                const triangleHeight = Math.sqrt(3) / 2 * shapeSize; // Calculate height of triangle
                shapeElement = canvas.polygon(`0,${triangleHeight} ${shapeSize / 2},0 ${shapeSize},${triangleHeight}`).fill(shapeColor); // Create triangle
                shapeElement.cx(150).cy(100);
                break;
            case 'square':
                shapeElement = canvas.rect(shapeSize, shapeSize).fill(shapeColor).cx(150).cy(100); // Create square
                break;
        }

        const bbox = shapeElement.bbox();

        // Create text element and center it in the shape
        const textElement = canvas.text(text)
            .fill(textColor)
            .font({ size: textSize })
            .attr({
                'text-anchor': 'middle',
                'dominant-baseline': 'middle'
            });

        if (shape === 'triangle') {

            textElement.center(bbox.cx, bbox.cy + textSize / 3); // Adjust text position for triangle
        } else {

            textElement.center(bbox.cx, bbox.cy); // Center text in shape
        }

        fs.writeFileSync('logo.svg', canvas.svg()); // Write SVG to file
    }

    // Ask user questions and generate SVG
    inquirer.prompt(questions).then(answers => {
        generateSVG(answers);
        console.log('Generated logo.svg successfully!')
    });
});
