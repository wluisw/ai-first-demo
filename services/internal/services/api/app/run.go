package app

import (
	"log/slog"
	"net/http"

	"github.com/wluisw/ai-first-demo/services/internal/services/api/adapters"
	"github.com/wluisw/ai-first-demo/services/internal/services/api/bootstrap"
)

// Run 装配 API 服务并阻塞启动 HTTP server。
func Run(logger *slog.Logger) error {
	cfg := bootstrap.Load()
	handler := adapters.NewHTTPHandler(New(), logger)
	logger.Info("api service listening", slog.String("addr", cfg.Addr))
	return http.ListenAndServe(cfg.Addr, handler)
}
