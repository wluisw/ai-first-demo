// Package ws 是 WebSocket 服务的实现根(hexagonal:domain / ports / app / adapters / bootstrap)。
//
// cmd/ws 只负责启动;业务从 app.Service 向下拆分。演示用最小 WS 服务:
//   - GET /healthz  健康检查
//   - /ws           WebSocket 端点,对每条消息做领域回显(前缀 "echo: ")
package ws
