const plugins = [] // 'tailwindcss'

if (process.env.NODE_ENV === 'production') {
  plugins.push('autoprefixer', '@fullhuman/postcss-purgecss')
}

module.exports = {plugins}
