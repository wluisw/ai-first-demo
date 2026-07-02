package app

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/wluisw/ai-first-demo/services/internal/services/ws/adapters"
	"github.com/wluisw/ai-first-demo/services/internal/services/ws/bootstrap"
)

// Run 装配 WS 服务并阻塞启动 HTTP/WebSocket server。
// ReadHeaderTimeout 只约束 header 读取,不影响 WS 升级后的长连接。
func Run(logger *slog.Logger) error {
	cfg := bootstrap.Load()
	srv := &http.Server{
		Addr:              cfg.Addr,
		Handler:           adapters.NewHTTPHandler(New(), logger),
		ReadHeaderTimeout: 5 * time.Second, // 防 Slowloris(gosec G114)
	}
	logger.Info("ws service listening", slog.String("addr", cfg.Addr))
	return srv.ListenAndServe()
}
