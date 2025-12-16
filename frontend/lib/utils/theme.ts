"use server"

import fs from "fs/promises"
import path from "path"

const STYLE_DIR = path.join(process.cwd(), "public/style")
const GLOBALS_CSS_PATH = path.join(process.cwd(), "app/globals.css")

export interface Theme {
  id: string
  name: string
  colors: {
    background: string
    primary: string
    sidebar: string
  }
}

export async function getThemes(): Promise<Theme[]> {
  try {
    const files = await fs.readdir(STYLE_DIR)
    const themes = await Promise.all(files
      .filter((file) => file.endsWith(".css"))
      .map(async (file) => {
        const name = file === "default.css"
          ? "Default"
          : file
            .replace(".css", "")
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

        const content = await fs.readFile(path.join(STYLE_DIR, file), "utf-8")
        const bgMatch = content.match(/--background:\s*([^;]+)/)
        const primaryMatch = content.match(/--primary:\s*([^;]+)/)
        const sidebarMatch = content.match(/--sidebar:\s*([^;]+)/)

        return {
          id: file,
          name: name,
          colors: {
            background: bgMatch ? bgMatch[1].trim() : "transparent",
            primary: primaryMatch ? primaryMatch[1].trim() : "transparent",
            sidebar: sidebarMatch ? sidebarMatch[1].trim() : "transparent",
          }
        }
      }))

    return themes.sort((a, b) => {
      if (a.id === "default.css") return -1
      if (b.id === "default.css") return 1
      return a.name.localeCompare(b.name)
    })
  } catch (error) {
    console.error("Failed to list themes:", error)
    return []
  }
}

export async function getCurrentThemeId(): Promise<string | null> {
  try {
    const content = await fs.readFile(GLOBALS_CSS_PATH, "utf-8")
    const match = content.match(/\/\* THEME_ID: (.+?) \*\//)
    return match ? match[1] : null
  } catch {
    return null
  }
}

export async function setTheme(themeId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (themeId.includes("..") || themeId.includes("/") || themeId.includes("\\")) {
      return { success: false, error: "Invalid theme ID" }
    }

    const themePath = path.join(STYLE_DIR, themeId)

    try {
      await fs.access(themePath)
    } catch {
      return { success: false, error: "Theme file not found" }
    }

    let content = await fs.readFile(themePath, "utf-8")

    content = `/* THEME_ID: ${ themeId } */\n` + content

    await fs.writeFile(GLOBALS_CSS_PATH, content, "utf-8")
    return { success: true }
  } catch (error) {
    console.error("Failed to set theme:", error)
    return { success: false, error: "Failed to update theme" }
  }
}
