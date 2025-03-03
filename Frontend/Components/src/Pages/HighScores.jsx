import React, { useEffect, useState } from "react";
import { getHighScoresPaginated } from "../CRUD"; // Import function

const HighScoresPage = () => {
  const [scores, setScores] = useState([]);     // Stores paginated scores
  const [page, setPage] = useState(1);          // ✅ Track current page number
  const scoresPerPage = 10;                     // ✅ Limit to 10 per page
  const [lastKey, setLastKey] = useState(null); // ✅ Track last key for Firebase pagination
  const [hasMore, setHasMore] = useState(true); // ✅ Detect next page
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScores();
  }, [page]);

  const fetchScores = async () => {
    try {
      setLoading(true);

      const { scores: fetchedScores, lastKey: newLastKey, hasNext } =
        await getHighScoresPaginated(lastKey, scoresPerPage);

      if (fetchedScores.length > 0) {
        setScores(fetchedScores);
        setLastKey(newLastKey); // ✅ Correctly track last key
        setHasMore(hasNext); // ✅ Detects if there's a next page
      } else {
        console.warn("⚠️ No more scores available.");
      }
    } catch (error) {
      console.error("❌ Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="high-score-container d-flex align-items-center justify-content-center">
      <div className="sigmar-regular Highscore-title d-flex align-items-center justify-content-center">
        <h2>High Scores</h2>
      </div>

      {loading ? <p>Loading...</p> : null}

      <ul className="ListedScores d-flex flex-column align-items-center justify-content-center">
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
              setLastKey(null); // ✅ Reset last key when going back
            }}
          >
            Previous
          </button>
        )}

        {hasMore && (
          <button
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default HighScoresPage;
