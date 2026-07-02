# CLAUDE.md — 单仓根上下文(agent 的常驻地图,v2.6)

> 单仓(mono-repo)：前端(Vite + React) + Go 后端多服务(api / ws) + 文档,全在一个仓库。
> **v2.4**：agent 写码行为纪律(Karpathy adapted)——任何 agent 动手前**必读** `.claude/skills/agent-coding-discipline/SKILL.md`。
> **v2.6**：并行优先——主 session 收到需求先判断能否并行分解。
> 任何 agent 进入项目后,按顺序:**读本文件 → 读 agent-coding-discipline → 按需读相关任务 skill**。
> 目标:全新 agent 只读本文件 + 本仓,就能独立完成一个跨端(前端 / 后端服务)改动并让测试通过。
> 把方括号 `[...]` 占位换成本仓真实内容,随架构演进持续更新。

---

## 🛑 强制行为纪律(动手前必读)

**任何写码 agent**(implementer / explorer / verifier-quality 等)**动手前**,必须先吃这份:
- [`.claude/skills/agent-coding-discipline/SKILL.md`](.claude/skills/agent-coding-discipline/SKILL.md) — 10 条规则 + 4 个失败模式 + 8 项 pre-submit 自检

## 🛑 并行优先原则(v2.6,主 session 必读)

**主 session 收到任何"加 X / 改 Y / 实现 Z"的需求,第一件事不是写码,而是判断"能不能并行分解"。**

- 先调 [`.claude/skills/task-decomposer/SKILL.md`](.claude/skills/task-decomposer/SKILL.md) 决策并出 DAG
- 可并行 → 调 [`.claude/skills/parallel-orchestrator/SKILL.md`](.claude/skills/parallel-orchestrator/SKILL.md) 用 Task tool **一条消息派 N 个子 agent 真并行**
- 串行 → 直接走 architect-task-writer + implementer

**默认保守**:有疑虑就串行。但对真正可分的任务(前端与某后端服务独立、api 与 ws 各自独立的功能模块)**一定要并行,不要傻串行**。

简版(贴墙):

1. **读再写** —— 读完整文件,不要扫
2. **想再做** —— 先说假设和 tradeoff
3. **简单** —— 写眼前问题的最少代码
4. **外科手术式** —— diff 像任务一样小;**不顺手 reformat**
5. **fail-first 测试** —— 修 bug 先写失败的测试再修
6. **goal-driven** —— 成功标准先于代码
7. **debug 不靠猜** —— 读完整 stack、复现、一次只改一处
8. **依赖永久** —— 标准库优先,加新依赖必说理由
9. **沟通** —— 说做了什么、为什么、有什么顾虑;不确定的事**精确**说出来
10. **持续推进** —— 没到需要人工决断前**不中断、一直往下推**;并行时只有卡到人工决断的那个子 session 停,其余照常继续

4 个失败模式(发现 = 停):Kitchen Sink / Wrong Abstraction / Optimistic Path / Runaway Refactor。

PR 描述自动带 pre-submit checklist(见 `.github/pull_request_template.md`)。

---

## 这个仓库是什么
**ai-first-demo** —— AI-First **单仓多项目** demo:一个前端(Vite + React 18 + TypeScript)+ Go 后端两服务(api 走 HTTP、ws 走 WebSocket)的单仓,用于**演示 / 测试 AI-First harness 的完整流程**(特性开关、AI 评审、triage 自愈、goal loop)。前后端与文档都在本仓,agent 可跨端独立完成改动并本地验证。
- 子系统:`apps/web/`(前端,Vite + React + TS)、`services/`(Go 1.26 后端,hexagonal,api + ws 两服务)、`docs/`(设计文档,本仓内——原共享 docs-repo 已转入本仓)。
- 核心技术栈:前端 Vite 5 + React 18 + TypeScript 5 + pnpm;后端 Go 1.26 + `net/http` + `github.com/coder/websocket` + `log/slog` 结构化日志。

## 目录结构(职责地图)

