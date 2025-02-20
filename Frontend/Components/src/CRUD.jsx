import { db } from "../../../Backend/Firebase/firebaseconfig";
import { ref, push, get, update, remove } from "firebase/database";

const SCORES_COLLECTION = "highscores"; // The node in Realtime Database

console.log("🔥 Firebase DB Instance:", db); //debug


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
