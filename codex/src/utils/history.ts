import type { ActiveTest, HistoryEntry } from '../types/mental'

export const HISTORY_STORAGE_KEY = 'mentaltest.history.v1'
export const HISTORY_LIMIT_PER_TYPE = 100

function toHistoryEntryArray(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) {
    return []
  }

  const isValidResults = (results: unknown): results is HistoryEntry['results'] => {
    if (!Array.isArray(results)) {
      return false
    }

    return results.every((result) => {
      if (!result || typeof result !== 'object') {
        return false
      }

      const record = result as Record<string, unknown>
      return (
        typeof record.key === 'string' &&
        typeof record.title === 'string' &&
        typeof record.score === 'number' &&
        typeof record.label === 'string' &&
        typeof record.guide === 'string'
      )
    })
  }

  return value.filter((entry): entry is HistoryEntry => {
    if (!entry || typeof entry !== 'object') {
      return false
    }

    const record = entry as Partial<HistoryEntry>
    return (
      typeof record.id === 'string' &&
      typeof record.createdAt === 'string' &&
      (record.testType === 'burnout' || record.testType === 'boreout') &&
      !!record.answers &&
      typeof record.answers === 'object' &&
      !Array.isArray(record.answers) &&
      isValidResults(record.results)
    )
  })
}

function limitByType(history: HistoryEntry[]): HistoryEntry[] {
  const burnout: HistoryEntry[] = []
  const boreout: HistoryEntry[] = []

  for (const entry of history) {
    if (entry.testType === 'burnout' && burnout.length < HISTORY_LIMIT_PER_TYPE) {
      burnout.push(entry)
    }

    if (entry.testType === 'boreout' && boreout.length < HISTORY_LIMIT_PER_TYPE) {
      boreout.push(entry)
    }
  }

  return [...burnout, ...boreout]
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') {
    return []
  }

  const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    return limitByType(toHistoryEntryArray(parsed))
  } catch {
    return []
  }
}

export function saveHistory(history: HistoryEntry[]): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitByType(history)))
  } catch (error) {
    // Best-effort persistence: log and continue without interrupting UX.
    console.error('Failed to persist history to localStorage.', error)
  }
}

export function appendHistory(entry: HistoryEntry): HistoryEntry[] {
  const current = loadHistory()
  const sameType = [entry, ...current.filter((item) => item.testType === entry.testType)]
  const otherType = current.filter((item) => item.testType !== entry.testType)
  const next = limitByType([...sameType, ...otherType])

  saveHistory(next)
  return next
}

export function clearHistoryByType(testType: ActiveTest): HistoryEntry[] {
  const next = loadHistory().filter((item) => item.testType !== testType)
  saveHistory(next)
  return next
}
