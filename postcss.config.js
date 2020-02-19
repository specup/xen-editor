module.exports = {
  plugins: [
    require('@csstools/postcss-sass')(),
    require('autoprefixer'),
    require('postcss-import')(),
  ]
}
