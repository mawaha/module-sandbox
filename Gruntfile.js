module.exports = function (grunt) {
	'use strict'

	grunt.initConfig({
		banner: '/*!\n' +
				' * <%= pkg.name %> Theme version: <%= pkg.version %>\n' +
				' * <%= pkg.description %>\n' +
				' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %> <%= pkg.url %>\n' +
				' * Distributed under the <%= pkg.license %> license\n' +
				' * <%= pkg.homepage %>\n' +
				' */\n',

		less: {
			dev:{
				options:{
					sourceMap: true,
					sourceMapFilename: "<%= pkg.name %>.css.map"
				},
				files: {
					"<%= config.dest.styles.path %>/<%= pkg.name %>.css": "<%= config.src.styles.less.path %>/<%= pkg.name %>.less"
				}
			},
			dist: {
				options:{
					compress: true,
					cleancss: true
				},
				files: {
					"<%= config.dest.styles.path %>/<%= pkg.name %>.min.css": "<%= config.dest.styles.path %>/<%= pkg.name %>.css"
				}
			}
		},

		concat: {
			app: {
				options: {
					banner: '<%= banner %>'
				},
				src: [ /* No guarantee of concat order */
					'<%= config.src.scripts.javascript.path %>/*.js'
				],

				dest: '<%= config.dest.scripts.path %>/<%= pkg.name %>.js'
			},
			bootstrap: {
				src: '<%= config.vendor_scripts.bootstrap %>',
				dest: '<%= config.dest.scripts.vendor.path %>/bootstrap.js'
			},
			modernizr: {
				src: '<%= config.vendor_scripts.modernizr %>',
				dest: '<%= config.dest.scripts.vendor.path %>/modernizr.js'
			}
		},

		jshint: {
			pre_concat: {
				src: ['<%= config.src.scripts.javascript.path %>/**/*.js']
			},
			post_concat: {
				src: ['<%= config.dest.scripts.path %>/<%= pkg.name %>.js']
			}
		},

		uglify: {
			app: {
				options: {
					sourceMap: true,
					sourceMapFilename: "<%= pkg.name %>.js.map"
				},
				src: '<%= config.dest.scripts.path %>/<%= pkg.name %>.js',
				dest: '<%= config.dest.scripts.path %>/<%= pkg.name %>.min.js'
			}
		},

		jasmine: {
			app: {
				src: '<%= config.src.scripts.javascript.path %>/app.js',
				options: {
					specs: '<%= config.src.scripts.tests.path %>/*Spec.js',
					vendor: '<%= config.vendor_scripts.path %>/jquery/dist/jquery.min.js'
				}
			}
		},

		usebanner: {
			css: {
				options:{
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: ['<%= config.dest.styles.path %>/core.min.css']
				}
			}
		},

		htmlmin: {
			templates: {
				options: {
					//conservativeCollapse: true,
					keepClosingSlash: true,
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: '<%= config.src.templates.path %>',
					src: ['**/*.ss'],
					dest: '<%= config.dest.templates.path %>'
				}]
			}
		},

		copy: {
			fonts: {
				files: [{
					expand: true,
					cwd: '<%= config.src.fonts.path %>',
					src: ['**/*.{eot,svg,ttf,woff}'],
					dest: '<%= config.dest.fonts.path %>'
				}]
			}
		},

		clean: [
			'<%= config.src.temp.path %>',
			'<%= config.dest.styles.path %>',
			'<%= config.dest.fonts.path %>',
			'<%= config.dest.images.path %>',
			'<%= config.dest.scripts.path %>',
			'<%= config.dest.templates.path %>'
		],

		watch: {
			options: {
				livereload: 35729 // Vagrant using default port 35729
			},

			less: {
				options: {
					atBegin: true
				},

				files: ['<%= config.src.styles.less.path %>/**/*.less'],

				tasks: ['less']
			},


			js: {
				files: ['<%= config.src.scripts.javascript.path %>/**/*.js'],

				tasks: ['jasmine', 'newer:jshint:pre_concat', 'concat:app', 'jshint:post_concat', 'newer:uglify']
			},

			test: {
				files: ['<%= config.src.scripts.tests.path %>/**/*Spec.js'],

				tasks: ['jasmine']
			},

			htmlmin: {
				options: {
					atBegin: true
				},
				files: ['<%= config.src.templates.path %>/**/*.ss'],
				tasks: ['newer:htmlmin']
			}
		}
	});

	// Default task(s).
	grunt.registerTask('default', ['watch']);

	grunt.registerTask('build', [
		'jshint:pre_concat',
		'concat',
		'uglify',
		'less',
		'htmlmin',
		'copy'
	]);


	// Plugins - autoload each dev dependency
	// ----------------------------------------------/
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
}