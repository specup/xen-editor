const update = require('immutability-helper')

module.exports = ({ config }) => {
  return update(config, {
    module: {
      rules: {
        $push: [
          {
            test: /\.tsx?$/,
            use: 'babel-loader',
          },
          {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
      },
    },
    resolve: {
      extensions: {
        $push: ['.ts', '.tsx'],
      },
    },
  })
}
