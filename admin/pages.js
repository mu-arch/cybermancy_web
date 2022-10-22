//sidebars

const sidebar = {
    //language=HTML
    data: `
        <div class="sidebar">
            <a onclick="navigate('')">
                <div class="logo"></div>
                <div class="logo-text">MQ</div>
            </a>
            <div id="sidebar-links">

            </div>
            <div class="account"
                 onmousedown="openControlMenu(this, account_menu, 0, 0, 'left','bottom', 269, 134.5, 0)">
                <div class="profile-icon">
                    <div class="icon-pacman" style="width: 18px; height: 18px;margin: 9px;filter:invert(100%)"></div>
                </div>
                <div id="email-slot" class="email">unknown</div>
                <div class="icon-expand nav-icon"></div>
            </div>
        </div>`,
    links: {
        //language=HTML
        account: `
            <div class="header">Settings</div>
            <div class="item">
                <div class="icon-awesomedude"></div>
                <div class="text">General</div>
            </div>
            <div class="item">
                <div class="icon-awesomedude"></div>
                <div>Wallets</div>
            </div>
            <div class="header">Records</div>
            <div class="item">
                <div class="icon-awesomedude"></div>
                <div>Billing</div>
            </div>
            <div class="item">
                <div class="icon icon-awesomedude"></div>
                <div>Activity</div>
            </div>`
    }
}

//main content
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

const mxs_list_overview = {
    title: "Mail Exchanges",
    sidebar: "postagent_general",
    //language=HTML
    data: `
        <div class="view-header">
            <h1>Mail Exchangers</h1><span id="syncing"><i class="gg-loadbar-alt"></i></span>
            <div class="view-header-controls">
                <div class="button" onmousedown="openControlMenu(this, mx_new, 50, 20, 'right', 'top', 380, 380, 15)">
                    Add exchanger
                </div>
            </div>
            <p>A Mail Exchanger (MX) coordinates all SMTP send and receive operations for your domain.</p>
        </div>
        <div class="view-content">
            <table>
                <colgroup>
                    <col span="1">
                    <col span="1" style="width: 90px;">
                    <col span="1" style="width: 70px;">
                </colgroup>
                <tbody id="table-body">
                <tr>
                    <th>domain</th>
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
                e("table-body").insertAdjacentHTML("beforeend", `<tr style="background: none"><td style="border-bottom: none"><div class="load-2"><div class="line"></div><div class="line"></div><div class="line"></div></div></td></tr>`);
            }

            let mxs = await mxs_list_overview.operations.get_list()
            if (start_time < last_navigation_time) {
                return
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
        <td><div class="bold">${acl_grants}</div></td>
        <td><div class="high-vis ${dns_valid}">${dns_valid}</div></td>
        </tr>`)
            })
        }
    }
}

