"use strict";

const API_URL = 'http://localhost:3030';

let last_navigation_time = new Date();

const notyf = new Notyf({
    duration: 1500,
    position: {
        x: 'center',
        y: 'top',
    },
    types: [
        {
            type: 'warning',
            background: 'orange',
            icon: {
                className: 'notyf__icon--error',
            },
            duration: 5000,
        },
        {
            type: 'error',
            background: 'red',
            duration: 10000,
            dismissible: true
        }
    ]
});

function e(e) {
    return document.getElementById(e);
}

function n(n) {
    return document.getElementsByName(n)
}

let last_rate_limit_time = 0;
function rate_limit(fn) {
    let current_time = Date.now();
    if (current_time - last_execution < 1000)
        return;
    
    last_rate_limit_time = current_time;
    fn();
}

async function post(url = '', data = {}, no_headers) {
    let current_nav_time = last_navigation_time
    let headers = {
            'Content-Type': 'application/json',
        };
    if (!no_headers) {
        headers['Authorization'] = localStorage.getItem('session')
        headers['Account-Id'] = localStorage.getItem('account_id')
    }
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: headers,
        body: JSON.stringify(data)
    })
    .catch((error) => {
        console.error('Error:', error);
        notyf.error(error);
        return {err: error}
    });

    if (response.status === 401) {
        logout(true)
    }

    if (response.status !== 200) {
        console.error('Error:', response);

        let resp = {}
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            resp = await response.json();
        }
        if (resp["message"]) {
            notyf.error(resp["message"]);
        } else {
            notyf.error("HTTP Status: " + response.status);
        }
        return {err: response.status}
    }
    return await response.json()
}

async function get(url = '') {
    let response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Authorization': localStorage.getItem('session'),
            'Account-Id': localStorage.getItem('account_id'),
        }
    })
        .catch((error) => {
            console.error('Error:', error);
        });

    if (response.status === 401) {
        console.log(response.status)
        logout(true)
    }

    let resp = response.json()

    if (response.status !== 200) {
        console.error('Error:', response);
        return {err: response.status + ": " + resp["message"]}
    }
    return resp
}

function logout(do_not_make_logout_rx_to_api) {
    if (do_not_make_logout_rx_to_api) {
        localStorage.clear();
        navigate("account/login");
        notyf.open({
            type: 'warning',
            message: 'Your session has expired. You have been logged out.'
        });
    } else {
        get(API_URL + '/account/logout')
        .then(r => {
            localStorage.clear();
            navigate("account/login");
            notyf.open({
                type: 'warning',
                message: 'You have been logged out.'
            });
        })
    }
}

function validateDomain(domain) {
    if (/^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(domain)) {
        return true
    }
    else {
        return false
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
    last_navigation_time = new Date();



    switch(true) {
        case route === "/":
            displayPage(mxs_list_overview, route)
            break;
        case route === "/mx/new":
            displayPage(mx_new, route)
            break;
        case route === "/account":
            displayPage(account, route)
            break;
        case route === "/account/general":
            displayPage(general_settings, route)
            break;
        case route === "/account/login":
            displayPage(account_login, route)
            break;
        case route === "/account/create":
            displayPage(account_create, route)
            break;
        case (route.split('/')[1] === "mx" && route.split('/')[3] === "overview"):
            displayPage(mx_overview, route)
            break;
        case (route.split('/')[1] === "mx" && route.split('/')[3] === "dns"):
            displayPage(mx_dns, route)
            break;
        default:
            displayPage(not_found, route)
    }
}

function displayPage(obj, url) {
    last_navigation_time = new Date();
    e("view").innerHTML = obj.data;
    window.parent.document.title = obj.title + ' - PostAgent';

    if (obj.sidebar) {
        generateSidebar(obj.sidebar)
        e("sidebar-container").style.display = "block";
    } else {
        e("sidebar-container").style.display = "none";
    }

    for (let fn in obj.collect) {
        obj.collect[fn](last_navigation_time, url)
    }

}

function navigate(route) {
    history.pushState({}, "", getDomain() + "/" + route)
}

// SIDEBAR

function generateSidebar(sidebar_ref) {

    e('sidebar-container').innerHTML = sidebar.data;
    e('email-slot').innerHTML = localStorage.getItem("email");

    if (sidebar_ref) {
        e('sidebar-links').innerHTML = sidebar.links[sidebar_ref]
    }

}

// MENU AND MODAL

function openControlMenu(callee, page, x, y, side, height, width, tx,ty) {
    for (let fn in page.collect) {
        page.collect[fn]()
    }
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

    if (height === "top") {
        e("control-menu").style.top =  y + "px";
    } else {
        ty = e("control-menu").offsetHeight - ty;
        e("control-menu").style.bottom =  y + "px";
    }

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
        e("control-menu").removeAttribute('style')
    }, 100);
}

function insertLoadingAnimation(element, lightMode) {
    if (lightMode) {
        element.innerHTML = `<div class="load-2 line-dark"><div class="line"></div><div class="line"></div><div class="line"></div></div>`
    } else {
        element.innerHTML = `<div class="load-2"><div class="line"></div><div class="line"></div><div class="line"></div></div>`
    }
}




let closing_allowed=false;
let control_menu_callee=null;
document.body.addEventListener('mousedown', detectModelClose, true);
generateSidebar()
coreRouter(location.pathname)