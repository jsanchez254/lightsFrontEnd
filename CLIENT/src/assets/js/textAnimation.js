// AA: red turning on
// AA: waiting 5 seconds
var words = 
`<bubble>
    <message>
    Let's turn on the red light for 1 second. We can refer to each of the lights by name (red, yellow, green), and we can instruct each of them to turn on or off. We do this by adding the command to the name, like this:

        <code>red.on()</code>

        After this, we need to tell the computer to wait for a certain period of time, so that the light stays on for that period. To do this, just type:

        <code>wait(5)</code>

        Now, turn on the red light for 5 seconds.
    </message>
<output>works</output>
</bubble>

<bubble>
    <message>
        Now it is the next thing...
    </message>
    <output>
        AA: Whatever
    </output>
</bubble>
<bubble>
    <message>
        Now it is the next thing...ygugyygtgttytf
    </message>
    <output>
        AA: Whatever
    </output>
</bubble>
`

//HERE WILL BE FUNCTION THAT WILL PARSE STRING IN THER CORRESPONDING SECTIONS
//READ MESSAGE FROM READ FILE TEXT

//GET BUBBLE ELEMENTS
var startScript = 0;
var storeBubbles = [];
let endBubble;
let newBubbleSlice = "";
let completeScript = 0
while((completeScript) < words.length){
    newBubbleSlice = words.slice(startScript);
    startScript = newBubbleSlice.search("<bubble>");
    endBubble = newBubbleSlice.search("</bubble>");
    storeBubbles.push(newBubbleSlice.substring((startScript + 8), (endBubble - 1)));
    startScript = endBubble + 9;
    completeScript += startScript;
}

var bubbleIndex = 0; //used to move between bubbles
var indexWord = 0; // used to keep track of message and code element for each bubble
var textAnimation;
var textFinished = false; //used to keep interval of animation going until message tag ends 

//CODE TAG HELPERS
var startCode = false;
var createLineCode = true;
var endCode;
var newCode;
var actualCode = "";
var text = document.getElementsByClassName("popuptext");

//function used to repeat content again
export function repeatAgain(res){
    if(res === "YES"){
        indexWord = 0;
        textFinished = false;
        text[0].style.height = "none";
        text[0].innerHTML = "";
        document.getElementById("repeatContent").style.display = "none";
    }
    else if(res === "NO"){
        text[0].innerHTML = "OKAY, GOOD LUCK!!!";
        textFinished = true; //TEMPORARY DEMO PURPOSE
        startBubble = false;
        document.getElementById("repeatContent").style.display = "none";
        console.log(message);
    }
}

//function that displays either success or not if the frontEnd and backEnd outputs match
export function checkSucess(check){
    if(check){
        clearInterval(textAnimation);
        text[0].innerHTML = "SUCCESS!!!";
        textFinished = false;
        startBubble = true;
        bubbleIndex += 1;
        message = "";
        forceClear = false;
        indexWord = 0;
    }
    else{
        text[0].innerHTML = "INCORRECT...PLEASE TRY AGAIN...";
    }
}

//HANDLE WHEN NEXT BUBBLE WILL BE FETCHED
var message = "";     //contains message tag with code tag inside to be displayed on animation
var output = "";      //contains output tag text to check with backEnd
function startNewBubble(){
    console.log("INDEX 1111: ", storeBubbles[bubbleIndex]);
    let startIndex = storeBubbles[bubbleIndex].search("<message>") + 10;    //start index of message text
    let endIndex = storeBubbles[bubbleIndex].search("</message>");          //end index of message text
    while(startIndex < endIndex){
        message += storeBubbles[bubbleIndex][startIndex];
        startIndex +=1;
    }
    //OUTPUT ELEMENT 
    let startOutput = storeBubbles[bubbleIndex].search("<output>") + 8;
    let endOutput = storeBubbles[bubbleIndex].search("</output>");
    while(startOutput < endOutput){
        output += storeBubbles[bubbleIndex][startOutput];
        startOutput +=1;
    }
    console.log("MESSAGE: ", forceClear);
}

//GET OUTPUT
export function getOutput(){
    return output;
}

//called everytime we click on cat
var forceClear = false;  //helper boolean to stop animation from going before interval is cleared
var startBubble = true;
export function sendText(){
    if(startBubble){
        console.log("AQUIIIIIII!111");
        startNewBubble();
        startBubble = false;
    }
    else{
        text[0].innerHTML = randomText();
    }
    if(!textFinished === true){
        text[0].style.height = "none";
        text[0].innerHTML = "";
        forceClear = false;
        textAnimation = setInterval(display, 5);
    }
}

//display words in animation format
function display(){
    if(forceClear === false){
        console.log("GO HERE: ", message);
        if(indexWord < message.length){
            let temp = indexWord;
            if((message[indexWord] === '<' && message[indexWord + 1] === 'c' 
            && message[indexWord + 2] === 'o') || startCode){
                startCode = true;
                if(createLineCode){
                    text[0].innerHTML += "<br/>";
                    createLineCode = false;
                    //cut message to get next coding tag
                    newCode = message.slice(indexWord);
                    endCode = newCode.search("</code>") + indexWord;
                    indexWord += 5;
                }
                else{
                    let ready = false;
                    if(indexWord === (endCode - 1)){
                        console.log(indexWord, " > ", endCode);
                        indexWord += 8;
                        text[0].innerHTML += "<br/>";
                        createLineCode  = true;
                        startCode = false;
                        ready = true;
                    }
                    if(ready){
                        text[0].innerHTML += "<pre class = 'codeWritten'>" + actualCode + "</pre>";
                        text[0].innerHTML += "<br/>";
                        actualCode = "";
                    }
                    else{
                        indexWord +=1;
                        actualCode += message[indexWord];
                    }
                }
            }
            else{
                startCode = false;
                text[0].innerHTML += message[indexWord];
                indexWord +=1;
                console.log(text[0].offsetHeight);
            }
            if(text[0].offsetHeight > 200 && message[temp] === ' '){
                console.log("SUPPOSED TO CLEAR HERE");
                forceClear = true;
                clearInterval(textAnimation);
            }
            //end animation when index reaches lenght of message
            if(indexWord === message.length){
                textFinished = true;
                document.getElementById("repeatContent").style.display = "block";
            }
        }
    }
}

var randomText1 = ["COME ON, YOU GOT THIS!!","KEEP ON TRYING...", "PERFORM ASSIGNMENT TO ADVANCE", "GOOD LUCK!!", "MEOW!"];
function randomText(){
    let rand = Math.floor(Math.random() * 5);
    return randomText1[rand];
}