let mx_new = {
    //language=HTML
    data: `<h3>Add Exchanger</h3>
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
    data: `<h3>Account Menu</h3>
<div class="account-menu"><div onclick="navigate('account'); closeControlModal()"><span class="icon-settings account-icon"></span>Account</div>
<div onclick="logout(); closeControlModal()" style="margin-bottom: 50px;"><span class="icon-bowl account-icon"></span>Logout</div></div>`
}

const account = {
    title: "Account",
    sidebar: "account",
    //language=HTML
    data: `
        <div class="view-header">
            <h1>Account</h1>
            <p>Here you can manage your billing and account settings globally across Cybermancy services.</p>
        </div>
        <div class="view-content">

            <div class="settings-category">
                <h2>User</h2>
                <div class="settings-category-items">
                    <div class="settings-option" onclick="navigate('account/general')">
                        <h3>General</h3>
                        <p>General settings for your user account.</p>
                    </div>
                    <div class="settings-option">
                        <h3>Wallets</h3>
                        <p>Create & view connected bank accounts.</p>
                    </div>
                </div>
            </div>

            <div class="settings-category">
                <h2>Records</h2>

                <div class="settings-category-items">

                    <div class="settings-option">
                        <h3>Billing History</h3>
                        <p>View the billing history for all wallets.</p>
                    </div>
                    <div class="settings-option">
                        <h3>Activity</h3>
                        <p>View account activity.</p>
                    </div>
                </div>
            </div>
        </div>

        </div>`,
    collect: [
        async function (start_time, url) {

        }
    ],
    operations: {}
}

const general_settings = {
    title: "Account General",
    sidebar: "account",
    //language=HTML
    data: `
        <div class="view-header">
            <h1><a onclick="navigate('account')">Account</a><span>/</span>General</h1><span id="syncing"><i
                class="gg-loadbar-alt"></i></span>
            <p>General settings related to your account.</p>
        </div>
        <div class="view-content">
            <div class="menu-section">

                <div class="menu-wrapper">
                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Display Name</h4>
                            <p>An optional name shown to others in a shared resource.</p>
                        </div>
                        <div class="menu-content">
                            <input placeholder="Enter your name" name="name" type="text">
                            <div class="input-desc">Others will see you as this name. Only for display purposes and not
                                tied to billing settings.
                            </div>
                            <div class="button" onmousedown="general_settings.operations.set_name(this)">Update</div>
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
                            <input placeholder="Current password" name="old_password" type="text">
                            <br><br>
                            <input placeholder="New password" name="new_password" type="text">
                            <br><br>
                            <input placeholder="Repeat new password" name="new_password_repeat" type="text">
                            <div class="input-desc">Upon update you will automatically be logged out of all devices.
                            </div>
                            <div class="button" onmousedown="general_settings.operations.update_password(this)">Update
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="menu-section">
                <div class="menu-wrapper">
                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Account Identifier</h4>
                            <p>View the account identifier.</p>
                        </div>
                        <div class="menu-content">
                            <input id="data-account-id" disabled type="text">
                        </div>
                    </div>


                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Browser Session</h4>
                            <p>View the session key.</p>
                        </div>
                        <div class="menu-content">
                            <input id="data-session" disabled type="text">
                            <div class="input-desc">This browser's session.</div>
                            <br>
                            <input id="data-session-created" disabled type="text">
                            <div class="input-desc">Creation time.</div>
                        </div>
                    </div>

                    <div class="menu-part">
                        <div class="menu-head">
                            <h4>Account Creation Date</h4>
                            <p>View when the account was created.</p>
                        </div>
                        <div class="menu-content">
                            <input id="data-created-date" disabled type="text">
                        </div>
                    </div>


                </div>
            </div>


            <div class="menu-section">
                <h3>Danger</h3>
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


        </div>
        </div>`,
    collect: [
        async function (start_time, url) {

            [].forEach.call(document.getElementsByClassName("menu-head"), function (el) {
                el.insertAdjacentHTML("beforeend", `<div class="settings-expand" style="top: ${(el.clientHeight / 2) - 15}px" onmousedown="general_settings.operations.toggle_field(this)">open</div>`);
                let menu_block = el.parentNode;
                let block_height = menu_block.offsetHeight;
                menu_block.setAttribute("data-initHeight", block_height)

                menu_block.style.height = `${el.offsetHeight}px`;
            })

            let settings = await general_settings.operations.get_user_settings()
            if (start_time < last_navigation_time) {
                return
            }
            e("syncing").style.opacity = "0";

            e("data-account-id").value = localStorage.getItem("account_id");
            e("data-session").value = localStorage.getItem("session");
            e("data-session-created").value = localStorage.getItem("session_created_at");


            document.getElementsByName("name")[0].value = settings.name
            e("data-created-date").value = settings.created_at;
        }
    ],
    operations: {
        get_user_settings: async function () {
            return await get(API_URL + `/account/settings/general`)
        },
        set_name: async function (self) {
            self.innerHTML = "Pending..."
            let menu_content = self.parentNode;
            let menu_block = menu_content.parentNode;

            let obj = {
                "name": document.getElementsByName("name")[0].value
            }

            let resp = await post(API_URL + `/account/settings/general`, obj)
            menu_block.querySelector(".button").innerHTML = "Update"
            if (resp.err) {
                return
            }
            general_settings.operations.close_field(self, menu_block.querySelector(".menu-head"), menu_block)
            notyf.success('Update accepted.');
        },
        update_password: async function (self) {
            let menu_content = self.parentNode;
            let menu_block = menu_content.parentNode;

            if (document.getElementsByName("new_password")[0].value !== document.getElementsByName("new_password_repeat")[0].value) {
                notyf.error('Passwords do not match. Try again.');
                return
            }

            let obj = {
                "old_password": document.getElementsByName("old_password")[0].value,
                "new_password": document.getElementsByName("new_password")[0].value
            }

            self.innerHTML = "Pending..."
            let resp = await post(API_URL + `/account/settings/password`, obj)
            menu_block.querySelector(".button").innerHTML = "Update"
            if (resp.err) {
                return
            }
            logout(true)
        },
        toggle_field: function (self) {
            let menu_head = self.parentNode;
            let menu_block = menu_head.parentNode
            if (menu_head.clientHeight === menu_block.clientHeight) {
                general_settings.operations.expand_field(self, menu_head, menu_block)
            } else {
                general_settings.operations.close_field(self, menu_head, menu_block)
            }
        },
        expand_field: function (self, menu_head, menu_block) {
            menu_block.style.height = `${parseInt(menu_block.getAttribute("data-initHeight")) + 12}px`;
            menu_block.style.background = "#1a1a1a"
            menu_head.querySelector(".settings-expand").innerHTML = "close";
            menu_head.style.marginTop = "12px"
        },
        close_field: function (self, menu_head, menu_block) {
            menu_block.style.removeProperty("background")
            menu_head.style.removeProperty("margin-top")
            menu_block.style.height = `${menu_head.clientHeight}px`;
            menu_head.querySelector(".settings-expand").innerHTML = "open";
        }
    }
}

const mx_overview = {
    title: "Exchange",
    sidebar: "postagent-exchange",
    //language=HTML
    data: `
        <div class="view-header">
            <h1>Loading...</h1><span id="syncing"><i class="gg-loadbar-alt"></i></span>
        </div>
        <div class="view-content">
            <div class="button" onclick="navigate('')">Return to Exchange list</div>
        </div>`,
    collect: [
        async function (start_time, url) {

            let domain_uuid = url.split("/")[2];

            let mx_data = await mx_overview.operations.get_mx(domain_uuid)
            if (start_time < last_navigation_time) {
                return
            }

            let domain = mx_data["domain"]
            document.title = `${domain} - PostAgent`
            document.getElementsByTagName("h1")[0].innerHTML = `<a onclick="navigate('mx/${domain_uuid}/overview')">${domain}</a><span>/</span>Overview`
            e("syncing").style.opacity = "0";
        }
    ],
    operations: {
        get_mx: async function get_mx(uuid) {
            return await get(API_URL + `/mx/${uuid}/basic`)
        },
    }
}

const mx_dns = {
    title: "DNS Configuration",
    sidebar: "postagent-exchange",
    //language=HTML
    data: `
        <div class="view-header">
            <h1>DNS Configuration</h1><span id="syncing"><i class="gg-loadbar-alt"></i></span>
            <p>Emails are routed over the internet using records stored in the DNS system. This page explains how to map
                your domain's MX records to our servers, so we can begin coordinating email traffic on your behalf.</p>
            <p>To do so, you'll need to update your DNS settings through your domain's registrar to the values we
                provide below.</p>
        </div>
        <div class="view-content">
            <div class="page-group">
                <h2>1. Add basic records (required):</h2>
                <table>
                    <colgroup>
                        <col span="1" style="width: 40px;">
                        <col span="1" style="width: 90px;">
                        <col span="1" style="width: 70px;">
                        <col span="1" style="width: 40px;">
                    </colgroup>
                    <tbody id="table-body">
                    <tr>
                        <th>type</th>
                        <th>hostname</th>
                        <th>required value</th>
                        <th>status</th>
                    </tr>
                    <tr>
                        <td>txt</td>
                        <td>?</td>
                        <td>
                            <div class="field">v=spf1 include:postagent.cybermancy.org ~all</div>
                        </td>
                        <td>
                            <div class="high-vis invalid">?</div>
                        </td>
                    </tr>
                    <tr>
                        <td>txt</td>
                        <td>?</td>
                        <td>
                            <div class="field">?</div>
                        </td>
                        <td>
                            <div class="high-vis invalid">?</div>
                        </td>
                    </tr>
                    </tbody>
                </table>


                <h3>What do these records do?</h3>

                <p>Recipient mail servers use these records to verify mail is actually coming from who it claims to be
                    from.
                    Their technical names are SPF and DKIM.</p>

                <p>SPF stands for "Sender Policy Framework" an anti-forgery system that ensures to the recipient mail
                    server
                    that PostAgent's IP is allowed to send on behalf of your domain.</p>

                <p>DKIM stands for "DomainKeys Identified Mail" a cryptographic signature based anti-forgery system that
                    allows recipient servers to (1) verify an email's "from" address is not spoofed and (2) ensure mail
                    content was not altered in transit. DKIM does NOT encrypt your emails (that's SSL).
                    Note: Your registrar may split the long DKIM key into two records. This is normal.</p>
            </div>

            <div class="page-group">
                <h2>2. Add MX records to receive mail (optional):</h2>

                <table>
                    <colgroup>
                        <col span="1" style="width: 40px;">
                        <col span="1" style="width: 90px;">
                        <col span="1" style="width: 70px;">
                        <col span="1" style="width: 40px;">
                    </colgroup>
                    <tbody id="table-body">
                    <tr>
                        <th>type</th>
                        <th>hostname</th>
                        <th>required value</th>
                        <th>status</th>
                    </tr>
                    <tr>
                        <td>mx</td>
                        <td>?</td>
                        <td>
                            <div class="field">10 mxa.postagent.cybermancy.org.</div>
                        </td>
                        <td>
                            <div class="high-vis invalid">?</div>
                        </td>
                    </tr>
                    <tr>
                        <td>mx</td>
                        <td>?</td>
                        <td>
                            <div class="field">20 mxb.postagent.cybermancy.org.</div>
                        </td>
                        <td>
                            <div class="high-vis invalid">?</div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <h3>Just to clarify:</h3>

                <p>The values listed above are in BIND format. Your registrar may require you to enter them differently.
                    The number before the required value represents the "priority" of the MX server. Some registrars may
                    exclude the trailing "." while others will require it.
                    Make sure PostAgent's MX records are the only MX records for this specific domain or sub-domain.</p>
            </div>
            <div class="page-group">
                <h2>3. Add a CNAME record to track unsubscribes, opens, & clicks (optional)</h2>
                <table>
                    <colgroup>
                        <col span="1" style="width: 40px;">
                        <col span="1" style="width: 90px;">
                        <col span="1" style="width: 70px;">
                        <col span="1" style="width: 40px;">
                    </colgroup>
                    <tbody id="table-body">
                    <tr>
                        <th>type</th>
                        <th>hostname</th>
                        <th>required value</th>
                        <th>status</th>
                    </tr>
                    <tr>
                        <td>cname</td>
                        <td>wo8vy2th.domain.com</td>
                        <td>
                            <div class="field">10 mxa.postagent.cybermancy.org.</div>
                        </td>
                        <td>
                            <div class="high-vis invalid">?</div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <h3>What's next?</h3>

                <p>Typically DNS settings propagate within an hour, but in some cases it can take over 24 hours.</p>

            </div>
        </div>
        <style>

            .page-group {
                padding: 20px 0 60px 0;
            }

            .page-group p {
                max-width: 650px;
                padding: 10px 0;
                font-size: 13px;
                line-height: 20px;
                color: #838383;
            }

            table {
                margin: 30px 0 40px 0;
            }

            .view-content th {
                text-transform: uppercase;
                font-size: 11px;
                text-align: left;
                font-weight: 500;
                border-bottom: 1px solid #494949;
                padding-bottom: 15px;
            }

            .view-content td {
                padding: 40px 0;
                border-bottom: 1px solid #2d2d2d;
                line-height: 0;
            }

            .message-only {
                background: none !important;
            }

            .message-only td {
                cursor: default;
            }

            .view-content td:first-child {
                font-family: monospace;
                text-transform: uppercase;
                font-weight: 700;
            }

            .view-content td:nth-child(2) {
                font-size: 13px
            }

            .field {
                font-family: monospace;
                padding: 10px;
                display: inline;
                border: 1px solid #5d5d5d;
                background: #232323;
                border-radius: 6px;
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
        async function (start_time, url) {
            let domain_uuid = url.split("/")[2];

            let mx_data = await mx_overview.operations.get_mx(domain_uuid)
            if (start_time < last_navigation_time) {
                return
            }

            let domain = mx_data["domain"]
            e("syncing").style.opacity = "0";
        }
    ],
    operations: {
        get_mx: async function get_mx(uuid) {
            return await get(API_URL + `/mx/${uuid}/basic`)
        },
    }
}

const account_login = {
    title: "Login",
    //language=HTML
    data: `
        <div class="form">
            <div class="logo"></div>
            <h1>Welcome,</h1>
            <p class="desc">Login to continue or <a class="link" onclick="navigate('account/create')">Sign up</a></p>
            <div class="account-form">
                <input type="text" name="email" placeholder="Email"
                       onkeydown="account_login.operations.listen_enter(event)">
                <input type="password" name="password" placeholder="Password"
                       onkeydown="account_login.operations.listen_enter(event)">
                <div id="login-submit" class="submit" onclick="account_login.operations.login()">Login</div>
            </div>
            <div class="hr"></div>
            <p class="forgot-email">Forgot your credentials? Click <a href="">here</a></p>
        </div>`,
    collect: [
        async function (start_time, url) {
            document.getElementsByName("email")[0].focus()
        }
    ],
    operations: {
        login: async function () {
            e("login-submit").innerText = "Please wait..."
            let result = await post(API_URL + `/account/login`, {
                email: n('email')[0].value,
                password: n('password')[0].value,
            }, true)
            if (result.err) {
                e("login-submit").innerText = "Login"
                return
            }
            localStorage.setItem('email', n('email')[0].value);
            localStorage.setItem('session', result['session']);
            localStorage.setItem('account_id', result['account_id']);
            localStorage.setItem('session_created_at', result['session_created_at']);
            navigate("")
        },
        listen_enter: function (event) {
            if (event.key === "Enter") {
                account_login.operations.login()
            }
        }
    }
}

const account_create = {
    title: "Join",
    //language=HTML
    data: `
        <div class="form">
            <div class="logo"></div>
            <h1>Join us,</h1>
            <p class="desc">Already signed up? <a class="link" onclick="navigate('account/login')">Login</a></p>
            <div class="account-form">
                <input autocomplete="off" type="text" name="email" placeholder="Email">
                <input autocomplete="off" type="password" name="password" placeholder="Password">
                <input autocomplete="off" type="password" name="password2" placeholder="Repeat Password">
                <div id="login-submit" class="submit" onclick="account_create.operations.create()">Sign up</div>
            </div>
            <div class="hr"></div>
            <p class="forgot-email">Your email is not shared, and we don't send marketing.</p>
        </div>`,
    collect: [
        async function (start_time, url) {
            document.getElementsByName("email")[0].focus()
        }
    ],
    operations: {
        create: async function () {
            e("login-submit").innerText = "Please wait..."
            if (account_create.operations.isEmail(n('email')[0].value) === false) {
                notyf.error('Email field is not valid.');
                return
            }

            if (n('password')[0].value !== n('password2')[0].value) {
                notyf.error('Passwords do not match.');
                return
            }

            let result = await post(API_URL + `/account/create`, {
                email: n('email')[0].value,
                password: n('password')[0].value,
            }, true)
            if (result.err) {
                e("login-submit").innerText = "Join us"
                return
            }
            notyf.success('Account created! Logging in...');
            await account_login.operations.login()
        },
        isEmail: function (email) {
            return /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email);
        }
    }
}