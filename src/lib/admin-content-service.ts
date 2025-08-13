import { promises as fs } from 'fs';
import path from 'path';

// For Admin-created content
export interface AdminModule {
    id: string;
    title: string;
    topics: string[];
}

interface AdminContent {
    modules: AdminModule[];
}

const adminContentFilePath = path.join(process.cwd(), 'public', 'admin-content.json');

async function readAdminContentFile(): Promise<AdminContent> {
    try {
        const fileContent = await fs.readFile(adminContentFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If file doesn't exist, return empty structure
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { modules: [] };
        }
        throw error;
    }
}

async function writeAdminContentFile(content: AdminContent): Promise<void> {
    await fs.writeFile(adminContentFilePath, JSON.stringify(content, null, 4), 'utf-8');
}

export async function getModules(): Promise<AdminContent> {
    return await readAdminContentFile();
}

export async function saveModule(newModule: AdminModule): Promise<void> {
    const content = await readAdminContentFile();
    
    const existingIndex = content.modules.findIndex(m => m.id === newModule.id);

    if (existingIndex > -1) {
        content.modules[existingIndex] = newModule;
    } else {
        content.modules.push(newModule);
    }

    await writeAdminContentFile(content);
}
