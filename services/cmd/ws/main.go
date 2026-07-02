// Command ws 启动 ai-first-demo 的 WebSocket 服务。
// 只负责装配日志并交给 app.Run;业务逻辑在 internal/services/ws 下分层。
package main

import (
	"log/slog"
	"os"

	"github.com/wluisw/ai-first-demo/services/internal/services/ws/app"
	"github.com/wluisw/ai-first-demo/services/internal/shared/observability"
)

func main() {
	logger := observability.NewLogger("ws")
	if err := app.Run(logger); err != nil {
		logger.Error("ws service exited", slog.Any("err", err))
		os.Exit(1)
	}
}
