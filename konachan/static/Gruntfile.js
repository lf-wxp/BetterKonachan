module.exports = function(grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            comsass: {
                files: [
                    'sass/*/*.scss'
                    // '!sass/function.scss',
                    // '!sass/*reset*.scss',
                    // '!sass/{6*,9*}.scss'
                ],
                tasks: ['sass','cssmin']
            },
            // js: {
            //   files: [
            //     'js/*.js'
            //   ],
            //   tasks: ['jshint']
            // },
            // coffee:{
            //   files:[
            //     'coffee/*.coffee'
            //   ],
            //   tasks:['coffee']
            // }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css'],
                    dest: 'css',
                    ext: '.min.css'
                }]
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compact'
                },
                files: [{
                    expand: true,
                    cwd: 'sass/pages',
                    src: ['*.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'css',
                    specify: ['sass/index.scss', 'sass/article.scss', 'sass/admin.scss', 'sass/article_view.scss'],
                    outputStyle: 'compact' /*compressed*/
                }
            }
        },
        coffee: {
            dist: {
                options: {
                    sourceMap: true,
                    bare: true
                },
                files: [{
                    expand: true,
                    cwd: 'coffee',
                    src: ['*.coffee'],
                    dest: 'js',
                    ext: '.js'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: 'jshintrc'
            },
            all: ['js/*.js', '!js/{jquery*,hammer*}.js']
        },
        autoprefixer: {
            options: {
                // browsers: ['last 1 version']
                // diff: true
            },
            multiple_files: {
                files: [{
                    expand: true,
                    src: 'css/*.css',
                    dest: './'
                }]
            }
        },
        browserSync: {
            default_options: {
                bsFiles: {
                    src: [
                        'css/*.css',
                        'img/*',
                        'js/*.js',
                        '*.html',
                        'sass/*.scss',
                        'coffee/*.coffee'
                    ]
                },
                options: {
                    watchTask: true,
                    host: "192.168.199.173",
                    server: {
                        baseDir: "./",
                        index: "index.html"
                    }
                }
            }
        }
    });
    // 加载Grunt插件
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.registerTask('default', ['watch']);
    // 注册grunt默认任务
    // grunt.registerTask('default', ['watch']);
};