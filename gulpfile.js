
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglifyjs');
var plugins = require('gulp-load-plugins')();

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass','watch']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
})
gulp.task('lint', function() {
  return gulp.src('./www/js/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
})
gulp.task('fixjs', function() {
  return gulp.src("./www/js/**/*.js")
      .pipe(plugins.fixmyjs())
      .pipe(gulp.dest("./www/js/"));
})

gulp.task('todo', function() {
    gulp.src('./www/js/**/*.js')
        .pipe(plugins.todo())
        .pipe(plugins.todo.reporter('json', {fileName: 'todo.json'}))
        .pipe(gulp.dest('./'));
})

gulp.task('quality', ['lint', 'fixjs', 'todo', 'wiredep','build-js']);

gulp.task('build-js', function() {
  return gulp.src('./www/js/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/lib'));
});

// configure which files to watch and what tasks to use on file changes
// gulp.task('watch', function() {
//   gulp.watch('./www/js/**/*.js', ['quality']);
// });

gulp.task('build-js', function() {
  return gulp.src('./www/js/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/lib'));
});
gulp.task('wiredep', function () {
var wiredep = require('wiredep').stream;
gulp.src('./www/index.html')
  .pipe(wiredep({
    directory: './www/lib',
    // devDependencies: true,
    exclude: ['/angular/', 'angular-animate', 'angular-mocks', 'angular-resource',       'angular-sanitize', 'angular-ui-router']
  }))
  .pipe(gulp.dest('./www/'))
});
