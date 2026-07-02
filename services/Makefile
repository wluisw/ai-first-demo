# ai-first-demo 后端(Go)本地开发入口。
# 只放本地构建/测试/格式化/服务启动;CI 门禁见 .github/workflows。包管理:Go modules。

.PHONY: setup build test fmt fmtcheck run-api run-ws verify

setup:
	go mod tidy

# 构建所有 cmd 入口(api + ws)。
build:
	go build ./cmd/...

test:
	go test ./...

fmt:
	gofmt -w cmd internal

fmtcheck:
	@out=$$(gofmt -l cmd internal); \
	 test -z "$$out" || { echo "需要 make fmt:"; echo "$$out"; exit 1; }

run-api:
	go run ./cmd/api

run-ws:
	go run ./cmd/ws

verify: fmtcheck build test
