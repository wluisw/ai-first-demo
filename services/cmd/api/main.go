// Command api 启动 ai-first-demo 的 API 服务(HTTP)。
// 只负责装配日志并交给 app.Run;业务逻辑在 internal/services/api 下分层。
package main

import (
	"log/slog"
	"os"

	"github.com/wluisw/ai-first-demo/services/internal/services/api/app"
	"github.com/wluisw/ai-first-demo/services/internal/shared/observability"
)

func main() {
	logger := observability.NewLogger("api")
	if err := app.Run(logger); err != nil {
		logger.Error("api service exited", slog.Any("err", err))
		os.Exit(1)
	}
}
