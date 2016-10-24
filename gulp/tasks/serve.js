/* Configuration */
const config = require('../config');
const DEVELOPMENT = config.ENVIRONMENT.IS_DEVELOPMENT;

/* Gulp */
const gulp = require('gulp');
const gutil = require('gulp-util');

/* Plugins */
const argv = require('yargs').argv;
const browserSync = require('browser-sync');
const copyToClipboard = require('copy-paste').copy;
const runSequence = require('run-sequence');

const port = config.PORT;

gulp.task('serve', ['prepare'], () => {
    const baseDir = DEVELOPMENT ? [
        config.DEVELOPMENT_BASE,
        config.BUILD_BASE,
        config.NPM,
        config.STYLEGUIDE_BASE

    ] : config.BUILD_BASE;

    browserSync({
        port,
        server: { baseDir },
        open: false
    }, () => copyToClipboard(`localhost:${port}`, () => gutil.log(gutil.colors.green('Local server address has been copied to your clipboard'))));

    const sanitize = (pathname) => {
        pathname instanceof Array || (pathname = [pathname]);
        pathname.map(path => path.replace(/^\.\//, ''));
        return pathname;
    };

    const watch = (pathname, tasks) => gulp.watch(sanitize(pathname), tasks);

    if (DEVELOPMENT) {
        watch(config.CSS_ALL, () => runSequence(['styles', 'styleguide']));
        watch(config.JS_ALL, ['eslint:app']);
        watch(config.TEMPLATE_ALL, ['tpl']);
        watch(config.SVG_ALL, ['icon']);
        watch(config.GULP_ALL, ['eslint:gulpfile']);
    }
});
