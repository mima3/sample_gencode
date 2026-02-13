function ResultGrid({ results }) {
  return (
    <div className="result-grid">
      {results.map((result) => (
        <article className="result-card" key={result.key ?? result.title}>
          <h3>{result.title}</h3>
          <p className={`rank-badge is-${result.rank.toLowerCase()}`}>{result.label}</p>
          <p className="result-score">score: {result.score}</p>
          <p className="result-guide">{result.guide}</p>
        </article>
      ))}
    </div>
  )
}

export default ResultGrid
