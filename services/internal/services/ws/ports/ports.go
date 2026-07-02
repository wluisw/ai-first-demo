// Package ports 声明 WS 服务的入站/出站端口(接口)。
package ports

// Echoer 是入站端口:对一条消息返回回显结果。
type Echoer interface {
	Echo(msg string) string
}
