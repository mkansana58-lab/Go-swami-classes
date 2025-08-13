import { promises as fs } from 'fs';
import path from 'path';

export interface Module {
    id: string;
    title: string;
    topics: string[];
}

interface Content {
    modules: Module[];
}

const contentFilePath = path.join(process.cwd(), 'public', 'content.json');

async function readContentFile(): Promise<Content> {
    try {
        const fileContent = await fs.readFile(contentFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If file doesn't exist, return empty structure
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { modules: [] };
        }
        throw error;
    }
}

async function writeContentFile(content: Content): Promise<void> {
    await fs.writeFile(contentFilePath, JSON.stringify(content, null, 4), 'utf-8');
}

export async function getModules(): Promise<Content> {
    return await readContentFile();
}

export async function saveModule(newModule: Module): Promise<void> {
    const content = await readContentFile();
    
    const existingIndex = content.modules.findIndex(m => m.id === newModule.id);

    if (existingIndex > -1) {
        // Update existing module
        content.modules[existingIndex] = newModule;
    } else {
        // Add new module
        content.modules.push(newModule);
    }

    await writeContentFile(content);
}
