/**
 * GruntFile
 * @version 0.0.3
 */
module.exports = function(grunt) {

    // load all grunt tasks
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        /**
        * Read package.json
        */
        pkg: grunt.file.readJSON('package.json'),

        /**
        * Set banner
        */
        banner: '/**\n' +
        '<%= pkg.title %> - <%= pkg.version %>\n' +
        '<%= pkg.homepage %>\n' +
        'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
        'License: Enjoy. Live long and prosper.\n' +
        '*/\n',

        dir: {
            js: 'public/js',
            css: 'public/css',
            sass: 'sass',
            img: 'public/images',
            views: 'public/views'
        },

        /**
         * Compile SASS
         */
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    trace: true,
                    debugInfo: true
                },
                expand: true,
                cwd: '<%= dir.sass %>/',
                src: ['*.scss', '!_*.scss'],
                dest: '<%= dir.css %>',
                ext: '.css'
            },
            build: {
                options: {
                    style: 'compressed',
                    noCache: true
                },
                expand: true,
                cwd: '<%= dir.sass %>/',
                src: ['*.scss', '!_*.scss'],
                dest: '<%= dir.css %>',
                ext: '.css'
            }
        },

        autoprefixer: {
            dev: {
                options: {
                    browsers: ['last 2 versions', 'ie 8', 'ie 9']
                },
                expand: true,
                flatten: true,
                src: '<%= dir.css %>/*.css',
                dest: '<%= dir.css %>/'
            }
        },

        // The watch command watches a given set of files and runs a task when one of them changes.
        watch: {

            //Automatic compilation of SASS changes
            sass: {
                files: ['<%= dir.sass %>/**/*.scss'],
                tasks: ['sass:dev', 'notify:sass']
            },

            // Add vendor prefixes
            prefix: {
                files: ['<%= dir.sass %>/**/*.scss'],
                tasks: ['autoprefixer:dev', 'notify:prefix'],
                options: {
                    livereload: true
                }
            },

            server: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
            },

            /**
             * If any system files changes reload browser.
             * Requires webkit browser extension.
             */
            livereload: {
                files: [
                    '<%= dir.img %>/*.{png,jpg,gif,svg}',
                    '<%= dir.js %>/**/*.js',
                    '<%= dir.sass %>/**/*.scss'
                ],
                options: {
                    livereload: true
                }
            }
        },

        /**
        * Nodemon
        * @github.com/ChrisWren/grunt-nodemon
        */
        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    nodeArgs: ['--debug'],
                    env: {
                        PORT: '1985'
                    },
                    // omit this property if you aren't serving HTML files and
                    // don't want to open a browser tab on start
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        // refreshes browser when server reboots
                        nodemon.on('restart', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });

                        /*setTimeout(function() {
                            require('grunt-open')('http://localhost:1955');
                        }, 1000);*/
                    }
                }
            }
        },

        open: {
            dev: {
              path: 'http://localhost:1985',
              app: 'Google Chrome'
            }
        },

        // In order to run the Karma watcher and the SASS watchers concurrently, we need to run this task
        concurrent: {
            dev: {
                tasks: ['watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        notify: {
            dev: {
                options: {
                    message: "Dev changes complete."
                }
            },

            build: {
                options: {
                    message: "Build complete."
                }
            },

            sass: {
                options: {
                    message: "SASS compiled."
                }
            },

            prefix: {
                options: {
                    message: "Autoprefixer finished."
                }
            }
        }
    });

    grunt.registerTask('dev', [
        'concurrent:dev',
        'notify:dev'
    ]);

    grunt.registerTask('prefix', ['autoprefixer:dev']);
};
