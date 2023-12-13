const triangle = require('./index.js');


  const shape = new triangle();
  shape.setColor('blue');
  expect(shape.render()).toEqual('<polygon points="150, 18 244, 182 56, 182" fill="blue" />');

