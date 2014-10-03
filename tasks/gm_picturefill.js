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


        // Merge task-specific and/or target-specific options with these defaults.
        var _options = this.options({
            size: {
                width: 100,
                height: 100
            },
            quality: 100,
            prefix: ''
        });

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

        /**
         * Function to itterate over all the files in the _srcFilesCount array
         * @return {null}
         */
        var _gmItterateFiles = function() {
            _srcFilesCount = _srcFiles.length;
            for (var i = 0; i < _srcFiles.length; i++) {
                _gmResizeFile(_srcFiles[i]);
            }
        };

        /**
         * Function to resize the files based on the options provided
         * @param  {Object} fileObj The file src and dest object
         * @return {null}   
         */
        var _gmResizeFile = function(fileObj) {
            var fileExt = path.extname(fileObj.src);
            var fileName = path.basename(fileObj.src, fileExt);
            fileName += '-' + _options.prefix;

            //create folder if it does not exist
            grunt.file.mkdir(fileObj.dest);

            gm(fileObj.src).size(function(err, size) {
                // note : size may be undefined
                if (!err) {
                    if (size.width < _options.size.width || size.height < _options.size.height) {
                        grunt.log.error('Cannot resize greater than provided image size');
                    } else {
                        gm(fileObj.src)
                            .resize(_options.size.width, _options.size.height)
                            .quality(_options.quality)
                            .write(path.join(fileObj.dest, fileName + fileExt), function(err) {
                                if (!err) {
                                    _resizedFilesCount++;
                                    if (_resizedFilesCount === _srcFilesCount) {
                                        _done(true);
                                    }
                                } else {
                                    console.log(err);
                                    _done(false);
                                }
                            });
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
		
		//Itterate over all the necessary files.
        _gmItterateFiles();

    });

};