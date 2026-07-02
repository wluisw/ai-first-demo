package app

import (
	"log/slog"
	"net/http"

	"github.com/wluisw/ai-first-demo/services/internal/services/ws/adapters"
	"github.com/wluisw/ai-first-demo/services/internal/services/ws/bootstrap"
)

// Run 装配 WS 服务并阻塞启动 HTTP/WebSocket server。
func Run(logger *slog.Logger) error {
	cfg := bootstrap.Load()
	handler := adapters.NewHTTPHandler(New(), logger)
	logger.Info("ws service listening", slog.String("addr", cfg.Addr))
	return http.ListenAndServe(cfg.Addr, handler)
}
