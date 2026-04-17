<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>

<%@ page isELIgnored="false"%>
 
<script src="js/policyViewer.js"></script>
<script src="js/tabulator.js"></script>

<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/tabulator.css">
 
<!-- XLSX export module (must be after tabulator.min.js) -->
<!-- <script
	src="https://unpkg.com/tabulator-tables@5.5.0/dist/js/modules/export.min.js"></script> -->
 
<!-- REQUIRED for XLSX export -->
<script	src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script	src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script	src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
<script	src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
 

 
 
 
 
 
 
 
 
<div class="card">
<div class="card-body">
<form method="get"
			action="${pageContext.request.contextPath}/my_aegis/prm_report"
			id="myCompanyForm">
<input type="hidden" name="view" /> <input type="hidden" name="_ff"
				value="<%=request.getParameter("_ff")%>" /> <input type="hidden"
				name="selectedCompanyNumber" id="selectedCompanyNumber" />
 
			<!-- Store JSON safely -->
<script id="jsonDataField" type="application/json">
{
  "companies":[
    {
      "newCompNo":"1001",
      "companyName":"Altec, Inc."
    }
  ],

  "companyDetail":{
    "companyId":"1001",
    "companyName":"Altec, Inc."
  },

  "report":[
    {
      "firstName":"Robert",
      "lastName":"Hunter",
      "portalLogin":"rob.hunter@altec.com",
      "registrationType":"AEGIS Registered",
      "jobTitle":"General Counsel",
      "employedAt":"Altec Industries, Inc.",
      "lastLogin":"N/A",

      "hasRenewalAcs":false,
      "hasPolicyAcs":true,
      "hasClaimsAcs":true,
      "hasRiskAssessmentAcs":false,
      "hasERiskAssessmentAcs":false,

      "policiesModel":[
        {"role":"Admin","permission":"All Policies"}
      ],

      "olaModel":[
        {"roleName":"User","lobName":"Renewal"}
      ]
    }
  ]
}
</script>

 
			<!-- Dropdown -->
<select id="companySelect" name="selectedCompanyNumber">
<option class="option-ellipsis" value="">Select</option>
</select>
	<!-- Single company display -->
	<span id="singleCompanyLabel" class="single-company-label"></span>
 
<div class="float-right">
    <button type="button" id="add-user-btn" onclick="openAddUserModal()">Add User</button> 
    <button type="button" id="download-pdf">Download PDF</button>
    <button type="button" id="download-xlsx">Download Excel</button>
</div>
 
			<!-- Report Table -->
<div id="results">
<!--loader div -->
<div id="prmLoader" class="prm-loader">
<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
<circle cx="18" cy="18" r="14" fill="none" stroke="#e0e0e0" stroke-width="3"/>
<circle cx="18" cy="18" r="14" fill="none" stroke="#3498db" stroke-width="3"
            stroke-dasharray="44 44"
            stroke-linecap="round"
            transform="rotate(-90 18 18)">
<animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="0.9s"
                repeatCount="indefinite"/>
</circle>
</svg>
<div class="prm-loader-text">Loading report, please wait...</div>
</div>
<div id="prmReportTable" class="hidden"></div>
</div>

<!-- Add User Modal -->
<div id="addUserModal" class="prm-modal-overlay">
<div class="prm-modal-content modal-container">
 
    <!-- ZONE 1: Header always visible -->
<div class="modal-header">
    <span class="modal-close" onclick="closeAddUserModal()">&times;</span>
    <h2 class="modal-title">Add User</h2>
</div>
 
    <!-- ZONE 2: Body scrolls independently, alerts live here -->
<div class="modal-body">
    <div class="modal-error hidden mb-12" id="add-user-error"></div>
    <div class="modal-success hidden mb-12" id="add-user-success"></div>
 
      <div class="form-group">
<label>First Name</label>
<input type="text" class="form-control" id="au-first-name" placeholder="First name">
</div>
<div class="form-group">
<label>Last Name</label>
<input type="text" class="form-control" id="au-last-name" placeholder="Last name">
</div>
<div class="form-group">
<label>Email</label>
<input type="email" class="form-control" id="au-email" placeholder="E-mail">
</div>
<div class="form-group">
<label>Confirm Email</label>
<input type="email" class="form-control" id="au-confirm-email" placeholder="Confirm E-mail">
</div>
<div class="form-group">
<label>Title</label>
<input type="text" class="form-control" id="au-title" placeholder="Title">
</div>
<div class="form-group">
<label>Access</label>
<div>
<label><input type="checkbox" name="access" value="Applications"> Applications</label>
<label><input type="checkbox" name="access" value="Policies"> Policies</label>
<label><input type="checkbox" name="access" value="Claims"> Claims</label>
<label><input type="checkbox" name="access" value="MRA"> MRA</label>
<label><input type="checkbox" name="access" value="My eRisk Assessment"> My eRisk Assessment</label>
<label><input type="checkbox" name="access" value="AEGIS News"> AEGIS News</label>
<label><input type="checkbox" name="access" value="PHC Invite"> PHC Invite</label>
</div>
</div>
<input type="hidden" id="au-group-name" value="DEFAULT_GROUP">
</div><!-- /body -->
 
  <!-- ZONE 3: Footer pinned at bottom, always visible -->
