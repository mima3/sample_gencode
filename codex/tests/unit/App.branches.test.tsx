import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HISTORY_STORAGE_KEY } from '../../src/utils/history'

describe('App branch coverage', () => {
  afterEach(() => {
    vi.resetModules()
    vi.doUnmock('../../src/data/mentalTests')
    window.localStorage.clear()
  })

  it('stores 0 when both latest answer and fallback are invalid', async () => {
    vi.doMock('../../src/data/mentalTests', async () => {
      const actual = await vi.importActual<typeof import('../../src/data/mentalTests')>(
        '../../src/data/mentalTests',
      )

      return {
        ...actual,
        burnoutQuestions: [{ text: 'test burnout question', category: 'emotionalExhaustion' }] as const,
        createBurnoutInitialAnswers: () => ({}),
      }
    })

    window.localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'legacy',
          createdAt: new Date().toISOString(),
          testType: 'burnout',
          answers: { 0: null },
          results: [
            {
              key: 'emotionalExhaustion',
              title: '情緒的消耗感',
              score: 1,
              rank: 'Ok',
              label: '良好',
              guide: 'guide',
            },
          ],
        },
      ]),
    )

    const { default: App } = await import('../../src/App')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '判定する' }))

    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw ?? '[]') as Array<{ answers?: Record<string, number> }>
    expect(parsed[0]?.answers?.['0']).toBe(0)
  })
})
