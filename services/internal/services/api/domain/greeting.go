// Package domain 是 API 服务的领域层:纯业务类型与规则,不依赖框架与 IO。
package domain

import "fmt"

// Greeting 是一次问候的领域结果。
type Greeting struct {
	Message string `json:"message"`
}

// NewGreeting 按名字构造问候;name 为空时回退到 "world"。
func NewGreeting(name string) Greeting {
	if name == "" {
		name = "world"
	}
	return Greeting{Message: fmt.Sprintf("hello, %s", name)}
}
