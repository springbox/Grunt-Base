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
	grunt.loadNpmTasks('grunt-imageoptim');
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
		 * @type {Object}
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
		 * This task will run with our production compile. 
		 * There's not much to the documentation, but here it is:
		 * https://github.com/JamieMason/grunt-imageoptim
		 *
		 * Unfortunately for Windows users, the task utilizes Mac specific software that 
		 * needs to be installed. The programs that are used are: ImageOptim, 
		 * ImageAlpha and JPEGmini for Mac.
		 */
		imageoptim: {
			files: ['<%= env.options.source.assets %>/img'],
			options: {
				quitAfter: true,
				imageAlpha: true
			}
		},



		// imagemin: {
		// 	dynamic: {
		// 		files: [{
		// 			expand: true,
		// 			cwd: '<%= env.options.source.assets %>/img',
		// 			src: ['**/*.{png,jpg,gif}'],
		// 			dest: '<%= env.options.production.assets %>/img'
		// 		}]
		// 	}
		// },

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
					},
					{ 
						expand: true, 
						cwd: '<%= env.options.source.assets %>', 
						src: ['js/**/*'], 
						dest: '<%= env.options.production.assets %>'
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
				sassDir: '<%= env.options.development.assets %>/sass',
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
		 */
		jshint: {
			all: ['Gruntfile.js']
		},


		/**
		 * Tasks related to the grunt-contrib-uglify plugin.
		 * See the source on Github for documentation: 
		 * https://github.com/gruntjs/grunt-contrib-uglify
		 */
		uglify: {

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
				files: ['<%= env.options.development.assets %>/**/*.js'],
				tasks: [''],
			},
			compass: {
				files: ['<%= env.options.development.assets %>/sass/**/*.{scss,sass}'],
				tasks: ['compass:development'],
			},
			livereload: {
				options: { 
					livereload: true 
				},
				files: ['styles.css', '<%= env.build %>/js/*.js', '*.html', '*.php', '<%= env.options.development.assets %>/img/**/*.{png,jpg,jpeg,gif,webp,svg}']
			}
		}
	});


	/**
	 * Let's assume that we'll be developing most often so we'll make that our default task.
	 */
	grunt.registerTask('default', 
		[
			'env:development',
			'compass:development',
			'copy:development',
			'preprocess:development'
		]
	);


	/**
	 * Our staging compile task
	 */
	grunt.registerTask('staging', 
		[
			'env:staging',
			'compass:staging',
			'copy:production',
			'preprocess:staging',
		]
	);


	/**
	 * Our production task will do optimizations, minifications, uglifications
	 */
	grunt.registerTask('production', 
		[
			'svg2png',
			'imageoptim',
			'env:production',
			'compass:production',
			'copy:production',
			'preprocess:production',
		]
	);


	/**
	 * If you just want modify the images
	 */
	grunt.registerTask('images', 
		[
			'svg2png',
			'imageoptim',
		]
	);

};