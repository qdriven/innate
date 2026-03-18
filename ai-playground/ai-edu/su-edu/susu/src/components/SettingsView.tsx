"use client";

import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Download, Upload, Trash2, Moon, Sun, Monitor, Globe, RefreshCw, FileDown, FileUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const { settings, updateSettings, topics, importTopics } = useAppStore();

  const handleExport = () => {
    const data = JSON.stringify(topics, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `susu-topics-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            importTopics(data);
            alert("导入成功！");
          } else {
            alert("无效的数据格式");
          }
        } catch (err) {
          alert("导入失败：" + (err as Error).message);
        }
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm("确定要清除所有数据吗？此操作不可撤销！")) {
      localStorage.removeItem("susu-storage");
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">设置</h1>
        </div>

        {/* Theme Settings */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Monitor className="h-5 w-5 text-teal-400" />
              外观设置
            </CardTitle>
            <CardDescription className="text-slate-400">
              自定义应用的外观
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">主题</Label>
                <p className="text-sm text-slate-500">选择明暗主题</p>
              </div>
              <div className="flex gap-2">
                {(["light", "dark", "system"] as const).map((theme) => (
                  <Button
                    key={theme}
                    variant={settings.theme === theme ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSettings({ theme })}
                    className={cn(
                      "w-20",
                      settings.theme === theme
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                        : "border-slate-600 text-slate-400"
                    )}
                  >
                    {theme === "light" && <Sun className="h-4 w-4 mr-1" />}
                    {theme === "dark" && <Moon className="h-4 w-4 mr-1" />}
                    {theme === "system" && <Monitor className="h-4 w-4 mr-1" />}
                    {theme === "light" ? "浅色" : theme === "dark" ? "深色" : "系统"}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-700" />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">语言</Label>
                <p className="text-sm text-slate-500">选择界面语言</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={settings.language === "zh" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettings({ language: "zh" })}
                  className={cn(
                    settings.language === "zh"
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                      : "border-slate-600 text-slate-400"
                  )}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  中文
                </Button>
                <Button
                  variant={settings.language === "en" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettings({ language: "en" })}
                  className={cn(
                    settings.language === "en"
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                      : "border-slate-600 text-slate-400"
                  )}
                >
                  <Globe className="h-4 w-4 mr-1" />
                  English
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Settings */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-teal-400" />
              数据管理
            </CardTitle>
            <CardDescription className="text-slate-400">
              导入、导出或清除数据
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">导出数据</Label>
                <p className="text-sm text-slate-500">将所有主题导出为 JSON 文件</p>
              </div>
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                <FileDown className="h-4 w-4 mr-2" />
                导出
              </Button>
            </div>

            <Separator className="bg-slate-700" />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">导入数据</Label>
                <p className="text-sm text-slate-500">从 JSON 文件导入主题</p>
              </div>
              <Button
                onClick={handleImport}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                <FileUp className="h-4 w-4 mr-2" />
                导入
              </Button>
            </div>

            <Separator className="bg-slate-700" />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-red-400">清除数据</Label>
                <p className="text-sm text-slate-500">删除所有本地数据</p>
              </div>
              <Button
                onClick={handleClearData}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                清除
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Update Settings */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-teal-400" />
              更新设置
            </CardTitle>
            <CardDescription className="text-slate-400">
              配置自动更新
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-300">自动更新</Label>
                <p className="text-sm text-slate-500">启动时检查新版本和内容更新</p>
              </div>
              <Switch
                checked={settings.autoUpdate}
                onCheckedChange={(checked) => updateSettings({ autoUpdate: checked })}
              />
            </div>

            {settings.autoUpdate && (
              <>
                <Separator className="bg-slate-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">更新服务器地址</Label>
                    <p className="text-sm text-slate-500">自定义更新源</p>
                  </div>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={settings.updateUrl || ""}
                    onChange={(e) => updateSettings({ updateUrl: e.target.value })}
                    className="w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">关于 Susu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm leading-relaxed">
              Susu 是一个互动学习平台，旨在让家长和孩子一起学习任何主题。
              通过结合 3D 可视化、闪卡和测验功能，让学习变得更有趣、更有效。
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500">
              <p>版本: 0.1.0</p>
              <p className="mt-1">使用 Next.js + shadcn/ui 构建</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}