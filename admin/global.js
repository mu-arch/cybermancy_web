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
    
    let button_dimensions = [callee.offsetWidth, callee.offsetHeight];
    
    e("control-menu").innerHTML = page.data;
    
    let menu_dimensions = [e("control-menu").offsetWidth, e("control-menu").offsetHeight];
    
    let scale_percent = [button_dimensions[0] / menu_dimensions[0], button_dimensions[1] / menu_dimensions[1]]
    
    let viewport_midpoint = [document.documentElement.clientWidth / 2, document.documentElement.clientHeight / 2];
    
    let button_midpoint = [
        control_menu_callee.getBoundingClientRect().left + (button_dimensions[0] / 2),
        control_menu_callee.getBoundingClientRect().top + (button_dimensions[1] / 2)
    ]
    
    console.log(button_midpoint)
    /*
    let menu_midpoint = [
        e("control-menu").getBoundingClientRect().left + (menu_dimensions[0] / 2),
        e("control-menu").getBoundingClientRect().top + (menu_dimensions[1] / 2)
    ]
    console.log(menu_midpoint)
    
     */
    
    let angle = getAngleDegrees(viewport_midpoint[0],viewport_midpoint[1], button_midpoint[0],button_midpoint[1])
    let menu_attachment_coords = [0,0]
    let button_attachment_coords = [0,0]
    let viewport_edge_intersection = [0,0]
    
    let region = 0
    let nearest_measurement_angle
    
    //todo shortcircuit on absolute values like 90, 180, etc
    
    if (angle > 315 && angle < 45) {
        region = 0
        nearest_measurement_angle = 0
    } else if (angle > 45 && angle < 135) {
        region = 1
        nearest_measurement_angle = 90
    } else if (angle > 135 && angle < 225) {
        region = 2
        nearest_measurement_angle = 180
    } else if (angle > 225 && angle < 315) {
        region = 3
        nearest_measurement_angle = 270
    }
    
    
    let rel_angle = angle;
    if (rel_angle < nearest_measurement_angle) {
        rel_angle = nearest_measurement_angle - rel_angle
    } else {
        rel_angle = rel_angle - nearest_measurement_angle
    }
    
    
    if (region === 0) {
    
    } else if (region === 1) {
        viewport_edge_intersection = [
            document.documentElement.clientWidth,
            (document.documentElement.clientHeight /2) - (Math.tan(d_to_r(rel_angle)) * (document.documentElement.clientWidth /2))
        ]
    }
    
    
    
    console.log(viewport_edge_intersection)
    
    let final_menu_pos_left = button_attachment_coords[0] - menu_attachment_coords[0];
    let final_menu_pos_top = button_attachment_coords[1] - menu_attachment_coords[1];
    
    e("control-menu").style.top =  final_menu_pos_top + "px";
    e("control-menu").style.left = final_menu_pos_left + "px";
    e("control-menu").style.opacity = "1";
    e("control-menu").style.pointerEvents = "all";
    
    e("control-menu").style.transform = `scale(${scale_percent[0]}, ${scale_percent[1]})`;
    e("control-menu").style.transformOrigin = `${menu_attachment_coords[0]}px ${menu_attachment_coords[1]}px`;
    
    
    setTimeout(function(){
        closing_allowed=false
        
        e("control-menu").style.transitionDuration = `100ms`;
        e("control-menu").style.transform = `scale(1, 1)`;
        //e("control-menu").style.opacity = "1";
        //e("control-menu").style.width =  width + "px";
        //e("control-menu").style.height = height + "px";
        //e("control-menu").style.top =  control_menu_callee.getBoundingClientRect().top + "px";
        //e("control-menu").style.left = (control_menu_callee.getBoundingClientRect().left + control_menu_callee.offsetWidth) + "px";
        //e("control-menu").style.transform = `translate(-250px, -10px)`
    }, 10);
    
    
}

function d_to_r(degrees) {
    var pi = Math.PI;
    return degrees * (pi/180);
}

function getAngleDegrees(fromX,fromY,toX,toY,force360 = true) {
    let deltaX = fromX-toX;
    let deltaY = fromY-toY; // reverse
    let radians = Math.atan2(deltaY, deltaX)
    let degrees = (radians * 180) / Math.PI - 90; // rotate
    if (force360) {
        while (degrees >= 360) degrees -= 360;
        while (degrees < 0) degrees += 360;
    }
    console.log('angle to degree:',{deltaX,deltaY,radians,degrees})
    return degrees;
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