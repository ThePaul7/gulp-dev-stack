const gulp = require('gulp');
const argv = require('yargs').argv;
const gutil = require('gulp-util');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const copyToClipboard = require('copy-paste').copy;
const config = require('../config');

// const {
//     port,
//     paths: { gulpfile, npm, src, dist }
// } = config;
const port = config.port;
const gulpfile = config.paths.gulpfile;
const npm = config.paths.npm;
const src = config.paths.src;
const dist = config.paths.dist;
const isDev = argv.dev || false;

gulp.task('serve', ['prepare'], () => {
    const baseDir = isDev ? [src.base, dist.base, npm] : dist.base;

    browserSync({
        port,
        server: { baseDir },
        open: false
    }, () => copyToClipboard(`localhost:${port}`, () => gutil.log(gutil.colors.green('Local server address has been copied to your clipboard'))));

    const sanitize = (pathname) => {
        pathname instanceof Array || (pathname = [pathname]);
        pathname.map(path => path.replace(/^\.\//, ''));
        return pathname;
    }
    const watch = (pathname, tasks) => gulp.watch(sanitize(pathname), tasks);

    if (isDev) {
        watch(src.styles.all, () => runSequence(['lint:styles', 'styles']));
        watch([src.fonts.all, src.fonts.faces], ['fonts'])
        watch(src.tpl.all, ['tpl']);
        watch(src.icon, ['icon']);
        watch(src.app.all, ['lint:app']);
        watch(gulpfile, ['lint:gulpfile']);
        watch(src.app.vendor.all, ['js:vendor']);
    }
});
