const API_URL = 'http://0.0.0.0:3030';

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
        <div class="button" onclick="openControlMenu(this, mx_new)">Add exchange</div>
    </div>`
    e('sidebar-container').innerHTML = template;
}

// MENU AND MODAL

function openControlMenu(callee, page) {
    
    control_menu_callee = callee;
    
    e("click-sink").style.pointerEvents = "auto";
    
    let button_dimensions = {
        x: callee.offsetWidth,
        y: callee.offsetHeight
    };
    
    e("control-menu").innerHTML = page.data;
    
    let menu_dimensions = {
        x: e("control-menu").offsetWidth,
        y: e("control-menu").offsetHeight
    }
    
    let scale_percent = {
        x: button_dimensions.x / menu_dimensions.x,
        y: button_dimensions.y / menu_dimensions.y
    };
    
    let button_midpoint = {
        x: control_menu_callee.getBoundingClientRect().left + (button_dimensions.x / 2),
        y: control_menu_callee.getBoundingClientRect().top + (button_dimensions.y / 2)
    }
    
    
    
    let ray_intersection = pointOnRect(button_midpoint.x,
        button_midpoint.y,
        0,
        0,
        document.documentElement.clientWidth ,
        document.documentElement.clientHeight ,
        false)
    
    let menu_insert_point = {
        x: ray_intersection.x - (menu_dimensions.x / 2),
        y: ray_intersection.y - (menu_dimensions.y / 2)
    }
    
    let menu_midpoint = {
        x: menu_insert_point.x + (menu_dimensions.x/2),
        y: menu_insert_point.y + (menu_dimensions.y/2)
    }
    
    let slope = getSlopeAngle(
        [
            button_midpoint.x,
            button_midpoint.y
        ],
        [
            document.documentElement.clientWidth/2,
            document.documentElement.clientHeight/2
        ]
    );
    slope = Math.tan(toRadians(slope))
    

    let center_height = document.documentElement.clientHeight/2
    
    console.log(center_height, (Math.abs(menu_midpoint.y) + center_height) , (button_midpoint.y + center_height), slope)
    
    let subtract_x = ((Math.abs(menu_midpoint.y) + center_height) - (center_height - button_midpoint.y)) /slope;
    console.log(subtract_x)
    menu_insert_point.x -= subtract_x;
    menu_insert_point.y = button_midpoint.y - (button_dimensions.y/2)
    
    
    
    
    
    
    
    e("control-menu").style.top =  menu_insert_point.y + "px";
    e("control-menu").style.left = menu_insert_point.x + "px";
    e("control-menu").style.opacity = ".5";
    e("control-menu").style.pointerEvents = "all";
    
    //e("control-menu").style.transform = `scale(${scale_percent[0]}, ${scale_percent[1]})`;
    //e("control-menu").style.transformOrigin = `${ray_intersection.x}px ${ray_intersection.y}px`;
    
    
    setTimeout(function(){
        closing_allowed=false
        
        e("control-menu").style.transitionDuration = `100000000ms`;
        //e("control-menu").style.transform = `scale(1, 1)`;
        //e("control-menu").style.opacity = "1";
        //e("control-menu").style.width =  width + "px";
        //e("control-menu").style.height = height + "px";
        //e("control-menu").style.top =  control_menu_callee.getBoundingClientRect().top + "px";
        //e("control-menu").style.left = (control_menu_callee.getBoundingClientRect().left + control_menu_callee.offsetWidth) + "px";
        //e("control-menu").style.transform = `translate(-250px, -10px)`
    }, 10);
    
    
}

function toRadians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}

function getSlopeAngle(s1,s2) {
    return Math.atan((s2[1] - s1[1]) / (s2[0] - s1[0])) * 180/Math.PI;
}

function pointOnRect(x, y, minX, minY, maxX, maxY, validate) {
    //assert minX <= maxX;
    //assert minY <= maxY;
    if (validate && (minX < x && x < maxX) && (minY < y && y < maxY))
        throw "Point " + [x,y] + "cannot be inside "
        + "the rectangle: " + [minX, minY] + " - " + [maxX, maxY] + ".";
    var midX = (minX + maxX) / 2;
    var midY = (minY + maxY) / 2;
    // if (midX - x == 0) -> m == ±Inf -> minYx/maxYx == x (because value / ±Inf = ±0)
    var m = (midY - y) / (midX - x);
    
    if (x <= midX) { // check "left" side
        var minXy = m * (minX - x) + y;
        if (minY <= minXy && minXy <= maxY)
            return {x: minX, y: minXy};
    }
    
    if (x >= midX) { // check "right" side
        var maxXy = m * (maxX - x) + y;
        if (minY <= maxXy && maxXy <= maxY)
            return {x: maxX, y: maxXy};
    }
    
    if (y <= midY) { // check "top" side
        var minYx = (minY - y) / m + x;
        if (minX <= minYx && minYx <= maxX)
            return {x: minYx, y: minY};
    }
    
    if (y >= midY) { // check "bottom" side
        var maxYx = (maxY - y) / m + x;
        if (minX <= maxYx && maxYx <= maxX)
            return {x: maxYx, y: maxY};
    }
    
    // edge case when finding midpoint intersection: m = 0/0 = NaN
    if (x === midX && y === midY) return {x: x, y: y};
    
    // Should never happen :) If it does, please tell me!
    throw "Cannot find intersection for " + [x,y]
    + " inside rectangle " + [minX, minY] + " - " + [maxX, maxY] + ".";
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
    e("container").style.opacity = "1";
    e("click-sink").style.pointerEvents = "none";
}





let closing_allowed=false;
let control_menu_callee=null;
document.body.addEventListener('mousedown', detectModelClose, true);
generateSidebar()
coreRouter(location.pathname)