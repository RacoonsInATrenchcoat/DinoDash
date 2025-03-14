import { db } from "../../../Backend/Firebase/firebaseconfig";
import {
  ref,
  push,
  get,
  update,
  remove,
} from "firebase/database";

const SCORES_COLLECTION = "highscores"; // The node in Realtime Database

//console.log("🔥 Firebase DB Instance:", db); //debug


// ✅ Function to submit a high score to Realtime Database
export const submitHighScore = async (username, score) => {
  try {
    const scoresRef = ref(db, `${SCORES_COLLECTION}/${username}`);
    await push(scoresRef, {
      score,
      timestamp: new Date().toISOString(),
    });
    console.log("High score submitted successfully");
  } catch (error) {
    console.error("Error submitting high score: ", error);
  }
};



// ✅ Function to retrieve all high scores from Realtime Database
export const getHighScores = async () => {
    try {
        const scoresRef = ref(db, SCORES_COLLECTION);
        const snapshot = await get(scoresRef);
        if (snapshot.exists()) {
            return snapshot.val(); // Returns all high scores
        } else {
            return {}; // No data found
        }
    } catch (error) {
        console.error("Error retrieving high scores: ", error);
        return {};
    }
};

// ✅ Function to update a specific high score (Not always needed)
export const updateHighScore = async (username, scoreId, newScore) => {
    try {
        const scoreRef = ref(db, `${SCORES_COLLECTION}/${username}/${scoreId}`);
        await update(scoreRef, { score: newScore });
        console.log("High score updated successfully");
    } catch (error) {
        console.error("Error updating high score: ", error);
    }
};

// ✅ Function to delete a specific high score
export const deleteHighScore = async (username, scoreId) => {
    try {
        const scoreRef = ref(db, `${SCORES_COLLECTION}/${username}/${scoreId}`);
        await remove(scoreRef);
        console.log("High score deleted successfully");
    } catch (error) {
        console.error("Error deleting high score: ", error);
    }
};

export const getHighScoresPaginated = async (lastScore, scoresPerPage) => {
  try {
    // Fetch the entire "highscores" node (which is nested by username)
    const scoresRef = ref(db, SCORES_COLLECTION);
    const snapshot = await get(scoresRef);
    if (!snapshot.exists()) {
      return { scores: [], lastScore: null, hasNext: false };
    }

    // Flatten the nested structure.
    // Expected structure: highscores -> username -> pushId -> { score, timestamp }
    let scoresArray = [];
    snapshot.forEach((usernameSnapshot) => {
      const username = usernameSnapshot.key;
      usernameSnapshot.forEach((scoreSnapshot) => {
        const data = scoreSnapshot.val();
        scoresArray.push({
          id: scoreSnapshot.key,
          username,
          score: data.score,
          timestamp: data.timestamp || null,
        });
      });
    });

    // Sort the flattened array in descending order (highest score first)
    scoresArray.sort((a, b) => b.score - a.score);

    // If a lastScore was provided (for pagination), filter out any records
    // that don't fall below that score.
    let filteredScores = lastScore !== null
      ? scoresArray.filter((item) => item.score < lastScore)
      : scoresArray;

    // Slice the array to get the current page (up to scoresPerPage items)
    const pageScores = filteredScores.slice(0, scoresPerPage);
    // The new lastScore is the lowest score on this page (if any)
    const newLastScore = pageScores.length ? pageScores[pageScores.length - 1].score : null;
    // Determine if there's a next page by checking if more items exist
    const hasNext = filteredScores.length > scoresPerPage;

    return { scores: pageScores, lastScore: newLastScore, hasNext };
  } catch (error) {
    console.error("Error retrieving paginated scores:", error);
    return { scores: [], lastScore: null, hasNext: false };
  }
};