let baseUrl = ''
if (process.env.VUE_APP_CURRENTMODE === 't') {
  // 测试环境
  baseUrl = ''
} else if (process.env.VUE_APP_CURRENTMODE === 'r') {
  // 预发布环境
  baseUrl = ''
} else {
  // 正式环境
  baseUrl = ''
}
