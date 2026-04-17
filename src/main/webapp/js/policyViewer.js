

function getCurDate() {
	const date = new Date();
	var mon = date.getMonth() + 1;
	mon = mon.toString();
	if (mon.length == 1)
		mon = "0" + mon;
	var day = date.getDate().toString();
	if (day.length == 1)
		day = "0" + day;


	var dtStr = date.getFullYear().toString() + mon + day;
	return dtStr;

}


function initializeTable(jsonDataStr) {
	var _ffStr = document.getElementById("_ff").value;
	// Define variables for input elements
	var table = new Tabulator("#myTable", {
		selectableRows: true,
		data: jsonDataStr,
		// layout:"fitColumns",
		layout: "fitDataStretch",
		pagination: "local",
		paginationSize: 25,
		paginationCounter: "rows",
		movableColumns: true,
		initialSort: [
			{ column: "firstName", dir: "asc" },
		],
		columns: [
			{ title: "First Name", field: "firstName" },
			{
				title: "Last Name",
				field: "lastName",
				formatter: function(cell, formatterParams, onRendered) {
					var contextPath = cell.getData().contextPath;
					var portalLogin = cell.getData().portalLogin;
					var lastName = cell.getValue();
					var url = contextPath + '/my_aegis/portal_admin/display_user?login=' + portalLogin + "&_ff=" + _ffStr;
					return "<a href='" + url + "'>" + lastName + "</a>";
				}
			},
			{ title: "Company", field: "roleForCompany" },
			{ title: "Policy Access", field: "archiveAccess" },
			{ title: "Access By", field: "archiveAccessRelation" },
			{
				title: "Unshare",
				formatter: function(cell, formatterParams, onRendered) {
					var isInputAllowed = cell.getRow().getData().isInputAllowed;
					var chkUserId = cell.getRow().getData().userID;
					var rowIndex = cell.getRow().getData().rowIndex;
					if (isInputAllowed) {
						return `<input type='checkbox' id='unshare-${rowIndex}' name='selectedItems' value='${rowIndex}'' class='unshare-checkbox'/> Unshare`;
					} else {
						return "&nbsp;";
					}
				}
			}
		]
	});


	// trigger download of data.xlsx file
	document.getElementById("download-xlsx").addEventListener("click", function() {
		table.download("xlsx", "Share_admin_" + getCurDate() + ".xlsx", { sheetName: "Share_admin" });
	});
	document.getElementById("download-pdf").addEventListener("click", function() {
		table.download("pdf", "Share_admin.pdf", {
			orientation: "portrait", // set page orientation to portrait
			title: "Share Admin", // add title to report
		});
	});


}



function initializeResultSearchAdminTable(jsonDataStr) {

	// Define variables for input elements

	var table = new Tabulator("#resultSearchAdminTable", {

		data: jsonDataStr,
		// layout:"fitColumns",
		layout: "fitDataStretch",
		pagination: "local",
		paginationSize: 25,
		paginationCounter: "rows",
		movableColumns: true,
		initialSort: [
			{ column: "ducumentUrl", dir: "asc" },
		],
		columns: [
			// {title:"Documents", field: "documentUrl", formatter:
			// "html"},
			{
				title: "Documents", field: "ducumentUrl", formatter: function(cell, formatterParams, onRendered) {
					var url = cell.getValue();
					var htmlLinkValue = cell.getData().htmlLinkValue;
					var contextPath = cell.getData().contextPath;
					var imgSrc = contextPath + '/resources/images/icons/yellow_document.gif';

					return "<a href='" + url + "' onMouseOver=\"javascript:showIt('monkey', true, true);tmt_DivAlign('monkey', 'r', '10')\" onMouseOut=\"javascript:showOut('monkey', false, false)\"><img src='" + imgSrc + "'  width='15' height='16' border='0'>" + htmlLinkValue + "</a>";
				}
			},
			{ title: "Company Name", field: "companyName" },
			{ title: "Line Of Business", field: "lobName" }

		]
	});
}

