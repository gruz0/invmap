module.exports = {
  entry: './app/index',
  output: {
    filename: 'app.js',
    path: './public'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
    ]
  }
};
