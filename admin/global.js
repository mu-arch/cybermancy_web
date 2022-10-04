const API_URL = 'http://0.0.0.0:3030';

function e(e) {
    return document.getElementById(e);
}

let last_rate_limit_time = 0;
function rate_limit(fn) {
    let current_time = Date.now();
    if (current_time - last_execution < 1000)
        return;
    
    last_rate_limit_time = current_time;
    fn();
}

async function post(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('session'),
            'Account-Id': localStorage.getItem('account_id'),
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

async function get(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Authorization': localStorage.getItem('session'),
            'Account-Id': localStorage.getItem('account_id'),
        },
    })
    .then(res => {
        if (res.status === 200) {
            return res.json();
        } else if (res.status === 401) {
            logout(true)
        } else {
            console.error(res)
        }
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}

function logout(redirect_only) {
    if (redirect_only) {
        localStorage.removeItem('session');
        window.location.href = "/account/login";
    } else {
        get(API_URL + '/account/logout')
        .then(r => {
            localStorage.removeItem('session');
            window.location.href = "/account/login";
        })
    }
}

// ROUTER

function getDomain() {
    return (location.protocol + '//' + location.host)
}

window.addEventListener("popstate", (e) => {
    coreRouter(location.pathname)
})

window.history.pushState = new Proxy(window.history.pushState, {
    apply: (target, thisArg, argArray) => {
        coreRouter(argArray[2].substring(getDomain().length))
        return target.apply(thisArg, argArray);
    },
});

function coreRouter(route) {
    switch(route) {
        case "/overview":
            displayPage(mx_overview)
            break;
        case "/mx/new":
            displayPage(mx_new)
            break;
        default:
            displayPage(mx_overview)
    }
}

function displayPage(obj) {
    e("view").innerHTML = obj.data;
    window.parent.document.title = obj.title + ' - PostAgent';
}

function navigate(route) {
    history.pushState({}, "", getDomain() + "/" + route)
}

// SIDEBAR

function generateSidebar() {
    let template = `<div class="sidebar">
        <a href="">
            <div class="logo"></div>
        </a>
        <button type="button" onclick="logout()">Logout!</button>
        <div class="button" onclick="openControlMenu(this, mx_new)">Add exchange</div>
    </div>`
    e('sidebar-container').innerHTML = template;
}

// MENU AND MODAL

function openControlMenu(callee, page, x, y, side, width, tx,ty) {
    closing_allowed=false
    
    width -= 60; //accounts for 20px padding on both sides
    
    control_menu_callee = callee;
    
    e("click-sink").style.pointerEvents = "auto";
    
    let button_dimensions = {
        x: control_menu_callee.offsetWidth,
        y: control_menu_callee.offsetHeight
    };
    
    e("control-menu").innerHTML = page.data;
    e("control-menu").style.width =  width + "px";
    
    let menu_dimensions = {
        x: e("control-menu").offsetWidth,
        y: e("control-menu").offsetHeight
    }
    
    let scale_percent = {
        x: button_dimensions.x / menu_dimensions.x,
        y: button_dimensions.y / menu_dimensions.y
    };
    
    e("control-menu").style.top =  y + "px";
    
    if (side === "right") {
        e("control-menu").style.right = x + "px";
    } else {
        e("control-menu").style.left = x + "px";
    }
    
    e("control-menu").style.opacity = "1";
    
    e("control-menu").style.transform = `scale(${scale_percent.x}, ${scale_percent.y})`;
    e("control-menu").style.transformOrigin = `${tx}px ${ty}px`;
    
    
    setTimeout(function(){
        closing_allowed=true
        e("control-menu").style.transitionDuration = `100ms`;
        e("control-menu").style.transform = `scale(1, 1)`;
    }, 5);

    setTimeout(function(){
        e("control-menu").style.pointerEvents = "all";
    }, 100);
    
}

function detectModelClose(event) {
    
    if(closing_allowed === false) {
        return
    }
    //we need the click sink because of a browser issue where empty regions of page don't trigger event
    if (event.target.id !== "click-sink") {
        return
    }
    closeControlModal()
}

function closeControlModal() {
    closing_allowed=false
    e("click-sink").style.pointerEvents = "none";
    e("control-menu").style.pointerEvents = "none";
    
    let button_dimensions = {
        x: control_menu_callee.offsetWidth,
        y: control_menu_callee.offsetHeight
    };
    
    let menu_dimensions = {
        x: e("control-menu").offsetWidth,
        y: e("control-menu").offsetHeight
    }
    
    let scale_percent = {
        x: button_dimensions.x / menu_dimensions.x,
        y: button_dimensions.y / menu_dimensions.y
    };
    
    e("control-menu").style.transform = `scale(${scale_percent.x}, ${scale_percent.y})`;
    
    setTimeout(function(){
        closing_allowed=true
        e("control-menu").style.transitionDuration = `0ms`;
        e("control-menu").style.opacity = "0";
    }, 100);
}

function insertLoadingAnimation(element, lightMode) {
    if (lightMode) {
        element.innerHTML = `<div class="load-2 line-dark">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>`
    } else {
        element.innerHTML = `<div class="load-2">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>`
    }
}




let closing_allowed=false;
let control_menu_callee=null;
document.body.addEventListener('mousedown', detectModelClose, true);
generateSidebar()
coreRouter(location.pathname)