function initializeUserListTable(jsonDataStr) {

    const _ffStr = document.getElementById("_ff").value;
    const queryAttribute = document.getElementById("queryAttribute").value;
    const queryOperand = document.getElementById("queryOperand").value;
    const searchParameter = document.getElementById("queryParameter").value;
    const queryActivated = document.getElementById("queryActivated").value;

    const table = new Tabulator("#userListTable", {
        data: jsonDataStr,
        layout: "fitDataStretch",
        pagination: "local",
        paginationSize: 25,
        paginationCounter: "rows",
        movableColumns: true,

        placeholder: "No record found",

        initialSort: [
            { column: "firstName", dir: "asc" }
        ],

        columns: [

            // 🔹 Member Status Icon
            {
                title: "",
                field: "member",
                hozAlign: "center",
                formatter: function (cell) {
                    const member = cell.getValue();
                    const loginLocked = cell.getData().loginLocked;

                    if (member === "0") {
                        return "<i class='fas fa-times-circle text-danger'></i>";
                    }

                    if (member === "1" && (!loginLocked || loginLocked === "0")) {
                        return "<i class='fas fa-check-square text-success'></i>";
                    }

                    if (member === "1" && loginLocked === "1") {
                        return "<i class='fas fa-lock text-danger'></i>";
                    }

                    return "";
                }
            },

            { title: "Last", field: "lastName" },
            { title: "First", field: "firstName" },
            { title: "Company", field: "companyName" },

            // 🔹 Email / Network ID
            {
                title: "Email / NetworkID",
                field: "email",
                formatter: function (cell) {
                    const data = cell.getData();
                    const { aegisNumber, email, networkLoginName } = data;

                    if (aegisNumber === 'bkr00001' || aegisNumber === 'b/c00001') {
                        return `
                            <div>
                                ${email}<br>
                                <small>HR</small><br>
                                <small>NetworkID: ${networkLoginName || "- - N/A - -"}</small>
                            </div>
                        `;
                    }

                    return email;
                }
            },

            // 🔹 Password Status
            {
                title: "Password",
                field: "password",
                hozAlign: "center",
                formatter: function (cell) {
                    const value = cell.getValue();

                    if (value === 'aegis123') return "default";
                    if (value === 'expired') return "expired";

                    return "valid";
                }
            },

            // 🔹 Last Login
            {
                title: "Last Login",
                field: "timestamp",
                formatter: function (cell) {
                    return cell.getValue() || "- - never - -";
                }
            },

            // 🔹 User Type
            {
                title: "User Type",
                field: "userType",
                formatter: function (cell) {
                    const data = cell.getData();
                    const { userType, rolesCnt } = data;

                    if (userType === 'SELF-Reg') return "SELF-REG";
                    if (userType === 'RMS' && rolesCnt === 0) return "RMS NO ROLE";
                    if (userType === 'RMS') return "RMS";

                    return "";
                }
            },

            // 🔹 Sharing
            {
                title: "Sharing",
                field: "sharingCnt",
                hozAlign: "center",
                formatter: function (cell) {

                    const data = cell.getData();
                    const { sharingCnt, login, contextPath } = data;

                    if (!sharingCnt) return "";

                    const url = `${contextPath}/archive/user_share_admin?ARCHIVE_STATE_CODE=shareUserDetailView&QUERY_PARAMETER=${login}&queryAttribute=${queryAttribute}&queryOperand=${queryOperand}&searchParameter=${searchParameter}&queryActivated=${queryActivated}&_ff=${_ffStr}`;

                    return `
                        <a href="${url}">
                            <i class="far fa-handshake text-primary"></i>
                            <span class="badge bg-primary ms-1">${sharingCnt}</span>
                        </a>
                    `;
                }
            },

            // 🔹 Edit
            {
                title: "Edit",
                field: "login",
                hozAlign: "center",
                formatter: function (cell) {

                    let login = cell.getValue();
                    const contextPath = cell.getData().contextPath;

                    if (login.includes("'")) {
                        login = login.replace(/'/g, "%27");
                    }

                    const url = `${contextPath}/my_aegis/portal_admin/display_user?login=${login}&_ff=${_ffStr}`;

                    return `
                        <a href="${url}">
                            <i class="fas fa-edit text-secondary"></i>
                        </a>
                    `;
                }
            }
        ]
    });
}


function initializeGroupMembersTable(jsonDataStr) {
	// Create a new Tabulator table
	var grpObj = document.getElementById("groupList");
	var selIndex = grpObj.selectedIndex;
	var grpValue = grpObj.options[selIndex].value;
	var _ffStr = document.getElementById("_ff").value;
	var table = new Tabulator("#groupMembersTable", {
		data: jsonDataStr,
		layout: "fitDataStretch",
		pagination: "local",
		paginationSize: 25,
		paginationCounter: "rows",
		movableColumns: true,
		initialSort: [
			{ column: "lastName", dir: "asc" },
		],
		columns: [
			{ title: "Last", field: "lastName" },
			{ title: "First", field: "firstName" },
			{ title: "Email", field: "email" },
			{ title: "Employed At", field: "companyName" },// , width: 300
			{
				title: "Password",
				field: "password",
				formatter: function(cell) {
					var password = cell.getValue();
					if (password === 'aegis123') {
						return "default";
					} else if (password === 'expired') {
						return "expired";
					}
					return "valid";
				},
				accessorDownload: function(value) {
					if (value === 'aegis123') {
						return "default";
					} else if (value === 'expired') {
						return "expired";
					}
					return "valid";
				}
			},
			{
				title: "Activated",
				field: "member",
				formatter: function(cell) {
					return cell.getValue() === 0 ? "NO" : "Y";
				},
				accessorDownload: function(value) {
					return value === 0 ? "NO" : "Y";   // <-- applied for
					// Excel/PDF
				},
				hozAlign: "center"
			},
			{
				title: "Last Login",
				field: "timestamp",
				formatter: function(cell) {
					return cell.getValue() ? cell.getValue() : "- - never - -";
				},
				hozAlign: "center"
			},
			{
				title: "Action",
				formatter: function(cell) {
					var data = cell.getRow().getData();
					var contextPath = cell.getData().contextPath;
					var firstName = cell.getData().firstName;
					var memID = cell.getData().memID;
					console.log("grpValue==" + grpValue);
					var deleteUrl = contextPath + "/my_aegis/manage_group/admin_group_delete_member?index=" + firstName + "&deleteMemberId=" + memID + "&groupName=" + grpValue + "&_ff=" + _ffStr;
					return "<a href='" + deleteUrl + "' onclick='return confirmAction();'>Delete</a>";
				},
				hozAlign: "center",
				download: false
			}
		]
	});

	// Trigger download of data.xlsx file
	document.getElementById("download-xlsx").addEventListener("click", function() {
		table.download("xlsx", "GroupReport" + "_" + getCurDate() + ".xlsx", { sheetName: "GroupReport" });
	});
}



function initializeMemberSearchTable(jsonDataStr) {
	var grpObj = document.getElementById("groupList");
	var selIndex = grpObj.selectedIndex;
	var grpValue = grpObj.options[selIndex].value;
	var _ffStr = document.getElementById("_ff").value;

	var table = new Tabulator("#memberSearchTable", {
		data: jsonDataStr,
		layout: "fitDataStretch",
		pagination: "local",
		paginationSize: 25,
		paginationCounter: "rows",
		movableColumns: true,
		initialSort: [
			{ column: "firstName", dir: "asc" },
		],
		columns: [
			{ title: "First Name", field: "firstName" },
			{ title: "Last Name", field: "lastName" },
			{ title: "Email", field: "email" },
			{
				title: "Action",
				formatter: function(cell, formatterParams, onRendered) {
					// var login = cell.getValue();
					var contextPath = cell.getData().contextPath;
					var login = cell.getData().login;
					var firstName = cell.getData().firstName;
					// var groupName = cell.getData().groupName;
					console.log("grpValue==" + grpValue);
					var url = contextPath + "/my_aegis/manage_group/admin_group_add_member?index=" + firstName + "&loginToAdd=" + login + "&groupName=" + grpValue + "&_ff=" + _ffStr;
					return `<a href="${url}" onclick="return confirmAction();">Add</a>`;// onclick="return
					// confirmAction();"

				}
			}
		]
	});

}


function initializeCompanyTable(jsonDataStr) {
	var _ffStr = document.getElementById("_ff").value;
	var table = new Tabulator("#companyTable", {
		data: jsonDataStr,  // Parse JSON string to JavaScript object
		layout: "fitColumns",
		pagination: "local",
		paginationSize: 25,
		paginationCounter: "rows",
		movableColumns: true,
		initialSort: [
			{ column: "companyName", dir: "asc" },
		],
		columns: [
			{ title: "Company Name", field: "companyName" },
			{ title: "Co. #", field: "newCompNo", width: 100 },
			{ title: "Co. Status", field: "custStatCd", width: 100 },
			{
				title: "Access Details",
				formatter: function(cell) {
					var data = cell.getRow().getData();
					var contextPath = cell.getData().contextPath;
					var id = cell.getData().id;
					var newCompNo = cell.getData().newCompNo;
					var companyDetailUrl = contextPath + '/my_aegis/portal_admin/display_company?mode=employees&companyId=' + id + "&_ff=" + _ffStr;
					var PRMReportUrl = contextPath + '/my_aegis/my_company_contacts?view=adminTool&selectedCompanyNumber=' + newCompNo + "&_ff=" + _ffStr;
					return `
                        <a href="${companyDetailUrl}">Company Details</a>
                        &nbsp;|&nbsp;
                        <a href="${PRMReportUrl}">PRM Report</a>
                    `;
				},
				hozAlign: "left"
			},
			{
				title: "Policies",
				formatter: function(cell) {
					var data = cell.getRow().getData();
					var contextPath = cell.getData().contextPath;
					var accessDetails = contextPath + `/archive/share_admin?ARCHIVE_STATE_CODE=shareDetailView&COMPANY_NAME_CODE=${data.companyName}&ARCHIVE_STATE_CODE=yearView&COMPANY_CORE_NUM_CODE=${data.coreNumber}&COMPANY_LOC_CODE=${data.locationId}&companyId=${data.newCompNo}&_ff=` + _ffStr;
					var shareURL = contextPath + `/archive/search_adminshare?ARCHIVE_STATE_CODE=searchAdminView&COMPANY_NAME_CODE=${data.companyName}&ARCHIVE_STATE_CODE=yearView&COMPANY_CORE_NUM_CODE=${data.coreNumber}&COMPANY_LOC_CODE=${data.locationId}&companyId=${data.newCompNo}&_ff=` + _ffStr;
					return `
                        <a href="${accessDetails}">Access Details</a>
                        &nbsp;|&nbsp;
                        <a href="${shareURL}">+ Share</a>
                    `;
				},
				hozAlign: "left"
			}
		]
	});


}






function initializeReqListTable(jsonDataStr) {
	var _ffStr = document.getElementById("_ff").value;
	var table = new Tabulator("#reqListOutputTable", {
		data: jsonDataStr,  // Parse JSON string to JavaScript object
		layout: "fitDataStretch",
		pagination: "local",
		paginationSize: 25,
		paginationCounter: "rows",
		movableColumns: true,
		initialSort: [
			{ column: "agServiceRequest.lastName", dir: "asc" },
		],
		columns: [
			{ title: "Last Name", field: "agServiceRequest.lastName" },
			{ title: "First Name", field: "agServiceRequest.firstName" },
			{ title: "Email Address", field: "agServiceRequest.newEmailAddr" },
			{ title: "Request Type", field: "agServiceRequest.requestType" },
			{ title: "Requested On", field: "agServiceRequest.rowCreateDate" },
			{ title: "Status", field: "agServiceRequest.requestStatus" },
			{
				title: "Action",
				formatter: function(cell, formatterParams, onRendered) {
					var requestStatus = cell.getData().agServiceRequest.requestStatus;
					// var id = cell.getValue();
					var id = cell.getData().agServiceRequest.id;
					var userId = cell.getData().agServiceRequest.userId;
					var contextPath = cell.getData().contextPath;
					if (requestStatus === 'Open') {
						var url = contextPath + "/my_aegis/process_request?key=" + id + "&issueId=null&status=Closed&login=" + userId + "&amp;_ff=" + _ffStr;
						return "<a href='" + url + "'  onclick='return onSubmitCheck(\"close\");'>Close</a>";
					} else if (requestStatus === 'Expired') {
						var url = contextPath + "/my_aegis/process_request?key=" + id + "&issueId=null&status=Expired&login=" + userId + "&amp;_ff=" + _ffStr;
						return "<a href='" + url + "' onclick='return onSubmitCheck(\"resend\");'>Resend Activation</a>";
					}
				},
				accessorDownload: function(value, data) {
					var requestStatus = data.agServiceRequest.requestStatus;
					console.log("Value==" + requestStatus);
					if (requestStatus === 'Open') {
						console.log("Value11==" + requestStatus);
						return "Close";
					} else if (requestStatus === 'Expired') {
						return "Resend Activation";
					}
				}
			}
		]
	});

	// trigger download of data.xlsx file
	document.getElementById("download-xlsx").addEventListener("click", function() {
		table.download("xlsx", "Requests" + getCurDate() + ".xlsx", { sheetName: "Request" });
	});
	document.getElementById("download-pdf").addEventListener("click", function() {
		table.download("pdf", "Request.pdf", {
			orientation: "portrait", // set page orientation to portrait
			title: "Request" // add title to report

		});
	});

}



function initializeCurPolicyArchiveAccessTable(jsonDataStr) {
	var table = new Tabulator("#curPolicyArchiveAccessTable", {
		data: jsonDataStr,  // Parse JSON string to JavaScript object
		layout: "fitDataStretch",
		pagination: "local",
		paginationSize: 25,
		movableColumns: true,
		initialSort: [
			{ column: "lastName", dir: "asc" }
		],
		columns: [
			{ title: "First Name", field: "firstName" },
			{ title: "Last Name", field: "lastName" },
			{ title: "Company", field: "roleForCompany" },
			{ title: "Policy Access", field: "archiveAccess" },
			{ title: "Access By", field: "archiveAccessRelation" },
			{
				title: "Unshare",
				formatter: function(cell, formatterParams, onRendered) {
					var isInputAllowed = cell.getData().isInputAllowed;


					var rowIndex = cell.getRow().getData().rowIndex;
					if (isInputAllowed) {
						return `<input type='checkbox' id='unshare-${rowIndex}' name='selectedItems' value='${rowIndex}' class='unshare-checkbox'/> Unshare`;
					} else {
						return "&nbsp;";
					}
				}

			}
		]
	});
}


function initializePRMReportTable(jsonData) {

	console.log(`Original data: ${jsonData.length} rows`);

	// debug: show all rows where application flag is not strict boolean
	// true/false
	jsonData.forEach((r, i) => {
		console.log(`row[${i}] portalLogin=${r.portalLogin} hasRenewalAcs:`, r.hasRenewalAcs, 'type=', typeof r.hasRenewalAcs,
			'olaModel length=', Array.isArray(r.olaModel) ? r.olaModel.length : 'n/a');
	});

	const nestedTables = new Map();

	const table = new Tabulator("#prmReportTable", {
		height: "auto",
		layout: "fitColumns",
		columnDefaults: { resizable: true },
		data: jsonData,
		columns: [
			{
				title: "",
				field: "_toggle",
				// sorter: false,
				width: "4%",
				hozAlign: "center",
				formatter(cell) {
					const d = cell.getRow().getData();
					const hasPolicies = Array.isArray(d.policiesModel) && d.policiesModel.length > 0;
					const hasOLA = Array.isArray(d.olaModel) && d.olaModel.length > 0;
					return (hasPolicies || hasOLA) ? "<i class='fas fa-plus'></i>" : "";
				},
				cellClick(e, cell) {
					const row = cell.getRow(), id = row.getIndex(), el = cell.getElement();
					const rowEl = row.getElement(),
						c1 = rowEl.querySelector(".nested-table-1"),
						c2 = rowEl.querySelector(".nested-table-2");
					const isOpen = (c1 && c1.style.display !== "none") || (c2 && c2.style.display !== "none");

					if (!isOpen) {
						if (c1) c1.style.display = "";
						if (c2) c2.style.display = "";
						const sub1 = nestedTables.get(id + "-policies");
						if (sub1) sub1.redraw();
						const sub2 = nestedTables.get(id + "-ola");
						if (sub2) sub2.redraw();
						el.innerHTML = "<i class='fas fa-minus'></i>";
					} else {
						if (c1) c1.style.setProperty("display", "none", "important");
						if (c2) c2.style.setProperty("display", "none", "important");
						el.innerHTML = "<i class='fas fa-plus'></i>";
					}
				},
				download: false
			},
			{
				title: "Name",
				field: "fullName",
				//width: "23%",
				//width:343,
				width: 220,

				formatter: function(cell) {
					const d = cell.getRow().getData();
					const name = `${d.lastName || ""}, ${d.firstName || ""}`.trim();
					const email = d.portalLogin ? `<div style="font-size:11px; color:#555;">${d.portalLogin}</div>` : "";
					const regType = d.registrationType ? `<div style="font-size:11px; color:#777; margin-top:2px;">${d.registrationType}</div>` : "";
					return `<div>${name}${email}${regType}</div>`;
				},
				headerFilter: "input",
				headerFilterFunc: function(headerValue, rowValue, rowData) {
					if (!headerValue) return true;
					const search = headerValue.toLowerCase();
					return (
						(rowData.lastName || "").toLowerCase().includes(search) ||
						(rowData.firstName || "").toLowerCase().includes(search) ||
						(rowData.portalLogin || "").toLowerCase().includes(search) ||
						(rowData.registrationType || "").toLowerCase().includes(search)
					);
				},
				accessorDownload: function(value, rowData) {
					// For Excel export — single line
					return `${rowData.lastName || ""}, ${rowData.firstName || ""} `;// (${rowData.portalLogin
					// ||
					// ""})
				}
			},// sorter: "string",
			{ title: "Email", field: "exportEmail", visible: false, download: true, accessorDownload: (v, d) => d.portalLogin || "" },

			{
				title: "Company",
				field: "employedAt",
				//width: "23%",
				width: 230,
				headerFilter: "input",
				formatter: function(cell) {
					const d = cell.getRow().getData();
					const company = d.employedAt || "";
					const title = d.jobTitle || "";

					const titleHtml = title
						? `<div style="font-size:11px; color:#555;">${title}</div>`
						: "";

					return `<div>${company}${titleHtml}</div>`;
				},
				headerFilterFunc: function(headerValue, rowValue, rowData) {
					if (!headerValue) return true;
					const search = headerValue.toLowerCase();
					return (
						(rowData.employedAt || "").toLowerCase().includes(search) ||
						(rowData.jobTitle || "").toLowerCase().includes(search)
					);
				},
				accessorDownload: function(value, rowData) {
					return `${rowData.employedAt || ""} `; // (${rowData.jobTitle
					// || ""})
				},
			},
			{
				title: "Title", field: "exportTitle",
				visible: false, download: true, accessorDownload: (v, d) => d.jobTitle || ""
			},

			{
				title: "Applications",
				field: "hasRenewalAcs",
				hozAlign: "center",
				//width: "6%",
				width: 118,

				headerTooltip: "Applications",
				formatter: function(cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.applicationsTicketStatus;
					const hasAccess = cell.getValue();

					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: orange;" title="Pending Approval"><path fill="currentColor" d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"></path></svg>';
					} else {
						if (hasAccess === true) {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: green;"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
						} else {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" style="width: 14px; height: 14px; color: red;"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
						}
					}
				},
				cellMouseEnter: function(e, cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.applicationsTicketStatus;
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						cell.getElement().setAttribute("title", "Pending Approval - Click for details");
					} else {
						cell.getElement().setAttribute("title", "Click to edit permission");
					}
				},
				cellClick: function(e, cell) {
					e.preventDefault();
					e.stopPropagation();
					const rowData = cell.getRow().getData();
					const fullName = `${rowData.lastName || ""}, ${rowData.firstName || ""}`.trim();
					const ticketStatus = rowData.applicationsTicketStatus;

					// Check if this is a pending icon
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						alert(`Pending Approval: ${fullName}\nApplications request is currently pending.`);
						return;
					}
					const columnField = cell.getField();
					let permissionType = "";

					switch (columnField) {
						case "hasRenewalAcs": permissionType = "Applications"; break;
						case "hasPolicyAcs": permissionType = "Policies"; break;
						case "hasClaimsAcs": permissionType = "Claims"; break;
						case "combinedRiskAssessment": permissionType = "Risk Assessment"; break;
						case "eligibleForAegisNews": permissionType = "AEGIS News"; break;
						case "hasPHCInvitee": permissionType = "PHC Invitee"; break;
						default: permissionType = "Applications";
					}

					showModal(fullName, permissionType);
				}
			},
			// POLICIES COLUMN
			{
				title: "Policies",
				field: "hasPolicyAcs",
				hozAlign: "center",
				//width: "6%",
				width: 83,

				headerTooltip: "Policies",
				formatter: function(cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.policiesTicketStatus;
					const hasAccess = cell.getValue();

					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: orange;" title="Pending Approval"><path fill="currentColor" d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"></path></svg>';
					} else {
						if (hasAccess === true) {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: green;"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
						} else {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" style="width: 14px; height: 14px; color: red;"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
						}
					}
				},
				cellMouseEnter: function(e, cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.policiesTicketStatus;
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						cell.getElement().setAttribute("title", "Pending Approval - Click for details");
					} else {
						cell.getElement().setAttribute("title", "Click to edit permission");
					}
				},
				cellClick: function(e, cell) {
					e.preventDefault();
					e.stopPropagation();
					const rowData = cell.getRow().getData();
					const fullName = `${rowData.lastName || ""}, ${rowData.firstName || ""}`.trim();
					const ticketStatus = rowData.policiesTicketStatus;

					// Check if this is a pending icon
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						alert(`Pending Approval: ${fullName}\nPolicies request is currently pending.`);
						return;
					}
					const columnField = cell.getField();
					let permissionType = "";

					switch (columnField) {
						case "hasRenewalAcs": permissionType = "Applications"; break;
						case "hasPolicyAcs": permissionType = "Policies"; break;
						case "hasClaimsAcs": permissionType = "Claims"; break;
						case "combinedRiskAssessment": permissionType = "Risk Assessment"; break;
						case "eligibleForAegisNews": permissionType = "AEGIS News"; break;
						case "hasPHCInvitee": permissionType = "PHC Invitee"; break;
						default: permissionType = "Applications";
					}

					showModal(fullName, permissionType);
				}
			},

			// CLAIMS COLUMN - COMPLETE
			{
				title: "Claims",
				field: "hasClaimsAcs",
				hozAlign: "center",
				//width: "6%",
				width: 81,

				headerTooltip: "Claims",
				formatter: function(cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.claimsTicketStatus;
					const hasAccess = cell.getValue();

					// Check if ticket is PENDING
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						// Clock icon SVG
						return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: orange;" title="Pending Approval"><path fill="currentColor" d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"></path></svg>';
					} else {
						// Show tick or cross based on access
						if (hasAccess === true) {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: green;"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
						} else {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" style="width: 14px; height: 14px; color: red;"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
						}
					}
				},
				cellMouseEnter: function(e, cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.claimsTicketStatus;
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						cell.getElement().setAttribute("title", "Pending Approval - Click for details");
					} else {
						cell.getElement().setAttribute("title", "Click to edit permission");
					}
				},
				cellClick: function(e, cell) {
					e.preventDefault();
					e.stopPropagation();
					const rowData = cell.getRow().getData();
					const fullName = `${rowData.lastName || ""}, ${rowData.firstName || ""}`.trim();
					const ticketStatus = rowData.claimsTicketStatus;

					// Check if this is a pending icon
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						alert(`Pending Approval: ${fullName}\nClaims request is currently pending.`);
						return;
					}
					const columnField = cell.getField();
					let permissionType = "";

					// Switch statement to determine permission type
					switch (columnField) {
						case "hasRenewalAcs": permissionType = "Applications"; break;
						case "hasPolicyAcs": permissionType = "Policies"; break;
						case "hasClaimsAcs": permissionType = "Claims"; break;
						case "combinedRiskAssessment": permissionType = "Risk Assessment"; break;
						case "eligibleForAegisNews": permissionType = "AEGIS News"; break;
						case "hasPHCInvitee": permissionType = "PHC Invitee"; break;
						default: permissionType = "Applications";
					}

					// Call showModal with the permission type
					showModal(fullName, permissionType);
				}
			},

			// RISK ASSESSMENT COLUMN
			{
				title: "Risk Assessment",
				field: "combinedRiskAssessment",
				hozAlign: "center",
				//width: "6%",
				width: 142,

				headerTooltip: "Risk Assessment",
				formatter: function(cell) {
					const row = cell.getRow();
					const data = row.getData();

					// Get values from both columns
					const riskAssess = data.hasRiskAssessmentAcs;
					const eRiskAssess = data.hasERiskAssessmentAcs;
					const ticketStatus = data.riskAssessmentTicketStatus;

					// Check for pending ticket first
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						// Clock icon SVG
						return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: orange;" title="Pending Approval"><path fill="currentColor" d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"></path></svg>';
					}

					// Apply logic: tick if ANY is true
					const showTick = riskAssess === true || eRiskAssess === true;

					if (showTick === true) {
						return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: green;"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
					} else {
						return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" style="width: 14px; height: 14px; color: red;"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
					}
				},
				cellMouseEnter: function(e, cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.riskAssessmentTicketStatus;
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						cell.getElement().setAttribute("title", "Pending Approval - Click for details");
					} else {
						cell.getElement().setAttribute("title", "Click to edit permission");
					}
				},
				cellClick: function(e, cell) {
					e.preventDefault();
					e.stopPropagation();
					const rowData = cell.getRow().getData();
					const fullName = `${rowData.lastName || ""}, ${rowData.firstName || ""}`.trim();
					const ticketStatus = rowData.riskAssessmentTicketStatus;

					// Check if this is a pending icon
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						alert(`Pending Approval: ${fullName}\nRisk Assessment Request is currently pending.`);
						return;
					}
					const columnField = cell.getField();
					let permissionType = "";

					// Switch statement to determine permission type
					switch (columnField) {
						case "hasRenewalAcs": permissionType = "Applications"; break;
						case "hasPolicyAcs": permissionType = "Policies"; break;
						case "hasClaimsAcs": permissionType = "Claims"; break;
						case "combinedRiskAssessment": permissionType = "Risk Assessment"; break;
						case "eligibleForAegisNews": permissionType = "AEGIS News"; break;
						case "hasPHCInvitee": permissionType = "PHC Invitee"; break;
						default: permissionType = "Applications";
					}

					// Call showModal with the permission type
					showModal(fullName, permissionType);
				},
				accessorDownload: function(value, rowData) {
					const riskAssess = rowData.hasRiskAssessmentAcs;
					const eRiskAssess = rowData.hasERiskAssessmentAcs;
					var showTick = riskAssess === true || eRiskAssess === true;

					return showTick ? "TRUE" : "FALSE";
				}
			},

			// new column:AEGIS News

			{
				title: "AEGIS News",
				field: "eligibleForAegisNews",
				hozAlign: "center",
				//width: "6%",
				width: 114,

				headerTooltip: "AEGIS News",
				formatter: function(cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.aegisNewsTicketStatus;
					const hasAccess = cell.getValue();

					// Check if ticket is PENDING
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						// Clock icon SVG
						return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: orange;" title="Pending Approval"><path fill="currentColor" d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"></path></svg>';
					} else {
						// Show tick or cross based on access
						if (hasAccess === true) {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: green;"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
						} else {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" style="width: 14px; height: 14px; color: red;"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
						}
					}
				},
				cellMouseEnter: function(e, cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.aegisNewsTicketStatus;
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						cell.getElement().setAttribute("title", "Pending Approval - Click for details");
					} else {
						cell.getElement().setAttribute("title", "Click to edit permission");
					}
				},
				cellClick: function(e, cell) {
					e.preventDefault();
					e.stopPropagation();
					const rowData = cell.getRow().getData();
					const fullName = `${rowData.lastName || ""}, ${rowData.firstName || ""}`.trim();
					const ticketStatus = rowData.aegisNewsTicketStatus;

					// Check if this is a pending icon
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						alert(`Pending Approval: ${fullName}\nAEGIS News Request is currently pending.`);
						return;
					}
					const columnField = cell.getField();
					let permissionType = "";

					// Switch statement to determine permission type
					switch (columnField) {
						case "hasRenewalAcs": permissionType = "Applications"; break;
						case "hasPolicyAcs": permissionType = "Policies"; break;
						case "hasClaimsAcs": permissionType = "Claims"; break;
						case "combinedRiskAssessment": permissionType = "Risk Assessment"; break;
						case "eligibleForAegisNews": permissionType = "AEGIS News"; break;
						case "hasPHCInvitee": permissionType = "PHC Invitee"; break;
						default: permissionType = "Applications";
					}

					// Call showModal with the permission type
					showModal(fullName, permissionType);
				}
			},

			// NEW COLUMN: PHC Invitee

			{
				title: "PHC Invitee",
				field: "hasPHCInvitee",
				hozAlign: "center",
				//width: "6%",
				width: 111,

				headerTooltip: "PHC Invitee",
				formatter: function(cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.phcInviteeTicketStatus;
					const hasAccess = cell.getValue();

					// Check if ticket is PENDING
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						// Clock icon SVG
						return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" class="svg-inline--fa fa-clock fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: orange;" title="Pending Approval"><path fill="currentColor" d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"></path></svg>';
					} else {
						// Show tick or cross based on access
						if (hasAccess === true) {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; color: green;"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
						} else {
							return '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" style="width: 14px; height: 14px; color: red;"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
						}
					}
				},
				cellMouseEnter: function(e, cell) {
					const rowData = cell.getRow().getData();
					const ticketStatus = rowData.phcInviteeTicketStatus;
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						cell.getElement().setAttribute("title", "Pending Approval - Click for details");
					} else {
						cell.getElement().setAttribute("title", "Click to edit permission");
					}
				},
				cellClick: function(e, cell) {
					e.preventDefault();
					e.stopPropagation();
					const rowData = cell.getRow().getData();
					const fullName = `${rowData.lastName || ""}, ${rowData.firstName || ""}`.trim();
					const ticketStatus = rowData.phcInviteeTicketStatus;

					// Check if this is a pending icon
					if (ticketStatus === 'PENDING' || ticketStatus === 'New') {
						alert(`Pending Approval: ${fullName}\nPHC Invitee Request is currently pending.`);
						return;
					}
					const columnField = cell.getField();
					let permissionType = "";

					// Switch statement to determine permission type
					switch (columnField) {
						case "hasRenewalAcs": permissionType = "Applications"; break;
						case "hasPolicyAcs": permissionType = "Policies"; break;
						case "hasClaimsAcs": permissionType = "Claims"; break;
						case "combinedRiskAssessment": permissionType = "Risk Assessment"; break;
						case "eligibleForAegisNews": permissionType = "AEGIS News"; break;
						case "hasPHCInvitee": permissionType = "PHC Invitee"; break;
						default: permissionType = "Applications";
					}

					// Call showModal with the permission type
					showModal(fullName, permissionType);
				}
			},


			{
				title: "Last Login", field: "lastLogin", hozAlign: "center",
				//width: "6%",
				width: 101,

				formatter: function(cell) {
					const value = cell.getValue();
					if (!value) return "";
					// Ensure it's a string
					const str = String(value).trim();
					// If it contains space (e.g. "2017-06-15 06:30:55.0") →
					// take part before space
					if (str.includes(" ")) {
						return str.split(" ")[0];
					}

					// Otherwise, return as-is (already just a date)
					return str;
				},
				accessorDownload: function(value, rowData) {
					if (!value) return "";
					const str = String(value).trim();
					if (str.includes(" ")) {
						return str.split(" ")[0]; // keep only date part
					}
					return str;
				}
			},// sorter: "date",
			{
				title: "Actions",
				field: "actions",
				hozAlign: "center",
				width: 103,
				download: false,
				headerTooltip: "Actions",
				formatter: function(cell) {
					const data = cell.getRow().getData();
					const userEmail = data.portalLogin || '';
					const userId = data.personId || '';
					const email = data.portalLogin || '';
					const row = cell.getRow();


					if (!userId) return '';

					// Create button as DOM element for better event handling
					var button = document.createElement('button');
					button.type = 'button';
					button.style.background = '#e74c3c';
					button.style.color = 'white';
					button.style.border = 'none';
					button.style.borderRadius = '4px';
					button.style.padding = '5px 10px';
					button.style.cursor = 'pointer';
					button.style.fontSize = '12px';
					button.style.display = 'inline-flex';
					button.style.alignItems = 'center';
					button.style.gap = '5px';
					button.title = 'Deactivate User';

					// Add icon and text
					button.innerHTML = '<i class="fas fa-trash-alt" style="font-size: 12px;"></i> Deactivate';

					// Add click handler
					button.onclick = function(e) {
						e.stopPropagation();
						deleteUserAccess(email, email, row.getElement(), button);
					};

					// Wrap in div for centering
					var wrapper = document.createElement('div');
					wrapper.style.display = 'flex';
					wrapper.style.justifyContent = 'center';
					wrapper.appendChild(button);

					return wrapper;
				}
			},
		],
		rowFormatter(row) {
			const d = row.getData(), id = row.getIndex();
			const { wrapper: w1, tableEl: t1 } = createNested("Policy Access Details:", "nested-table-1");
			const { wrapper: w2, tableEl: t2 } = createNested("Applications Access Details:", "nested-table-2");

			row.getElement().appendChild(w1);
			row.getElement().appendChild(w2);

			if (Array.isArray(d.policiesModel) && d.policiesModel.length) {
				const sub = new Tabulator(t1, {
					layout: "fitColumns",
					data: d.policiesModel,
					columns: [
						{ title: "Role", field: "role", width: 150 },
						{ title: "Policy(s)", field: "permission", width: 200 },
					],
				});
				nestedTables.set(id + "-policies", sub);
			} else {
				w1.remove();
			}

			if (Array.isArray(d.olaModel) && d.olaModel.length) {
				const sub = new Tabulator(t2, {
					layout: "fitColumns",
					data: d.olaModel,
					columns: [
						{ title: "Role", field: "roleName", width: 150 },
						{ title: "LOB", field: "lobName", width: 200 },
					],
				});
				nestedTables.set(id + "-ola", sub);
			} else {
				w2.remove();
			}

			if (!nestedTables.has(id + "-policies") && !nestedTables.has(id + "-ola")) {
				const toggle = row.getCell("_toggle");
				if (toggle) toggle.getElement().style.visibility = "hidden";
			}
		},
	});

	function createNested(title, cls) {
		const wrapper = document.createElement("div");
		wrapper.classList.add("nested-container", cls);
		wrapper.style.display = "none";
		wrapper.style.padding = "8px 30px";
		wrapper.style.background = "#eee";

		const titleEl = document.createElement("div");
		titleEl.style.fontWeight = "bold";
		titleEl.textContent = title;

		const tableEl = document.createElement("div");
		tableEl.style.border = "1px solid #999";

		wrapper.appendChild(titleEl);
		wrapper.appendChild(tableEl);
		return { wrapper, tableEl };
	}
	// addPRMFilters(table);
	// --- helpers (put these before flattenData) ---
	function normalizeBool(v) {
		// keep as boolean if present, else blank
		if (v === true) return true;
		if (v === false) return false;
		return "";
	}

	// Get selected company name from dropdown for filename
	var companySelect = document.getElementById("companySelect");
	var selectedOption = companySelect.options[companySelect.selectedIndex];
	var companyName = selectedOption ? selectedOption.text : "PRM_Report";

	// Clean company name for filename (remove special characters)
	var safeCompanyName = companyName.replace(/[^a-z0-9]/gi, '_');

	// trigger download of data.xlsx file
	document.getElementById("download-xlsx").addEventListener("click", function(e) {
		e.preventDefault();
		table.download("xlsx", safeCompanyName + getCurDate() + ".xlsx", { sheetName: "PRM_Report" });
	});
	return table;

}


