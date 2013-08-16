module.exports = function(grunt) {


	/**
	 * Putting these at the top allow us to quickly see what plugins our 
	 * Grunt process is loading.
	 */
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	


	grunt.initConfig({

		/**
		 * Let's set up environment variables that we can change rather than editing 
		 * all our settings each time we want to change a build directory or something.
		 * We can access these via Grunt's template strings: 
		 * https://github.com/gruntjs/grunt/wiki/grunt.template
		 */
		env: {
			assets: 'assets',
			build: 'build/assets'
		},

		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Tasks related to the grunt-contrib-compass plugin.
		 * See the source on GitHub for documentation: 
		 * https://github.com/gruntjs/grunt-contrib-compass
		 */
		compass: {
			// Compass' global options
			options: {
				importPath: 'bower_components',
				sassDir: '<%= env.assets %>/sass',
				cssDir: '<%= env.build %>/css',
				fontsPath: '<%= env.build %>/fonts',
				imagesPath: '<%= env.build %>/img',
			},
			production: {
				options: {
					environment: 'production',
					outputStyle: 'compressed',
					noLineComments: true,
					force: true
				}
			},
			development: {
				options: {

					outputStyle: 'expanded'
				}
			}
		},

		/**
		 * Tasks related to the grunt-contrib-uglify plugin.
		 * See the source on Github for documentation: 
		 * https://github.com/gruntjs/grunt-contrib-uglify
		 */
		uglify: {

		},

		/**
		 * Aaaand finally we'll set up our watch event. 
		 * You'll also find a method below our config that makes sure we only change
		 * files that were edited, rather than all of them.
		 * @type {Object}
		 */
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile'],
			},
			scripts: {
				files: ['<%= env.assets %>/**/*.js'],
				//tasks: ['jshint:all', 'copy:scripts'],
				options: {
					livereload: true
				}
			},
			compass: {
				files: ['<%= env.assets %>/sass/**'],
				tasks: ['compass:development'],
				options: {
					livereload: true
				}
			},
		},
	});


	/**
	 * Let's assume that we'll be developing most often so we'll make that our default task.
	 */
	grunt.registerTask('default', 
		[
			'compass:development',
		]
	);


	/**
	 * Our production task will do optimizations, minifications, uglifications
	 */
	grunt.registerTask('production', 
		[
			'compass:production',
		]
	);

};