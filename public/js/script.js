let gameMatrix;
let score = 0;
let movesCount = 0;
let playerProfileShowing = false;
let leaderboardShowing = false;
let gameShowing = false;
const leaderboardPageSize = 20;
let currPage = 1;

document.getElementById("start_button").addEventListener('click', () => {
    startGame();
})

document.getElementById("restart_button").addEventListener('click', () => {
    startGame();
})

document.getElementById("home_page").addEventListener('click', () => {
    showHomePage();
})

const startGame = () => {
    showGame();

    playerProfileShowing = false;
    leaderboardShowing = false;

    gameMatrix = [
        ['','','',''],
        ['','','',''],
        ['','','',''],
        ['','','','']
    ];
    score = 0;
    movesCount = 0;

    randomTiles();
    randomTiles();
    renderScore();
    renderMoves();

    document.addEventListener("keydown", logKeyPress)

}

const gameOver = () => {
    console.log("GAME OVER");
    document.removeEventListener("keydown", logKeyPress)
    let loseModal = document.getElementById("lose_modal");
    loseModal.style.display = "block";
    var span = document.getElementById("close_lose_modal");

    const restartButton = document.getElementById("lose_modal_restart");
    const homePageButton = document.getElementById("lose_modal_home");

    const startGameModal = () => {
        loseModal.style.display = "none";
        startGame();
    }
    
    const showHomePageModal = () => {
        loseModal.style.display = "none";
        showHomePage();
    }

    restartButton.addEventListener('click', startGameModal)
    homePageButton.addEventListener('click', showHomePageModal)

    span.onclick = () => {
        loseModal.style.display = "none";
        restartButton.removeEventListener('click', startGameModal)
        homePageButton.removeEventListener('click', showHomePageModal)
    }

    const data = {
        score: score,
        moves: movesCount,
        size: 4
    }

    fetch("/game_over",
        { method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
    })
    .then(async (response) => {
        const data = await response.text();
        console.log(data);
    })

}

const gameWon = () => {
    console.log("GAME WON");
    document.removeEventListener("keydown", logKeyPress)
    let winModal = document.getElementById("win_modal");
    winModal.style.display = "block";
    var span = document.getElementById("close_win_modal");
    span.onclick = () => {
        winModal.style.display = "none";
        document.addEventListener("keydown", logKeyPress);
    }

    winModal.addEventListener('cancel', () => {
        document.addEventListener("keydown", logKeyPress);
    })

}

const randomTiles = () => {
    console.log("Adding random tile")

    let positionEmpty = false;
    let foundEmptyTile = false;

    for(let j = 0; j < 4; j++){ // check for at least 1 empty tile
        for(let k = 0; k < 4; k++){
            if(gameMatrix[j][k] === ''){
                positionEmpty = true;
                break;
            }
        }
        if(positionEmpty) break;
    }

    console.log(positionEmpty)

    if(positionEmpty){
        while(!foundEmptyTile){
            // pick random x,y 
            randX = Math.floor(Math.random() * (4 - 0) + 0);
            randY = Math.floor(Math.random() * (4 - 0) + 0);
    
            // check matrix if x,y is empty
            if(gameMatrix[randX][randY] === ''){
                // put value in matrix
                gameMatrix[randX][randY] = Math.random() > 0.5 ? 4 : 2;
                console.log(`found empty tile [${randX};${randY}]`);
                foundEmptyTile = true;
            }
        } 
    }

    renderTiles();

}

const renderTiles = () => {
    // write gameMatrix values to tiles
    for(let i=0; i < 4; i++){
        for(let j=0; j < 4; j++){
            tile = document.getElementById(`tile${i}${j}`);
            tile.innerText = gameMatrix[i][j];
            if(gameMatrix[i][j] !== ''){
                tile.setAttribute("class", "")
                tile.classList.add("tile_shape");
                tile.classList.add(`number_${gameMatrix[i][j]}`);
            }
            if(gameMatrix[i][j] === ''){
                tile.setAttribute("class", "");
                tile.classList.add("tile_shape");
            }
            if(gameMatrix[i][j] === 2048){
                gameWon();
            }
        }
    }
}

const renderScore = () => {
    document.getElementById("score").innerText = score;
}
const renderMoves = () => {
    document.getElementById("moves").innerText = movesCount;
}

