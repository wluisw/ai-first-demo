// Package adapters 是 API 服务的入站/出站适配器:把外部协议(HTTP)接到端口。
package adapters

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/wluisw/ai-first-demo/services/internal/services/api/ports"
)

// NewHTTPHandler 构造 API 服务的 HTTP 路由,把请求翻译成对 Greeter 端口的调用。
func NewHTTPHandler(greeter ports.Greeter, logger *slog.Logger) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, logger, http.StatusOK, map[string]string{"status": "ok"})
	})

	mux.HandleFunc("GET /api/hello", func(w http.ResponseWriter, r *http.Request) {
		g := greeter.Greet(r.URL.Query().Get("name"))
		writeJSON(w, logger, http.StatusOK, g)
	})

	return mux
}

func writeJSON(w http.ResponseWriter, logger *slog.Logger, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		logger.Error("failed to encode response", slog.Any("err", err))
	}
}
