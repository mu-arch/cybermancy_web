const mx_overview = {
    "title": "Mail Exchanges",
    "data": `<div class="view-header">
        <h1>Mail Exchanges</h1>
        <div class="view-header-controls">
            <div href="/mx/new.html" class="button" onclick="navigate('mx/new')">Add exchange</div>
        </div>
    </div>
    <button type="button" onclick="logout()">Logout!</button>`
}

let mx_new = {
    "title": "New MX",
    "data": `<div class="view-header">
    <h1><a onclick="navigate('overview')">Mail Exchanges</a> <span>/</span> New</h1>
    <div class="view-header-controls">

    </div>
    <p>Mail Exchanges (MX) coordinate all SMTP send and receive operations for your domain.</p>
  </div>`
}