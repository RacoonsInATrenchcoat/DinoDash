import React, { useEffect, useState } from "react";
import { getHighScores } from "../CRUD";

console.log("✅ HighScoresPage is mounting!");
const HighScoresPage = () => {
  const [scores, setScores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const scoresPerPage = 50;

  useEffect(() => {
    fetchScores();
  }, [currentPage]);

  const fetchScores = async () => {
    try {
      console.log("⏳ Fetching high scores...");
      const allScores = await getHighScores();
      console.log("✅ Fetched Scores:", allScores);
  
      if (!allScores) {
        console.error("❌ No scores found! Database might be empty.");
      }
  
      const sortedScores = Object.entries(allScores || {})
        .flatMap(([username, userScores]) =>
          Object.entries(userScores).map(([scoreId, { score, timestamp }]) => ({
            id: scoreId,
            username,
            score,
            timestamp,
          }))
        )
        .sort((a, b) => b.score - a.score);
  
      const startIndex = (currentPage - 1) * scoresPerPage;
      const paginatedScores = sortedScores.slice(startIndex, startIndex + scoresPerPage);
      setScores(paginatedScores);
    } catch (error) {
      console.error("❌ Error in fetchScores:", error);
    }
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