const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../../DA');
const DEST_NOTEBOOKS_DIR = path.join(__dirname, '../public/notebooks');
const DATA_DIR = path.join(__dirname, '../src/data');
const STRUCTURE_FILE = path.join(DATA_DIR, 'course-structure.json');

// Ensure directories exist
if (!fs.existsSync(DEST_NOTEBOOKS_DIR)) {
    fs.mkdirSync(DEST_NOTEBOOKS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function syncContent() {
    console.log('Scanning source directory:', SOURCE_DIR);

    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`Source directory not found: ${SOURCE_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(SOURCE_DIR);
    const sprints = new Map();

    // Regex to match: SprintX_WebinarY_Title.ipynb
    // Example: Sprint1_Webinar01_Teorico.ipynb
    const regex = /^Sprint(\d+)_Webinar(\d+)_(.+)\.ipynb$/i;

    files.forEach(file => {
        const match = file.match(regex);
        if (match) {
            const isSprint7 = match[1] === '7'; // Special case based on user file list (Sprint 7 exists)
            const sprintNum = parseInt(match[1], 10);
            const webinarNum = parseInt(match[2], 10);
            const titleRaw = match[3]; // "Teorico", "Practico", etc.

            // Clean up title (replace underscores with spaces, Title Case)
            const title = titleRaw.replace(/_/g, ' ').replace(/\./g, '');

            const sprintId = `sprint-${sprintNum}`;

            if (!sprints.has(sprintId)) {
                sprints.set(sprintId, {
                    id: sprintId,
                    number: sprintNum,
                    title: `Sprint ${sprintNum}`,
                    webinars: []
                });
            }

            const sprint = sprints.get(sprintId);

            // Copy file to public
            const sourcePath = path.join(SOURCE_DIR, file);
            const destPath = path.join(DEST_NOTEBOOKS_DIR, file);

            // Only copy if modified or doesn't exist to save IO
            // Actually for build, better to just copy or use copyFileSync
            try {
                fs.copyFileSync(sourcePath, destPath);
                console.log(`Copied: ${file}`);
            } catch (err) {
                console.error(`Error copying ${file}:`, err);
            }

            sprint.webinars.push({
                id: `webinar-${webinarNum}`,
                number: webinarNum,
                title: title,
                filename: file,
                type: title.toLowerCase().includes('practico') ? 'Practical' : 'Theoretical'
            });
        }
    });

    // Convert map to array and sort
    const sortedSprints = Array.from(sprints.values()).sort((a, b) => a.number - b.number);

    // Sort webinars within sprints
    sortedSprints.forEach(sprint => {
        sprint.webinars.sort((a, b) => a.number - b.number);
    });

    // Write structure file
    fs.writeFileSync(STRUCTURE_FILE, JSON.stringify(sortedSprints, null, 2));
    console.log(`Generated course structure with ${sortedSprints.length} sprints.`);
}

syncContent();