<div class="modal-footer">

    <button type="button" id="au-submit-btn"
            class="btn-primary"
            onclick="submitAddUser()">
        Submit
    </button>

    <button type="button" id="au-cancel-btn"
            class="btn-secondary"
            onclick="closeAddUserModal()">
        Cancel
    </button>

</div>
 
  </div>
</div>
</form>
</div>
</div>
 
<c:if test="${prmCompanyForm.view eq 'adminTool'}">
<div>
<a
			href="<%=request.getContextPath()%>/my_aegis/portal_admin/company_list?_ff=<%=request.getParameter("_ff")%>">Return
			to Company List</a>
</div>
</c:if>
 
 
<script>
// Define context path at the top
window.contextPath = "<%=request.getContextPath()%>";
 
// Store JSON data globally for modal functions to access
window.jsonDataFieldContent = null;
 
document.addEventListener("DOMContentLoaded", function () {
    // 1. Get JSON from server and store it globally
    const jsonElement = document.getElementById("jsonDataField");
    if (jsonElement) {
        window.jsonDataFieldContent = jsonElement.textContent;
    }
    const raw = window.jsonDataFieldContent ? window.jsonDataFieldContent.trim() : "";
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        console.error("Invalid JSON:", e);
        return;
    }
 
    const companies = parsed.companies || [];
    const companyDetail = parsed.companyDetail || null; 
    const reportData = parsed.report || [];
 
   /*  // Populate dropdown
    const select = document.getElementById("companySelect");
    // 2. Parse JSON data
    // Contains: companies[], companyDetail{}, report[] (user data)
    // 3. Populate company dropdown
    select.innerHTML = '<option value="">Select</option>';
    companies.forEach(function(c) {
        const opt = document.createElement("option");
        opt.value = c.newCompNo;
        opt.textContent = c.companyName;
        if (companyDetail && c.newCompNo === companyDetail.companyId) opt.selected = true;
        select.appendChild(opt);
    }); */
// Populate dropdown
    const select = document.getElementById("companySelect");
    select.innerHTML = '';
 
    if (companies.length === 1) {
        // Hide the dropdown, show company name as subheading text
        document.getElementById("companySelect").style.display = "none";
        const label = document.getElementById("singleCompanyLabel");
        label.textContent = companies[0].companyName;
        label.style.display = "inline-block";
 
        // Auto-submit to load the report if not already loaded
        if (!companyDetail || !companyDetail.companyId) {
            document.getElementById("selectedCompanyNumber").value = companies[0].newCompNo;
            document.getElementById("myCompanyForm").submit();
        }
    } else {
        // Multiple companies - show the Select prompt and full list
        select.innerHTML = '<option value="">Select</option>';
        companies.forEach(function(c) {
            const opt = document.createElement("option");
            opt.value = c.newCompNo;
            opt.textContent = c.companyName;
            if (companyDetail && c.newCompNo === companyDetail.companyId) opt.selected = true;
            select.appendChild(opt);
        });
    }
 
    // Show details & table only if a company is selectedf
    // 4. If company already selected, show table
if (companyDetail && companyDetail.companyId) {

	console.log("companyDetail:", companyDetail);
	console.log("reportData:", reportData);
    const results = document.getElementById("results");
    const loader = document.getElementById("prmLoader");
    const table = document.getElementById("prmReportTable");
    const addBtn = document.getElementById("add-user-btn");
    const pdfBtn = document.getElementById("download-pdf");
    const xlsxBtn = document.getElementById("download-xlsx");

    results.classList.remove("hidden");

    console.log("reportData.length==" + reportData.length);

    if (reportData.length) {
        initializePRMReportTable(reportData);

        loader.classList.add("hidden");
        table.classList.remove("hidden");

        addBtn.classList.remove("hidden");
        addBtn.classList.add("show-inline");

        pdfBtn.classList.remove("hidden");
        pdfBtn.classList.add("show-inline");

        xlsxBtn.classList.remove("hidden");
        xlsxBtn.classList.add("show-inline");
    }
}
 
    // On dropdown change
select.addEventListener("change", function() {

    const newVal = select.value;

    const results = document.getElementById("results");
    const loader = document.getElementById("prmLoader");
    const table = document.getElementById("prmReportTable");
    const pdfBtn = document.getElementById("download-pdf");
    const xlsxBtn = document.getElementById("download-xlsx");

    if (!newVal){
        pdfBtn.classList.add("hidden");
        xlsxBtn.classList.add("hidden");
        return;
    }

    // Show loader before submit
    results.classList.remove("hidden");

    loader.classList.remove("hidden");     // show loader
    table.classList.add("hidden");         // hide table

    pdfBtn.classList.add("hidden");
    xlsxBtn.classList.add("hidden");

    document.getElementById("selectedCompanyNumber").value = newVal;
    document.getElementById("myCompanyForm").submit();
});
});
 
