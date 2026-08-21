/**
 * Tavily 原生插件 - 强制深研版
 * 默认直接拉满（max 5），并在插件层强制并行 + 交叉验证的系统提示
 */
import { defineTool } from '/opt/deepseek-harness/packages/core/tools/lib/index.js'

export const name = 'tavily-native'
export const inject = ['tools', 'systemPrompt']

const DEFAULT_BASE = 'http://10.0.0.22:8080'
const DEFAULT_KEY = 'CV4D8G3cNELiGQEA8xHJ1RL8HFzvXqMPOP0tQJF6qc8'

function truncate(s, n) {
  if (!s) return s
  return s.length > n ? s.slice(0, n) + '…' : s
}

export function apply(ctx, config = {}) {
  const baseURL = (config.baseURL || process.env.TAVILY_PROXY_URL || DEFAULT_BASE).replace(/\/$/, '')
  const masterKey = config.masterKey || process.env.TAVILY_MASTER_KEY || DEFAULT_KEY
  const defaultMax = config.maxResults ?? 5
  // 插件层强制深研提示：所有挂载此插件的 Agent 都会继承
  ctx.systemPrompt.section({
    name: 'tavily-deep-research',
    order: 95,
    text: [
      '检索铁律（强制）：',
      '1) 任何需要查资料的任务，不得省略搜索，必须调用 tavily_search；',
      '2) 单次任务至少并行 4 个查询，覆盖：原词 / 别名 / 最新 / 评测/口碑 / 对比/竞品 / 风险/负面 / 英文视角；',
      '3) 关键论断至少 2 个独立来源交叉印证，优先官方来源；出现新名词/版本号/链接必须追加一轮检索直到无新线索；',
      '4) 不要用臆测代替搜索结果，缺工具时明确说明。',
    ].join('\n'),
  })

  // tavily_search - 默认拉满 5 条
  ctx.tools.register(defineTool({
    name: 'tavily_search',
    description: '用内网 Tavily 代理搜索网页（替代 web_search，默认 5 条，强制深研：并行多查询+交叉验证，不得省略）。',
    parameters: {
      query: { type: 'string', required: true, description: '搜索关键词' },
      max_results: { type: 'number', description: '返回条数，默认 5，最大 8（禁止填 1-2，强制拉满）' },
      search_depth: { type: 'string', description: 'basic 或 advanced，默认 basic', enum: ['basic', 'advanced'] },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          query: { type: 'string', required: true },
          answer: { type: 'string' },
          sources: {
            type: 'array', required: true,
            items: {
              type: 'object', additionalProperties: false,
              properties: {
                url: { type: 'string', required: true },
                title: { type: 'string' },
                snippet: { type: 'string' },
              }
            }
          }
        }
      },
      render: (_args, value) => {
        const lines = []
        if (value.answer) lines.push(value.answer)
        if (value.sources.length) {
          lines.push('Sources:')
          for (const s of value.sources) {
            const label = s.title || (()=>{try{return new URL(s.url).hostname}catch{return s.url}})()
            const snip = s.snippet ? ` — ${truncate(s.snippet, 220)}` : ''
            lines.push(`- [${label}](${s.url})${snip}`)
          }
        } else {
          lines.push('No results found.')
        }
        return [{ type: 'text', text: lines.join('\n') }]
      }
    },
    async execute(args) {
      const query = String(args.query || '').trim()
      if (!query) throw new Error('query must be a non-empty string')
      const max_results = Math.min(Math.max(parseInt(args.max_results ?? defaultMax, 10) || defaultMax, 1), 8)
      const search_depth = args.search_depth === 'advanced' ? 'advanced' : 'basic'
      const payload = { query, max_results, search_depth, include_domains: [], exclude_domains: [] }
      const resp = await fetch(`${baseURL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${masterKey}` },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) throw new Error(`Tavily proxy ${resp.status}: ${await resp.text()}`)
      const data = await resp.json()
      const sources = (data.results || []).slice(0, max_results).map(r => ({
        url: r.url,
        title: r.title,
        snippet: truncate(r.content || '', 250),
      }))
      return {
        query,
        ...(data.answer ? { answer: truncate(data.answer, 800) } : {}),
        sources,
      }
    },
    presentCall: (args) => ({ card: 'generic', title: `搜索: ${args.query}`, kind: 'search', rawInput: args.query }),
  }))

  // tavily_extract
  ctx.tools.register(defineTool({
    name: 'tavily_extract',
    description: '提取指定 URL 的正文（精简输出，每页截 4000 字）',
    parameters: {
      urls: { type: 'array', required: true, items: { type: 'string' }, description: '要提取的 URL 列表' },
      extract_depth: { type: 'string', description: 'basic 或 advanced', enum: ['basic', 'advanced'] },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          results: {
            type: 'array', required: true,
            items: {
              type: 'object', additionalProperties: false,
              properties: {
                url: { type: 'string', required: true },
                title: { type: 'string' },
                content: { type: 'string' },
              }
            }
          }
        }
      },
      render: (_args, value) => {
        const lines = value.results.map(r => `## [${r.title || r.url}](${r.url})\n${truncate(r.content || '', 4000)}`)
        return [{ type: 'text', text: lines.join('\n\n---\n\n') || 'No content extracted.' }]
      }
    },
    async execute(args) {
      const urls = Array.isArray(args.urls) ? args.urls.filter(Boolean) : []
      if (!urls.length) throw new Error('urls must be a non-empty array')
      const extract_depth = args.extract_depth === 'advanced' ? 'advanced' : 'basic'
      const resp = await fetch(`${baseURL}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${masterKey}` },
        body: JSON.stringify({ urls, extract_depth }),
      })
      if (!resp.ok) throw new Error(`Tavily proxy ${resp.status}: ${await resp.text()}`)
      const data = await resp.json()
      const results = (data.results || []).map(r => ({
        url: r.url,
        title: r.title,
        content: truncate(r.raw_content || '', 4000),
      }))
      return { results }
    },
  }))
}
