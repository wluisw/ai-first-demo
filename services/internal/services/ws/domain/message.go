// Package domain 是 WS 服务的领域层:纯业务规则,不依赖框架与 IO。
package domain

// Echo 返回对一条入站消息的领域回显(演示:加 "echo: " 前缀)。
func Echo(msg string) string {
	return "echo: " + msg
}
