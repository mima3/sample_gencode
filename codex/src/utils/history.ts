import type { ActiveTest, HistoryEntry } from '../types/mental'

export const HISTORY_STORAGE_KEY = 'mentaltest.history.v1'
export const HISTORY_LIMIT_PER_TYPE = 100

function toHistoryEntryArray(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) {
    return []
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
      typeof record.answers === 'object' &&
      Array.isArray(record.results)
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

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitByType(history)))
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
