import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TestSwitcher from '../../../src/components/TestSwitcher'

describe('TestSwitcher', () => {
  it('shows active state and calls onChange for boreout button', () => {
    const onChange = vi.fn()

    render(<TestSwitcher activeTest="burnout" onChange={onChange} />)

    const burnoutButton = screen.getByRole('button', { name: 'バーンアウト' })
    const boreoutButton = screen.getByRole('button', { name: 'ボーアウト' })

    expect(burnoutButton).toHaveClass('is-active')
    expect(boreoutButton).not.toHaveClass('is-active')

    fireEvent.click(boreoutButton)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('boreout')
  })

  it('calls onChange for burnout button', () => {
    const onChange = vi.fn()

    render(<TestSwitcher activeTest="boreout" onChange={onChange} />)

    const burnoutButton = screen.getByRole('button', { name: 'バーンアウト' })
    fireEvent.click(burnoutButton)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('burnout')
  })
})