```
apps/
  web/                  # 前端主应用(Vite + React + TS,pnpm workspace 成员 @app/web)
    src/{components,lib}/#   可复用组件 + 前端工具(如特性开关读取)
    index.html / vite.config.ts
services/               # Go 后端(单 Go module,hexagonal)
  go.mod                #   module github.com/wluisw/ai-first-demo/services(go 1.26)
  cmd/{api,ws}/         #   2 个服务入口(各编译为一个二进制)
  internal/services/    #   各服务实现(kebab):api / ws,每个含 domain/ports/adapters/app/bootstrap
  internal/shared/      #   跨服务共享:observability(slog)
  Makefile              #   后端本地命令(verify/build/test/fmt/run-api/run-ws)
docs/                   # 设计文档(本仓内):architecture.md、services/<英文可读名>/(api.md/CHANGELOG.md)、standards/、test-cases/(双维度)
graphify-out/           # 知识图谱(`graphify update .` 生成,纯 AST 无 LLM;GRAPH_REPORT.md 给 agent 读)
flags/feature-flags.ts  # 特性开关封装(发布安全阀,前端按开关灰度)
.claude/                # harness(skills 24、agents 10、settings)
.github/workflows/      # 本仓 CI/CD 与 AI 评审工作流
scripts/ state/ prompts/# harness core:自动化脚本 / agent 外置记忆 / 任务模板
Makefile                # 根级委托(services-* / web-*)
```

## Session 开始必读

每次进入项目后,按顺序:
1. **读 `graphify-out/GRAPH_REPORT.md`**(若存在)— 了解模块社区、依赖热点(~2-5k token,读一次)
2. **读本文件** — 确认当前技术栈和命令
3. **读 agent-coding-discipline** — 写码行为纪律
4. **按需读 skill** — 根据任务类型,参考下方"规范 skill 强制加载"表

## 本地开发(agent 必须能复现这些命令)

> ✅ 下列即本仓真实可跑命令。CI 门禁与 AI 评审都依赖"能一键跑测试"。前端用 **pnpm**,后端用 **Go + make**。

```bash
# 根级委托 Makefile
make setup            # services: go mod tidy + web: pnpm install
make check            # services verify + web typecheck/test/lint(全量)
make precommit        # 提交前快速自检(services fmtcheck+build + web typecheck)——pre-commit hook 入口

# 后端(委托 services/Makefile)
make services-verify  # fmtcheck + build + go test ./...(= cd services && make verify)
make services-build   # go build ./cmd/...
make services-fmt     # gofmt -w cmd internal
cd services && make run-api   # 起 api 服务(默认 :8080)
cd services && make run-ws    # 起 ws 服务(默认 :8081)

# 前端(pnpm workspace)
make web-dev / web-build / web-test / web-typecheck / web-lint
```

- **api 服务**:`GET /healthz` 健康检查、`GET /api/hello?name=` 返回领域问候(name 省略回退 world)。
- **ws 服务**:`GET /healthz`、`/ws` WebSocket 端点(对每条消息做 `echo:` 回显)。

## 编码规范

### 后端(Go)
- Go 版本:`go 1.26.0` + `toolchain go1.26.4`;格式化 `gofmt`(`make services-fmt`),提交前必跑,CI 会校验。
- 架构:hexagonal(domain / ports / adapters / app / bootstrap),禁止跨层直接调用;`cmd/<svc>` 只负责启动,业务从 `app.Service` 向下拆分。
- 错误处理:哨兵错误 + `errors.Is/As` → 见 `go-error-handling` skill。
- 日志:只用 `log/slog`(JSON,固定带 `service` 字段),禁 `fmt.Print*` → 见 `go-logging` skill。
- 可观测:新服务 / 外部调用 / 请求链路补结构化日志与埋点 → 见 `go-observability` skill。
- 测试:新代码必须带测试;关键路径必须有集成测试。跨服务共享类型放 `services/internal/shared/`,服务间不互相 import。

### 前端(TypeScript)
- Node 20、TypeScript 5(`strict: true`);格式化 Prettier / eslint(`pnpm lint`),提交前必跑。
- 函数组件 + hooks,禁 class component;UI 边界用 Error Boundary 兜底;网络请求统一封装,失败给用户可读提示,不吞错。
- 数值精度:涉及金额 / 精度敏感数值时,API 返回 `string`,**禁止前端做浮点运算** → 见 `financial-numerics` skill(如项目适用)。
- 测试:组件测试(Vitest + Testing Library)+ 关键交互路径 E2E。

