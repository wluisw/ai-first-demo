// Package app 装配 WS 服务:实现入站端口的业务核心,并把适配器接到一起。
package app

import (
	"github.com/wluisw/ai-first-demo/services/internal/services/ws/domain"
	"github.com/wluisw/ai-first-demo/services/internal/services/ws/ports"
)

// Service 是 WS 服务的业务装配根,实现 ports.Echoer。
type Service struct{}

// New 创建 WS 服务实例。
func New() *Service { return &Service{} }

// Echo 实现 ports.Echoer。
func (s *Service) Echo(msg string) string { return domain.Echo(msg) }

// 编译期断言:Service 满足 Echoer 端口。
var _ ports.Echoer = (*Service)(nil)
