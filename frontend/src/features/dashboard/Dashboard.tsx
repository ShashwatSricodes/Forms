"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  LayoutTemplate,
  FileText,
  Loader2,
  Link2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TemplateModal } from "./components/Popup";
import { getUserForms, deleteForm } from "@/lib/api/form";
import type { Form } from "@/types/form";
import { supabase } from "@/config/supabaseClient";

export default function Dashboard() {
  const navigate = useNavigate();

  const [forms, setForms] = useState<Form[]>([]);
  const [filteredForms, setFilteredForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        navigate("/login");
        return;
      }

      setUser({
        name: data.user.user_metadata?.full_name || "User",
        email: data.user.email || "user@example.com",
      });
    };

    fetchUser();
  }, [navigate]);

  // Load forms
  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setLoading(true);
    try {
      const data = await getUserForms();
      setForms(data || []);
    } catch (err: any) {
      console.error("Failed to load forms:", err);
      alert("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  // Search + sort
  useEffect(() => {
    let result = [...forms];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          (f.title || "").toLowerCase().includes(q) ||
          (f.description || "").toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return sortBy === "newest" ? bTime - aTime : aTime - bTime;
    });
    setFilteredForms(result);
  }, [forms, searchQuery, sortBy]);

  const handleDelete = async (formId: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    try {
      await deleteForm(formId);
      setForms((prev) => prev.filter((f) => f.id !== formId));
    } catch (err) {
      console.error("Failed to delete form:", err);
      alert("Failed to delete form");
    }
  };

  // 📌 Copy public form link using HashRouter
  const handleCopyLink = (formId: string) => {
    const link = `${window.location.origin}/#/form/${formId}`;
    navigator.clipboard.writeText(link);
    alert("✅ Public link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen pt-12 md:pt-16 mt-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 px-4 sm:px-6 lg:px-8">
          {user && (
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                className="flex items-center gap-2.5 px-4 py-3 cursor-default h-16 w-full sm:w-[280px] justify-start shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-base font-semibold uppercase text-gray-700">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-base leading-tight text-gray-900">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </Button>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search your forms..."
              className="w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as "newest" | "oldest")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Created (new → old)</SelectItem>
                <SelectItem value="oldest">Created (old → new)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            >
              <LayoutTemplate className="h-5 w-5 mr-2" />
              Browse Template
            </Button>
          </div>
        </header>

        {/* Forms Section */}
        <main className="px-4 sm:px-6 lg:px-8 pb-12">
          {forms.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first form to get started
              </p>
              <Button onClick={() => navigate("/forms/create")}>
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Form
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Create New Form */}
              <Card
                onClick={() => navigate("/forms/create")}
                className="h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Plus className="h-7 w-7 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700 text-base">
                    Create New Form
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start from scratch
                  </p>
                </CardContent>
              </Card>

              {/* Form Cards */}
              {filteredForms.map((form) => (
                <Card
                  key={form.id}
                  className="h-52 flex flex-col justify-between hover:shadow-lg transition overflow-hidden"
                >
                  <CardContent className="pt-4 pb-2">
                    <h3 className="font-semibold line-clamp-2 break-words text-base">
                      {form.title}
                    </h3>
                    {form.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 break-words">
                        {form.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          form.is_public
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {form.is_public ? "Public" : "Private"}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {new Date(form.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end gap-2 pr-3 pb-3">
                    {/* Edit */}
                    <Button
                      variant="ghost"
                      aria-label="Edit form"
                      onClick={() => navigate(`/forms/${form.id}/edit`)}
                    >
                      <Edit className="h-6 w-6" />
                    </Button>

                    {/* View Responses */}
                    <Button
                      variant="ghost"
                      aria-label="View responses"
                      onClick={() => navigate(`/forms/${form.id}/responses`)}
                    >
                      <Eye className="h-6 w-6" />
                    </Button>

                    {/* Copy Link for public form */}
                    {form.is_public && (
                      <Button
                        variant="ghost"
                        aria-label="Copy public link"
                        onClick={() => handleCopyLink(form.id)}
                      >
                        <Link2 className="h-6 w-6 text-blue-600" />
                      </Button>
                    )}

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      aria-label="Delete form"
                      onClick={() => handleDelete(form.id)}
                    >
                      <Trash2 className="h-6 w-6 text-red-500" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Template Modal */}
      <TemplateModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
