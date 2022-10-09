const sidebar = {
    //language=HTML
    data: `
        <div class="sidebar">
            <a onclick="navigate('')">
                <div class="logo"></div>
                <div class="logo-text">PostAgent</div>
            </a>
            <div class="account"
                 onmousedown="openControlMenu(this, account_menu, 0, 0, 'left','bottom', 269, 134.5, 0)">
                <div class="profile-icon">
                    <div class="icon-pacman" style="width: 18px; height: 18px;margin: 9px;filter:invert(100%)"></div>
                </div>
                <div id="email-slot" class="email">unknown</div>
                <div class="icon-expand nav-icon"></div>
            </div>
        </div>`
}

const mxs_list_overview = {
    title: "Mail Exchanges",
    //language=HTML
    data: `
        <div class="view-header">
            <h1>Mail Exchanges</h1><span id="syncing"><i class="gg-loadbar-alt"></i></span>
            <div class="view-header-controls">
                <div class="button" onmousedown="openControlMenu(this, mx_new, 50, 20, 'right', 'top', 380, 380, 15)">
                    Add exchange
                </div>
            </div>
            <p>A Mail Exchange (MX) coordinates all SMTP send and receive operations for your domain.</p>
        </div>
        <div class="view-content">
            <table>
                <colgroup>
                    <col span="1">
                    <col span="1" style="width: 150px;">
                    <col span="1" style="width: 90px;">
                    <col span="1" style="width: 70px;">
                </colgroup>
                <tbody id="table-body">
                <tr>
                    <th>domain</th>
                    <th>usage (30 days)</th>
                    <th>grants</th>
                    <th>dns</th>
                </tr>
                </tbody>
            </table>
        </div>
        <style>
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
                cursor: pointer;
            }

            .view-content tr:hover:not(tr:first-child) {
                background: #0e0e0e;
            }

            .message-only {
                background: none !important;
            }

            .message-only td {
                cursor: default;
            }

            .view-content tr:hover .primary {
                background: #fff;
                color: #000;
                padding: 4px 10px;
                border-radius: 99px;
            }

            .view-content tr:hover .click-to-open {
                display: inline;
            }

            .click-to-open {
                display: none;
                padding-left: 12px;
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
                background-color: rgba(34, 255, 0, .2);
                color: rgb(34, 255, 0);
            }

            .invalid {
                background-color: rgba(255, 0, 0, 0.2);
                color: rgb(255, 0, 0);
            }</style>`,
    collect: [
        async function (start_time) {

            let ls_mxs = localStorage.getItem('mx_overview_mxs');

            if (ls_mxs) {
                ls_mxs = JSON.parse(ls_mxs)
                mxs_list_overview.operations.insert_mxs(ls_mxs)
            } else {
                e("table-body").insertAdjacentHTML("beforeend", `<tr id="loading"><td style="border-bottom: none"><div class="load-2"><div class="line"></div><div class="line"></div><div class="line"></div></div></td></tr>`);
            }

            let mxs = await mxs_list_overview.operations.get_list()
            if (start_time < last_navigation_time) {
                return
            }

            if (e("loading")) {
                e("loading").remove();
            }

            if (ls_mxs !== mxs) {
                while (e("table-body").childNodes.length > 2) {
                    e("table-body").removeChild(e("table-body").lastChild);
                }
                mxs_list_overview.operations.insert_mxs(mxs)
                localStorage.setItem('mx_overview_mxs', JSON.stringify(mxs))
            }


            e("syncing").style.opacity = "0";
            if (localStorage.getItem('mx_overview_mxs') === "[]") {
                e("table-body").insertAdjacentHTML("beforeend", `<tr class="message-only"><td style="border-bottom: none">You have no MXs yet.</td></tr>`);
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
                let acl_grants
                if (item["acl_grants"].length === 1) {
                    acl_grants = item["acl_grants"][0]
                } else {
                    acl_grants = "multiple"
                }

                e("table-body").insertAdjacentHTML("beforeend", `<tr onclick="navigate('mx/${item['mx']}/overview')">
        <td><div class="primary">${item["domain"]}</div><div class="click-to-open">open</div></td>
        <td><div class="number">0 cr</div></td>
        <td><div class="bold">${acl_grants}</div></td>
        <td><div class="high-vis ${dns_valid}">${dns_valid}</div></td>
        </tr>`)
            })
        }
    }
}

