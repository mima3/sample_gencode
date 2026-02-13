function TestSwitcher({ activeTest, onChange }) {
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
