Notes to self:

2 public folders due to:
    Firebase public/ → Hosts the website when deployed via Firebase Hosting.
    React public/ → Used during development for static assets (like the default "vite.svg").

"src" folder is kept and not renamed due to:
    When running "npm run dev", Vite compiles src/ into a working React app.

Use "tree /F > structure.txt" to save a file structure map!

CRUD with Firebase by using "addDoc" and "SetDoc":
    AddDoc creates a random ID for the new item.
    SetDoc creates a fixed document ID (like using the username as the key).
    updateDoc & deleteDoc work similar (by using specific ID).
