import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from '../../src/App'
import { HISTORY_STORAGE_KEY } from '../../src/utils/history'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    // restore crypto if a test stubs it
    Object.defineProperty(globalThis, 'crypto', {
      value: crypto,
      configurable: true,
    })
  })

  it('shows results only after clicking the calculate button and shows only burnout history on burnout tab', () => {
    const { container } = render(<App />)

    expect(screen.getByRole('heading', { name: 'バーンアウト診断' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '情緒的消耗感' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '判定する' }))

    expect(screen.getByRole('heading', { name: '情緒的消耗感' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'バーンアウト履歴（最新100件）' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'ボーアウト履歴（最新100件）' })).not.toBeInTheDocument()
    expect(container.querySelectorAll('.history-item')).toHaveLength(1)

    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(raw).toContain('"testType":"burnout"')
  })

  it('stores boreout history and can delete boreout history', () => {
    const { container } = render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'ボーアウト' }))
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: '判定する' }))

    expect(screen.getByRole('heading', { name: 'ボーアウト判定' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ボーアウト履歴（最新100件）' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'バーンアウト履歴（最新100件）' })).not.toBeInTheDocument()
    expect(container.querySelectorAll('.history-item')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: '履歴を削除' }))

    expect(container.querySelectorAll('.history-item')).toHaveLength(0)
    expect(screen.getByText('まだ履歴はありません。')).toBeInTheDocument()

    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(raw).not.toContain('"testType":"boreout"')
  })

  it('can delete burnout history on burnout tab', () => {
    const { container } = render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '判定する' }))
    expect(container.querySelectorAll('.history-item')).toHaveLength(1)

    fireEvent.click(screen.getByRole('button', { name: '履歴を削除' }))
    expect(container.querySelectorAll('.history-item')).toHaveLength(0)

    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    expect(raw).not.toBeNull()
    expect(raw).not.toContain('"testType":"burnout"')
  })

  it('uses fallback id path when crypto.randomUUID is unavailable', () => {
    Object.defineProperty(globalThis, 'crypto', {
      value: undefined,
      configurable: true,
    })

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '判定する' }))

    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    expect(raw).not.toBeNull()

    const parsed = JSON.parse(raw ?? '[]') as Array<{ id: string }>
    expect(parsed[0]?.id).toMatch(/\d+-[0-9a-f]+/)
  })
})
