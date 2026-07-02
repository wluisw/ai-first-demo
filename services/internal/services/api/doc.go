// Package api 是 API 服务的实现根(hexagonal:domain / ports / app / adapters / bootstrap)。
//
// cmd/api 只负责启动;业务从 app.Service 向下拆分。演示用最小 HTTP 服务:
//   - GET /healthz          健康检查
//   - GET /api/hello?name=  返回领域问候(name 省略回退 world)
package api
