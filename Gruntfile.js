module.exports = function(grunt) {


	/**
	 * Putting these at the top allow us to quickly see what plugins our 
	 * Grunt process is loading.
	 */
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-svg2png');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-env');


	grunt.initConfig({

		/**
		 * Let's set up environment variables that we can change rather than editing 
		 * all our settings each time we want to change a build directory or something.
		 * We can access these via Grunt's template strings: 
		 * https://github.com/gruntjs/grunt/wiki/grunt.template
		 *
		 * We could use this with or without the 'grunt-env' plugin, but we'll use the plugin 
		 * so we can dynamically change things when we preprocess our files (like using concatenated 
		 * JavaScript or not)
		 * https://github.com/jsoverson/grunt-env/
		 * 
		 */
		env: {
			options: {
				source: {
					root: 'site/source',
					assets: 'site/source/assets'
				},
				development: {
					root: 'site/development',
					assets: 'site/development/assets'
				},
				staging: {
					root: 'site/staging',
					assets: 'site/staging/assets'
				},
				production: {
					root: 'site/production',
					assets: 'site/production/assets'
				}
			},
			development: {
				NODE_ENV: 'DEVELOPMENT'
			},
			staging: {
				NODE_ENV: 'STAGING'
			},
			production: {
				NODE_ENV: 'PRODUCTION'
			}
		},

		pkg: grunt.file.readJSON('package.json'),

		/**
		 * We use this task to switch between versions of code that can vary from dev to production.
		 * There's not too much to it, but documentation is available:
		 * https://github.com/jsoverson/grunt-preprocess/
		 */
		preprocess: {
			development: {
				src: '<%= env.options.source.root %>/index.html',
				dest: '<%= env.options.development.root %>/index.html'
			},
			staging: {
				src: '<%= env.options.source.root %>/index.html',
				dest: '<%= env.options.staging.root %>/index.html'
			},
			production: {
				src: '<%= env.options.source.root %>/index.html',
				dest: '<%= env.options.production.root %>/index.html'
			}
		},


		/**
		 * We'll run svg2png on our regular assets folder and convert everything there.
		 * Documentation: https://github.com/dbushell/grunt-svg2png
		 */
		svg2png: {
			all: {
				// specify files in array format with multiple src-dest mapping
				files: [
					// rasterize all SVG files in "img" and its subdirectories to "img/png"
					// rasterize SVG file to same directory
					{ src: ['<%= env.options.source.assets %>/img/**/*.svg'] }
				]
			}
		},


		/**
		 * If you run into errors while optimizing the images, be sure to check 
		 * your version of Node and make sure it's the latest stable version.
		 * It can be finicky like that.
		 * View the documentation at: https://github.com/gruntjs/grunt-contrib-imagemin
		 */
		imagemin: {
			replace: {
				files: [{
					expand: true,
					cwd: '<%= env.options.source.assets %>/img',
					src: ['**/*.{png,jpg,gif}'],
					dest: '<%= env.options.source.assets %>/img'
				}]
			},
			production: {
				files: [{
					expand: true,
					cwd: '<%= env.options.source.assets %>/img',
					src: ['**/*.{png,jpg,gif}'],
					dest: '<%= env.options.production.assets %>/img'
				}]
			}
		},

		/**
		 * Copy over our files. We'll run tasks based off the copies.
		 * See documentation for the copy plugin:
		 * https://github.com/gruntjs/grunt-contrib-copy
		 */
		copy: {
			development: {
				files: [
					{ 
						expand: true, 
						cwd: '<%= env.options.source.assets %>', 
						src: ['fonts/**/*'], 
						dest: '<%= env.options.development.assets %>'
					},
					{ 
						expand: true, 
						cwd: '<%= env.options.source.assets %>', 
						src: ['img/**/*'], 
						dest: '<%= env.options.development.assets %>'
					},
					{ 
						expand: true, 
						cwd: '<%= env.options.source.assets %>', 
						src: ['js/**/*'], 
						dest: '<%= env.options.development.assets %>'
					}
				]
			},
			staging: {
				files: [
					{ 
						expand: true, 
						cwd: '<%= env.options.source.assets %>', 
						src: ['fonts/**/*'], 
						dest: '<%= env.options.staging.assets %>'
					},
					{ 
						expand: true, 
						cwd: '<%= env.options.source.assets %>', 
						src: ['img/**/*'], 
						dest: '<%= env.options.staging.assets %>'
					},
					// We're currently configured to minify and concatenate our js files 
					// for staging, this gives us the option to continue using non-concatenated versions
					{ 
						expand: true, 
						cwd: '<%= env.options.source.assets %>', 
						src: ['js/**/*'], 
						dest: '<%= env.options.staging.assets %>'
					}
				]
			},
			production: {
				files: [
					{ 
						expand: true, 
						cwd: '<%= env.options.source.assets %>', 
						src: ['fonts/**/*'], 
						dest: '<%= env.options.production.assets %>'
					},
					{ 
						expand: true, 
						cwd: '<%= env.options.source.assets %>', 
						src: ['img/**/*'], 
						dest: '<%= env.options.production.assets %>'
					}
				]
			},

			// We don't want to minify or concatenate these in development, so we'll
			// copy them over in a watch task. They're already included in the `grunt` task
			scripts: {
				files: [
					{
						expand: true,
						cwd: '<%= env.options.source.assets %>',
						src: ['js/**/*'],
						dest: '<%= env.options.development.assets %>'
					}
				]
			}
		},

		/**
		 * Tasks related to the grunt-contrib-compass plugin.
		 * See the source on GitHub for documentation: 
		 * https://github.com/gruntjs/grunt-contrib-compass
		 */
		compass: {
			// Compass' global options
			options: {
				importPath: 'bower_components',
				sassDir: '<%= env.options.source.assets %>/sass',
				relativeAssets: true,
			},
			development: {
				options: {
					cssDir: '<%= env.options.development.assets %>/css',
					fontsPath: '<%= env.options.development.assets %>/fonts',
					imagesPath: '<%= env.options.development.assets %>/img',
					outputStyle: 'expanded'
				}
			},
			staging: {
				options: {
					cssDir: '<%= env.options.staging.assets %>/css',
					fontsPath: '<%= env.options.staging.assets %>/fonts',
					imagesPath: '<%= env.options.staging.assets %>/img',
					outputStyle: 'compact',
					force: true
				}
			},
			production: {
				options: {
					cssDir: '<%= env.options.production.assets %>/css',
					fontsPath: '<%= env.options.production.assets %>/fonts',
					imagesPath: '<%= env.options.production.assets %>/img',
					environment: 'production',
					outputStyle: 'compressed',
					noLineComments: true,
					force: true
				}
			},
		},


		/** 
		 * Let's check our files, yo! No reason to get sloppy with our JS.
		 * See the source on Github for documentation: 
		 * https://github.com/gruntjs/grunt-contrib-jshint
		 *
		 * In our options we can set values to true which tells jshint to ignore warnings
		 * for those errors.
		 * See the jshint documentation to set options for specific error types:
		 * http://www.jshint.com/docs/options/
		 */
		jshint: {
			options: {
				smarttabs: true
			},
			others: ['<%= env.options.source.assets %>/js/**/*.js'],
			gruntfile: {
				options: {},
				files: {
					src: ['Gruntfile.js']
				}
			}
		},


		/**
		 * Tasks related to the grunt-contrib-uglify plugin.
		 * See the source on Github for documentation: 
		 * https://github.com/gruntjs/grunt-contrib-uglify
		 */
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd, h:MM:ss TT") %> */\n',
				beautify: true,
			},
			staging: {
				options: {
					// output the source name above each file when on staging
					beautify: true
				},
				files: {
					'<%= env.options.staging.assets %>/js/app.min.js': [
						// Files will be concatenated in the order of this array.
						// You can also ignore files or glob only files that match certain names.
						// Grunt supports minimatch if you're curious about the possibilities:
						// https://github.com/isaacs/minimatch
						'<%= env.options.source.assets %>/js/**/*.js'
					]
				}
			},
			production: {
				options: {
					// Let us know how well uglify is performing when we build for production
					report: 'gzip',
					beautify: false,
					mangle: {
						// Don't want some a variable mangled? No prob!
						except: ['jQuery', 'SuperObviousVariableExample']
					}
				},
				files: {
					'<%= env.options.production.assets %>/js/app.min.js': [
						// Files will be concatenated in the order of this array.
						'<%= env.options.source.assets %>/js/**/*.js'
					]
				}
			}
		},


		/**
		 * Aaaand finally we'll set up our watch event. We'll load in the livereload JavaScript with our 
		 * preprocess task. It's currently only set to load in development mode.
		 * 
		 * You'll also find a method below our config that makes sure we only change
		 * files that were edited, rather than all of them.
		 * See the source on Github for documentation:
		 * https://github.com/gruntjs/grunt-contrib-watch
		 */
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile'],
			},
			scripts: {
				files: ['<%= env.options.source.assets %>/**/*.js'],
				tasks: ['jshint:others', 'copy:scripts'],
			},
			compass: {
				files: ['<%= env.options.source.assets %>/sass/**/*.{scss,sass}'],
				tasks: ['compass:development'],
			},
			source: {
				files: [
					'<%= env.options.source.root %>/**/*!{.js,.scss,.sass,.jpg,.gif,.png,.svg}',
					'<%= env.options.source.root %>/**/*'
				],
				tasks: ['env:development', 'preprocess:development']
			},
			livereload: {
				options: { 
					livereload: true 
				},
				files: [
					'<%= env.options.development.assets %>/img/**/*.{png,jpg,jpeg,gif,webp,svg}',
					'<%= env.options.development.assets %>/css/styles.css', 
					'<%= env.options.development.assets %>/js/**/*.js', 
					'<%= env.options.development.root %>/**/*.html', 
					'<%= env.options.development.root %>/**/*.php', 
				]
			}
		}
	});


	/**
	 * Let's assume that we'll be developing most often so we'll make that our default task.
	 */
	grunt.registerTask('default', 
		[
			'env:development',
			'jshint:others',
			'compass:development',
			'copy:development',
			'copy:scripts',
			'preprocess:development'
		]
	);


	/**
	 * Our staging compile task
	 */
	grunt.registerTask('staging', 
		[
			'env:staging',
			'jshint:others',
			'compass:staging',
			'copy:staging',
			'uglify:staging',
			'preprocess:staging',
		]
	);


	/**
	 * Our production task will do optimizations, minifications, uglifications
	 */
	grunt.registerTask('production', 
		[
			'env:production',
			'jshint:others',
			'svg2png',
			'imagemin:production',
			'compass:production',
			'copy:production',
			'uglify:production',
			'preprocess:production',
		]
	);


	/**
	 * If you just want modify the images
	 */
	grunt.registerTask('images', 
		[
			'svg2png',
			'imagemin:replace',
		]
	);


};