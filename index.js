const request = require("superagent");
const icsTool = require("ics");
const fs = require("fs");

const TEAM_ACRONYMS = {
    "Gen.G": "GEN",
    "T1": "T1",
    "Nongshim RedForce": "NS",
    "BRION": "BRO",
    "DN SOOPers": "DNS",
    "Dplus Kia": "DK",
    "BNK FEARX": "BFX",
    "KT Rolster": "KT",
    "DRX": "DRX",
    "Hanwha Life Esports": "HLE",
};

function getShortName(fullName) {
    // Return the acronym if found, otherwise return the original full name
    return TEAM_ACRONYMS[fullName] || fullName;
}

async function generateLCKCalendar() {
    const agent = request.agent();
    const API_URL = "https://lol.fandom.com/api.php";

    // 1. Credentials (using process.env for security)
    const USERNAME = process.env.LEAGUE_USER;
    const BOT_PASSWORD = process.env.LEAGUE_PASS;

    try {
        console.log("🔑 Logging in...");
        const tokenRes = await agent.get(API_URL).query({ action: "query", meta: "tokens", type: "login", format: "json" });
        const loginToken = tokenRes.body.query.tokens.logintoken;
        await agent.post(API_URL).type('form').send({ action: "login", lgname: USERNAME, lgpassword: BOT_PASSWORD, lgtoken: loginToken, format: "json" });

        console.log("🚀 Fetching LCK 2026 Schedule & Scores...");

        const queryParams = {
            action: "cargoquery",
            format: "json",
            tables: "MatchSchedule",
            fields: "Team1, Team2, Team1Score, Team2Score, DateTime_UTC, MatchId, ShownName, BestOf",
            where: "DateTime_UTC >= '2026-01-01' AND ShownName LIKE 'LCK%' AND ShownName NOT LIKE 'LCK CL%'",
            order_by: "DateTime_UTC ASC",
            limit: "200"
        };

        const response = await agent.get(API_URL).query(queryParams);

        // 1. Check if the API returned an error (like "Ratelimit exceeded" or "Login required")
        if (response.body.error) {
            console.error("❌ API Error:", response.body.error.info);
            return;
        }

        // 2. Look into the response structure
        const matches = response.body.cargoquery;

        if (!matches || !Array.isArray(matches)) {
            console.log("❌ No data found or invalid structure.");
            console.log("Full Response from API:", JSON.stringify(response.body, null, 2));
            return;
        }

        console.log(`✅ Found ${matches.length} matches. Processing...`);
        const events = matches.map(m => {
            try {
                const match = m.title;

                const rawDate = match["DateTime UTC"];
                const matchId = match["MatchId"];

                if (!rawDate || rawDate.trim() === "") {
                    console.warn(`⚠️ Skipping ${matchId}: Missing Date`);
                    return null;
                }

                const date = new Date(rawDate.replace(' ', 'T') + 'Z');

                // 2. CHECK IF DATE IS VALID: (e.g., not "Invalid Date")
                if (isNaN(date.getTime())) {
                    console.warn(`⚠️ Skipping match ${MatchId}: Invalid Date format (${rawDate})`);
                    return null;
                }

                const t1Short = getShortName(match.Team1);
                const t2Short = getShortName(match.Team2);

                let summary = `${t1Short} vs ${t2Short}`;

                if (match.Team1Score && match.Team2Score) {
                    summary += `    ${match.Team1Score} : ${match.Team2Score}`;
                }

                // 4. GENERATE START ARRAY
                const start = [
                    date.getUTCFullYear(),
                    date.getUTCMonth() + 1,
                    date.getUTCDate(),
                    date.getUTCHours(),
                    date.getUTCMinutes()
                ];

                const bestOf = parseInt(match.BestOf) || 3;

                return {
                    // MatchId ensures your phone updates the existing event instead of creating a new one
                    uid: `lck2026_${match.MatchId}`,
                    title: summary,
                    start: start,
                    duration: bestOf === 5 ? { hours: 3 } : { hours: 2 },
                    status: 'CONFIRMED',
                    // Alarm configuration (5 minutes before)
                    alarms: [
                        {
                            action: 'audio',
                            description: 'Reminder',
                            trigger: { minutes: 5, before: true },
                            repeat: 0,
                            attachType: 'VALUE=URI',
                            attach: 'Chord'
                        }
                    ]
                };
            } catch (err) {
                console.error("❌ Error processing individual match:", err);
                return null;
            }
        }).filter(e => e !== null);

        // 'productId' maps to the 'PRODID' in your example
        const { error, value } = icsTool.createEvents(events, {
            productId: 'LCK2026',
            calName: 'LCK2026'
        });

        if (error) throw error;

        fs.writeFileSync("./lck_2026.ics", value);
        console.log(`✅ Success! Updated ${events.length} matches.`);

    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

generateLCKCalendar();