# grunt-gm-picturefill

> Plugin to resize images to work with picturefill plugin or the picture element providing sample output for easy reference

## Picturefill by Scott Jehl
To find out how to use Picturefill on your sites, visit the project and demo site:

[Picturefill Documentation, Downloads, and Demos Site](http://scottjehl.github.com/picturefill/)

## Getting Started
First download and install [GraphicsMagick](http://www.graphicsmagick.org/). In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:

    brew install graphicsmagick

This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gm-picturefill --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gm-picturefill');
```

## The "gm_picturefill" task

### Overview
In your project's Gruntfile, add a section named `gm_picturefill` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gm_picturefill: {
    task_one: {
       options: {
          // Task-specific options go here.
        },
         files: {
          'path/to/dest/dir': ['path/to/source/one','path/to/source/two']
        }
    },
  },
})
```

### Options

#### options.picturefill
Type: `Object`
Default value:
```js
[{
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
}, {
    breakpoint: '1280px',
    prefix: 'lg',
    size: {
        width: 1280,
        height: 1280
    },
    quality: 100
}]
```
An `Array` of `Objects` having key/value pairs as follows

##### breakpoint
Type: `String`


The break point for which the images is to be resized eg. `'40.063em'` or `'320px'`.

##### prefix
Type: `String`


A string that uniquely identifies an image resized for a particular viewport size eg. `'xs'` or `'small'`.


If left `''` (empty), the breakpoint will be added as the prefix.

##### size 
Type: `Object`


An object containing `width` and `height` attributes used for resizing the images.

__Note:__ Aspect ratio of the image will allways be maintained.

##### quality
Type: `Number`

The quality to be maintained for the resized images. Ranges from `0` to `100`.




#### options.createSample
Type: `Boolean`

Default value: `true`

Flag to create the sample file containing the necessary markup to use the resized images with the Picturefill plugin.

#### options.sampleOutputPath
Type: `String`

Default value: `'./'`

Path to the directory where the sample file will be created for reference.



### Usage Examples

#### Default Options
```js
grunt.initConfig({
  gm_picturefill: {
    default:{
      options: {},
      files: {
        'path/to/rsized': ['path/to/original']
      }
    }
  }
})
```
In this example, the default options are used to create resized images in the folder named `resized` from the folder `original` for the breakpoints `320px`,`768px`,`1024px` and `1280px`. So if there exists a file named `sample.png` in the `original` folder, then after the task is run it would create `sample-xs.png`,`sample-sm.png`,`sample-md.png` and `sample-lg.png` in the `resized` folder and create the following markup in the `picturefill_sample` directory.

```html
<!--Picturefill element definition for file node-js -->
<picture>
  <!--[if IE 9]><video style="display: none;"><![endif]-->
    <source srcset="resized\sample-lg.png" media="(min-width: 1280px)">
    <source srcset="resized\sample-md.png" media="(min-width: 1024px)">
    <source srcset="resized\sample-sm.png" media="(min-width: 768px)">
  <!--[if IE 9]></video><![endif]-->
  
  <img srcset="resized\sample-xs.png" alt="Lorem ipsum dolor sit amet">
</picture>
```

#### Custom Options
```js
grunt.initConfig({
  gm_picturefill: {
    custom:{
      options: {
        picturefill:[
          {
            breakpoint:'768px',
            size:{
              width:768,
              height:768
            }
            prefix:'small',
            quality:50
          },
          {
            breakpoint:'1280px',
            size:{
              width:1280,
              height:1280
            }
            prefix:'large',
            quality:100
          }
        ]
      },
      files: {
        'path/to/rsized': ['path/to/original']
      }
    }
  }
})
```
In this example, custom options are used to do create two resized images for the breakpoints `768px` and `1280px` with the prefix `small` and `large` respectively.  So if there exists a file named `sample.png` in the `original` folder, then after the task is run it would create `sample-small.png` and `sample-large.png` in the `resized` folder and create the following markup in the `picturefill_sample` directory.

```html
<!--Picturefill element definition for file node-js -->
<picture>
  <!--[if IE 9]><video style="display: none;"><![endif]-->
    <source srcset="resized\sample-large.png" media="(min-width: 1280px)">
  <!--[if IE 9]></video><![endif]-->
  
  <img srcset="resized\sample-small.png" alt="Lorem ipsum dolor sit amet">
</picture>
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(0.0.1)_

## License
Copyright (c) 2014 Nisheed Jagadish. Licensed under the MIT license.
