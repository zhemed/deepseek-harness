/**
 * Pure-type outlet of the search-progress projection: the one home of the
 * `webSearchProgress` SessionProjectionMap key, importable from client
 * aggregates without dragging host Context merges.
 *
 * @module @deepseek-ai/dsh-web-search-deepseek/projection
 */

import type {} from '@deepseek-ai/dsh-session-projection/types'
import type { SessionEvent } from '@deepseek-ai/dsh-session'

/** The latest in-flight search progress for the owning session. */
export interface WebSearchProgressProjection {
  /** Provider-generated id pairing the call/thinking/done events. */
  readonly callId: string
  /** The query the search ran. */
  readonly query: string
  /** The effort level used (`high`/`max`); omitted when `off`. */
  readonly effort?: string
  /** Cumulative thinking text so far. */
  readonly thinking: string
  /** True once the search settled. */
  readonly done?: boolean
}

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionMap {
    /** Latest in-flight search progress, or null before the first search and after a new turn. */
    webSearchProgress: WebSearchProgressProjection | null
  }
}

/** Fold one committed event into the search-progress projection state. */
export function applyWebSearchProgress(
  state: WebSearchProgressProjection | null,
  event: SessionEvent,
): WebSearchProgressProjection | null {
  switch (event.type) {
    case 'web/search-call':
      return {
        callId: event.data.callId,
        query: event.data.query,
        thinking: '',
        ...event.data.effort !== undefined ? { effort: event.data.effort } : {},
      }
    case 'web/search-thinking':
      return state !== null && state.callId === event.data.callId
        ? { ...state, thinking: event.data.text }
        : state
    case 'web/search-done':
      return state !== null && state.callId === event.data.callId
        ? { ...state, done: true }
        : state
    case 'turn/start':
      return null
    default:
      return state
  }
}