const leftMovePossible = () => {

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++) {
            if(j !== 0){
                if(gameMatrix[i][j] === '') continue;
                else if(gameMatrix[i][j-1] === '') return true;
                else if(gameMatrix[i][j-1] === gameMatrix[i][j]) return true;
            }
        }
        console.log(`rad ${i} pohyb nemozny`)
    }
    return false;

}

const upMovePossible = () => {

    for(let j = 0; j < 4; j++){
        for(let i = 0; i < 4; i++) {
            if(i !== 0){
                if(gameMatrix[i][j] === '') continue;
                else if(gameMatrix[i-1][j] === '') return true;
                else if(gameMatrix[i-1][j] === gameMatrix[i][j]) return true;
            }
        }
    }
    return false;

}

const rightMovePossible = () => {

    for(let i = 0; i < 4; i++){
        for(let j = 3; j >= 0; j--) {
            if(j !== 3){
                if(gameMatrix[i][j] === '') continue;
                else if(gameMatrix[i][j+1] === '') return true;
                else if(gameMatrix[i][j+1] === gameMatrix[i][j]) return true;
            }
        }
    }
    return false;

}

const downMovePossible = () => {

    for(let j = 0; j < 4; j++){
        for(let i = 3; i >= 0; i--) {
            if(i !== 3){
                if(gameMatrix[i][j] === '') continue;
                else if(gameMatrix[i+1][j] === '') return true;
                else if(gameMatrix[i+1][j] === gameMatrix[i][j]) return true;
            }
        }
    }
    return false;

}

const leftMove = () => {

    //check if tile is on the limits of the matrix

    // check if next tile in direction is empty, if yes, current tile can move, also empty current tile
    // check if next tile in direction is of the same value, if yes add them up to the next tile and empty current tile

    for(let idx = 0; idx < 4; idx++){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(j !== 0){

                    if(gameMatrix[i][j-1] === ''){
                        gameMatrix[i][j-1] = gameMatrix[i][j];
                        gameMatrix[i][j] = '';
                    }

                }
            }
        }
    }

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(j !== 0){

                if(gameMatrix[i][j] === gameMatrix[i][j-1] && gameMatrix[i][j] !== ''){
                    gameMatrix[i][j-1] += gameMatrix[i][j-1];
                    gameMatrix[i][j] = '';
                    score = score + (gameMatrix[i][j-1]);
                    renderScore();
                }

            }
        }
    }

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(j !== 0){

                if(gameMatrix[i][j-1] === ''){
                    gameMatrix[i][j-1] = gameMatrix[i][j];
                    gameMatrix[i][j] = '';
                }

            }
        }
    }

    renderTiles();
    randomTiles(1);

    movesCount++;
    renderMoves();

    return console.log("LEFT");
    
}
const upMove = () => {

    for(let idx = 0; idx < 4; idx++){
        for(let j = 0; j < 4; j++){
            for(let i = 0; i < 4; i++){
                if(i !== 0){
    
                    if(gameMatrix[i-1][j] === ''){
                        gameMatrix[i-1][j] = gameMatrix[i][j];
                        gameMatrix[i][j] = '';
                    }
    
                }
            }
        }
    }

    for(let j = 0; j < 4; j++){
        for(let i = 0; i < 4; i++){
            if(i !== 0){

                if(gameMatrix[i][j] === gameMatrix[i-1][j] && gameMatrix[i][j] !== ''){
                    gameMatrix[i-1][j] += gameMatrix[i-1][j];
                    gameMatrix[i][j] = '';
                    score = score + (gameMatrix[i-1][j]);
                    renderScore();
                }

            }
        }
    }

    for(let j = 0; j < 4; j++){
        for(let i = 0; i < 4; i++){
            if(i !== 0){

                if(gameMatrix[i-1][j] === ''){
                    gameMatrix[i-1][j] = gameMatrix[i][j];
                    gameMatrix[i][j] = '';
                }

            }
        }
    }

    renderTiles();
    randomTiles(1);

    movesCount++;
    renderMoves();


    return console.log("UP"); 

}
const rightMove = () => {

    for(let idx = 0; idx < 4; idx++){
        for(let i = 0; i < 4; i++){
            for(let j = 3; j >= 0; j--){
                if(j !== 3){
    
                    if(gameMatrix[i][j+1] === ''){
                        gameMatrix[i][j+1] = gameMatrix[i][j];
                        gameMatrix[i][j] = '';
                    }
    
                }
            }
        }
    }

    for(let i = 0; i < 4; i++){
        for(let j = 3; j >= 0; j--){
            if(j !== 3){

                if(gameMatrix[i][j] === gameMatrix[i][j+1] && gameMatrix[i][j] !== ''){
                    gameMatrix[i][j+1] += gameMatrix[i][j+1];
                    gameMatrix[i][j] = '';
                    score = score + (gameMatrix[i][j+1]);
                    renderScore();
                }

            }
        }
    }

    for(let i = 0; i < 4; i++){
        for(let j = 3; j >= 0; j--){
            if(j !== 3){

                if(gameMatrix[i][j+1] === ''){
                    gameMatrix[i][j+1] = gameMatrix[i][j];
                    gameMatrix[i][j] = '';
                }

            }
        }
    }

    //renderTiles();
    randomTiles(1);

    movesCount++;
    renderMoves();

    return console.log("RIGHT");

}
const downMove = () => {

    for(let idx = 0; idx < 4; idx++){
        for(let j = 0; j < 4; j++){
            for(let i = 3; i >= 0; i--){
                if(i !== 3){
    
                    if(gameMatrix[i+1][j] === ''){
                        gameMatrix[i+1][j] = gameMatrix[i][j];
                        gameMatrix[i][j] = '';
                    }
    
                }
            }
        }
    }

    for(let j = 0; j < 4; j++){
        for(let i = 3; i >= 0; i--){
            if(i !== 3){

                if(gameMatrix[i][j] === gameMatrix[i+1][j] && gameMatrix[i][j] !== ''){
                    gameMatrix[i+1][j] += gameMatrix[i+1][j];
                    gameMatrix[i][j] = '';
                    score = score + (gameMatrix[i+1][j]);
                    renderScore();
                }

            }
        }
    }

    for(let j = 0; j < 4; j++){
        for(let i = 3; i >= 0; i--){
            if(i !== 3){

                if(gameMatrix[i+1][j] === ''){
                    gameMatrix[i+1][j] = gameMatrix[i][j];
                    gameMatrix[i][j] = '';
                }

            }
        }
    }

    //renderTiles();
    randomTiles(1);

    movesCount++;
    renderMoves();

    return console.log("DOWN");
    
}

