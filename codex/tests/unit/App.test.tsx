import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../src/App'

describe('App', () => {
  it('shows results only after clicking the calculate button', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'バーンアウト診断' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '情緒的消耗感' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '判定する' }))

    expect(screen.getByRole('heading', { name: '情緒的消耗感' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '脱人格化' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '個人的達成感' })).toBeInTheDocument()
  })

  it('switches to boreout and shows score only after calculate button', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'ボーアウト' }))
    expect(screen.getByRole('heading', { name: 'ボーアウト診断' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'ボーアウト判定' })).not.toBeInTheDocument()

    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: '判定する' }))

    expect(screen.getByRole('heading', { name: 'ボーアウト判定' })).toBeInTheDocument()
    expect(screen.getByText('score: 1')).toBeInTheDocument()
  })
})