let mx_new = {
    //language=HTML
    data: `<h3>Add Exchange</h3>
    <p>Enter your domain name. We\'ll add DNS records in the next step.</p>
    <input name="domain" placeholder="domain.com">
    <div id="form-buttons">
        <button class="confirm" onclick="mx_new.operations.create()"><span style="background-size: 11px;"
                                                                           class="icon icon-check invert"></span>
            <div>Confirm</div>
        </button>
        <button class="cancel" onclick="closeControlModal()"><span style="background-size: 9px;"
                                                                   class="icon icon-cancel invert"></span>
            <div>Cancel</div>
        </button>
    </div>
    <div id="modal-notif" style="display: none"></div>
    `,
    collect: [
        async function (url) {
            setTimeout(function () {
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
    data: `<h3>Options</h3>
<div class="account-menu"><div onclick="navigate('account'); closeControlModal()"><span class="icon-settings account-icon"></span>Account</div>
<div onclick=""><span class="icon-graph account-icon"></span>Billing Wallets</div>
<div onclick="logout()" style="margin-bottom: 50px;"><span class="icon-bowl account-icon"></span>Logout</div></div>`
}

const not_found = {
    title: "Page not found",
    //language=HTML
    data: `
        <div class="view-header">
            <h1>Page not found</h1>

            <p>The page your requested could not be found. If you think this is an application error please report it to
                us.</p>
        </div>
        <div class="view-content">
            <div class="button" onclick="navigate('')">Return to overview</div>
        </div>`
}

const account = {
    title: "Account Settings",
    //language=HTML
    data: `
        <div class="view-header">
            <h1>Account</h1><span id="syncing"><i class="gg-loadbar-alt"></i></span>
        </div>
        <div class="view-content">
            <div class="button" onclick="navigate('')">Return to Exchange list</div>
        </div>`,
    collect: [
        async function (start_time, url) {

        }
    ],
    operations: {}
}

const general_settings = {
    title: "Account General",
    //language=HTML
    data: `
        <div class="view-header">
            <h1>Account<span>/</span>Settings</h1><span id="syncing"><i class="gg-loadbar-alt"></i></span>
            <p>General settings related to your account. These account settings are global across all Cybermancy
                services.</p>
        </div>
        <div class="view-content">
            <div class="menu-section">
                <h3>Config</h3>

                <div class="menu-wrapper">
                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Name</h4>
                            <p>The name others see you as in a team.</p>
                        </div>
                        <div class="menu-content">
                            <input>
                            <div class="input-desc"></div>
                        </div>
                    </div>


                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Email Address</h4>
                            <p>View or update the email address linked to this account.</p>
                        </div>
                        <div class="menu-content">

                        </div>
                    </div>

                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Password</h4>
                            <p>Update the account password.</p>
                        </div>
                        <div class="menu-content">

                        </div>
                    </div>

                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Timezone</h4>
                            <p>Set the timezone to be used to display timestamps in the GUI.</p>
                        </div>
                        <div class="menu-content">

                        </div>
                    </div>

                </div>
            </div>


            <div class="menu-section">
                <h3>Management</h3>
                <div class="menu-wrapper">
                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Delete Account</h4>
                            <p>Permanently delete the account.</p>
                        </div>
                        <div class="menu-content">

                        </div>
                    </div>
                </div>
            </div>


            <div class="menu-section">
                <h3>Debug</h3>
                <div class="menu-wrapper">
                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Account UUID</h4>
                            <p>View the account identifier.</p>
                        </div>
                        <div class="menu-content">

                        </div>
                    </div>


                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Session Token</h4>
                            <p>View the session token.</p>
                        </div>
                        <div class="menu-content">

                        </div>
                    </div>


                </div>
            </div>


        </div>
        </div>`,
    collect: [
        async function (start_time, url) {

            [].forEach.call(document.getElementsByClassName("menu-head"), function (el) {
                el.insertAdjacentHTML("beforeend", `<div class="settings-expand">Expand</div>`);
            })

        }
    ],
    operations: {
        get_user_settings: async function get_mx(get_user_settings) {
            return await get(API_URL + `/account/settings`)
        },
    }
}

const mx_overview = {
    title: "Exchange",
    //language=HTML
    data: `
        <div class="view-header">
            <h1>Overview</h1><span id="syncing"><i class="gg-loadbar-alt"></i></span>
        </div>
        <div class="view-content">
            <div class="button" onclick="navigate('')">Return to Exchange list</div>
        </div>`,
    collect: [
        async function (start_time, url) {

            let mx_data = await mx_overview.operations.get_mx(url.split("/")[2])
            if (start_time < last_navigation_time) {
                return
            }

            let domain = mx_data["domain"]
            document.title = `${domain} - PostAgent`
            //document.getElementsByTagName("h1")[0].innerHTML = `${domain}<span>/</span>Overview`
            e("syncing").style.opacity = "0";
        }
    ],
    operations: {
        get_mx: async function get_mx(uuid) {
            return await get(API_URL + `/mx/${uuid}/basic`)
        },
    }
}