### 通用
- 结构化日志(JSON),字段含 `service`、`request_id`、`level`;自愈环依赖这些字段做聚类。
- 新代码必须带测试;关键路径必须有集成 / E2E 测试。

## 安全禁区(BLOCK 级,评审会拦)
- 不得硬编码密钥/token;用环境变量 + secrets。
- 新端点默认必须鉴权;越权(IDOR)零容忍。
- 用户输入到 SQL/shell/模板一律参数化/转义。
- 不得在日志/响应中泄露 PII 或凭证。

## 特性开关(强制)
- **每个新功能必须藏在特性开关后**(前端见 `flags/feature-flags.ts`;后端新功能同样走开关约定)。
- 新增 flag 时:在代码里用类型安全的 key,并在 PR 描述里写明 flag 名与灰度计划。
- 不要删旧 flag 而不清理其分支逻辑。

## 部署(harness 不内置)
- **部署高度项目特定(Vercel/AWS/k8s/Cloud Run 各不同),harness 不提供部署 workflow**,由各项目自行配置或交管理端。
- agent 不应手动操作 prod;合并后的部署由各项目自己的流水线负责。

## 🛑 合并与发布纪律(每次合并进 main 都要,强制)
**任何 PR 合并进 `main` 后,必须立刻做这两件事,缺一不算完成:**
1. **打 tag** —— 给这次合并打一个 git tag 并 push 到远端(语义化版本 `vX.Y.Z` 或日期 `vYYYY.MM.DD-N`)。tag 是**回滚锚点**。
2. **写合并记录** —— 在 GitHub 基于该 tag 建一个 **Release**,正文写清改了什么 / 为什么 / 影响面。Release 是**人能读的合并审计**。

> 铁律:**没打 tag、没写 Release 的合并 = 没合并完。** 不要直推 main 跳过 PR,也不要合了 PR 就走人。

## 给实现 agent 的工作约定
1. **分支纪律(BLOCK 级):禁止直接 commit/push 到 `main`。** 任何改动必须:新建分支 → 提交 → 开 PR → 过门禁(ci-gate/ai-review-gate + 人工评审)→ 合并。
2. **先出计划与风险,再写码。** 列出你识别到的失败模式、安全边界、可能的技术债。
3. 不扩大范围;任务模板(`prompts/architect-task.md`)第 3 节之外的需求,先问架构师。
4. 自带测试,确保本仓的测试命令(见"本地开发"节)通过。
5. 开 PR 时在描述里列出权衡点,并指出需要人类重点看的"战略风险"。
6. 跨服务共享类型放 `services/internal/shared/`,不要在服务间复制,也不要服务间直接互相 import;跨端契约(前后端共享)记录在 `docs/`。

## 给 triage agent 的工作约定
- 错误来源:日志用 slog(结构化)→ 采集入可观测后端;前端遥测事件同样结构化。错误追踪(Sentry 类)按需接入。
- 按错误指纹聚类、九维打分(见 `scripts/triage_engine.py` + `.claude/skills/triage-severity-scorer/SKILL.md`)。
- 建单前先去重:用 `state/triage-history.jsonl` 识别首次/稳定/回归;已知 flake 自动降权。
- 建议步骤遵循 `.claude/skills/pr-investigator/SKILL.md`。

---

## v2 新增:Skills / Agents / State / Loops

### Skills(`.claude/skills/<name>/SKILL.md`)
项目知识按域拆分。agent 看到 `description` 与 `when_to_use` 自动加载相关 skill。
新增 skill:在 `.claude/skills/` 下建目录(目录名即 skill 名,含 SKILL.md;CC 按 frontmatter 的 `name`/`description` 自动发现,无需注册表)。

#### 规范 skill 强制加载（开发与评审的共同底线）

任何 agent 在以下情形**必须先 Read 对应 skill 再动手**（不是"自觉"，是硬规则）：

**通用（不随技术栈变化）：**

| 情形 | 必须先读 skill |
|------|--------------|
| 涉及 SQL/ORM/DB 迁移 | `sql-optimization` |
| 外部调用/并发/缓存/监控 | `performance-review` |
| 处理用户输入/鉴权/密钥/序列化 | `secure-coding` |
| 改 HTTP/RPC 接口 | `api-doc-output` |
| 改数据模型 | `data-model-output` |
| 任意功能变更完成后（PR 前） | `changelog-output` |
| 任何改动的底线 | `clean-code` + `testing-standards` |
| 新功能 | 额外加 `feature-flag-setup` |

