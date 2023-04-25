module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss'
  ],
  rules: {
    'selector-class-pattern': ['^([a-z][a-z0-9]*)((-{1,2}|_{1,2})[a-z0-9]+)*$'],
    'selector-id-pattern': ['^([a-z][a-z0-9]*)(-[a-z0-9]+)*$|__(nuxt|layout)']
  }
}
