import HistoryChart from './HistoryChart'
import type { ActiveTest, HistoryEntry } from '../types/mental'

type HistorySectionProps = {
  entries: HistoryEntry[]
  onDelete: () => void
  title: string
  testType: ActiveTest
}

function HistorySection({ entries, onDelete, title, testType }: HistorySectionProps) {
  return (
    <section className="history-subsection">
      <div className="history-subsection-header">
        <h3>{title}</h3>
        <button className="history-delete-button" onClick={onDelete} type="button">
          履歴を削除
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="history-empty">まだ履歴はありません。</p>
      ) : (
        <>
          <HistoryChart entries={entries} testType={testType} />
          <div className="history-list" role="list">
            {entries.map((entry) => (
              <details className="history-item" key={entry.id} role="listitem">
                <summary>
                  <span className="history-heading">{new Date(entry.createdAt).toLocaleString('ja-JP')}</span>
                </summary>

                <div className="history-body">
                  <p className="history-subtitle">スコア</p>
                  <ul className="history-score-list">
                    {entry.results.map((result) => (
                      <li key={`${entry.id}-${result.key}`}>
                        {result.title}: {result.score}（{result.label}）
                      </li>
                    ))}
                  </ul>

                  <p className="history-subtitle">回答</p>
                  <div className="history-answers">
                    {Object.entries(entry.answers).map(([index, value]) => (
                      <span className="history-answer-chip" key={`${entry.id}-q${index}`}>
                        Q{Number(index) + 1}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default HistorySection