**Go 后端相关：**

| 情形 | 必须先读 skill |
|------|--------------|
| 涉及 Go 日志输出 | `go-logging` |
| 涉及 Go 错误处理 | `go-error-handling` |
| 新增服务/外部调用/请求链路 | `go-observability` |

这些 skill 同时被 PR 的 AI 评审引用(见 `.github/workflows/ai-review.yml`)。开发期漏掉的,评审期会拦。

#### 文档同步义务（PR 前必须完成）

| 改动类型 | 必须同步更新 | 对应 skill |
|---------|------------|-----------|
| 新增/修改**可测功能**(后端契约) | `docs/test-cases/<服务kebab>/<feature>.md`(api/ws → 生成 auto-tests) | `test-case-output`(约定) |
| 改动**影响线上前端流程**(用户可感知) | 连带更新 `docs/test-cases/web/<流程>.md`(前端 e2e) | `test-case-output`(约定) |
| 新增/修改 HTTP/WS 接口 | `docs/services/<英文可读名>/api.md`(API Service / WS Service) | `api-doc-output` |
| 新增/修改数据模型 | `docs/services/<英文可读名>/数据模型.md` | `data-model-output` |
| 任意功能变更(PR 前) | `docs/services/<英文可读名>/CHANGELOG.md` | `changelog-output` |
| 全局架构演进 | `docs/architecture.md` | — |

**所有相关文档必须在同一 PR 里更新,不允许单独补提。**
> **命名**:`docs/services/` 用**英文可读名**(`API Service`↔`api`、`WS Service`↔`ws`,给人读);`docs/test-cases/` 用 **kebab**(`api`/`ws`,与 `services/cmd/<服务>` 对齐,给工具);二者故意不同。
> **test-cases 双维度**:`web/<流程>.md`(前端 e2e)+ `<服务kebab>/<feature>.md`(后端契约);后端改动影响用户可感知流程时,勿只更后端契约、漏掉 `web/` 的 e2e。约定详见 `docs/test-cases/README.md`。

### Sub-agents(`.claude/agents/<name>.toml`)
角色化的 agent + 模型分层:`explorer`(Haiku)/`implementer`(Sonnet)/`subtask-implementer`(并行子任务)/`merger`(并行整合)/三类 `verifier`(分层)/`triage-scorer`(Sonnet)/`checker`(Sonnet)。**写代码的 agent 不能是判断 done 的 agent;并行子任务不能再递归 spawn 子 agent**。

> **别混 `checker` 与 `verifier`(两个不同职责)**:
> - `checker` = goal_loop 的**完成度判定**,返回 `done|continue|stuck`——判断"**任务做完没**"。
> - `verifier-quality/security/performance/dependency` = **code review**——评审"**代码好不好**"。
> 本地自审(开 PR 前)和 PR 门禁的代码评审,都用 `verifier-*` 那套,**不是 checker**。

### State(`state/`)
agent 的外置记忆:`triage-history.jsonl`、`token-usage.jsonl`、`comprehension-log.jsonl`、
`tasks/<id>.json`、`known-flakes.txt`。**append-only 优先**,入仓可审计。

### Goal Loops(`scripts/goal_loop.py`)
跑到一个可验证的停止条件成立为止。implementer 推一步 → checker(独立 sub-agent)判定 done。
长任务、回归修复、CI 自愈都套这个范式。

### Worktrees(`scripts/spawn_agent_worktree.sh`)
并行 agent 任务必须用 `git worktree` 隔离 fs + 隔离端口/进程,否则集成测试一定撞车。

### Token 与 Comprehension 报告
- `scripts/token_report.py`:按 day / loop / role / model 聚合花费,集成进每日健康报告。
- `scripts/comprehension_metrics.py`:**反认知投降护栏**——comprehension-coverage、
  pr-read-rate、agent-modification-rate 三项指标低于阈值会触发红线告警。

---
*保持本文件最新是架构师的职责。它过时一天,agent 就盲一天。*
