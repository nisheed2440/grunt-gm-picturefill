'use strict';
var _ = require('underscore');
var grunt = require('grunt');
var gm = require('gm');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.gm_picturefill = {
    setUp: function(done) {
        // setup here if necessary
        var self = this;
        self.filesList = {
            xs: './test/expected/node-js-xs.png',
            sm: './test/expected/node-js-sm.png',
            md: './test/expected/node-js-md.png',
            lg: './test/expected/node-js-lg.png',
            txs: './tmp/node-js-xs.png',
            tsm: './tmp/node-js-sm.png',
            tmd: './tmp/node-js-md.png',
            tlg: './tmp/node-js-lg.png'
        };
        self.exptProcessed = 0;
        self.testProcessed = 0;
        self.dims = {};

        _.each(self.filesList, function(value, key) {
            gm(value).size(function(err, size) {
                self.dims[key] = {
                    width: size.width,
                    height: size.height
                };
                self.exptProcessed++;
                if (self.exptProcessed === 8) {
                    done();
                }
            });
        });
    },
    default_options: function(test) {
        var self = this;

        test.expect(8);
        //XS TESTING
        test.equals(self.dims.xs.width,self.dims.txs.width,'XS WIDTH TEST FAILED');
        test.equals(self.dims.xs.height,self.dims.txs.height,'XS HEIGHT TEST FAILED'); 
        //SM TESTING
        test.equals(self.dims.sm.width,self.dims.tsm.width,'SM WIDTH TEST FAILED');
        test.equals(self.dims.sm.height,self.dims.tsm.height,'SM HEIGHT TEST FAILED'); 
        //MD TESTING
        test.equals(self.dims.md.width,self.dims.tmd.width,'MD WIDTH TEST FAILED');
        test.equals(self.dims.md.height,self.dims.tmd.height,'MD HEIGHT TEST FAILED');
        //LG TESTING
        test.equals(self.dims.lg.width,self.dims.tlg.width,'LG WIDTH TEST FAILED');
        test.equals(self.dims.lg.height,self.dims.tlg.height,'LG HEIGHT TEST FAILED');

        test.done();
    }
};