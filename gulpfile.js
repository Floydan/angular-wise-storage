var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    ngAnnotate = require('gulp-ng-annotate'),
    sourceFiles = [
      'src/angularStorage/angularStorage.prefix',
      'src/angularStorage/angularStorage.js',
      'src/angularStorage/directives/**/*.js',
      'src/angularStorage/filters/**/*.js',
      'src/angularStorage/services/**/*.js',
      'src/angularStorage/angularStorage.suffix'
    ],
    lintFiles = [
      'src/angularStorage/**/*.js',
      'test/**/*.js',
      'gulpfile.js'
    ];

gulp.task('lint', function() {
  return gulp.src(lintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', function() {
  gulp.src(sourceFiles)
    .pipe(concat('angular-wise-storage.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('angular-wise-storage.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['lint', 'build']);
