// 自动加载api
const commonApiObj = {}
const finalObj = {}
const modulesApi = require.context('./modules', true, /\.js$/)
modulesApi.keys().forEach(key => {
	const newKey = key.replace(/(\.\/|\.js)/g, '')
	commonApiObj[newKey] = require(`./modules/${newKey}`)
})
Object.values(commonApiObj).map(x => Object.assign(finalObj, x))
// console.log('所有业务接口--', finalObj)
export default {
	...finalObj
}
