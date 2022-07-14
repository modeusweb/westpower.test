const {src, dest, parallel, series, watch} = require('gulp');

const browserSync = require('browser-sync').create();
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const cache = require('gulp-cache');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const fileInclude = require('gulp-file-include');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const { readFileSync } = require('fs');
const concat = require('gulp-concat');

let isProd = false; // dev by default

const clean = () => {
  return del(['dist/*'])
}

const styles = () => {
  return src('./src/scss/**/*.scss')
      .pipe(gulpif(!isProd, sourcemaps.init()))
      .pipe(sass().on("error", notify.onError()))
      .pipe(autoprefixer({grid: 'autoplace'}))
      .pipe(gulpif(isProd, cleanCSS({ level: 2 })))
      .pipe(gulpif(!isProd, sourcemaps.write('.')))
      .pipe(dest('./dist/css/'))
      .pipe(browserSync.stream());
};

const stylesBackend = () => {
  return src('./src/scss/**/*.scss')
      .pipe(sass().on("error", notify.onError()))
      .pipe(autoprefixer({grid: 'autoplace'}))
      .pipe(dest('./dist/css/'))
};

const scripts = () => {
  src('./src/js/vendors/**.js')
      .pipe(concat('vendors.min.js'))
      .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
      .pipe(dest('./dist/js/'))
  return src(
      ['./src/js/functions/**.js', './src/js/components/**.js', './src/js/main.js'])
      .pipe(gulpif(!isProd, sourcemaps.init()))
      .pipe(concat('main.js'))
      // .pipe(gulpif(isProd,
      //   babel({
      //     presets: ["@babel/preset-env"]
      //   })
      // ))
      .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
      .pipe(gulpif(!isProd, sourcemaps.write('.')))
      .pipe(dest('./dist/js'))
      .pipe(browserSync.stream());
}

const scriptsBackend = () => {
  src('./src/js/vendors/**.js')
      .pipe(concat('vendors.min.js'))
      .pipe(gulpif(isProd, uglify().on("error", notify.onError())))
      .pipe(dest('./dist/js/'))
  return src(['./src/js/functions/**.js', './src/js/components/**.js', './src/js/main.js'])
      .pipe(dest('./dist/js'))
};

const resources = () => {
  return src('./src/resources/**')
      .pipe(dest('./dist'))
}

const fonts = () => {
  return src('./src/fonts/**')
      .pipe(dest('./dist/fonts'))
}

const images = () => {
  return src('src/img/**/*')
      .pipe(gulpif(isProd,
          cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
              plugins: [
                { optimizationLevel: 3 },
                { progressive: true },
                { interlaced: true },
                { removeViewBox: false },
                { removeUselessStrokeAndFill: false },
                { cleanupIDs: false }
              ]
            })
          ]))
      ))
      .pipe(dest('./dist/img'))
};

const htmlInclude = () => {
  return src(['./src/*.html'])
      .pipe(fileInclude({
        prefix: '@',
        basepath: '@file'
      }))
      .pipe(dest('./dist'))
      .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
      directory: true
    },
    notify: false
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/js/**/*.js', scripts);
  watch('./src/partials/*.html', htmlInclude);
  watch('./src/*.html', htmlInclude);
  watch('./src/resources/**', resources);
  watch('./src/fonts/**', fonts);
  watch('./src/img/**/*', images);

}

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(clean, htmlInclude, scripts, styles, resources, images, fonts, watchFiles);
exports.build = series(toProd, clean, htmlInclude, scripts, styles, resources, images, fonts);
exports.backend = series(toProd, clean, htmlInclude, scriptsBackend, stylesBackend, resources, images, fonts);