const logKeyPress = (e) => {
    if(gameShowing){
        if(e.keyCode === 37){
            if(leftMovePossible()){
                leftMove();
            }
            else if(!leftMovePossible() && !upMovePossible() && !rightMovePossible() && !downMovePossible()){
                gameOver();
            }
        }
        if(e.keyCode === 38){
            if(upMovePossible()){
                upMove();
            }
            else if(!leftMovePossible() && !upMovePossible() && !rightMovePossible() && !downMovePossible()){
                gameOver();
            }   
        }
        if(e.keyCode === 39){
            if(rightMovePossible()){
                rightMove(); 
            }
            else if(!leftMovePossible() && !upMovePossible() && !rightMovePossible() && !downMovePossible()){
                gameOver();
            }
        }
        if(e.keyCode === 40){
            if(downMovePossible()){
                downMove();
            }
            else if(!leftMovePossible() && !upMovePossible() && !rightMovePossible() && !downMovePossible()){
                gameOver();
            }
        }
    }
}

const fetchPlayerProfile = () => {

    const nick = document.getElementById("nick");
    const email = document.getElementById("email");
    const wins = document.getElementById("wins");
    const pic = document.getElementById("player_photo");
    const avgScore = document.getElementById("avg_score");
    const avgMoves = document.getElementById("avg_moves");
    const profileSettingsIcon = document.getElementById("profile_settings_icon");

    //for settings dialog

    if(!playerProfileShowing){
        fetch(`/player_profile`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            showPlayerProfile();

            if(data.pic === null){
                pic.setAttribute("src", '/img/default_user.png');
            }
            else {
                pic.setAttribute("src", `/photos/${data.pic}`);
            }
            
            
            nick.innerText = data.nick;
            email.innerText = data.email;
            wins.innerText = data.wins;
            avgScore.innerText = data.avgScore;
            avgMoves.innerText = data.avgMoves;
            playerProfileShowing = true;
        })
    }

    profileSettingsIcon.addEventListener('click', profileSettings);

}

