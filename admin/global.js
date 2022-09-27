const API_URL = 'http://10.0.0.26:3030';

function e(e) {
    return document.getElementById(e);
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
    </div>`
    e('sidebar-container').innerHTML = template;
}

// MENU AND MODAL

function openControlMenu(callee, page) {
    
    control_menu_callee = callee;
    
    e("container").style.opacity = ".6";
    e("click-sink").style.pointerEvents = "auto";
    
    let button_width = callee.offsetWidth;
    let button_height = callee.offsetHeight;
    
    e("control-menu").style.top =  control_menu_callee.getBoundingClientRect().top + "px";
    e("control-menu").style.left = control_menu_callee.getBoundingClientRect().left + "px";
    e("control-menu").innerHTML = page.data;
    
    let menu_width = e("control-menu").offsetWidth;
    let menu_height = e("control-menu").offsetHeight;
    
    
    
    
    setTimeout(function(){
        closing_allowed=false
        
        //e("control-menu").style.opacity = "1";
        //e("control-menu").style.width =  width + "px";
        //e("control-menu").style.height = height + "px";
        //e("control-menu").style.top =  control_menu_callee.getBoundingClientRect().top + "px";
        //e("control-menu").style.left = (control_menu_callee.getBoundingClientRect().left + control_menu_callee.offsetWidth) + "px";
        //e("control-menu").style.transform = `translate(-250px, -10px)`
    }, 10);
    
    
}

function detectModelClose(event) {
    
    if(closing_allowed === false) {
        return
    }
    if (event.target.id !== "click-sink") {
        return
    }
    closeControlModal()
}

function closeControlModal() {
    closing_allowed=false
    e("container").style.opacity = "1";
    e("click-sink").style.pointerEvents = "none";
}





let closing_allowed=false;
let control_menu_callee=null;
document.body.addEventListener('mousedown', detectModelClose, true);
generateSidebar()
coreRouter(location.pathname)