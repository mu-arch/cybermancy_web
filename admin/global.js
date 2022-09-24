const API_URL = 'http://10.0.0.26:3030';
const LOGIN_PAGE_URL = '/auth/login.html';

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
            localStorage.removeItem('session');
            window.location.href = LOGIN_PAGE_URL;
        } else {
            console.error(res)
        }
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}

function logout() {
    get(API_URL + '/account/logout')
    .then(r => {
        localStorage.removeItem('session');
        window.location.href = LOGIN_PAGE_URL;
    })
}

function generateSidebar() {
    let template = `<div class="sidebar">
        <a href="http://localhost:8000/postagent/index.html">
            <div class="logo"></div>
        </a>
    </div>`
    e('sidebar-container').innerHTML = template;
}
generateSidebar()