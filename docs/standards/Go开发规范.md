# Go 开发规范

## 技术栈
- Go 1.26(`services/go.mod` 钉版本);格式化 gofmt;lint golangci-lint v2(`services/.golangci.yml`)。
- 依赖克制:标准库优先(`net/http`、`log/slog`);WebSocket 用 `github.com/coder/websocket`。

## 硬约束
- 架构:hexagonal(domain / ports / adapters / app / bootstrap),禁跨层直接调用;`cmd/<svc>` 只负责启动。
- 错误:哨兵错误 + `errors.Is/As`(见 `go-error-handling` skill)。
- 日志:只用 `log/slog`(JSON,固定 `service` 字段),禁 `fmt.Print*`(见 `go-logging` skill)。
- HTTP server 必须设超时(`ReadHeaderTimeout`),防 Slowloris(gosec G114)。
- 跨服务共享放 `internal/shared/`,服务间不互相 import。
- 新代码必须带测试;关键路径集成测试。

## 命令
`cd services && make verify`(fmtcheck + build + test)/ `make run-api` / `make run-ws`(或根 `make services-*`)。
