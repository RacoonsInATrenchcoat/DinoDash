import React, { useEffect, useState } from "react";
import { getHighScoresPaginated } from "../CRUD";
import { useMobileContext } from "../MobileMode";

const HighScoresPage = () => {
  const [scores, setScores] = useState([]); // Stores paginated scores
  const [lastScore, setLastScore] = useState(null); // Track last score for pagination
  const [hasMore, setHasMore] = useState(true); // Detect if there's a next page
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Track current page number
  const isMobile = useMobileContext();
  const scoresPerPage = isMobile ? 5 : 10; // Limit to 10 items per page

  useEffect(() => {
    fetchScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const { scores: fetchedScores, lastScore: newLastScore, hasNext } =
        await getHighScoresPaginated(lastScore, scoresPerPage);
      if (fetchedScores.length > 0) {
        setScores(fetchedScores);
        setLastScore(newLastScore);
        setHasMore(hasNext);
      } else {
        console.warn("No scores available.");
        setScores([]); // Ensure we show "No scores available"
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className= {isMobile == true ? "mobile-high-score-container d-flex" : "high-score-container d-flex justify-content-center"}>
      <div className= "Highscore-title d-flex justify-content-center">
        <h2>High Scores</h2>
      </div>

      {loading && <p>Loading...</p>}

      <ul className= {isMobile == true ? "mobile-ListedScores" : "ListedScores d-flex flex-column justify-content-center"}>
        {scores.length > 0 ? (
          scores.map((entry, index) => (
            <li key={entry.id}>
              {index + 1 + (page - 1) * scoresPerPage}. Score: {entry.score}, Username: {entry.username}
            </li>
          ))
        ) : (
          <p>No scores available</p>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        {page > 1 && (
          <button
            onClick={() => {
              setPage(page - 1);
              setLastScore(null); // Reset lastScore when going back
            }}
          >
            Previous
          </button>
        )}

        {hasMore && (
          <button onClick={() => setPage(page + 1)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default HighScoresPage;
