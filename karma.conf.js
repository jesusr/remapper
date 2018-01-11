module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    files: [{
      pattern: './test/test-context.js',
      watched: false
    }],
    frameworks: ['mocha'],
    preprocessors: {
      'test-context.js': ['webpack']
    },
    webpack: {
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel?presets[]=es2015'
        }]
      },
      watch: true
    },
    webpackServer: {
      noInfo: true
    }
  });
};
