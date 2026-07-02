// Package adapters 是 WS 服务的入站适配器:把 WebSocket 协议接到 Echoer 端口。
package adapters

import (
	"log/slog"
	"net/http"

	"github.com/coder/websocket"

	"github.com/wluisw/ai-first-demo/services/internal/services/ws/ports"
)

// NewHTTPHandler 构造 WS 服务的路由:/healthz 健康检查 + /ws WebSocket 回显端点。
func NewHTTPHandler(echoer ports.Echoer, logger *slog.Logger) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok"}`))
	})

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		c, err := websocket.Accept(w, r, nil)
		if err != nil {
			logger.Error("ws accept failed", slog.Any("err", err))
			return
		}
		defer func() { _ = c.CloseNow() }()

		ctx := r.Context()
		for {
			typ, data, err := c.Read(ctx)
			if err != nil {
				return // 客户端关闭或连接出错,结束读循环
			}
			if err := c.Write(ctx, typ, []byte(echoer.Echo(string(data)))); err != nil {
				logger.Error("ws write failed", slog.Any("err", err))
				return
			}
		}
	})

	return mux
}
