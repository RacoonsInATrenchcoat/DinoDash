import React, { useEffect, useState } from "react";
import { getHighScores } from "../CRUD";

const HighScoresPage = () => {
  const [scores, setScores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const scoresPerPage = 50;

  useEffect(() => {
    fetchScores();
  }, [currentPage]);

  const fetchScores = async () => {
    const allScores = await getHighScores();
    const sortedScores = Object.entries(allScores) // Convert object to array
      .flatMap(([username, userScores]) =>
        Object.entries(userScores).map(([scoreId, { score, timestamp }]) => ({
          id: scoreId,
          username,
          score,
          timestamp,
        }))
      )
      .sort((a, b) => b.score - a.score); // Sort by highest score
    
    const startIndex = (currentPage - 1) * scoresPerPage;
    const paginatedScores = sortedScores.slice(startIndex, startIndex + scoresPerPage);
    setScores(paginatedScores);
  };

  return (
    <div>
      <h2>High Scores</h2>
      <ul className="ListedScores">
        {scores.length > 0 ? (
          scores.map((entry, index) => (
            <li key={entry.id}>
              {index + 1 + (currentPage - 1) * scoresPerPage}. Score: {entry.score}, Username: {entry.username}
            </li>
          ))
        ) : (
          <p>No scores available</p>
        )}
      </ul>
      <div className="pagination">
        {currentPage > 1 && <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>}
        {scores.length === scoresPerPage && <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>}
      </div>
    </div>
  );
};

export default HighScoresPage;
