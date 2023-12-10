const inquirer = require('inquirer'); 
const fs = require('fs');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

let createSVGWindow;
import('svgdom').then((svgdom) => {
    createSVGWindow = svgdom.createSVGWindow;
    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);

    function isValidColor(input) {
        const hexColorRegex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;
        const colorKeywords = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
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
        let shapeSize = 100; // Default shape size
        let textSize = shapeSize / 3; // Calculate text size as a fraction of shape size

        switch (shape) {
            case 'circle':
                shapeElement = canvas.circle(shapeSize).fill(shapeColor).cx(150).cy(100);
                break;
            case 'triangle':
                const triangleHeight = Math.sqrt(3) / 2 * shapeSize;
                shapeElement = canvas.polygon(`0,${triangleHeight} ${shapeSize / 2},0 ${shapeSize},${triangleHeight}`).fill(shapeColor);
                shapeElement.cx(150).cy(100);
                break;
            case 'square':
                shapeElement = canvas.rect(shapeSize, shapeSize).fill(shapeColor).cx(150).cy(100);
                break;
        }

        // Get the bounding box of the shape for positioning the text
        const bbox = shapeElement.bbox();

        const textElement = canvas.text(text)
            .fill(textColor)
            .font({ size: textSize })
            .attr({
                'text-anchor': 'middle',
                'dominant-baseline': 'middle'
            });

        if (shape === 'triangle') {
            // For a triangle, adjust the text position manually a bit to cater for visual centering
            textElement.center(bbox.cx, bbox.cy + textSize / 3);
        } else {
            // For circle and square, we can center the text directly
            textElement.center(bbox.cx, bbox.cy);
        }

        fs.writeFileSync('logo.svg', canvas.svg());
    }

    inquirer.prompt(questions).then(answers => {
        generateSVG(answers);
        console.log('Generated logo.svg successfully!')
    });
});
