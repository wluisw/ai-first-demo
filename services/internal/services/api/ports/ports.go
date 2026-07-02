// Package ports 声明 API 服务的入站/出站端口(接口),隔离领域与外部适配器。
package ports

import "github.com/wluisw/ai-first-demo/services/internal/services/api/domain"

// Greeter 是入站端口:给定名字返回领域问候结果。
type Greeter interface {
	Greet(name string) domain.Greeting
}