const profileSettings = () => {
    const changeNick = document.getElementById("change_nick");
    const changeEmail = document.getElementById("change_email");
    const changePhoto = document.getElementById("change_photo");
    const newNick = document.getElementById("new_nick");
    const newEmail = document.getElementById("new_email");
    const newPhoto = document.getElementById("new_photo");
    const changeNickMessage = document.getElementById("change_nick_message");
    const changeEmailMessage = document.getElementById("change_email_message");
    const changePhotoMessage = document.getElementById("change_photo_message");
    const playerProfileSettings = document.getElementById("player_profile_settings");
    var span = document.getElementById("player_profile_settings_x");

    newNick.value = "";
    newEmail.value = "";
    newPhoto.value = "";
    changeNickMessage.innerHTML = "";
    changeEmailMessage.innerHTML = "";
    changePhotoMessage.innerHTML = "";

    playerProfileSettings.showModal();

    const changeNickFetch = (e) => {
        e.preventDefault();

        console.log("change nick listener")

        const data = {
            "new_nick": newNick.value
        }
        
        fetch(changeNick.action, 
                    { method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data)
                    })
        .then(async function(response){
            const data = await response.text();
            changeNickMessage.innerText = data;
            console.log(data);
        })
    }

    const changeEmailFetch = (e) => {
        e.preventDefault();

        const data = {
            "new_email": newEmail.value
        }

        fetch(changeEmail.action, 
                    { method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data)
                    })
        .then(async function(response){
            const data = await response.text();
            changeEmailMessage.innerText = data;
            console.log(data);
        })
    }

    const changePhotoFetch = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("new_photo", newPhoto.files[0]);

        console.log(formData)
        console.log(newPhoto.files)

        fetch(changePhoto.action,
                    { method: "POST",
                      body: formData
        })
        .then(async (response) => {
            const data = await response.text();
            changePhotoMessage.innerText = data;
            console.log(data);
        })
    }

    changeNick.addEventListener('submit', changeNickFetch);
    changeEmail.addEventListener('submit', changeEmailFetch);
    changePhoto.addEventListener('submit', changePhotoFetch);

    span.onclick = () => {
        playerProfileSettings.close();
        changeNick.removeEventListener('submit', changeNickFetch);
        changeEmail.removeEventListener('submit', changeEmailFetch);
        changePhoto.removeEventListener('submit', changePhotoFetch);
    }

    playerProfileSettings.addEventListener('cancel', () => {
        changeNick.removeEventListener('submit', changeNickFetch);
        changeEmail.removeEventListener('submit', changeEmailFetch);
        changePhoto.removeEventListener('submit', changePhotoFetch);
    })

}

