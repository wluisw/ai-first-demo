# CLAUDE.md — 本代码仓的 agent 常驻上下文(v2.1)

> v2 升级:把项目知识从单文件拆成 `skills/` 体系;sub-agent 角色化;新增 `state/` 外置记忆。
> **v2.1 升级**:模型无关——支持 Anthropic / OpenAI / DeepSeek / Qwen / Kimi / GLM 等任意厂商。
> 切厂商只需 2 个 env:`LLM_PROVIDER` + `LLM_API_KEY`。详见 `docs/多模型适配.md`。
> 任何 agent 进入项目后,**先读本文件,再按需 Read 相关 skill**。

> 这是 harness 的核心文件之一。**多仓架构下每个代码仓各有一份 CLAUDE.md**,反映本仓真实
> 结构与命令;跨仓共享的文档/接口/契约在独立的 **docs-repo**(经 git submodule 挂到 `docs/`)。
> 任何 agent(评审、实现、triage)进入本仓都先读它。**目标:一个全新 agent 只读本文件 + 本仓,
> 就能独立完成一个改动并让测试通过。** 把方括号占位换成本仓真实内容,随架构演进持续更新。

---

## 这个仓库是什么
本仓是 **AI-First 前端示例应用(`ai-first-demo`)**:一个用 **Vite + React 18 + TypeScript** 构建的
单页 Web 应用,演示在 AI-First harness(特性开关、AI 评审、triage 自愈、goal loop)约束下如何
开发前端。在多仓体系中,本仓是**前端仓**,与后端服务仓并列;前后端**共享同一个 docs-repo**
(`https://github.com/wluisw/ai-frist-doc.git`,经 git submodule 挂到 `docs/`),接口契约、数据模型、
总体架构都以 docs-repo 为唯一事实来源,**不在本仓复制**。

## 目录结构(职责地图)
> 这是**本代码仓**的结构,按本仓真实情况填。
```
apps/web/             # 前端主应用(Vite + React + TS)
  src/                #   组件、页面、入口
    components/       #   可复用 UI 组件
    lib/              #   前端侧工具(如特性开关读取)
    App.tsx           #   根组件
    main.tsx          #   挂载入口
  index.html          #   HTML 模板
  vite.config.ts      #   构建配置
flags/feature-flags.ts # 特性开关封装(发布安全阀,前端按开关灰度)
docs/                 # ← git submodule,指向共享 docs-repo(总体架构/各服务设计/接口/数据定义/契约)
.github/              # 本仓 CI/CD 与 AI 评审工作流
scripts/              # harness 自动化脚本(triage / goal loop / token & comprehension 报告)
state/                # agent 外置记忆(append-only)
prompts/ flags/       # 任务模板与特性开关
```
> 跨前后端/跨服务共享的接口、类型、契约放在 **docs-repo 的 `contracts/`**,本仓经 `docs/` submodule 引用,**不要在本仓复制**。

