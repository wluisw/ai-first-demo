package observability

import (
	"log/slog"
	"os"
)

// NewLogger 返回一个输出结构化 JSON、带固定 service 字段的 slog.Logger。
// service 字段是自愈环做日志聚类的关键(见 CLAUDE.md 编码规范)。
func NewLogger(service string) *slog.Logger {
	h := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
	return slog.New(h).With(slog.String("service", service))
}
