module.exports = {
  purge: [
    './index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        72: '20rem'
      },
      height: {
        128: '600px'
      }
    },
  },
  variants: {},
  plugins:  [
  require('@tailwindcss/custom-forms')
],
}