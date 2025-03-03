import { db } from "../../../Backend/Firebase/firebaseconfig";
import { ref, push, get, update, remove, query, orderByKey, limitToFirst, startAt} from "firebase/database";

const SCORES_COLLECTION = "highscores"; // The node in Realtime Database

//console.log("🔥 Firebase DB Instance:", db); //debug


// ✅ Function to submit a high score to Realtime Database
export const submitHighScore = async (username, score) => {
    try {
        const scoresRef = ref(db, `${SCORES_COLLECTION}/${username}`); // Path: highscores/username
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

export const getHighScoresPaginated = async (lastKey, scoresPerPage) => {
    try {
      console.log(`🔍 Fetching scores. Last Key: ${lastKey || "None (First Page)"}`);
  
      let scoresQuery;
  
      if (lastKey) {
        scoresQuery = query(
          ref(db, SCORES_COLLECTION),
          orderByKey(), // ✅ Order by key (Firebase unique IDs)
          startAt(lastKey), // ✅ Fetch next batch after last key
          limitToFirst(scoresPerPage + 1) // ✅ Fetch extra item to detect next page
        );
      } else {
        scoresQuery = query(
          ref(db, SCORES_COLLECTION),
          orderByKey(), // ✅ Order by key (Firebase unique IDs)
          limitToFirst(scoresPerPage + 1) // ✅ Fetch extra item to detect next page
        );
      }
  
      const snapshot = await get(scoresQuery);
      if (!snapshot.exists()) {
        console.warn("⚠️ No high scores found!");
        return { scores: [], lastKey: null, hasNext: false };
      }
  
      let scoresArray = [];
      let newLastKey = null;
  
      snapshot.forEach((childSnapshot) => {
        const username = childSnapshot.key;
        const userScores = childSnapshot.val();
  
        Object.entries(userScores).forEach(([scoreId, scoreData]) => {
          if (typeof scoreData === "object" && scoreData.score !== undefined) {
            scoresArray.push({
              id: scoreId,
              username: username,
              score: scoreData.score,
              timestamp: scoreData.timestamp || null,
            });
          }
        });
  
        newLastKey = childSnapshot.key; // ✅ Track last retrieved key
      });
  
      // ✅ Check if there's a next page by ensuring we fetched extra items
      const hasNext = scoresArray.length > scoresPerPage;
      if (hasNext) scoresArray.pop(); // Remove the extra item
  
      console.log(`✅ Retrieved ${scoresArray.length} scores. More pages? ${hasNext}`);
  
      return { scores: scoresArray, lastKey: newLastKey, hasNext };
    } catch (error) {
      console.error("❌ Error retrieving paginated scores:", error);
      return { scores: [], lastKey: null, hasNext: false };
    }
  };