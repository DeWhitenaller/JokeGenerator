const container = document.getElementById("jokeContainer");
document.getElementById("jokeButton").addEventListener("click", GetJokeFromServer);

let currentJokeObj;
let loadingNewJoke = false;

function GetJokeFromServer(){
    
    loadingNewJoke = true;
    setTimeout(() => {
        if(!loadingNewJoke) return;
        SetLoadingMessageActive(true);
    }, 200);

    SwipeCurrentBoxToLeft();

    var jokeUrl = 'https://official-joke-api.appspot.com/random_joke';

    // Get HTTP Request -> ich bekomme Daten vom Se
    fetch(jokeUrl)
    .then(data => data.json())
    .then(obj => {
        AddJokeToJokeBox(obj);
    })
    .catch(error => {
        AddJokeToJokeBox({"setup": "I was just about to tell you a joke...", "punchline": "But the server forgot the punchline 😢"})
    })
}

function AddJokeToJokeBox(obj) {

    loadingNewJoke = false;
    SetLoadingMessageActive(false);

    currentJokeObj = obj;
    let jokeBox = CreateNewJokeBox(currentJokeObj);
    SwipeCurrentBoxToLeft();
    // Trigger animation on new jokeBox
    setTimeout(() => {
        jokeBox.classList.add("active");
    }, 10);

    let currentPrevBoxes = container.querySelectorAll('.jokeBox.previous');

    // Delete previous box in 2s
    setTimeout(() => {
        DestroyAllPreviousBoxes(currentPrevBoxes);
    }, 2000);
}

function CreateNewJokeBox(obj){
    const jokeBox = document.createElement('div');
    jokeBox.classList.add("jokeBox");
    container.appendChild(jokeBox);

    // Setup-P
    const joke = document.createElement('p');
    joke.id = 'setup';
    joke.textContent = obj.setup;
    jokeBox.appendChild(joke);

    // Punchline-Button
    const punchlineButton = document.createElement('button');
    punchlineButton.id = 'showPunchlineButton';
    punchlineButton.textContent = 'Show Punchline';
    jokeBox.appendChild(punchlineButton);
    punchlineButton.addEventListener("click", ShowPunchline);

    return jokeBox;
}

function ShowPunchline(){
    const jokeBox = document.querySelector('.jokeBox.active');
    jokeBox.querySelector("#showPunchlineButton").remove();

    const joke = document.createElement('p');
    joke.id = 'punchline';
    joke.textContent = currentJokeObj.punchline;
    jokeBox.appendChild(joke);
}

function DestroyAllPreviousBoxes(boxes){
    // Hier nicht einfach alle nehmen
    boxes.forEach(box => {
        box.remove();
    });
}

function SwipeCurrentBoxToLeft(){

    const activeBoxes = container.querySelectorAll('.jokeBox.active');

        activeBoxes.forEach(box => {
            box.classList.remove('active');
            box.classList.add('previous');
        });
}

function SetLoadingMessageActive(active) {

    const loadingBox = document.querySelector('.loadingBox');

    if (active) {    
        // Get the position and size of the target element
        const rect = container.getBoundingClientRect();

        // Position the loadingBox in the center of the target element
        const centerX = rect.left + rect.width / 2 + window.scrollX;
        const centerY = rect.top + rect.height / 2 + window.scrollY;
        const boxRect = loadingBox.getBoundingClientRect();

        // Apply it to the floating element
        loadingBox.style.position = 'absolute';
        loadingBox.style.top = `${centerY - boxRect.height / 2}px`;
        loadingBox.style.left = `${centerX - boxRect.width / 2}px`;
        loadingBox.style.display = 'block'; // sichtbar machen, falls nötig

        // Trigger animation
        loadingBox.classList.add("active");        
    } else {
        loadingBox.classList.remove("active");
    }

}