// ============ MODAL FUNCTIONS ============
 
 
// ============ PDF Generation Function ============
 
function buildReportHTML(companyDetail, reportData) {
    var html = '';

    html += '<div id="report-container" style="background:white; padding:8px; font-family:Arial; font-size:11px;">';

    html += '<style>';
    html += 'h2 { margin-bottom:6px; color:#333; font-size:16px; margin-left:20px; }';
    html += '.info-table { width:95%; margin-left:20px; border-collapse:collapse; font-size:9px; }';
    html += '.tick { color:green; font-weight:bold; }';
    html += '.cross { color:red; font-weight:bold; }';
    html += '</style>';

    html += '<h2>PRM Report</h2>';

    reportData.forEach(function(user) {
        var fullName = (user.lastName || "") + ', ' + (user.firstName || "");

        html += '<table class="info-table">';
        html += '<tr>';
        html += '<td><b>Name:</b> ' + fullName + '</td>';
        html += '<td><b>Applications:</b> ' + (user.hasRenewalAcs ? '✔' : '✖') + '</td>';
        html += '</tr>';

        html += '<tr>';
        html += '<td><b>Email:</b> ' + (user.portalLogin || "") + '</td>';
        html += '<td><b>Policies:</b> ' + (user.hasPolicyAcs ? '✔' : '✖') + '</td>';
        html += '</tr>';

        html += '</table><br/>';
    });

    html += '</div>';

    return html;
}
 
// ============ Event Listeners ============
 
document.getElementById("download-pdf").addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
 
    var raw = document.getElementById("jsonDataField").textContent.trim();
    var parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (err) {
        alert("Invalid JSON");
        return;
    }
 
    var companyDetail = parsed.companyDetail || {};
    var reportData = parsed.report || [];
    // Get selected company name from dropdown for filename
    var companySelect = document.getElementById("companySelect");
    var selectedOption = companySelect.options[companySelect.selectedIndex];
    var companyName = selectedOption ? selectedOption.text : "PRM_Report";
    // Clean company name for filename (remove special characters)
    var safeCompanyName = companyName.replace(/[^a-z0-9]/gi, '_');
 
    var tempDiv = document.createElement("div");
    tempDiv.style.position = "fixed";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "0";
    tempDiv.innerHTML = buildReportHTML(companyDetail, reportData);
    document.body.appendChild(tempDiv);
 
    var element = tempDiv.querySelector("#report-container");
 
    setTimeout(function() {
        var opt = {
            margin: 0.5,
            //filename: "PRM_Report.pdf",
          	filename: safeCompanyName +getCurDate() + ".pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };
 
        html2pdf().set(opt).from(element).save().then(function() {
            document.body.removeChild(tempDiv);
        });
    }, 300);
});
 
//For Add User Modal
function openAddUserModal() {
    // Reset all fields
    ["au-first-name","au-last-name","au-email","au-confirm-email","au-title"]
        .forEach(function(id) { document.getElementById(id).value = ""; });
    document.querySelectorAll("input[name='access']")
            .forEach(function(cb) { cb.checked = false; });
 
    // Reset alerts
    var errDiv = document.getElementById("add-user-error");
    var sucDiv = document.getElementById("add-user-success");
    errDiv.style.display = "none"; errDiv.textContent = "";
    sucDiv.style.display = "none"; sucDiv.textContent = "";
 
    // Reset submit button
    var submitBtn = document.getElementById("au-submit-btn");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
    submitBtn.style.background = "#2980b9";
 
    // Reset cancel button text
    document.getElementById("au-cancel-btn").textContent = "Cancel";
 
    document.getElementById("addUserModal").style.display = "flex";
}
 
