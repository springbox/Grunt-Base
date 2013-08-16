module.exports = function(grunt) {

	grunt.initConfig({
		compass: {                    // Task/plugin
		    dist: {                   // Target
		      options: {              // Target options
		        sassDir: 'sass',
		        cssDir: 'css',
		        environment: 'production'
		      }
		    },
		    dev: {                    // Another target
		      options: {
		        sassDir: 'sass',
		        cssDir: 'css'
		      }
		    }
		  }
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-compass');
	

	// Default task.
	grunt.registerTask('default', ['compass:dev']);
	grunt.registerTask('prod', ['compass:dist']);

};