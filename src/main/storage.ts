import { app } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { randomUUID } from 'crypto'

export interface StoredPrompt {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface PromptStore {
  version: number
  prompts: StoredPrompt[]
}

const filePath = join(app.getPath('userData'), 'prompts.json')
let cache: PromptStore = { version: 1, prompts: [] }

function flush(): void {
  writeFileSync(filePath, JSON.stringify(cache, null, 2), 'utf-8')
}

export function loadPrompts(): StoredPrompt[] {
  if (cache.prompts.length === 0 && existsSync(filePath)) {
    try {
      cache = JSON.parse(readFileSync(filePath, 'utf-8'))
    } catch {
      cache = { version: 1, prompts: [] }
    }
  }
  return cache.prompts
}

export function savePrompt(title: string, content: string): StoredPrompt {
  const now = new Date().toISOString()
  const prompt: StoredPrompt = {
    id: randomUUID(),
    title: title.slice(0, 60),
    content,
    createdAt: now,
    updatedAt: now,
  }
  cache.prompts.push(prompt)
  flush()
  return prompt
}

export function updatePrompt(
  id: string,
  fields: { title?: string; content?: string },
): StoredPrompt | null {
  const prompt = cache.prompts.find((p) => p.id === id)
  if (!prompt) return null
  if (fields.title !== undefined) prompt.title = fields.title.slice(0, 60)
  if (fields.content !== undefined) prompt.content = fields.content
  prompt.updatedAt = new Date().toISOString()
  flush()
  return prompt
}

export function deletePrompt(id: string): boolean {
  const idx = cache.prompts.findIndex((p) => p.id === id)
  if (idx === -1) return false
  cache.prompts.splice(idx, 1)
  flush()
  return true
}

export function getPrompt(id: string): StoredPrompt | null {
  return cache.prompts.find((p) => p.id === id) ?? null
}
