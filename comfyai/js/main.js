//let path = "http://localhost:63342/comfy_ai_web"
let path = "https://cybermancy.org/comfyai"

//execute immediately at runtime
let chat_data = false;
let loopIterCountMut = 0;
async function get_chat_demo_data() {
    let chat_data_promise = await fetch(path + "/js/chats.json");
    chat_data = await chat_data_promise.json()
    chat_data = shuffle(chat_data)
}



//start function spam
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Fisher-Yates-Durstenfeld shuffle
function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}

function getBrowserWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function isEven(value){
    if (value%2 == 0)
        return true;
    else
        return false;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

//start application code
window.onload=function() {
    get_chat_demo_data()
    let start_anim_delay = setInterval(function() {
        if (chat_data) {
            //animateSVG()
            insertChatDemos()
            clearInterval(start_anim_delay)
        }
    }, 500)
}

let exitIdleAnimation = false;
var resetAnimationsDebounced = debounce(function() {
    console.info("Cleaning up demo and restarting.")
    document.getElementById("chats").innerHTML = "";
    chat_data = shuffle(chat_data)
    insertChatDemos()
}, 150)

window.addEventListener('resize', resetAnimationsDebounced);

function animateSVG() {
    let element = document.getElementById("bg").contentDocument.getElementsByTagName("svg")[0];

    element.style.strokeDasharray = 4500 + 'px';
    let strokeDashoffset = 4200;
    element.style.strokeDashoffset = strokeDashoffset + 'px';
    document.getElementById("bg").style.opacity = .5;

    var refreshInterval = setInterval(function() {
        strokeDashoffset += 30
        element.style.strokeDashoffset = strokeDashoffset + 'px';
        if (strokeDashoffset > 8400) {
            clearInterval(refreshInterval)
        }
    }, 20)
}

function insertChatDemos() {
    exitIdleAnimation = true;
    let chats_container = document.getElementById("chats")
    if (getBrowserWidth() < 900) {
        return
    }
    let browserWidth = getBrowserWidth() - 630;
    let handledWidthMut = browserWidth;
    loopIterCountMut = 0;

    while (handledWidthMut > 0) {
        let buf = `<div class="chat-block">`;
        random_chat = chat_data[loopIterCountMut]

        buf += buildMessage(random_chat)

        buf += `</div>`;
        chats_container.innerHTML += buf;
        let container = chats_container.children[loopIterCountMut].children


        handledWidthMut -= 289+100;
        loopIterCountMut += 1;
    }

    //animation section

    let colIterCountMut = 0;



    while (colIterCountMut < chats_container.children.length) {
        animateMessageIn(chats_container.children[colIterCountMut], colIterCountMut)
        colIterCountMut += 1;
    }


    exitIdleAnimation = true;
}

function buildMessage(random_chat) {

    let buf = ""
    for (let item in random_chat) {
        item = random_chat[item]

        let bgVal = "";
        if (item.a == "ComfyAI") {
            bgVal = "message-bg-special"
        }

        let cVal = "";
        if(item.c != null) {
            cVal = `color: ${item.c}`
        }

        buf += `<div class="chat-message ${bgVal}" style="opacity:0; transform: translateY(100px);">
                    <img class="pfp" src="${path}/img/pfp/${item.p}.webp">
                    <div class="message-right">
                        <div class="name-dummy" style="${cVal}">${item.a}</div>
                        <div class="time-dummy">Today at 4:20 PM</div>
                        <p class="content-text">${item.m}</p>
                    </div>
                    <div style="clear: both;"></div>
                </div>
`
    }
    return buf
}

function animateMessageIn(currentColRef, colIterCountMut) {
    let animateWaitTimeoutMut = 250 + (750 * colIterCountMut);

    let messagesRef = currentColRef.children;

    let messageContainerLeftOffset = currentColRef.getBoundingClientRect().left;

    let currentMessageIterCountMut = 0;
    while (currentMessageIterCountMut < messagesRef.length) {

        let message = messagesRef[currentMessageIterCountMut];

        setTimeout(function () {
            if (messageContainerLeftOffset + 300 > getBrowserWidth()) {
                message.style.opacity = .2;
            } else {
                message.style.opacity = 1;
            }
            message.style.transform = "translateY(0px)";
        }, animateWaitTimeoutMut)

        animateWaitTimeoutMut += 250;
        currentMessageIterCountMut += 1;
    }
}

let lastRand = 0
function executeIdleChatDemoAnimation() {
    console.log(loopIterCountMut)
    animateWaitTimeoutMut = 250;
    let chats_container = document.getElementById("chats");
    let chats_children = chats_container.children

    let randIntInRange = 0;
    if (chats_children.length > 1) {
        randIntInRange = getRandomInt(0,chats_children.length -1);
        while (randIntInRange === lastRand) {
            randIntInRange = getRandomInt(0,chats_children.length -1)
        }
        lastRand = randIntInRange
    }

    let currentColRef = chats_children[randIntInRange]
    let messageContainerLeftOffset = currentColRef.getBoundingClientRect().left;
    let messagesRef = currentColRef.children

    currentColRef.style.opacity = 0;
    currentColRef.style.transform = "scale(.95)";

    setTimeout(function() {
        currentColRef.style.opacity = 1;
        currentColRef.style.transform = "";
        //currentColRef.style.transition = "none";
        if (exitIdleAnimation) {
            return
        }
        if (loopIterCountMut === chat_data.length) {
            loopIterCountMut = 0;
        } else {
            loopIterCountMut++
        }
        random_chat = chat_data[loopIterCountMut]
        currentColRef.innerHTML = buildMessage(random_chat);
        animateMessageIn(currentColRef, 0)
    }, 500)

}

//var intervalID = setInterval(myCallback, 5000);

function myCallback() {
    if (exitIdleAnimation) {
        exitIdleAnimation = false
    } else {
        executeIdleChatDemoAnimation()
    }
}
