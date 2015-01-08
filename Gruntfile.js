
// 定义自动率刷新
var LIVERELOAD_PORT = 35728;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // 加载所有grunt模块
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // js验证
        jshint: {
            all: ['app/script/*.js']
        },
        // 对build目录进行清理
        clean: {
            build: {
                src: 'build/*'
            }
        },
        // css压缩
        cssmin: {
            all: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/style',
                        src: '**/*.css',
                        dest: 'build/style',
                        ext: '-min.css'
                    }
                ]
            }

        },
        // js压缩
        uglify: {
            all: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/script',
                        src: '**/*.js',
                        dest: 'build/script'
                    }
                ]
            }
        },
        // jade
        jade: {
            debug: {

                options: {
                    pretty: true,
                    data: {
                        debug: false,
                        timestamp: "<%= grunt.template.today() %>"
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/',
                        src: ['**/*.jade'],
                        dest: 'app/',
                        ext: '.html'
                    }
                ]
            }
        },
        less: {
            main: {
                options: {
                    compress: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/style/',
                        src: ['**/*.less'],
                        dest: 'app/style/',
                        ext: '.css'
                    }
                ]
            }
        },
        watch: {
            css: {
                files: ['app/**/*.less'],
                tasks: ['less']
            },
            html: {
                files: ['app/**/*.jade'],
                tasks: ['jade']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: ['app/**/*.html', 'app/**/*.css','app/**/*.less', 'app/**/*.js']
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0',
                keepalive: true,
                open: true
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            }
        }
    });

    // 默认被执行的任务列表。
    grunt.registerTask('default', ['clean', 'cssmin', 'uglify']);
    grunt.registerTask('jslint', ['jshint']);
    grunt.registerTask('serve', ['connect']);


};
