import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { ResumeEntry } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "resumes.json");

async function readAll(): Promise<ResumeEntry[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as ResumeEntry[];
  } catch {
    return [];
  }
}

async function writeAll(entries: ResumeEntry[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function listResumes(): Promise<ResumeEntry[]> {
  return readAll();
}

export async function saveResume(
  entry: Pick<ResumeEntry, "name" | "text"> & { id?: string }
): Promise<ResumeEntry> {
  const entries = await readAll();
  const updatedAt = new Date().toISOString();

  if (entry.id) {
    const idx = entries.findIndex((e) => e.id === entry.id);
    if (idx >= 0) {
      entries[idx] = { ...entries[idx], name: entry.name, text: entry.text, updatedAt };
      await writeAll(entries);
      return entries[idx];
    }
  }

  const created: ResumeEntry = {
    id: crypto.randomUUID(),
    name: entry.name,
    text: entry.text,
    updatedAt,
  };
  entries.push(created);
  await writeAll(entries);
  return created;
}

export async function deleteResume(id: string): Promise<void> {
  const entries = await readAll();
  await writeAll(entries.filter((e) => e.id !== id));
}
