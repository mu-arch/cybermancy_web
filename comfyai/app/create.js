function e(e) {
    return document.getElementById(e);
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

let automation_object = {
    uuid: null,
    name: "",
    draft: false,
    event: null,
    actions: []
}



function setSubPageContent(page_object) {
    e("sub-page-content").style.display = 'inline-block';
    e("primary-page-content").style.display = 'none';

    let html = `<h1>${page_object.title}</h1>`;
    html += `<p class="header">${page_object.desc}</p>`;

    page_object.types.forEach((item) => {
        html += `<div class="selection-block ${item.disabled ? 'disabled' : ''}" onclick="returnFromSubPage('${page_object.type}', '${item.name}')"><div class="selection-button"><h3>${item.name}</h3><p>${item.desc}</p><img src="../img/icons/keyboard_arrow_right.svg"></div>`
        if (item.extended_desc) {
            html += `<p class="extended-desc">${item.extended_desc}</p>`
        }
        html += `</div>`
    })

    let sidebar_html = '';

    sidebar_html += `<h3 class="speech-bubble floating">${page_object.sidebar_header}</h3><img class="floating2" src="../img/helper2.png">`

    let lines = page_object.sidebar_text.split("\n")

    lines.forEach((line) => {
        sidebar_html += `<p>${line}</p>`
    })

    html += `<div id="close-sub-page" onclick="cleanupSubPageContent()"><img src="../img/icons/cross.svg"></div>`



    e("sub-page-content").innerHTML = html;
    e("right-sidebar").innerHTML = sidebar_html;
}

function update_name(value) {
    if (!value) {
        value = "New Automation"
    }

    automation_object.name = value
    e("automation-name").innerText = automation_object.name;
    e("automation-name").setAttribute("title", automation_object.name);
}

function returnFromSubPage(obj_key, element) {
    console.log(obj_key, element);

    if (obj_key == "event") {
        automation_object.event = {
            type: element,
            data: null
        }
    }
    cleanupSubPageContent();
    wakeupMainPageState()
}

function cleanupSubPageContent() {
    e("primary-page-content").style.display = 'inline-block';
    e("sub-page-content").style.display = 'none';
    e("right-sidebar").innerHTML = '';
    wakeupMainPageState()
}

function wakeupMainPageState() {

    if (automation_object.name == "") {

    } else {
        let event_html = `<div class="portion"><h2>2. Event</h2><p class="section-p">The event defines what ComfyAI should notice. When something happens in your Discord server that matches your event, and its optional properties, this automation is triggered.</p><div id="event-block"></div></div>`
    }

    if (automation_object.event == null) {
        e("right-sidebar").innerHTML = "<h3>New here?</h3><p>Be sure to check out the getting started guide!</p>";
        e("event-block").innerHTML = `<div class="pre-config" onclick="setSubPageContent(events_selection)"><div class="pre-select"><img src="../img/icons/plus.svg">Event</div></div>`;
    } else {
        e("event-block").innerHTML = `<div class="event-card"></div>`;
    }

}

function firstLoadCheck() {

    /*
    if (params.uuid) {
        loadCommandFromStore(params.uuid)
    } else {
        let new_uuid = uuidv4();
        const params = new URLSearchParams(location.search);

        params.set('uuid', new_uuid);

        params.toString();
        window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
    }

     */

}



//run instantly

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
update_name(automation_object.name);
wakeupMainPageState();
firstLoadCheck();