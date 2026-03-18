"use client";

import { useState } from "react";
import { useAppStore } from "@/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, Topic } from "@/types";
import { X, Plus, Trash2, Download, Upload, Sparkles, Loader2 } from "lucide-react";
import { generateFlashcards } from "@/services/geminiService";

export function AdminDashboard() {
  const {
    isAdmin,
    setIsAdmin,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addTopic,
    updateTopic,
    deleteTopic,
    addFlashcard,
    importData,
    exportData,
    resetData,
  } = useAppStore();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("📚");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateTopic, setGenerateTopic] = useState("");
  const [generateCount, setGenerateCount] = useState(10);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({
        name: newCategoryName,
        icon: newCategoryIcon,
        description: newCategoryDesc,
      });
      setNewCategoryName("");
      setNewCategoryIcon("📚");
      setNewCategoryDesc("");
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learn-together-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          importData(data);
        } catch (error) {
          alert("Invalid backup file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={isAdmin} onOpenChange={setIsAdmin}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Admin Dashboard</DialogTitle>
          <DialogDescription>
            Manage categories, topics, and content
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="categories" className="flex-1 overflow-hidden flex flex-col">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="categories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="Icon (emoji)"
                      value={newCategoryIcon}
                      onChange={(e) => setNewCategoryIcon(e.target.value)}
                    />
                    <Input
                      placeholder="Category Name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="col-span-2"
                    />
                  </div>
                  <Input
                    placeholder="Description"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                  />
                  <Button onClick={handleAddCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.description} • {category.topics.length} topics
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="topics" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-sm">
                    Select a category first, then add topics from the sidebar or topic detail view.
                  </p>
                </CardContent>
              </Card>

              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {category.topics.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No topics yet</p>
                    ) : (
                      category.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <div className="flex items-center gap-2">
                            <span>{topic.icon}</span>
                            <span>{topic.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({topic.flashcards.length} cards)
                            </span>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteTopic(topic.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Backup & Restore</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button onClick={handleExport} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <div>
                      <Input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
                      <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Flashcard Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Generate flashcards using AI. Requires Gemini API key in environment.
                  </p>
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter topic name to generate flashcards"
                      value={generateTopic}
                      onChange={(e) => setGenerateTopic(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Number of cards"
                        value={generateCount}
                        onChange={(e) => setGenerateCount(parseInt(e.target.value) || 10)}
                        className="w-32"
                      />
                      <Button 
                        variant="outline" 
                        disabled={!generateTopic || isGenerating}
                        onClick={async () => {
                          if (!generateTopic) return;
                          setIsGenerating(true);
                          try {
                            const cards = await generateFlashcards(generateTopic, generateCount);
                            alert(`Generated ${cards.length} flashcards for "${generateTopic}"!\n\nQuestions:\n${cards.map(c => `- ${c.question}`).join('\n')}`);
                          } catch (error) {
                            alert("Failed to generate flashcards. Make sure NEXT_PUBLIC_GEMINI_API_KEY is set in your environment.");
                          } finally {
                            setIsGenerating(false);
                          }
                        }}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        {isGenerating ? "Generating..." : "Generate Flashcards"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onClick={() => {
                    if (confirm("Are you sure? This will delete all data.")) {
                      resetData();
                    }
                  }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset All Data
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
