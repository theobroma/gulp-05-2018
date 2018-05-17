var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var del = require('del');
var cache = require('gulp-cached');
var runSequence = require('run-sequence');
//postcss
var autoprefixer = require('autoprefixer');
var mqpucker = require('css-mqpacker');
var assets = require('postcss-assets');
var fontpath = require('postcss-fontpath');
var customMedia = require('postcss-custom-media');
var mediaMinmax = require('postcss-media-minmax');
var flexbugs = require('postcss-flexbugs-fixes');
var fileinclude = require('gulp-file-include');
//Server
var browserSync = require('browser-sync').create();
var isDevelopment = require('./gulp/util/env');

//plugins for testing
var html5Lint = require('gulp-html5-lint');
var reporter = require('postcss-reporter');
var stylelint = require('stylelint');
var postcss_scss = require('postcss-scss');

//load all plugins that start with "gulp-"
var $ = require('gulp-load-plugins')();

// Ресурсы проекта
var paths = {
  dest: 'assets/',
  styles: 'source/sass/',
  css: 'assets/css/',
  scripts: 'source/scripts/',
  libsJS: 'source/libs/',
  js: 'assets/js/',
  templates: 'source/templates/',
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
  assets({ loadPaths: ['assets/img/'], relativeTo: 'assets/css/' }),
  customMedia(),
  mediaMinmax(),
  flexbugs()
];

// Компиляция стилей
gulp.task('sass', function() {
  return (
    gulp
      .src([paths.styles + '**/*.{sass,scss}', '!' + paths.styles + '**/_*.{sass,scss}'])
      .pipe($.sourcemaps.init())
      .pipe($.sass().on('error', $.sass.logError)) // plumber doesn't work here
      .pipe($.postcss(processors))
      .pipe($.sourcemaps.write())
      //.pipe($.csso())
      .pipe(gulp.dest(paths.css))
      .pipe($.notify('SASS Compiled'))
  );
});

//Компиляция Pug
gulp.task('pug', function() {
  return gulp
    .src([paths.templates + '*.pug', '!' + paths.templates + '_*.pug'])
    .pipe($.plumber())
    .pipe($.pug({ pretty: isDevelopment }))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
    .pipe($.notify('Pug Compiled'));
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
    .pipe($.concat('all.js'))
    //.pipe($.uglify())
    .pipe(gulp.dest(paths.js));
});

// Convert ttf->woff, else just copy woff
gulp.task('ttf2woff', function() {
  return gulp
    .src(paths.fonts_src + '*.{ttf,woff}')
    .pipe($.plumber())
    .pipe($.ttf2woff())
    .pipe(gulp.dest(paths.fonts_dest));
});
// Copy font-awesome from node_modules
gulp.task('copy-fa', function() {
  return gulp.src('node_modules/font-awesome/fonts/*.woff').pipe(gulp.dest(paths.fonts_dest));
});

// Сжатие картинок
gulp.task('imagemin', function() {
  gulp
    .src(paths.img + '*.{png,jpg,gif,svg}')
    .pipe(cache('img'))
    .pipe(
      $.imagemin({
        verbose: true
      })
    )
    .pipe(gulp.dest(paths.bundles));
});

//responsive
// gulp.task('images', function() {
//   return gulp
//     .src('src/*.{jpg,png}')
//     .pipe(
//       $.responsive(
//         {
//           '*.jpg': {
//             // Resize all JPG images to 200 pixels wide
//             width: 200
//           },
//           '*.png': {
//             // Resize all PNG images to 50% of original pixels wide
//             width: '50%'
//           },
//           // Resize all images to 100 pixels wide and add suffix -thumbnail
//           '*': {
//             width: 100,
//             rename: { suffix: '-thumbnail' }
//           }
//         },
//         {
//           // Global configuration for all images
//           // The output quality for JPEG, WebP and TIFF output formats
//           quality: 70,
//           // Use progressive (interlace) scan for JPEG and PNG output
//           progressive: true,
//           // Zlib compression level of PNG output format
//           compressionLevel: 6,
//           // Strip all metadata
//           withMetadata: false
//         }
//       )
//     )
//     .pipe(gulp.dest('dist'));
// });

//Перезагрузка страницы
gulp.task('browser-sync', function() {
  browserSync.init(['css/*.css', 'js/*.js', '*.html'], {
    server: {
      baseDir: paths.dest
    },
    open: 'local',
    browser: 'chrome'
  });
});

//clean build folder
gulp.task('cleanBuildDir', function(cb) {
  rimraf(paths.dest, cb);
});

gulp.task('cssLint', function() {
  return gulp.src([paths.styles + '**/*.{sass,scss}']).pipe(
    $.postcss([stylelint(), reporter({ clearMessages: true })], {
      syntax: postcss_scss
    })
  );
});

gulp.task('w3c', function() {
  gulp
    .src(paths.dest + '*.html')
    .pipe($.w3cjs())
    .pipe($.w3cjs.reporter());
});

gulp.task('watch', function() {
  gulp.watch(paths.templates + '**/*.pug', ['pug']);
  gulp.watch(paths.fonts_src + '**/*.{ttf,woff}', ['fonts']);
  gulp.watch(paths.styles + '**/*.scss', ['sass']);
  gulp.watch(paths.scripts + '**/*.js', ['scripts']);
  gulp.watch(paths.symbols + '*.svg', ['symbols']);
  gulp.watch(paths.img + '*.{png,jpg,gif,svg}', ['imagemin']).on('change', function(event) {
    if (event.type === 'deleted') {
      del(paths.bundles + path.basename(event.path));
      delete cache.caches['imagemin'][event.path];
    }
  });
});

gulp.task('fonts', ['copy-fa', 'ttf2woff']);
gulp.task('compile', ['pug', 'sass', 'scripts', 'fonts', 'imagemin']);
gulp.task('build', function(callback) {
  runSequence('cleanBuildDir', 'compile', callback);
});
gulp.task('dev', ['compile', 'browser-sync', 'watch']);
gulp.task('default', function(callback) {
  runSequence('cleanBuildDir', 'dev', callback);
});
