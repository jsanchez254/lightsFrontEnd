// AA: red turning on
// AA: waiting 5 seconds
import yoshi from "../img/yoshi.gif";
// var render = new FileReader();
// render.onload = function(e) {
//     var text = render.result;
//     console.log(text);
//   }
// var wow = render.readAsText("./trafficlight_script.txt");
// console.log("FILE READER TEST: ", wow);
var words = 

`<bubble>
    <message>
    Let's turn on the red light for 1 second. We can refer to each of the lights by name (red, yellow, green), and we can instruct each of them to turn on or off. We do this by adding the command to the name, like this:

        <code>red.on()</code>

        After this, we need to tell the computer to wait for a certain period of time, so that the light stays on for that period. To do this, just type:

        <code>wait(5)</code>

        Now, turn on the red light for 5 seconds.
    </message>
<output>
AA: red turning on
AA: waiting 1 seconds
</output>
</bubble>

<bubble>
    <message>
        TEST 2 green
    </message>
    <output>
    AA: green turning on
    AA: waiting 1 seconds 
    </output>
</bubble>

<bubble>
    <message>
        TEST 3 yellow
    </message>
    <output>
    AA: yellow turning on
    AA: waiting 1 seconds
    </output>
</bubble>
`
//create img element 
var arrow = document.createElement("img");
arrow.src = yoshi;
arrow.id = "nextText";

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
        text[0].style.color = "rgb(40, 185, 40)";
        textFinished = false;
        startBubble = true;
        bubbleIndex += 1;
        message = "";
        forceClear = false;
        indexWord = 0;
    }
    else{
        text[0].innerHTML = "INCORRECT...PLEASE TRY AGAIN...";
        text[0].style.color = "red";
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
    output = "";
    while(startOutput < endOutput){
        output += storeBubbles[bubbleIndex][startOutput];
        startOutput +=1;
    }
    console.log("OUTPUT HERE!: ", output);
}

//GET OUTPUT
export function getOutput(){
    console.log("OUTPUT HERE!: ", output);
    return output;
}

//called everytime we click on cat
var forceClear = false;  //helper boolean to stop animation from going before interval is cleared
var startBubble = true;
var startCount = 0;
export function sendText(){
    if(startBubble){
        startNewBubble();
        startBubble = false;
    }
    else{
        text[0].innerHTML = randomText();
    }
    if(!textFinished === true){
        text[0].style.height = "none";
        text[0].innerHTML = "";
        text[0].style.color = "black";
        forceClear = false;
        textAnimation = setInterval(display, 5);
        startCount = 0; //will be used to make sure line is used up
    }
}

//display words in animation format
function display(){
    if(forceClear === false){
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
            if(text[0].offsetHeight > 200){
                if(startCount > 40 && message[indexWord] === ' '){
                    text[0].innerHTML += "...";
                    text[0].append(arrow);
                    forceClear = true;
                    clearInterval(textAnimation);
                }        
                startCount+=1;
            }
            //end animation when index reaches lenght of message
            if(indexWord === message.length){
                textFinished = true;
                document.getElementById("repeatContent").style.display = "block";                
                text[0].append(arrow);
            }
        }
    }
}

var randomText1 = ["COME ON, YOU GOT THIS!!","KEEP ON TRYING...", 
                "PERFORM ASSIGNMENT TO ADVANCE", "GOOD LUCK!!", "MEOW!"];
function randomText(){
    let rand = Math.floor(Math.random() * 5);
    text[0].style.color = "black";
    return randomText1[rand];
}


