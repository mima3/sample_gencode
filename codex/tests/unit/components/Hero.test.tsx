import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from '../../../src/components/Hero'

describe('Hero', () => {
  it('renders title and description', () => {
    render(<Hero />)

    expect(screen.getByText('Mental Check')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'バーンアウト / ボーアウト セルフチェック' })).toBeInTheDocument()
    expect(
      screen.getByText(
        '既存の診断ロジックを維持したまま、React + Vite で再構成したモダンUIです。各設問に回答すると結果がリアルタイムで更新されます。',
      ),
    ).toBeInTheDocument()
  })
})
