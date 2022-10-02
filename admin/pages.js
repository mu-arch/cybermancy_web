const mx_overview = {
    title: "Mail Exchanges",
    data: `<div class="view-header">
        <h1>Mail Exchanges</h1>
        <div class="view-header-controls">
            <div class="button" onclick="openControlMenu(this, mx_new, 50, 20, 'right', 380, 380, 15)">Add exchange</div>
        </div>
        <p>A Mail Exchange (MX) coordinates all SMTP send and receive operations for your domain.</p>
    </div>
    <div class="view-content"></div>`
}

//MX new
let mx_new = {
    data: `<h3>Add Exchange</h3>
<p>Enter your domain name. We\'ll add DNS records in the next step.</p>
<input name="domain" placeholder="domain.com">
<div id="form-buttons">
<button class="confirm" onclick="mx_new.operations.create()"><span style="background-size: 11px;" class="icon icon-check invert"></span><div>Confirm</div></button>
<button class="cancel" onclick="closeControlModal()"><span style="background-size: 9px;" class="icon icon-cancel invert"></span><div>Cancel</div></button>
</div>
`,
    operations: {
        create: function create() {
            let obj = {
                domain: document.getElementsByName("domain")[0].value
            }
            e("form-buttons").style.pointerEvents = "none";
            e("form-buttons").style.opacity = ".25";
            post(API_URL + '/mx/create', obj).then(r => {
            
            })
        }
    }
}
