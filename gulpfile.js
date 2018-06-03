var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    babel = require('gulp-babel'),
    ts = require('gulp-typescript'),
    strip = require('gulp-strip-comments');

var tsProject = ts.createProject("tsconfig.json");

gulp.task('type', function () {
    return gulp.src('dev/')
});

// Styles

gulp.task('html', function () {
    return gulp.src('dev/index.html')
        .pipe(strip())
        .pipe(gulp.dest(''))
});

gulp.task('styles', function () {
    return gulp.src('dev/styl/main.styl')
        .pipe(stylus())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat('main.css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('web/css'))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

gulp.task('vendorstyles', function () {
    return gulp.src('dev/styl/vendorcss/**/*.css')
        /* .pipe(rename({ suffix: '.min' })) */
        .pipe(uglify())
        .pipe(gulp.dest('web/css/vendor'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

gulp.task('ts', () =>
    gulp.src('dev/ts/**/*.ts')
    .pipe(tsProject())
    //.pipe(concat('main.min.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('web/scripts'))
);

// Scripts
gulp.task('scripts', function () {
    return gulp.src('dev/js/vendor/**/*.js')
        /* .pipe(rename({ suffix: '.min' })) */
        .pipe(uglify())
        .pipe(gulp.dest('web/scripts/vendor'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// Images
gulp.task('images', function () {
    return gulp.src('dev/img/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('web/img'))
        .pipe(notify({
            message: 'Images task complete'
        }));
});

// Clean
gulp.task('clean', function () {
    del(['web/css', 'web/scripts'])
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start(['html', 'styles', 'scripts', 'ts']);
});

// Watch
gulp.task('watch', function () {

    // Watch .scss files
    gulp.watch('dev/styl/**/*.styl', ['styles']);

    // Watch .ts files
    gulp.watch('dev/ts/**/*.ts', ['ts']);

    // Watch image files
    gulp.watch('dev/img/**/*', ['images']);

    //Watch html
    gulp.watch('dev/index.html', ['html'])

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['web/**']).on('change', livereload.changed);

});