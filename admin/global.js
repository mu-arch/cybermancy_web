"use strict";

var Notyf=function(){"use strict";var e,o=function(){return(o=Object.assign||function(t){for(var i,e=1,n=arguments.length;e<n;e++)for(var o in i=arguments[e])Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o]);return t}).apply(this,arguments)},n=(t.prototype.on=function(t,i){var e=this.listeners[t]||[];this.listeners[t]=e.concat([i])},t.prototype.triggerEvent=function(t,i){var e=this;(this.listeners[t]||[]).forEach(function(t){return t({target:e,event:i})})},t);function t(t){this.options=t,this.listeners={}}(i=e=e||{})[i.Add=0]="Add",i[i.Remove=1]="Remove";var f,i,s=(a.prototype.push=function(t){this.notifications.push(t),this.updateFn(t,e.Add,this.notifications)},a.prototype.splice=function(t,i){i=this.notifications.splice(t,i)[0];return this.updateFn(i,e.Remove,this.notifications),i},a.prototype.indexOf=function(t){return this.notifications.indexOf(t)},a.prototype.onUpdate=function(t){this.updateFn=t},a);function a(){this.notifications=[]}(i=f=f||{}).Dismiss="dismiss";var r={types:[{type:"success",className:"notyf__toast--success",backgroundColor:"#3dc763",icon:{className:"notyf__icon--success",tagName:"i"}},{type:"error",className:"notyf__toast--error",backgroundColor:"#ed3d3d",icon:{className:"notyf__icon--error",tagName:"i"}}],duration:2e3,ripple:!0,position:{x:"right",y:"bottom"},dismissible:!(i.Click="click")},c=(p.prototype.on=function(t,i){var e;this.events=o(o({},this.events),((e={})[t]=i,e))},p.prototype.update=function(t,i){i===e.Add?this.addNotification(t):i===e.Remove&&this.removeNotification(t)},p.prototype.removeNotification=function(t){var i,e,n=this,t=this._popRenderedNotification(t);t&&((e=t.node).classList.add("notyf__toast--disappear"),e.addEventListener(this.animationEndEventName,i=function(t){t.target===e&&(e.removeEventListener(n.animationEndEventName,i),n.container.removeChild(e))}))},p.prototype.addNotification=function(t){var i=this._renderNotification(t);this.notifications.push({notification:t,node:i}),this._announce(t.options.message||"Notification")},p.prototype._renderNotification=function(t){var i=this._buildNotificationCard(t),e=t.options.className;return e&&(t=i.classList).add.apply(t,e.split(" ")),this.container.appendChild(i),i},p.prototype._popRenderedNotification=function(t){for(var i=-1,e=0;e<this.notifications.length&&i<0;e++)this.notifications[e].notification===t&&(i=e);if(-1!==i)return this.notifications.splice(i,1)[0]},p.prototype.getXPosition=function(t){return(null===(t=null==t?void 0:t.position)||void 0===t?void 0:t.x)||"right"},p.prototype.getYPosition=function(t){return(null===(t=null==t?void 0:t.position)||void 0===t?void 0:t.y)||"bottom"},p.prototype.adjustContainerAlignment=function(t){var i=this.X_POSITION_FLEX_MAP[this.getXPosition(t)],e=this.Y_POSITION_FLEX_MAP[this.getYPosition(t)],t=this.container.style;t.setProperty("justify-content",e),t.setProperty("align-items",i)},p.prototype._buildNotificationCard=function(n){var o=this,t=n.options,i=t.icon;this.adjustContainerAlignment(t);var e=this._createHTMLElement({tagName:"div",className:"notyf__toast"}),s=this._createHTMLElement({tagName:"div",className:"notyf__ripple"}),a=this._createHTMLElement({tagName:"div",className:"notyf__wrapper"}),r=this._createHTMLElement({tagName:"div",className:"notyf__message"});r.innerHTML=t.message||"";var c,p,d,l,u=t.background||t.backgroundColor;i&&(c=this._createHTMLElement({tagName:"div",className:"notyf__icon"}),("string"==typeof i||i instanceof String)&&(c.innerHTML=new String(i).valueOf()),"object"==typeof i&&(p=i.tagName,d=i.className,l=i.text,i=void 0===(i=i.color)?u:i,l=this._createHTMLElement({tagName:void 0===p?"i":p,className:d,text:l}),i&&(l.style.color=i),c.appendChild(l)),a.appendChild(c)),a.appendChild(r),e.appendChild(a),u&&(t.ripple?(s.style.background=u,e.appendChild(s)):e.style.background=u),t.dismissible&&(s=this._createHTMLElement({tagName:"div",className:"notyf__dismiss"}),u=this._createHTMLElement({tagName:"button",className:"notyf__dismiss-btn"}),s.appendChild(u),a.appendChild(s),e.classList.add("notyf__toast--dismissible"),u.addEventListener("click",function(t){var i,e;null!==(e=(i=o.events)[f.Dismiss])&&void 0!==e&&e.call(i,{target:n,event:t}),t.stopPropagation()})),e.addEventListener("click",function(t){var i,e;return null===(e=(i=o.events)[f.Click])||void 0===e?void 0:e.call(i,{target:n,event:t})});t="top"===this.getYPosition(t)?"upper":"lower";return e.classList.add("notyf__toast--"+t),e},p.prototype._createHTMLElement=function(t){var i=t.tagName,e=t.className,t=t.text,i=document.createElement(i);return e&&(i.className=e),i.textContent=t||null,i},p.prototype._createA11yContainer=function(){var t=this._createHTMLElement({tagName:"div",className:"notyf-announcer"});t.setAttribute("aria-atomic","true"),t.setAttribute("aria-live","polite"),t.style.border="0",t.style.clip="rect(0 0 0 0)",t.style.height="1px",t.style.margin="-1px",t.style.overflow="hidden",t.style.padding="0",t.style.position="absolute",t.style.width="1px",t.style.outline="0",document.body.appendChild(t),this.a11yContainer=t},p.prototype._announce=function(t){var i=this;this.a11yContainer.textContent="",setTimeout(function(){i.a11yContainer.textContent=t},100)},p.prototype._getAnimationEndEventName=function(){var t,i=document.createElement("_fake"),e={MozTransition:"animationend",OTransition:"oAnimationEnd",WebkitTransition:"webkitAnimationEnd",transition:"animationend"};for(t in e)if(void 0!==i.style[t])return e[t];return"animationend"},p);function p(){this.notifications=[],this.events={},this.X_POSITION_FLEX_MAP={left:"flex-start",center:"center",right:"flex-end"},this.Y_POSITION_FLEX_MAP={top:"flex-start",center:"center",bottom:"flex-end"};var t=document.createDocumentFragment(),i=this._createHTMLElement({tagName:"div",className:"notyf"});t.appendChild(i),document.body.appendChild(t),this.container=i,this.animationEndEventName=this._getAnimationEndEventName(),this._createA11yContainer()}function d(t){var e=this;this.dismiss=this._removeNotification,this.notifications=new s,this.view=new c;var i=this.registerTypes(t);this.options=o(o({},r),t),this.options.types=i,this.notifications.onUpdate(function(t,i){return e.view.update(t,i)}),this.view.on(f.Dismiss,function(t){var i=t.target,t=t.event;e._removeNotification(i),i.triggerEvent(f.Dismiss,t)}),this.view.on(f.Click,function(t){var i=t.target,t=t.event;return i.triggerEvent(f.Click,t)})}return d.prototype.error=function(t){t=this.normalizeOptions("error",t);return this.open(t)},d.prototype.success=function(t){t=this.normalizeOptions("success",t);return this.open(t)},d.prototype.open=function(i){var t=this.options.types.find(function(t){return t.type===i.type})||{},t=o(o({},t),i);this.assignProps(["ripple","position","dismissible"],t);t=new n(t);return this._pushNotification(t),t},d.prototype.dismissAll=function(){for(;this.notifications.splice(0,1););},d.prototype.assignProps=function(t,i){var e=this;t.forEach(function(t){i[t]=(null==i[t]?e.options:i)[t]})},d.prototype._pushNotification=function(t){var i=this;this.notifications.push(t);var e=(void 0!==t.options.duration?t:this).options.duration;e&&setTimeout(function(){return i._removeNotification(t)},e)},d.prototype._removeNotification=function(t){t=this.notifications.indexOf(t);-1!==t&&this.notifications.splice(t,1)},d.prototype.normalizeOptions=function(t,i){t={type:t};return"string"==typeof i?t.message=i:"object"==typeof i&&(t=o(o({},t),i)),t},d.prototype.registerTypes=function(t){var i=(t&&t.types||[]).slice();return r.types.map(function(e){var n=-1;i.forEach(function(t,i){t.type===e.type&&(n=i)});var t=-1!==n?i.splice(n,1)[0]:{};return o(o({},e),t)}).concat(i)},d}();

const API_URL = 'http://10.0.0.26:3030';

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
            type: 'info',
            background: '#0a3370',
            icon: {
                className: 'notyf__icon--success',
            },
            duration: 2500,
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