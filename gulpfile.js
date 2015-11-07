//本体系
var g = require('gulp');
var gulpif = require('gulp-if');

//開発パス、ビルドパス
var srcPath = './src/'
var buildPath = './build/'

//SCSS系
var scss = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixCore = require('autoprefixer-core');
var autoprefix = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var minCss = require('gulp-minify-css');

//Jade系
var jade = require('gulp-jade');
var data = require('gulp-data');
var dirs = require('recursive-readdir');

//js(dont use template)
var connect = require('gulp-connect');

// js-hint
var jshint = require('gulp-jshint');

g.task('lint', function() {
	return g.src([srcPath + '**/js/**/*.js','!'+srcPath + '**/js/lib/*.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

g.task('sass',function(){
	var minCssFlg = true;
	console.log('gulp task sass ---------satar');
	return scss(srcPath+'assets/css/',
		{
			style:'expanded',
			sourcemap:true
		}
	)
	.on('error',function(txt) {
				console.error('ERRor',txt.message);
	})
	.pipe(plumber())
	.pipe(autoprefix({
		browers:['Android 2.1','ie 8','ie 7'],
		cascade: false
	}))
	.pipe(sourcemaps.write('/map',{
		includeContent:false,
		sourceRoot:buildPath+'assets/css/'
	}))
	.pipe(gulpif( minCssFlg,minCss(),console.log('minfy:'+minCssFlg) ))
	.pipe(g.dest(buildPath+'assets/css/'));
})

g.task("jade",function(){
	g.src(['./src/**/*.jade','!*/include/*.jade','!*/layouts/*.jade','!*/elements/*.jade'])
	.pipe(plumber())
	.pipe(jade({
		pretty:true
	}))
	.pipe(g.dest(buildPath+''))
})

g.task('copy',function(){
	g.src(srcPath+'assets/js/**/')
	.pipe(g.dest(buildPath+'assets/js/'))

	g.src(srcPath+'assets/img/**/')
	.pipe(g.dest(buildPath+'assets/img/'))

})

g.task('watch',['sass','jade','copy'],function(){
	g.watch(srcPath+'**/*.jade',['jade']);
	g.watch(srcPath+'assets/css/**/*.scss',['sass']);
	g.watch(srcPath+'assets/js/**/*.js',['copy']);
	g.watch(srcPath+'assets/js/**/*.js',['lint']);
})

g.task('server',function(){
	connect.server({
		root:'./build'
		// port:8080,
		// host:'jadetest.local'
	});

})

g.task('default',['watch','server'])