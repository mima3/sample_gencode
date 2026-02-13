import { useMemo } from 'react'
import type { ActiveTest, HistoryEntry } from '../types/mental'

type ScorePoint = {
  index: number
  score: number
}

type ScoreSeries = {
  key: string
  label: string
  className: string
  points: ScorePoint[]
}

type HistoryChartProps = {
  entries: HistoryEntry[]
  testType: ActiveTest
}

function HistoryChart({ entries, testType }: HistoryChartProps) {
  const series = useMemo<ScoreSeries[]>(() => {
    const timeline = [...entries].reverse()
    if (testType === 'burnout') {
      const defs = [
        { key: 'emotionalExhaustion', label: '情緒的消耗感', className: 'series-emotional' },
        { key: 'depersonalization', label: '脱人格化', className: 'series-depersonalization' },
        { key: 'personalAccomplishment', label: '個人的達成感', className: 'series-accomplishment' },
      ]

      return defs.map((def) => ({
        key: def.key,
        label: def.label,
        className: def.className,
        points: timeline.map((entry, index) => ({
          index: index + 1,
          score: entry.results.find((result) => result.key === def.key)?.score ?? 0,
        })),
      }))
    }

    return [
      {
        key: 'boreout',
        label: 'ボーアウト判定',
        className: 'series-boreout',
        points: timeline.map((entry, index) => ({
          index: index + 1,
          score: entry.results[0]?.score ?? 0,
        })),
      },
    ]
  }, [entries, testType])

  const firstSeries = series[0]

  if (!firstSeries || firstSeries.points.length === 0) {
    return null
  }

  const maxScore = Math.max(...series.flatMap((item) => item.points.map((point) => point.score)), 1)
  const pointCount = firstSeries.points.length
  const width = 680
  const height = 200
  const paddingX = 24
  const paddingY = 20
  const xStep = pointCount > 1 ? (width - paddingX * 2) / (pointCount - 1) : 0
  const plotHeight = height - paddingY * 2
  const toX = (index: number): number => paddingX + xStep * index
  const toY = (score: number): number => paddingY + plotHeight - (score / maxScore) * plotHeight
  const gridSteps = 4
  const gridValues = Array.from({ length: gridSteps + 1 }, (_, i) =>
    Math.round((maxScore * (gridSteps - i)) / gridSteps),
  )

  return (
    <div className="history-chart" aria-label="スコア履歴グラフ">
      <div className="history-line-legend">
        {series.map((item) => (
          <span className="history-line-legend-item" key={item.key}>
            <span className={`history-line-legend-dot ${item.className}`} />
            {item.label}
          </span>
        ))}
      </div>
      <svg
        className="history-line-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="スコア推移"
      >
        <line
          className="history-line-axis"
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
        />
        <line
          className="history-line-axis"
          x1={paddingX}
          y1={paddingY}
          x2={paddingX}
          y2={height - paddingY}
        />
        {gridValues.map((value, index) => (
          <g key={`grid-${value}-${index}`}>
            <line
              className="history-line-grid"
              x1={paddingX}
              y1={toY(value)}
              x2={width - paddingX}
              y2={toY(value)}
            />
            <text className="history-line-grid-label" x={paddingX - 6} y={toY(value) + 4}>
              {value}
            </text>
          </g>
        ))}

        {series.map((item) => {
          const polylinePoints = item.points
            .map((point, index) => `${toX(index)},${toY(point.score)}`)
            .join(' ')

          return (
            <g key={item.key}>
              <polyline className={`history-line-path ${item.className}`} points={polylinePoints} />
              {item.points.map((point, index) => (
                <g key={`${item.key}-point-${point.index}`}>
                  <circle className={`history-line-point ${item.className}`} cx={toX(index)} cy={toY(point.score)} r={4} />
                </g>
              ))}
              {item.points.length > 0 ? (
                <text
                  className={`history-line-value ${item.className}`}
                  x={toX(item.points.length - 1)}
                  y={toY(item.points[item.points.length - 1]!.score) - 8}
                >
                  {item.points[item.points.length - 1]!.score}
                </text>
              ) : null}
            </g>
          )
        })}
        {firstSeries.points.map((point, index) => (
          <text className="history-line-index" key={`index-${point.index}`} x={toX(index)} y={height - 4}>
            {point.index}
          </text>
        ))}
      </svg>
    </div>
  )
}

export default HistoryChart
