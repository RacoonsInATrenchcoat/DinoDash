First of all, hello!
If you got this far then congratulations! Feel free to mention on the interview that first drink is on me.

Built on Firefox, but switched to Chrome for consistency with worldwide methods. (+setInterval issues)

Assets used:
Backgrounds - https://craftpix.net/freebies/free-desert-scrolling-2d-game-backgrounds/
Wooden Buttons - https://www.freepik.com/free-vector/wooden-buttons-ui-game_12632833.htm
Stone background - https://www.freepik.com/free-vector/wall-texture-with-cartoon-stones_1064416.htm
Cactus: https://www.freepik.com/free-vector/exotic-cactus-plants-ceramic-pots_4882714.htm
Camel - https://www.freepik.com/free-vector/camel_3146430.htm
Sabertooth tiger - https://www.freepik.com/free-vector/saber-toothed-cat-vector_37881358.htm
LizardWizard art - JuditMolnarDesign

Display font: Sigmar - https://fonts.google.com/specimen/Sigmar?lang=en_Latn
Bodycopy font: https://fonts.google.com/specimen/Luckiest+Guy

Notes to self:

Deploy Project Console: https://console.firebase.google.com/project/dino-dash-66723/overview
Hosting URL: https://dino-dash-66723.web.app

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

When using requestAnimationFrame, the time between frames (deltaTime) varies:

    On 60Hz monitors → deltaTime ≈ 16.6ms per frame.
    On 144Hz monitors → deltaTime ≈ 6.94ms per frame.
    On 240Hz monitors → deltaTime ≈ 4.16ms per frame.

Need to use "normalizedDelta" to force a consistent speed, instead of depending on client.