function deleteUserAccess(userId, email, rowElement, buttonElement) {
	if (!userId) {
		alert('Error: User ID not found');
		return;
	}

	if (!confirm('Deactivate user ' + email)) {
		return;
	}

	var originalHTML = buttonElement.innerHTML;
	buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size: 12px;"></i> Deactivating...';
	buttonElement.disabled = true;
	buttonElement.style.opacity = '0.6';
	buttonElement.style.cursor = 'wait';

	var ffInput = document.querySelector('input[name="_ff"]');
	var ffValue = ffInput ? ffInput.value : '';

	$.ajax({
		url: window.contextPath + "/my_aegis/prm_report/deactivate_user",
		type: 'POST',
		data: {
			userId: userId,
			_ff: ffValue
		},
		// NO dataType: 'json' — matches updatePermission pattern
		success: function(response) {
			// Manually parse if string, same safety net as updatePermission
			if (typeof response === 'string') {
				try {
					response = JSON.parse(response);
				} catch (e) {
					console.error("Response was not JSON:", response.substring(0, 300));
					alert('Error: Unexpected server response. Check console.');
					buttonElement.innerHTML = originalHTML;
					buttonElement.disabled = false;
					buttonElement.style.opacity = '1';
					buttonElement.style.cursor = 'pointer';
					buttonElement.style.background = '#e74c3c';
					return;
				}
			}

			if (response.success) {
				alert('User deactivated successfully');
				buttonElement.innerHTML = '<i class="fas fa-check" style="font-size: 12px;"></i> Deactivated';
				buttonElement.style.background = '#6c757d';
				buttonElement.style.cursor = 'default';
				buttonElement.disabled = true;
				buttonElement.style.opacity = '0.8';
				buttonElement.title = 'User deactivated';
				buttonElement.onclick = null;
			} else {
				alert('Error: ' + response.message);
				buttonElement.innerHTML = originalHTML;
				buttonElement.disabled = false;
				buttonElement.style.opacity = '1';
				buttonElement.style.cursor = 'pointer';
				buttonElement.style.background = '#e74c3c';
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("Error when deactivating user.");
			console.log(textStatus + ": " + errorThrown);
			console.log("Response:", jqXHR.responseText.substring(0, 300));
			alert('Error: Could not connect to server. Please try again.');
			buttonElement.innerHTML = originalHTML;
			buttonElement.disabled = false;
			buttonElement.style.opacity = '1';
			buttonElement.style.cursor = 'pointer';
			buttonElement.style.background = '#e74c3c';
		}
	});
}
// ============ MODAL FUNCTIONS ============

function closeModal() {
	var modal = document.getElementById('prmPermissionModal');
	if (modal) {
		modal.remove();
	}
}

function escapeHandler(e) {
	if (e.key === 'Escape') {
		closeModal();
	}
}

function showModal(userName, permissionType) {
	console.log("showModal called with:", userName, permissionType);

	// 1. Remove existing modal if any
	const existingModal = document.getElementById('prmPermissionModal');
	if (existingModal) {
		existingModal.remove();
	}

	// Get current row data from the table
	var table = Tabulator.findTable("#prmReportTable")[0];
	if (!table) {
		console.error("Table not found");
		return;
	}

	// Find the row by userName
	var rowData = null;
	var allRows = table.getRows();
	for (var i = 0; i < allRows.length; i++) {
		var row = allRows[i];
		var data = row.getData();
		var fullName = (data.lastName || "") + ", " + (data.firstName || "");
		if (fullName.trim() === userName.trim()) {
			rowData = data;
			break;
		}
	}

	if (!rowData) {
		console.error("Could not find row data for user:", userName);
		return;
	}

	var companyNumberInput = document.getElementById('companySelect');
	var companyNumber = companyNumberInput ? companyNumberInput.value : "";
	console.log("Company number retrieved:", companyNumber);

	// Determine current access status
	let currentStatus = false;
	switch (permissionType) {
		case 'Applications': currentStatus = rowData.hasRenewalAcs === true; break;
		case 'Policies': currentStatus = rowData.hasPolicyAcs === true; break;
		case 'Claims': currentStatus = rowData.hasClaimsAcs === true; break;
		case 'Risk Assessment':
			currentStatus = (rowData.hasRiskAssessmentAcs === true || rowData.hasERiskAssessmentAcs === true);
			break;
		case 'AEGIS News': currentStatus = rowData.hasAegisNews === true; break;
		case 'PHC Invitee': currentStatus = rowData.hasPHCInvitee === true; break;
		default: currentStatus = false;
	}

	// Prepare modal message
	let modalMessage = '';
	let checkboxLabel = '';

	if (currentStatus) {
		modalMessage = `${userName} currently has active access to ${permissionType}.`;
		checkboxLabel = 'Revoke access';
	} else {
		modalMessage = `${userName} currently does not have access to ${permissionType}.`;
		checkboxLabel = 'Grant access';
	}

	// Build modal HTML (same as before, but remove contextPath references)
	var modalHtml = `
	<div id="prmPermissionModal" class="prm-modal-overlay">
	    <div class="prm-modal-box">
	        
	        <h3 class="prm-modal-title">
	            <span class="prm-highlight">${permissionType}</span> Permission
	        </h3>

	        <div class="prm-modal-body">
	            <p class="prm-text">
	                ${modalMessage}<br><br>
	                <strong>Select checkbox and click Submit to ${currentStatus ? 'revoke' : 'grant'} access.</strong>
	            </p>

	            <div class="prm-checkbox-container">
	                <input type="checkbox" id="confirmCheckbox">
	                <label id="checkboxLabel" class="${currentStatus ? 'revoke' : 'grant'}">
	                    ${checkboxLabel}
	                </label>
	            </div>
	        </div>

	        <div id="messageArea" class="prm-message"></div>

	        <div class="prm-footer">
	            <button id="submitPermissionBtn" class="prm-btn submit ${currentStatus ? 'danger' : 'success'}" disabled>
	                Submit
	            </button>
	            <button id="cancelBtn" class="prm-btn cancel">Cancel</button>
	        </div>

	    </div>
	</div>
	`;

	// Insert modal
	document.body.insertAdjacentHTML('beforeend', modalHtml);

	// Setup event listeners
	const modal = document.getElementById('prmPermissionModal');
	const checkbox = document.getElementById('confirmCheckbox');
	const submitBtn = document.getElementById('submitPermissionBtn');
	const cancelBtn = document.getElementById('cancelBtn');

	cancelBtn.addEventListener('click', closeModal);

	checkbox.addEventListener('change', function() {
		submitBtn.disabled = !this.checked;
		//submitBtn.style.opacity = this.checked ? '1' : '0.6';
	});

	submitBtn.addEventListener('click', function() {
		if (!checkbox.checked) return;
		const action = currentStatus ? 'disable' : 'enable';
		updatePermission(rowData.portalLogin, permissionType, action, companyNumber);
	});

	modal.addEventListener('click', function(e) {
		if (e.target === modal) closeModal();
	});

	document.addEventListener('keydown', escapeHandler);
}


function updatePermission(memberAccount, applName, action, companyNumber) {
	var submitBtn = document.getElementById('submitPermissionBtn');
	var messageArea = document.getElementById('messageArea');
	var cancelBtn = document.getElementById('cancelBtn');
	var modalFooter = document.getElementById('modalFooter');
	var ffInput = document.querySelector('input[name="_ff"]');
	var ffValue = ffInput ? ffInput.value : '';



	submitBtn.disabled = true;
	submitBtn.style.opacity = '0.6';
	submitBtn.innerHTML = '<span class="loading-spinner"></span> Submitting...';
	messageArea.innerHTML = '';

	$.ajax({
		url: window.contextPath + "/my_aegis/prm_report/createMemberServicesTicket",
		type: 'POST',
		data: {
			memberAccount: memberAccount,
			applName: applName,
			action: action,
			companyNumber: companyNumber,
			_ff: ffValue
		},
		success: function(data) {
			if (data.status === 'success') {
				let ticketInfo = data.ticketNumber ? `<br><small><strong>Ticket #:</strong> ${data.ticketNumber}</small>` : '';
				messageArea.innerHTML = `<div class="modal-success"><strong>Success!</strong> ${data.message}${ticketInfo}</div>`;

				document.getElementById('confirmCheckbox').disabled = true;
				submitBtn.remove();
				cancelBtn.textContent = 'Close';
				cancelBtn.style.background = '#3498db';
				// Change cancel to close button
				cancelBtn.onclick = function() {
					var companySelect = document.getElementById('companySelect');
					var companyNumber = companySelect ? companySelect.value : '';

					// Reload the page with the expected parameter name 'selectedCompanyNumber'
					window.location.href = window.location.pathname + '?selectedCompanyNumber=' + encodeURIComponent(companyNumber) + '&_ff=' + encodeURIComponent(ffValue);
				};
			} else {
				messageArea.innerHTML = `<div class="modal-error"><strong>Error!</strong> ${data.message}</div>`;
				submitBtn.disabled = false;
				submitBtn.innerHTML = 'Submit';
				submitBtn.style.opacity = '1';
				submitBtn.style.background = (action === 'enable' ? '#27ae60' : '#e74c3c');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("Error when updating permission.");
			console.log(textStatus + ": " + errorThrown);
		}
	});
}
function getPermissionFieldName(permissionType) {
	switch (permissionType) {
		case 'Applications': return 'hasRenewalAcs';
		case 'Policies': return 'hasPolicyAcs';
		case 'Claims': return 'hasClaimsAcs';
		case 'Risk Assessment': return 'combinedRiskAssessment';
		case 'AEGIS News': return 'hasAegisNews';
		case 'PHC Invitee': return 'hasPHCInvitee';
		default: return null;
	}
}
