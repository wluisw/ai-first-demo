package app

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/wluisw/ai-first-demo/services/internal/services/api/adapters"
	"github.com/wluisw/ai-first-demo/services/internal/services/api/bootstrap"
)

// Run 装配 API 服务并阻塞启动 HTTP server。
func Run(logger *slog.Logger) error {
	cfg := bootstrap.Load()
	srv := &http.Server{
		Addr:              cfg.Addr,
		Handler:           adapters.NewHTTPHandler(New(), logger),
		ReadHeaderTimeout: 5 * time.Second, // 防 Slowloris(gosec G114)
	}
	logger.Info("api service listening", slog.String("addr", cfg.Addr))
	return srv.ListenAndServe()
}
