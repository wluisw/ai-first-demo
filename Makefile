# =============================================================================
# ai-first-demo 单仓多项目根级 Makefile —— 纯委托层,不含业务逻辑。
# -----------------------------------------------------------------------------
# 后端(Go)执行层在 services/Makefile;前端(web)在 apps/web(pnpm workspace)。
# 本文件只把根级命令转发到对应子项目。
# =============================================================================
.DEFAULT_GOAL := help
.PHONY: help setup check precommit \
        services-verify services-build services-fmt services-test \
        web-dev web-build web-test web-typecheck web-lint

SERVICES_DIR := services

help:
	@echo "ai-first-demo 单仓多项目 — 根级委托命令:"
	@echo "  make setup            安装依赖(services go mod tidy + web pnpm install)"
	@echo "  make check            全量检查(services verify + web typecheck/test/lint)"
	@echo "  make precommit        提交前快速自检(services fmtcheck+build + web typecheck)"
	@echo "  make services-verify  → services: fmtcheck + build + test"
	@echo "  make services-build   → services: go build ./cmd/..."
	@echo "  make services-fmt     → services: gofmt -w cmd internal"
	@echo "  make web-dev|web-build|web-test|web-typecheck|web-lint → apps/web(pnpm)"

# ---- 聚合 ----
setup:
	$(MAKE) -C $(SERVICES_DIR) setup
	pnpm install

check: services-verify web-typecheck web-test web-lint

# pre-commit hook 调用入口:快速自检(格式 + 编译 + 前端类型)。
precommit:
	$(MAKE) -C $(SERVICES_DIR) fmtcheck
	$(MAKE) -C $(SERVICES_DIR) build
	pnpm typecheck

# ---- services 委托(转发到 services/Makefile 真实 target)----
services-verify:
	$(MAKE) -C $(SERVICES_DIR) verify
services-build:
	$(MAKE) -C $(SERVICES_DIR) build
services-fmt:
	$(MAKE) -C $(SERVICES_DIR) fmt
services-test:
	$(MAKE) -C $(SERVICES_DIR) test

# ---- web 委托(apps/web 已初始化;根 package.json scripts 已 --filter @app/web)----
web-dev:
	pnpm dev
web-build:
	pnpm build
web-test:
	pnpm test
web-typecheck:
	pnpm typecheck
web-lint:
	pnpm lint
