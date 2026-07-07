<!-- 这份模板自动出现在每个新 PR 的描述里。规则源:.claude/skills/agent-coding-discipline/SKILL.md -->

## 这个 PR 做了什么(一句话)

<!-- 写给一年后忘了这事的你自己 -->

## 为什么

<!-- 触发这个改动的需求/bug/数据/对话 -->

## 你需要重点看什么(战略风险)

<!-- 1~3 条;reviewer 只看这些,逐行交给 AI 评审 -->
- 
- 

---

## Pre-submit 自检(写码 agent 与人都要勾)

来源:[`.claude/skills/agent-coding-discipline/SKILL.md`](../blob/main/.claude/skills/agent-coding-discipline/SKILL.md)

- [ ] 我**读了**改动涉及的文件,**复用了现有模式**(Rule 1 — Read before you write)
- [ ] 我**先说了假设和计划**,而不是直接动手(Rule 2 — Think before you code)
- [ ] 这是**眼前问题的最小改动**,没有过度抽象(Rule 3 — Simplicity)
- [ ] **每行 diff 都能被任务解释**,无顺手编辑、无 reformat(Rule 4 — Surgical changes)
- [ ] 改动有**测试覆盖**;bug fix **先写了失败测试**(Rule 5 — Verification)
- [ ] 新功能**藏在特性开关后**,kill switch 名:`FLAGS.________`
- [ ] 每个**新依赖都有理由**,标准库不够才加(Rule 8 — Dependencies)
- [ ] 我**说明了做了什么、为什么、有什么顾虑**(Rule 9 — Communication)

## 4 个失败模式自查(发现 = 停下来,不要硬上)

- [ ] **Kitchen Sink** — "顺便"重构了无关代码?→ revert 那些行
- [ ] **Wrong Abstraction** — 抽象了只被调用一次的东西?→ inline 回去
- [ ] **Optimistic Path** — 只覆盖了 happy path?→ 补错误处理 + 测试
- [ ] **Runaway Refactor** — 一个 fix 改了 > 5 个文件?→ 拆 PR

---

## 测试用例(有可测功能变更时必填)

<!-- 列出本 PR 新增/修改的 test-cases;agent 据此生成/更新 auto-tests 脚本。规则见 docs/test-cases/README.md。无可测功能则写"无"。 -->
<!-- ⚠️ 改动影响线上前端流程时,除后端契约用例外,必须连带列出 web/ 前端 e2e 用例(线上验收走前端)。 -->
- 后端契约:`docs/test-cases/<服务kebab>/<feature>.md#TC-xxx`(新增 / 修改)
- 前端流程 e2e:`docs/test-cases/web/<流程>.md#TC-xxx`(后端改动影响用户可感知流程时必填)
- 无(本次不涉及可测功能)

## 信息(选填,有则填)

- 关联 issue / Linear ticket: 
- 灰度计划:`teamOnly → X% → 全量 / kill`
- 部署后**5 分钟内**值得盯的指标:
- 是否涉及 schema 迁移?(向后兼容?rollback 方案?)
