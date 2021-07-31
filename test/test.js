const assert = require('chai').assert;
var app = require('../app.js');


//sample test. can add more if necessary
describe('bmi calculator', () => {
    
    //if data file not exists, return 0
    it('should return 0 on invalid paths', () => {
        assert.equal(app('hello.json', 'result.json'), 0);
    });
});