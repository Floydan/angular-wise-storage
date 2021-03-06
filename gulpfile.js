var gulp = require('gulp'),
    del = require('del'),                     // Delete files/folders using globs (https://www.npmjs.com/package/del)
    jshint = require('gulp-jshint'),          // JavaScript linter (https://www.npmjs.com/package/gulp-jshint/)
    rename = require('gulp-rename'),          // Renames file paths (https://www.npmjs.com/package/gulp-rename/)
    sourcemaps = require('gulp-sourcemaps'),  // Creates source map files (https://www.npmjs.com/package/gulp-sourcemaps/)
    uglify = require('gulp-uglify'),          // Minifies JavaScript (https://www.npmjs.com/package/gulp-uglify/)
    concat = require('gulp-concat'),          // Concatinates files to one file (https://www.npmjs.com/package/gulp-concat/)
    ngAnnotate = require('gulp-ng-annotate'),

    sourceFiles = [
      'src/wiseStorage/wise-storage.prefix',
      'src/wiseStorage/wise-storage.js',
      'src/wiseStorage/services/**/*.js',
      'src/wiseStorage/wise-storage.suffix'
    ],
    lintFiles = [
      'src/wiseStorage/**/*.js',
      'test/**/*.js',
      'gulpfile.js'
    ];

gulp.task('clean', function () {
  return del('./dist/**/*.*');
});

gulp.task('lint', function() {
  return gulp.src(lintFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
  gulp.src(sourceFiles)
    .pipe(concat('angular-wise-storage.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./dist/'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename('angular-wise-storage.min.js'))
    .pipe(sourcemaps.init('.'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  return gulp
        .watch('./dist/**/*.{js,ts}', ['lint', 'clean', 'build'])     // Watch the scripts folder for file changes.
        .on('change', function (event) {        // Log the change to the console.
          console.log('File ' + event.path + ' was ' + event.type + ', build task started.');
        });
});

gulp.task('default', ['lint', 'clean', 'build']);
