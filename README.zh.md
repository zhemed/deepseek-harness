# DeepSeek Harness（自部署维护版）

[English](README.md) | 中文

这是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）的**自主维护版**。dsh 是由 [DeepSeek AI](https://deepseek.com) 开源的 agent harness（智能体框架），采用 MIT 协议。

它采用**一切皆插件**的架构，并由 [Cordis](https://github.com/cordiverse/cordis) 驱动，其设计参见论文 [_A Programming Paradigm for Spatiotemporal Composability_](https://github.com/cordiverse/paper)。

> 本仓库由 [zhemed](https://github.com/zhemed) 独立维护，跟随上游并加入自托管修复：局域网访问、明文 HTTP 兼容、DeepSeek V4 思考档位透传等。

## 从源码运行

```sh
git clone https://github.com/zhemed/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

该命令会启动 Web UI，默认地址为 `http://127.0.0.1:3080`。详见 [Web UI 指南](docs/user/guide/index.md)。

> 官方 npm 包（`npx @deepseek-ai/dsh web`）由 DeepSeek AI 发布；本自维护版以源码方式部署。

## 反馈与支持

- 问题反馈：[zhemed/deepseek-harness Issues](https://github.com/zhemed/deepseek-harness/issues)
- 为你的插件仓库添加 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 话题，便于被发现。

## 参与贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 开发

请先阅读[开发指南](docs/development.md)与[架构文档](docs/architecture.md)。

面向 agent：请遵循 [AGENTS.md](AGENTS.md)。

## 许可证

[MIT](LICENSE)

第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。