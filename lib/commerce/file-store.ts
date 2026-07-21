import { promises as fs } from "fs"
import path from "path"

/** Local-dev JSON store under ./data (not available on Vercel). */
export function commerceDataPath(filename: string): string {
  return path.join(process.cwd(), "data", filename)
}

export async function ensureJsonFile(filePath: string): Promise<void> {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, "[]", "utf-8")
  }
}

export async function readJsonArray<T>(filePath: string): Promise<T[]> {
  await ensureJsonFile(filePath)
  const raw = await fs.readFile(filePath, "utf-8")
  return JSON.parse(raw) as T[]
}

export async function writeJsonArray<T>(
  filePath: string,
  rows: T[],
): Promise<void> {
  await ensureJsonFile(filePath)
  await fs.writeFile(filePath, JSON.stringify(rows, null, 2), "utf-8")
}
