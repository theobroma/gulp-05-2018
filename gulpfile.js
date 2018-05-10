var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('autoprefixer');
var mqpucker = require('css-mqpacker');
var assets = require('postcss-assets');
var fontpath = require('postcss-fontpath');
var fileinclude = require('gulp-file-include');
//load all plugins that start with "gulp-"
var $ = require('gulp-load-plugins')();

// Ресурсы проекта
var paths = {
  dest: 'assets/',
  styles: 'source/styles/',
  css: 'assets/css/',
  scripts: 'source/scripts/',
  libsJS: 'source/libs/',
  js: 'assets/js/',
  templates: 'templates/',
  img: 'source/img/',
  symbols: 'source/img/icons/',
  bundles: 'assets/img/',
  html: './',
  fonts_src: 'source/fonts/',
  fonts_dest: 'assets/fonts/',
  video_src: 'source/video/',
  video_dest: 'assets/video/'
};

// Плагины
var processors = [
  autoprefixer({ browsers: ['last 2 versions'] }),
  mqpucker({ sort: true }),
  fontpath(),
  assets({ loadPaths: ['assets/img/'], relativeTo: 'assets/css/' })
];

// Компиляция стилей
gulp.task('styles', function() {
  return (
    gulp
      .src([paths.styles + '**/*.{sass,scss}', '!' + paths.styles + '**/_*.{sass,scss}'])
      .pipe($.sass().on('error', $.sass.logError)) // plumber doesn't work here
      .pipe($.postcss(processors))
      //.pipe($.csso())
      .pipe(gulp.dest(paths.css))
  );
});

// Сборка скриптов
gulp.task('scripts', function() {
  gulp
    .src(paths.scripts + '*.js')
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file'
      })
    )
    .pipe($.plumber())
    .pipe($.concat('scripts.js'))
    //.pipe($.uglify())
    .pipe(gulp.dest(paths.js));
});

// Сборка шрифтов
gulp.task('fonts', function() {
  return gulp
    .src(paths.fonts_src + '*.ttf')
    .pipe($.plumber())
    .pipe($.ttf2woff())
    .pipe(gulp.dest(paths.fonts_dest));
});

gulp.task('images', function() {
  return gulp
    .src('src/*.{jpg,png}')
    .pipe(
      $.responsive(
        {
          '*.jpg': {
            // Resize all JPG images to 200 pixels wide
            width: 200
          },
          '*.png': {
            // Resize all PNG images to 50% of original pixels wide
            width: '50%'
          },
          // Resize all images to 100 pixels wide and add suffix -thumbnail
          '*': {
            width: 100,
            rename: { suffix: '-thumbnail' }
          }
        },
        {
          // Global configuration for all images
          // The output quality for JPEG, WebP and TIFF output formats
          quality: 70,
          // Use progressive (interlace) scan for JPEG and PNG output
          progressive: true,
          // Zlib compression level of PNG output format
          compressionLevel: 6,
          // Strip all metadata
          withMetadata: false
        }
      )
    )
    .pipe(gulp.dest('dist'));
});

//clean all build folder
gulp.task('cleanBuildDir', function(cb) {
  rimraf(paths.dest, cb);
});

gulp.task('watch', function() {
  gulp.watch(paths.templates + '**/*.pug', ['pug']);
  gulp.watch(paths.fonts_src + '**/*.ttf', ['fonts']);
  gulp.watch(paths.styles + '**/*.scss', ['styles']);
  gulp.watch(paths.scripts + '**/*.js', ['scripts']);
  gulp.watch(paths.symbols + '*.svg', ['symbols']);
  gulp.watch(paths.img + '*.{png,jpg,gif,svg}', ['img']).on('change', function(event) {
    if (event.type === 'deleted') {
      del(paths.bundles + path.basename(event.path));
      delete cache.caches['img'][event.path];
    }
  });
});

gulp.task('compile', ['styles', 'scripts', 'fonts']);
gulp.task('build', function(callback) {
  runSequence('cleanBuildDir', 'compile', callback);
});

gulp.task('default', ['compile', 'watch']);