## 本地开发(agent 必须能复现这些命令)
> ⚠️ 下面是本仓真实可跑的命令——CI 门禁与 AI 评审都依赖"能一键跑测试"。包管理器用 **pnpm**。
- 拉取含 submodule 的代码:`git clone --recurse-submodules <repo>`(已克隆则 `git submodule update --init --recursive`)
- 安装依赖:`pnpm install`
- 起开发服务:`pnpm dev`(在 `apps/web` 下启动 Vite,默认 http://localhost:5173)
- 构建:`pnpm build`
- 跑测试:`pnpm test`(Vitest 单测;关键路径需补 Playwright E2E)
- 类型检查/lint:`pnpm typecheck` + `pnpm lint`

## 编码规范
- 语言版本:Node 20、TypeScript 5(`strict: true`)。
- 格式化:Prettier — 提交前必跑,CI 会校验。
- 错误处理:UI 边界用 Error Boundary 兜底;网络请求统一封装,失败给用户可读提示,不吞错。
- 日志:**结构化日志**(JSON),字段含 `service`、`request_id`、`level`;前端遥测事件同样结构化。
  自愈环依赖这些字段做聚类——不结构化,triage 引擎就看不懂。
- 测试:新代码必须带测试;关键交互路径必须有集成/E2E 测试。

## 安全禁区(BLOCK 级,评审会拦)
- 不得硬编码密钥/token;用环境变量 + secrets。
- 新端点默认必须鉴权;越权(IDOR)零容忍。
- 用户输入到 SQL/shell/模板一律参数化/转义。
- 不得在日志/响应中泄露 PII 或凭证。

## 特性开关(强制)
- **每个新功能必须藏在特性开关后**(见 `flags/feature-flags.ts`)。
- 新增 flag 时:在代码里用类型安全的 key,并在 PR 描述里写明 flag 名与灰度计划。
- 不要删旧 flag 而不清理其分支逻辑。

## 部署(harness 不内置)
- **部署高度项目特定(AWS/Vercel/k8s/Cloud Run 各不同),harness 不提供部署 workflow**,由各项目自行配置或交管理端。
- agent 不应手动操作 prod;合并后的部署由各项目自己的流水线负责。

## 给实现 agent 的工作约定
1. **分支纪律(BLOCK 级):禁止直接 commit/push 到 `main`。** 任何改动必须:新建分支 → 提交 → 开 PR → 过门禁(ci-gate/ai-review-gate + 人工评审)→ 合并。
2. **先出计划与风险,再写码。** 列出你识别到的失败模式、安全边界、可能的技术债。
3. 不扩大范围;任务模板(`prompts/architect-task.md`)第 3 节之外的需求,先问架构师。
4. 自带测试,确保本仓的集成/测试命令(见"本地开发"节)通过。
5. 开 PR 时在描述里列出权衡点,并指出需要人类重点看的"战略风险"。
6. 复用 docs-repo 的 `contracts/`(经 `docs/` submodule),不要在仓内复制跨服务类型。

## 给 triage agent 的工作约定
- 错误来源:可观测后端(CloudWatch / Prometheus 等)+ Sentry。
- 按错误指纹聚类、九维打分(见 `scripts/triage_engine.py` + `skills/triage-severity-scorer/SKILL.md`)。
- 建单前先去重:用 `state/triage-history.jsonl` 识别首次/稳定/回归;已知 flake 自动降权。
- 建议步骤遵循 `skills/pr-investigator/SKILL.md`。

---

## v2 新增:Skills / Agents / State / Loops

### Skills(`skills/<name>/SKILL.md`)
项目知识按域拆分。agent 看到 `description` 与 `when_to_use` 自动加载相关 skill。
新增 skill:在 `skills/` 下建目录,登记到 `skills/README.md`。

#### 规范 skill 强制加载（开发与评审的共同底线）
任何 agent 在以下情形**必须先 Read 对应 skill 再动手**（不是"自觉"，是硬规则）：
- 涉及 SQL/ORM/迁移 → `sql-optimization`
- 外部调用/并发/缓存/日志/监控 → `performance-review`
- 处理用户输入/鉴权/密钥/序列化 → `secure-coding`
- 金额/价格/余额/交易 → `financial-numerics`
- 改接口 → `api-doc-output`；改数据模型 → `data-model-output`
- 任何改动的底线：`clean-code` + `testing-standards` + 新功能 `feature-flag-setup`

这些 skill 同时被 PR 的 AI 评审引用（见 `.github/workflows/ai-review.yml`）。开发期漏掉的，评审期会拦。

### Sub-agents(`agents/<name>.toml`)
角色化的 agent + 模型分层:`explorer`(Haiku)/`implementer`(Sonnet)/三类 `verifier`(分层)/
`triage-scorer`(Sonnet)/`checker`(Sonnet)。**写代码的 agent 不能是判断 done 的 agent**。

### State(`state/`)
agent 的外置记忆:`triage-history.jsonl`、`token-usage.jsonl`、`comprehension-log.jsonl`、
`tasks/<id>.json`、`known-flakes.txt`。**append-only 优先**,入仓可审计。

### Goal Loops(`scripts/goal_loop.py`)
跑到一个可验证的停止条件成立为止。implementer 推一步 → checker(独立 sub-agent)判定 done。
长任务、回归修复、CI 自愈都套这个范式。

### Worktrees(`scripts/spawn_agent_worktree.sh`)
并行 agent 任务必须用 `git worktree` 隔离 fs + 隔离 docker compose project name,
否则集成测试一定撞车。

### Token 与 Comprehension 报告
- `scripts/token_report.py`:按 day / loop / role / model 聚合花费,集成进每日健康报告
- `scripts/comprehension_metrics.py`:**反认知投降护栏**——comprehension-coverage、
  pr-read-rate、agent-modification-rate 三项指标低于阈值会触发红线告警

---
*保持本文件最新是架构师的职责。它过时一天,agent 就盲一天。*
