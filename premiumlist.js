// =================== PREMIUM LIST ===================
const PREMIUM_USERS = [
    "123456789",
    "987654321",
    "555444222",
    "7979664801",
    "6976365864",
    "1687251080",
    "6853136424",
    "6551769849",
    "7593407632",
    "7821615443",
    "7821615443",
    "6693705429",
    "6391087192",
    "7457769202",

    // one week people
    "8330656816", // exp Dec 14 2025
    "560614543",  // exp Dec 12 2025
    "7634974917", // exp Dec 10 2025
    "7436021331", // exp Dec 11 2025
];

// =================== GET TELEGRAM ID FROM URL ===================
function getTelegramID() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // ?id=123456
}

// =================== CHECK PREMIUM ACCESS ===================
function verifyPremium() {
    const tgID = getTelegramID();

    // If no ?id= found → block immediately
    if (!tgID) {
        deny("No Telegram ID provided in URL.");
        return;
    }

    // If telegram id not in our PREMIUM_USERS list
    if (!PREMIUM_USERS.includes(tgID)) {
        deny("Your Telegram ID is not Premium.");
        return;
    }

    console.log("✔ Premium Access Granted:", tgID);
}

// =================== DENY ACCESS ===================
function deny(message) {
    // Hide entire page
    document.body.innerHTML = `
        <div style="
            font-family:Arial;
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            text-align:center;
            padding:20px;
        ">
            <div style="
                background:#fff;
                padding:25px;
                border-radius:12px;
                box-shadow:0 4px 14px rgba(0,0,0,0.1);
                max-width:320px;
            ">
                <h2 style="color:#dc3545">Access Denied</h2>
                <p>${message}</p>

                <p style="font-size:12px;color:#555">You need Premium access.</p>

                <a href="https://wa.me/2348121697423?text=Hello%20Admin,%20I%20want%20to%20get%20Premium%20Access."
                   style="
                       display:inline-block;
                       margin-top:10px;
                       background:#25D366;
                       color:#fff;
                       padding:10px 15px;
                       border-radius:6px;
                       text-decoration:none;
                       font-weight:bold;
                   ">
                    Message Admin on WhatsApp
                </a>

            </div>
        </div>
    `;
}
 
// Run check when page loads
verifyPremium();