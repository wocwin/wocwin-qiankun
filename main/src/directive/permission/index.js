import hasPermi from './hasPermi'

const install = function(Vue) {
  Vue.directive('hasPermi', hasPermi)
}

if (window.Vue) {
  window['hasPermi'] = hasPermi
  Vue.use(install); // eslint-disable-line
}

export default install
