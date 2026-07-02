// Package app 装配 API 服务:实现入站端口的业务核心,并把适配器接到一起。
package app

import (
	"github.com/wluisw/ai-first-demo/services/internal/services/api/domain"
	"github.com/wluisw/ai-first-demo/services/internal/services/api/ports"
)

// Service 是 API 服务的业务装配根,实现 ports.Greeter。
type Service struct{}

// New 创建 API 服务实例。
func New() *Service { return &Service{} }

// Greet 实现 ports.Greeter。
func (s *Service) Greet(name string) domain.Greeting {
	return domain.NewGreeting(name)
}

// 编译期断言:Service 满足 Greeter 端口。
var _ ports.Greeter = (*Service)(nil)
