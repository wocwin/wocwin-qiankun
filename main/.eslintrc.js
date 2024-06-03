// ESlint 检查配置
module.exports = {
  root: true,
  parserOptions: {
    // parser: 'babel-eslint',
    // sourceType: 'module'
    parser: '@babel/eslint-parser'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:prettier/recommended' // 冲突时使用prettier的规则进行覆盖
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 控制在生产环境下是否允许使用 console，生产环境下输出警告，其他情况下关闭
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 控制在生产环境下是否允许使用 debugger，生产环境下输出警告，其他情况下关闭
    'no-console': 'off', // 关闭 no-console 规则，允许使用 console，但前面已经设置了条件规则
    quotes: [1, 'single'], // 强制使用单引号
    'no-irregular-whitespace': 2, // 禁止使用不规则的空白符
    'no-multiple-empty-lines': [2, { max: 1 }], // 限制最多连续出现一行空行
    'use-isnan': 2, // 使用 isNaN() 函数进行 NaN 判断
    'vars-on-top': 2, // 声明的变量要放在函数顶部
    'semi-spacing': [2, { before: false, after: true }], // 分号前后空格
    'no-multi-spaces': 1, // 禁止多余的空格
    'no-trailing-spaces': 2, // 禁止行尾空格
    'comma-spacing': 2, // 逗号前后的空格
    'space-before-function-paren': ['error', 'never'], // 函数名和括号之间不允许有空格
    'no-unused-vars': 'warn', // 未使用的变量发出警告
    'no-tabs': 'off', // 关闭禁止使用制表符的规则
    'no-unreachable': 'off', // 关闭禁止出现不可达代码的规则
    'space-before-function-paren': 'off', // 关闭函数名和括号之间是否需要空格的规则
    eqeqeq: 'off', // 关闭使用 === 和 !== 代替 == 和 != 的规则
    indent: 'off' // 关闭缩进检查
  }
}
