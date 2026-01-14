import fs from 'fs';
import path from 'path';

const articlesDirectory = path.join(process.cwd(), 'src/content/articles');

export function getSortedArticlesData() {
    if (!fs.existsSync(articlesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticlesData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Simple frontmatter parsing (regex)
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = frontmatterRegex.exec(fileContents);
        let frontmatter: any = {};

        if (match) {
            const frontmatterBlock = match[1];
            frontmatterBlock.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length > 0) {
                    frontmatter[key.trim()] = valueParts.join(':').trim();
                }
            });
        }

        return {
            id,
            ...frontmatter,
        };
    });

    return allArticlesData.sort((a: any, b: any) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getArticleData(id: string) {
    const fullPath = path.join(articlesDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Simple frontmatter parsing
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = frontmatterRegex.exec(fileContents);

    let frontmatter: any = {};
    let content = fileContents;

    if (match) {
        const frontmatterBlock = match[1];
        content = match[2];

        frontmatterBlock.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                frontmatter[key.trim()] = valueParts.join(':').trim();
            }
        });
    }

    return {
        id,
        content,
        ...frontmatter,
    };
}
