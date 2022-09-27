const mx_overview = {
    "title": "Mail Exchanges",
    "data": `<div class="view-header">
        <h1>Mail Exchanges</h1>
        <div class="view-header-controls">
            <div href="/mx/new.html" class="button" onclick="openControlMenu(this, mx_new)">Add exchange</div>
        </div>
        <p>A Mail Exchange (MX) coordinates all SMTP send and receive operations for your domain.</p>
    </div>
    <div class="view-content"></div>`
}

let mx_new = {
    "data": `<h3>Add Exchange</h3>
<p>Enter your domain name. We\'ll add DNS records in the next step.</p>
<input placeholder="domain.com">
<button class="confirm"><span style="background-size: 11px;" class="icon icon-check invert"></span><div>Confirm</div></button>
<button class="cancel"><span style="background-size: 9px;" class="icon icon-cancel invert"></span><div>Cancel</div></button>
`
}