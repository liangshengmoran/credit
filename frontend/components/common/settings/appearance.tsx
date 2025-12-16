"use client"

import * as React from "react"
import Link from "next/link"
import { Moon, Sun, Loader2, Check, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getThemes, setTheme, getCurrentThemeId, type Theme } from "@/lib/utils/theme"
import { cn } from "@/lib/utils"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

function ThemeModeSection() {
  const { theme, setTheme } = useTheme()

  const modes = [
    { id: "light", name: "明亮", icon: Sun },
    { id: "dark", name: "黑暗", icon: Moon },
    { id: "system", name: "自动", icon: Monitor }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-medium text-sm text-muted-foreground">主题模式</h2>
        <p className="text-xs text-muted-foreground">
          选择应用程序的整体明暗主题
        </p>
      </div>

      <div className="flex gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isActive = theme === mode.id

          return (
            <Button
              key={mode.id}
              variant={isActive ? "default" : "secondary"}
              size="sm"
              onClick={() => setTheme(mode.id)}
              className="flex-1 text-xs"
            >
              {Icon && <Icon className="size-3 mr-1" />}
              {mode.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

function InterfaceAppearanceSection() {
  const [themes, setThemes] = React.useState<Theme[]>([])
  const [currentThemeId, setCurrentThemeId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [switching, setSwitching] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function load() {
      try {
        const [t, c] = await Promise.all([getThemes(), getCurrentThemeId()])
        setThemes(t)
        setCurrentThemeId(c)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSetTheme = async (theme: Theme) => {
    if (switching === theme.id) return
    setSwitching(theme.id)
    try {
      const res = await setTheme(theme.id)
      if (res.success) {
        setCurrentThemeId(theme.id)
        toast.success(`外观已切换为 ${ theme.name }`)
      } else {
        toast.error(res.error || "切换失败")
      }
    } catch {
      toast.error("切换失败")
    } finally {
      setSwitching(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-medium text-sm text-muted-foreground">界面外观</h2>
        <p className="text-xs text-muted-foreground">
          选择界面的配色方案和视觉风格
        </p>
      </div>

      <div>
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {themes.map((theme) => {
              const isActive = currentThemeId === theme.id || (!currentThemeId && theme.id === "default.css")
              const isSwitching = switching === theme.id

              return (
                <div
                  key={theme.id}
                  onClick={() => handleSetTheme(theme)}
                  className={cn(
                    "group relative cursor-pointer rounded-xl border transition-all overflow-hidden",
                    isActive
                      ? "border-primary ring-1 ring-primary/20"
                      : "border-border/10 hover:border-border"
                  )}
                >
                  <div
                    className="aspect-[4/3] w-full relative"
                    style={{ backgroundColor: theme.colors?.background ?? "transparent" }}
                  >
                    <div className="flex h-full p-2 gap-2">
                      <div className="w-1/4 h-full rounded-sm opacity-50" style={{ backgroundColor: theme.colors?.sidebar ?? "transparent" }} />
                      <div className="flex-1 space-y-1.5 pt-1">
                        <div className="h-1.5 w-1/3 rounded-full opacity-60" style={{ backgroundColor: theme.colors?.primary ?? "currentColor" }} />
                        <div className="h-8 w-full rounded-sm bg-foreground/5 opacity-50" />
                        <div className="h-4 w-1/2 rounded-sm bg-foreground/5 opacity-30" />
                      </div>
                    </div>

                    {isActive && !isSwitching && (
                      <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  <div className="p-2 border-t border-border/10 bg-background/50">
                    <div className={cn("text-[10px] font-medium text-center truncate transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                      {theme.name}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


export function AppearanceMain() {
  return (
    <div className="py-6 space-y-6">
      <div className="font-semibold">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/settings" className="text-base text-primary">设置</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-base font-semibold">外观设置</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <ThemeModeSection />

      <InterfaceAppearanceSection />

      <div className="space-y-4 opacity-50 pointer-events-none grayscale">
        <h2 className="font-medium text-sm text-muted-foreground">即将推出</h2>
        <div className="bg-muted/30 rounded-xl p-6 h-32 flex items-center justify-center border border-border/50">
          <span className="text-sm text-muted-foreground">更多自定义选项正在开发中...</span>
        </div>
      </div>
    </div>
  )
}