const fetchLeaderboard = () => {

    const profileSettingsIcon = document.getElementById("profile_settings_icon");
    profileSettingsIcon.removeEventListener('click', profileSettings)

    const leaderboardBody = document.getElementById("leaderboard_body");

    if(!leaderboardShowing){

        fetch("/leaderboard", { method: "GET" })
        .then(response => response.json())
        .then(data => {
            showLeaderboard();
            data.sort((a, b) => b.highscore - a.highscore);

            let splitArray = [];
            for(let i=0; i<data.length; i+=leaderboardPageSize){
                splitArray.push(data.slice(i,i+leaderboardPageSize));
            }

            document.getElementById("next_page").addEventListener('click', () => {
                if(currPage < splitArray.length){
                    currPage++;
                    renderLeaderboard();
                }
                document.getElementById("page_num").innerText = currPage;
            });

            document.getElementById("prev_page").addEventListener('click', () => {
                if(currPage > 1){
                    currPage--;
                    renderLeaderboard();
                }
                document.getElementById("page_num").innerText = currPage;
            });

            const renderLeaderboard = () => {

                leaderboardBody.innerHTML = "";
                const startNum = (currPage - 1) * 20;

                for(let i = 0; i < splitArray[currPage-1].length; i++){
                    const row = document.createElement("tr");
    
                    const number = document.createElement("td");
                    number.innerText = startNum+i+1;

                    const nick = document.createElement("td");
                    const nick_a = document.createElement("a");
                    nick_a.setAttribute("role","button");
                    nick_a.setAttribute("id",`${splitArray[currPage-1][i].nick}`);
                    nick_a.classList.add("player_profile_button");
                    nick_a.innerText = splitArray[currPage-1][i].nick;
                    nick.appendChild(nick_a)

                    const highscore = document.createElement("td");
                    highscore.innerText = splitArray[currPage-1][i].highscore;

                    const moves = document.createElement("td");
                    moves.innerText = splitArray[currPage-1][i].moves;

                    const fieldSize = document.createElement("td");
                    fieldSize.innerText = splitArray[currPage-1][i].fieldSize;
    
                    row.appendChild(number);
                    row.appendChild(nick);
                    row.appendChild(highscore);
                    row.appendChild(moves);
                    row.appendChild(fieldSize);
                    leaderboardBody.appendChild(row);
    
                }

                const playerIdButtons = document.querySelectorAll(".player_profile_button");

                playerIdButtons.forEach((button) => {
                    
                    button.addEventListener('click', (e) => {
                        playerProfileModal(e.target.id);
                    });
                });

            }

            renderLeaderboard();
        
            leaderboardShowing = true;
        })
    }
}

const playerProfileModal = (nick) => {

    const playerProfileModal = document.getElementById("player_profile_modal");
    const nickTag = document.getElementById("modal_nick");
    const wins = document.getElementById("modal_wins");
    const avgScore = document.getElementById("modal_avg_score");
    const avgMoves = document.getElementById("modal_avg_moves");
    const pic = document.getElementById("player_photo_modal");

    fetch(`/player/${nick}`, { method: "GET" })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            playerProfileModal.showModal();

            if(data.pic === null){
                pic.setAttribute("src", '/img/default_user.png');
            }
            else {
                pic.setAttribute("src", `/photos/${data.pic}`);
            }

            nickTag.innerText = data.nick;
            wins.innerText = data.wins;
            avgScore.innerText = data.avgScore;
            avgMoves.innerText = data.avgMoves;

            var span = document.getElementById("player_profile_modal_x");
            span.onclick = () => {
                playerProfileModal.close();
            }
        })
}

const showGame = () => {
    document.getElementById("start_page").classList.add("hidden");
    document.getElementById("leaderboard").classList.add("hidden");
    document.getElementById("player_profile").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    playerProfileShowing = false;
    leaderboardShowing = false;
    gameShowing = true;
}

const showPlayerProfile = () => {
    document.getElementById("start_page").classList.add("hidden");
    document.getElementById("leaderboard").classList.add("hidden");
    document.getElementById("game").classList.add("hidden");
    document.getElementById("player_profile").classList.remove("hidden");
    leaderboardShowing = false;
    gameShowing = false;
}

const showLeaderboard = () => {
    document.getElementById("start_page").classList.add("hidden");
    document.getElementById("game").classList.add("hidden");
    document.getElementById("player_profile").classList.add("hidden");
    document.getElementById("leaderboard").classList.remove("hidden");
    playerProfileShowing = false;
    gameShowing = false;
}

const showHomePage = () => {
    document.getElementById("leaderboard").classList.add("hidden");
    document.getElementById("game").classList.add("hidden");
    document.getElementById("player_profile").classList.add("hidden");
    document.getElementById("start_page").classList.remove("hidden");
    playerProfileShowing = false;
    leaderboardShowing = false;
    gameShowing = false;
} 

const showGameButtons = document.querySelectorAll(".show_game");

showGameButtons.forEach((button) => {
    button.addEventListener('click', () => {
        showGame();
    })
})

const showLeaderboardButtons = document.querySelectorAll(".show_leaderboard");

showLeaderboardButtons.forEach((button) => {
    button.addEventListener('click', () => {
        fetchLeaderboard();
    })
})

const showPlayerButtons = document.querySelectorAll(".show_player");

showPlayerButtons.forEach((button) => {
    button.addEventListener('click', () => {
        fetchPlayerProfile();
    })
})
