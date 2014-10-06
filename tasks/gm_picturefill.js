/*
 * grunt-gm-picturefill
 *
 *
 * Copyright (c) 2014 Nisheed Jagadish
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore');
var path = require('path');
var gm = require('gm');
var jade = require('jade');
var fs = require('fs');


module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('gm_picturefill', 'Plugin to crop or resize images to work with picturefill plugin or the picture element', function() {

        var _this = this;

        var _done = this.async();

        var _allowedFileTypes = ['png', 'jpg', 'jpeg', 'gif'];

        var _srcFiles = [];

        var _srcFilesCount = 0;

        var _resizedFilesCount = 0;

        var _optionsErrCount = 0;

        var _filesBreakpointList = {};


        // Merge task-specific and/or target-specific options with these defaults.
        var _options = this.options({
            picturefill: [{
                breakpoint: '320px',
                prefix: 'xs',
                size: {
                    width: 320,
                    height: 320
                },
                quality: 100
            }, {
                breakpoint: '768px',
                prefix: 'sm',
                size: {
                    width: 768,
                    height: 768
                },
                quality: 100
            }, {
                breakpoint: '1024px',
                prefix: 'md',
                size: {
                    width: 1024,
                    height: 1024
                },
                quality: 100
            }],
            createSample: true,
            sampleOutputPath: './'
        });

        /** 
         * Function to sanitize and retrieve only the required options
         * @return {null}
         */
        var _sanitizeOptions = function() {
            _options.picturefill = _.filter(_options.picturefill, function(value, key) {
                if (value.hasOwnProperty('breakpoint') && value.hasOwnProperty('size')) {
                    return value;
                } else {
                    grunt.log.error('Option does not have either a breakpoint or size attribute !!!');
                    grunt.log.errorlns(JSON.stringify(value, null, 4));
                    _optionsErrCount++;
                    return;
                }
            });
            return;
        };

        /**
         * Function to sort breakpoints available
         * @return {Number}
         */
        var _sortBreakpoints = function() {
            _.each(_filesBreakpointList, function(el, index, list) {
                list[index] = _.sortBy(el, function(o) {
                    return parseInt(o.bp);
                }).reverse();
            });

            return _filesBreakpointList;
        };


        var _renderPicturefillTpl = function() {
            var html = jade.renderFile('./template/picturefill.jade', {
                pretty: true,
                data: _filesBreakpointList
            });

            grunt.file.mkdir(path.join(_options.sampleOutputPath, 'picturefill_sample'));

            grunt.file.copy(path.join('template', 'picturefill.min.js'), path.join(_options.sampleOutputPath, 'picturefill_sample', 'picturefill.min.js'));

            fs.writeFile(path.join(_options.sampleOutputPath, 'picturefill_sample', 'index.html'), html, function(err) {
                if (err) {
                    grunt.fail.warn('Sample Picturefill template could not be created');
                } else {
                    grunt.log.ok('Sample Picturefill template created successfully');
                }
            });
        };

        /**
         * Function to check if the current file extension belongs to one of the allowed file extentions
         * @param  {String} filePath
         * @return {Boolean}
         */
        var _checkFileExt = function(filePath) {
            return _.contains(_allowedFileTypes, path.extname(filePath).substring(1).toLowerCase());
        };

        /**
         * Function to check if the current file path is a file and check file extension
         * @param  {String} filePath
         * @return {Boolean}
         */
        var _checkIsFile = function(filePath) {
            if (grunt.file.isFile(filePath) === true) {
                if (_checkFileExt(filePath) === true) {
                    //utilize the settings object to run the resizing
                    return true;
                } else {
                    grunt.log.error(filePath + ' doesn\'t match the required file types');
                    return false;
                }
            }
            return false;
        };

        var _gmItterateOptions = function() {
            for (var i = 0; i < _options.picturefill.length; i++) {
                _gmItterateFiles(_options.picturefill[i]);
            }
        };

        /**
         * Function to itterate over all the files in the _srcFilesCount array
         * @return {null}
         */
        var _gmItterateFiles = function(option) {
            _srcFilesCount = _srcFiles.length;
            for (var i = 0; i < _srcFiles.length; i++) {
                _gmResize(_srcFiles[i], option);
            }
        };





        var _gmResizeFiles = function(fileObj, option, fileName, fileExt, keepOriginalDims, width, height) {

            var imgWidth = (keepOriginalDims === true) ? width : option.size.width;
            var imgHeight = (keepOriginalDims === true) ? height : option.size.height;

            var originalFileName = path.basename(fileObj.src, fileExt);

            gm(fileObj.src)
                .resize(imgWidth, imgHeight)
                .quality(option.quality)
                .write(path.join(fileObj.dest, fileName + fileExt), function(err) {
                    if (!err) {
                        _resizedFilesCount++;

                        if (!_filesBreakpointList.hasOwnProperty(originalFileName)) {
                            _filesBreakpointList[originalFileName] = [];
                            _filesBreakpointList[originalFileName].push({
                                mq: '(min-width: ' + option.breakpoint + ')',
                                path: path.join(fileObj.dest, fileName + fileExt),
                                ext: fileExt,
                                bp: option.breakpoint.match(/\d+/)[0]
                            });
                        } else {
                            _filesBreakpointList[originalFileName].push({
                                mq: '(min-width: ' + option.breakpoint + ')',
                                path: path.join(fileObj.dest, fileName + fileExt),
                                ext: fileExt,
                                bp: option.breakpoint.match(/\d+/)[0]
                            });
                        }

                        if (_resizedFilesCount >= (_srcFilesCount * _options.picturefill.length)) {
                            if (_options.createSample === true) {
                                _sortBreakpoints();
                                _renderPicturefillTpl();
                            }
                            _done(true);
                        }

                    } else {
                        console.log(err);
                        _done(false);
                    }
                });
        };

        /**
         * Function to resize the files based on the options provided
         * @param  {Object} fileObj The file src and dest object
         * @return {null}
         */
        var _gmResize = function(fileObj, option) {
            var fileExt = path.extname(fileObj.src);
            var fileName = path.basename(fileObj.src, fileExt);
            fileName += (option.hasOwnProperty('prefix') && option.prefix !== '') ? '-' + option.prefix : '-' + option.breakpoint;

            option.quality = option.quality || 100;

            //create folder if it does not exist
            grunt.file.mkdir(fileObj.dest);

            gm(fileObj.src).size(function(err, size) {
                // note : size may be undefined
                if (!err) {
                    if (size.width < option.size.width || size.height < option.size.height) {
                        grunt.log.warn('Cannot resize greater than provided image size.\n Keeping original dimensions.');
                        _gmResizeFiles(fileObj, option, fileName, fileExt, true, size.width, size.height);
                    } else {
                        _gmResizeFiles(fileObj, option, fileName, fileExt);
                    }
                } else {
                    grunt.log.error('Cannot retrieve file size information');
                }
            });
        };

        // Iterate over all specified file groups.
        this.files.forEach(function(file) {
            //Returns an array of existing file paths
            var src = file.src.filter(function(filePath) {
                if (!grunt.file.exists(filePath)) {
                    grunt.log.warn('Source file "' + filePath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            src.forEach(function(filePath) {

                if (grunt.file.isDir(filePath)) {
                    //check all the files inside this folder
                    grunt.file.recurse(filePath, function(fileFolderPath) {
                        //check is file exists and matched the necessary file types
                        if (_checkIsFile(fileFolderPath) === true) {
                            _srcFiles.push({
                                src: fileFolderPath,
                                dest: file.dest
                            });
                        }
                    });

                } else {
                    //check is file exists and matched the necessary file types
                    if (_checkIsFile(filePath) === true) {
                        _srcFiles.push({
                            src: filePath,
                            dest: file.dest
                        });
                    }
                }

            });
        });

        _sanitizeOptions();

        //Check if there exists any errors and abort.
        if (_optionsErrCount > 0) {
            grunt.fail.warn('PLEASE MAKE SURE ALL THE OPTIONS ARE CLEARLY SPECIFIED');
        }

        //Itterate over all the options and necessary files.
        _gmItterateOptions();

    });

};