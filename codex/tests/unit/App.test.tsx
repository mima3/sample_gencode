import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../src/App'

describe('App', () => {
  it('renders burnout panel by default and can switch to boreout panel', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'バーンアウト診断' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '情緒的消耗感' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '脱人格化' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '個人的達成感' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'ボーアウト' }))

    expect(screen.getByRole('heading', { name: 'ボーアウト診断' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'ボーアウト判定' })).toBeInTheDocument()
    expect(screen.getByText('score: 0')).toBeInTheDocument()
  })

  it('updates boreout score when an answer changes', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'ボーアウト' }))

    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: '1' } })

    expect(screen.getByText('score: 1')).toBeInTheDocument()
  })
})