function closeAddUserModal() {
    document.getElementById("addUserModal").style.display = "none";
}
window.addEventListener("click", function(e) {
    var modal = document.getElementById("addUserModal");
    if (e.target === modal) closeAddUserModal();
});
 
function submitAddUser() {
    var firstName    = document.getElementById("au-first-name").value.trim();
    var lastName     = document.getElementById("au-last-name").value.trim();
    var email        = document.getElementById("au-email").value.trim().toLowerCase();
    var confirmEmail = document.getElementById("au-confirm-email").value.trim().toLowerCase();
    var title        = document.getElementById("au-title").value.trim();
    var errDiv       = document.getElementById("add-user-error");      // Changed to errDiv
    var sucDiv       = document.getElementById("add-user-success");   // Changed to sucDiv
 
    errDiv.style.display = "none";
    sucDiv.style.display = "none";
 
    // Disable submit button to prevent duplicate submissions while processing
    var submitBtn = document.getElementById("au-submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
 
    // Basic validations
    if (!firstName || !lastName || !email || !confirmEmail || !title) {
        errDiv.textContent = "All fields are required.";
        errDiv.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
        return;
    }
    if (email !== confirmEmail) {
        errDiv.textContent = "Email addresses do not match.";
        errDiv.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
        return;
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errDiv.textContent = "Please enter a valid email address.";
        errDiv.style.display = "block";
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
        return;
    }
 
    // Get selected access checkboxes
    var accessChecked = [];
    document.querySelectorAll("input[name='access']:checked").forEach(function(cb) {
        accessChecked.push(cb.value);
    });
 
    // Get company info from current page JSON
    var raw = document.getElementById("jsonDataField").textContent.trim();
    var parsed = JSON.parse(raw);
    var companyDetail = parsed.companyDetail || {};
    var companyNumber = companyDetail.companyId || "";
    var companyName   = companyDetail.companyName || "";
    var _ff = document.querySelector("input[name='_ff']").value;
 
    // Build description as name-value pairs
    var description =
        "First Name: " + firstName + "\n" +
        "Last Name: "  + lastName  + "\n" +
        "Email: "      + email     + "\n" +
        "Title: "      + title     + "\n" +
        "Access: "     + (accessChecked.length ? accessChecked.join(", ") : "None") + "\n" +
        "Company: "    + companyNumber + "\n" +
        "Requested at: " + new Date().toISOString();
    console.log(description);
 
    // Call backend to validate domain, check existing user, then create ticket
    fetch(window.contextPath + "/my_aegis/prm_report/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            firstName:     firstName,
            lastName:      lastName,
            email:         email,
            title:         title,
            access:        accessChecked.join(","),
            companyNumber: companyNumber,
            companyName:   companyName,
            description:   description,
            _ff:           _ff
        })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
        if (data.status === "success") {
            // Hide error if any
            errDiv.style.display = "none";
 
            // Show success message with ticket number
            var ticketNumber = data.ticketNumber || "";
            sucDiv.innerHTML = ticketNumber
                ? "Request submitted successfully. Ticket #: <strong>" + ticketNumber + "</strong>"
                : (data.message || "Request submitted successfully.");
            sucDiv.style.display = "block";
 
            // Scroll body back to top so alert is visible
            var modalBody = document.querySelector("#addUserModal .au-modal-body") 
                         || document.querySelector("#addUserModal [style*='overflow-y']");
            if (modalBody) modalBody.scrollTop = 0;
 
            submitBtn.textContent = "Submitted";
            submitBtn.disabled = true;
            submitBtn.style.background = "#27ae60";
 
            // Change Cancel to Close
            document.getElementById("au-cancel-btn").textContent = "Close";
        } else if (data.status === "error") {
            // Hide success if any
            sucDiv.style.display = "none";
 
            // Show error message
            errDiv.textContent = data.message || "An error occurred.";
            errDiv.style.display = "block";
            // Re-enable submit button on error so user can try again
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
        }
    })
    .catch(function(err) {                        
        sucDiv.style.display = "none";
        errDiv.textContent = "Network error: " + err.message;
        errDiv.style.display = "block";
        // Re-enable submit button on error
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
    });
}
/* document.getElementById("download-xlsx").addEventListener("click", function(e){
    e.preventDefault();
    var table = Tabulator.findTable("#prmReportTable")[0];
    if (table) {
        var date = new Date().toISOString().split('T')[0];
        table.download("xlsx", "PRM_Report_" + date + ".xlsx", {sheetName: "PRM_Report"});
    }
}); */
</script>