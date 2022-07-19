function e(e) {
    return document.getElementById(e);
}

let automation_object = {
    name: "",
    event: null,
    actions: []
}

/*
let text_value_struct = {
    match_case: bool,
    allow_inside_word_matches: bool,
    string: String
}

 */



function setSubPageContent(page_object) {
    e("sub-page-content").style.display = 'inline-block';
    e("primary-page-content").style.display = 'none';

    let html = `<h1>${page_object.title}</h1>`;
    html += `<p class="header">${page_object.desc}</p>`;

    page_object.types.forEach((item) => {
        html += `<div class="selection-block ${item.disabled ? 'disabled' : ''}" onclick="setMainPageState('${page_object.type}', '${item.name}')"><div class="selection-button"><h3>${item.name}</h3><p>${item.desc}</p><img src="../img/icons/keyboard_arrow_right.svg"></div>`
        if (item.extended_desc) {
            html += `<p class="extended-desc">${item.extended_desc}</p>`
        }
        html += `</div>`
    })

    let sidebar_html = '';

    sidebar_html += `<h3>${page_object.sidebar_header}</h3>`

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
        value = "Create"
    }

    automation_object.name = value
    e("automation-name").innerText = automation_object.name;
}

function setMainPageState(obj_key, element) {
    console.log(obj_key, element);
    automation_object.event = {
        type: element,
        data: null
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
    if (automation_object.event == null) {
        e("pre-config").style.display = "block";
        e("right-sidebar").innerHTML = "<h3>New here?</h3><p>Be sure to check out the getting started guide!</p>";
    } else {
        e("pre-config").style.display = "none";
    }

}

//run instantly

update_name(automation_object.name);
wakeupMainPageState();