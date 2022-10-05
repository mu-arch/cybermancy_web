const mx_overview = {
    title: "Mail Exchanges",
    data: `<div class="view-header">
        <h1>Mail Exchanges</h1><span id="syncing" class="pulsate">Syncing</span>
        <div class="view-header-controls">
            <div class="button" onmousedown="openControlMenu(this, mx_new, 50, 20, 'right', 380, 380, 15)">Add exchange</div>
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
</div>`,
    collect: [
        async function () {
            let ls_mxs = localStorage.getItem('mx_overview_mxs');
            if (ls_mxs) {
                ls_mxs = JSON.parse(ls_mxs)
                mx_overview.operations.insert_mxs(ls_mxs)

                let mxs = await mx_overview.operations.get_list()
                if (ls_mxs !== mxs) {
                    while (e("table-body").childNodes.length > 2) {
                        e("table-body").removeChild(e("table-body").lastChild);
                    }
                        mx_overview.operations.insert_mxs(mxs)
                        localStorage.setItem('mx_overview_mxs', JSON.stringify(mxs))
                }
            } else {
                e("table-body").insertAdjacentHTML("beforeend", `<tr id="loading"><td style="border-bottom: none"><div class="load-2"><div class="line"></div><div class="line"></div><div class="line"></div></div></td></tr>`);
                let mxs = await mx_overview.operations.get_list()
                e("loading").remove();
                    mx_overview.operations.insert_mxs(mxs)
                    localStorage.setItem('mx_overview_mxs', JSON.stringify(mxs))

            }
            e("syncing").remove();
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

                e("table-body").insertAdjacentHTML("beforeend", `<tr>
        <td><div class="primary">${item["domain"]}</div><div class="click-to-open">open</div></td>
        <td><div class="number">0 cr</div></td>
        <td><div class="bold">?</div></td>
        <td><div class="high-vis ${dns_valid}">${dns_valid}</div></td>
        </tr>`)
            })
        }
    }
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
