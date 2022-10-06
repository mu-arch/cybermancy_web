const sidebar = {
    data: `<div class="sidebar">
        <a href="">
            <div class="logo"></div>
        </a>
        <div class="account" onmousedown="openControlMenu(this, account_menu, 0, 0, 'left','bottom', 269, 134.5, 0)"><div class="profile-icon"><div class="icon-awesomedude" style="width: 18px; height: 18px;margin: 9px;filter:invert(100%)"></div></div><div id="email-slot" class="email">unknown</div><div class="icon-expand nav-icon"></div></div>
    </div>`
}

const mxs_list_overview = {
    title: "Mail Exchanges",
    data: `<div class="view-header">
        <h1>Mail Exchanges</h1><span id="syncing">Syncing</span>
        <div class="view-header-controls">
            <div class="button" onmousedown="openControlMenu(this, mx_new, 50, 20, 'right', 'top', 380, 380, 15)">Add exchange</div>
        </div>
        <p>A Mail Exchange (MX) coordinates all SMTP send and receive operations for your domain.</p>
    </div>
    <div class="view-content">
   <table>
   <colgroup>
        <col span="1" >
        <col span="1" style="width: 150px;">
        <col span="1" style="width: 70px;">
        <col span="1" style="width: 70px;">
      </colgroup>
      <tbody id="table-body">
        <tr>
          <th>domain</th>
   <th>usage (30 days)</th>
   <th>role</th>
   <th>dns</th>
        </tr>
      </tbody>
</table>
</div><style>
.view-content th {
    text-transform: uppercase;
    font-size: 11px;
    text-align: left;
    font-weight: 500;
    border-bottom: 1px solid #494949;
    padding-bottom: 15px;
}

.view-content td {
    padding: 20px 0;
    border-bottom: 1px solid #2d2d2d;
    cursor:pointer;
}

.view-content tr:hover:not(tr:first-child) {
    background: #0e0e0e;
}

.view-content tr:hover .primary {
    background: #fff;
    color: #000;
    padding: 4px 10px;
    border-radius: 99px;
}

.view-content tr:hover .click-to-open{
    display: inline;
}

.click-to-open {
    display: none;
    padding-left:12px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.58);
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: 600;
}

.primary {
    font-weight: 600;
    font-size: 15px;
    display: inline;
}

.number {
    font-family: monospace;
}

.bold {
    text-transform: uppercase;
    font-weight: 600;
    font-size: 11px;
}

.high-vis {
    text-transform: uppercase;
    letter-spacing: 1px;
    display: inline;
    padding: 3px 8px;
    font-weight: 600;
    font-size: 11px;
    border-radius: 5px;
}

.valid {
    background-color: rgba(34, 255, 0,.2);
    color: rgb(34, 255, 0);
}

.invalid {
    background-color: rgba(255, 0, 0, 0.2);
    color: rgb(255, 0, 0);
}</style>`,
    collect: [
        async function () {
            let ls_mxs = localStorage.getItem('mx_overview_mxs');
            if (ls_mxs) {
                ls_mxs = JSON.parse(ls_mxs)
                mxs_list_overview.operations.insert_mxs(ls_mxs)

                let mxs = await mxs_list_overview.operations.get_list()
                if (ls_mxs !== mxs) {
                    while (e("table-body").childNodes.length > 2) {
                        e("table-body").removeChild(e("table-body").lastChild);
                    }
                        mxs_list_overview.operations.insert_mxs(mxs)
                        localStorage.setItem('mx_overview_mxs', JSON.stringify(mxs))
                }
            } else {
                e("table-body").insertAdjacentHTML("beforeend", `<tr id="loading"><td style="border-bottom: none"><div class="load-2"><div class="line"></div><div class="line"></div><div class="line"></div></div></td></tr>`);
                let mxs = await mxs_list_overview.operations.get_list()
                e("loading").remove();
                    mxs_list_overview.operations.insert_mxs(mxs)
                    localStorage.setItem('mx_overview_mxs', JSON.stringify(mxs))

            }
            e("syncing").style.opacity = "0";
            if (localStorage.getItem('mx_overview_mxs') === "[]") {
                e("table-body").insertAdjacentHTML("beforeend", `<tr><td style="border-bottom: none">You have no MXs yet.</td></tr>`);
            }
        }
        ],
    operations: {
        get_list: async function get_list() {
            return await get(API_URL + '/mx')
        },
        insert_mxs: function insert_mxs(mxs) {
            mxs.forEach(item => {
                let dns_valid = "invalid"
                if (item["dns_valid"]) {
                    dns_valid = "valid"
                }

                e("table-body").insertAdjacentHTML("beforeend", `<tr onclick="navigate('mx/${item['mx']}/overview')">
        <td><div class="primary">${item["domain"]}</div><div class="click-to-open">open</div></td>
        <td><div class="number">0 cr</div></td>
        <td><div class="bold">?</div></td>
        <td><div class="high-vis ${dns_valid}">${dns_valid}</div></td>
        </tr>`)
            })
        }
    }
}

let mx_new = {
    data: `<h3>Add Exchange</h3>
<p>Enter your domain name. We\'ll add DNS records in the next step.</p>
<input name="domain" placeholder="domain.com">
<div id="form-buttons">
<button class="confirm" onclick="mx_new.operations.create()"><span style="background-size: 11px;" class="icon icon-check invert"></span><div>Confirm</div></button>
<button class="cancel" onclick="closeControlModal()"><span style="background-size: 9px;" class="icon icon-cancel invert"></span><div>Cancel</div></button>
</div>
<div id="modal-notif" style="display: none"></div>
`,
    collect: [
        async function () {
            setTimeout(function(){
                console.log("works")
                document.getElementsByName("domain")[0].focus()
            }, 100);
        }
    ],
    operations: {
        create: function create() {
            let domain = document.getElementsByName("domain")[0].value;
            e("modal-notif").style.display = "block";
            if (!validateDomain(domain)) {
                e("modal-notif").innerHTML = "Invalid domain."
                return
            }

            let obj = {
                domain: domain
            }
            e("form-buttons").style.pointerEvents = "none";
            e("form-buttons").style.opacity = ".25";
            insertLoadingAnimation(e("modal-notif"), true)
            post(API_URL + '/mx/create', obj).then(r => {
                console.log(r)
            })
        }
    }
}

let account_menu = {
    data: `<h3>Account Menu</h3><div class="account-menu"><div><span class="icon-settings account-icon"></span>Settings</div><div onclick="logout()"><span class="icon-bowl account-icon"></span>Logout</div></div>`
}

const not_found = {
    title: "Page not found",
    data: `<div class="view-header">
        <h1>Page not found</h1>
       
        <p>The page your requested could not be found. If you think this is an application error please report it to us.</p>
    </div><div class="view-content"><div class="button" onclick="navigate('overview')">Return to overview</div></div>`
}

const mx_overview = {
    title: "MX Overview",
    data: `<div class="view-header">
        <h1>Overview</h1>
       
        <p>The page your requested could not be found. If you think this is an application error please report it to us.</p>
    </div><div class="view-content"><div class="button" onclick="navigate('overview')">Return to overview</div></div>`
}