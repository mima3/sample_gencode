import type { ActiveTest } from '../types/mental'

type TestSwitcherProps = {
  activeTest: ActiveTest
  onChange: (test: ActiveTest) => void
}

function TestSwitcher({ activeTest, onChange }: TestSwitcherProps) {
  return (
    <section className="switcher" aria-label="診断切り替え">
      <button
        className={activeTest === 'burnout' ? 'switcher-button is-active' : 'switcher-button'}
        onClick={() => onChange('burnout')}
        type="button"
      >
        バーンアウト
      </button>
      <button
        className={activeTest === 'boreout' ? 'switcher-button is-active' : 'switcher-button'}
        onClick={() => onChange('boreout')}
        type="button"
      >
        ボーアウト
      </button>
    </section>
  )
}

export default TestSwitcher
