"use client";

import { useState, useRef } from "react";
import { useParticipants, useDeleteParticipant, useCreateParticipant, useUpdateParticipant, adminParticipantKeys } from "@/hooks/useParticipants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/api/admin";
import { adminQueryKeys } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Upload, UserPlus, FileEdit, Trash2, Filter, ArrowUpDown, RefreshCw, Eye, EyeOff, Users, Vote, Clock } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AdminParticipantsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [filterVoted, setFilterVoted] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 10;

  const { data, isLoading } = useParticipants({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    sortBy: sortConfig?.key || "createdAt",
    sortOrder: sortConfig?.direction || "desc",
    ...(filterRole !== "ALL" && { role: filterRole }),
    ...(filterVoted === "voted" && { hasVoted: true }),
    ...(filterVoted === "pending" && { hasVoted: false }),
  });
  const participantsList = data?.data || [];
  const meta = data?.meta;
  
  const { data: stats } = useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: async () => {
      const { data } = await AdminAPI.getStats();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteParticipantMutation = useDeleteParticipant();
  const createParticipantMutation = useCreateParticipant();
  const updateParticipantMutation = useUpdateParticipant();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, _setFormData] = useState({
    name: "", nim: "", email: "", phone: "", password: "", role: "POI"
  });

  const setFormData = (data: any) => {
    if (typeof data === 'function') {
      _setFormData(data(formData));
    } else {
      _setFormData(data);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Excel Handles
  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prev: any) => ({ ...prev, password }));
  };

  const handleExportExcel = async () => {
    try {
      // Fetch all participants without pagination for export
      const limit = Math.max(stats?.votedCount + stats?.remainingVotes || 1000, 1000);
      const res: any = await AdminAPI.getParticipants({ page: 1, limit, search: "" });
      const allParticipants = res.data || [];

      if (allParticipants.length === 0) {
        toast.warning("No data to export");
        return;
      }

      const worksheetData = allParticipants.map((p: any) => ({
        "NIM": p.nim || "",
        "Name": p.name || "",
        "Email": p.email || "",
        "Phone": p.phone || "",
        "Password": p.plainPassword || "••••••••",
        "Role": p.role || "",
        "Status": p.hasVoted ? "Voted" : "Pending"
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
      XLSX.writeFile(workbook, `PECC_Election_Participants_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel");
    }
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel columns to payload, generate random password if empty
        const payload = data.map((row: any) => {
          let genPass = "";
          const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          for (let i = 0; i < 8; i++) genPass += charset.charAt(Math.floor(Math.random() * charset.length));

          // Parse and validate the role properly, default to POI
          let parsedRole = String(row.Role || row.role || "POI").toUpperCase().trim();
          if (parsedRole !== "OFFICER" && parsedRole !== "POI" && parsedRole !== "ADMIN") {
            parsedRole = "POI";
          }

          return {
            nim: String(row.NIM || row.nim || ""),
            name: String(row.Name || row.name || ""),
            email: String(row.Email || row.email || ""),
            phone: String(row.Phone || row.phone || ""),
            password: String(row.Password || row.password || genPass),
            role: parsedRole,
          }
        }).filter(r => r.name); // Ensure required fields

        if (payload.length === 0) {
          toast.error("Excel data seems empty or malformed.");
          return;
        }

        const id = toast.loading(`Uploading ${payload.length} participants...`);
        try {
           await AdminAPI.uploadParticipants(payload);
           toast.success("Import successful!", { id });
           queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats });
           queryClient.invalidateQueries({ queryKey: adminParticipantKeys.lists() });
        } catch (apiErr: any) {
           toast.error(apiErr.response?.data?.message || "Import failed", { id });
        }
      } catch (err) {
        console.error(err);
        toast.error("Error reading file.");
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsBinaryString(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createParticipantMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Participant added successfully!");
        setIsAddOpen(false);
        setFormData({ name: "", nim: "", email: "", phone: "", password: "", role: "POI" });
      }
    });
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    // Only send non-empty fields for update
    const updateData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
    );
    updateParticipantMutation.mutate({ id, data: updateData }, {
      onSuccess: () => {
        toast.success("Participant updated successfully!");
        setEditingId(null);
        setFormData({ name: "", nim: "", email: "", phone: "", password: "", role: "POI" });
      }
    });
  };

  const openEditModal = (p: any) => {
    setFormData({
      name: p.name,
      nim: p.nim,
      email: p.email || "",
      phone: p.phone || "",
      password: "", // Don't populate password
      role: p.role,
    });
    setEditingId(p.id);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const activeFilterCount = (filterRole !== "ALL" ? 1 : 0) + (filterVoted !== "all" ? 1 : 0);

  const resetFilters = () => {
    setFilterRole("ALL");
    setFilterVoted("all");
    setCurrentPage(1);
  };

  const totalPages = meta?.totalPages || 0;
  const totalItems = meta?.total || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black tracking-tight text-[#4A0E17]">Participant Management</h2>
          <p className="text-sm text-[#6B4F43] mt-1">Manage all registered voters and their status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={handleExportExcel} className="cursor-pointer text-[#4A0E17] border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="cursor-pointer text-[#4A0E17] border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 flex-1 sm:flex-none">
              <Upload className="w-4 h-4 mr-2" /> Import
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              accept=".xlsx,.xls,.csv" 
              onChange={handleImportExcel} 
            />
          </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer bg-[#4A0E17] text-white hover:bg-[#2D060C] shadow-md shadow-[#4A0E17]/20">
                <UserPlus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 rounded-2xl border-[#D4AF37]/20 bg-[#FFFDF9] text-[#4A0E17]">
              <form onSubmit={handleAddSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-playfair font-black text-[#4A0E17]">Add New Participant</DialogTitle>
                  <DialogDescription>
                    Register a new voter for the election.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                  <div className="space-y-2">
                    <Label htmlFor="new-name" className="text-[#4A0E17] font-bold">Name</Label>
                    <Input id="new-name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="E.g. John Doe" className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-nim" className="text-[#4A0E17] font-bold">NIM</Label>
                    <Input id="new-nim" required value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} placeholder="E.g. 4.33.24.X.XX" className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-[#4A0E17] font-bold flex justify-between">
                       <span>Password</span>
                       <button type="button" onClick={generatePassword} className="text-xs text-[#4A0E17] font-bold flex items-center gap-1 hover:underline cursor-pointer"><RefreshCw className="w-3 h-3"/> Generate</button>
                    </Label>
                    <Input id="new-password" required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email" className="text-[#4A0E17] font-bold">Email (Optional)</Label>
                    <Input id="new-email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-phone" className="text-[#4A0E17] font-bold">Phone (Optional)</Label>
                    <Input id="new-phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+62 8..." className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-role" className="text-[#4A0E17] font-bold">Role</Label>
                    <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                      <SelectTrigger id="new-role" className="border-[#D4AF37]/40 focus:ring-[#4A0E17]/20 focus:border-[#4A0E17] rounded-xl">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-[#FFFDF9] border-[#D4AF37]/30">
                        <SelectItem value="POI">POI (PECC Officer Internship)</SelectItem>
                        <SelectItem value="OFFICER">OFFICER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN (Full Access)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createParticipantMutation.isPending} className="w-full sm:w-auto font-bold rounded-xl bg-[#4A0E17] hover:bg-[#2D060C] text-white shadow-md">
                    {createParticipantMutation.isPending ? "Adding..." : "Add Participant"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-[#D4AF37]/20 shadow-sm bg-[#FFFDF9]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B4F43] font-medium">Total Participants</p>
              <h3 className="text-2xl font-bold mt-1 text-[#4A0E17]">{totalItems}</h3>
            </div>
            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#4A0E17] border border-[#D4AF37]/30">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 border-y-[#D4AF37]/20 border-r-[#D4AF37]/20 shadow-sm bg-[#FFFDF9]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Voted</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-700">{stats?.votedCount || 0} <span className="text-sm font-normal text-[#6B4F43]">Participants</span></h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100">
               <Vote className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-400 border-y-[#D4AF37]/20 border-r-[#D4AF37]/20 shadow-sm bg-[#FFFDF9]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-red-500 font-medium">Not Voted</p>
              <h3 className="text-2xl font-bold mt-1 text-red-600">{stats?.remainingVotes || 0} <span className="text-sm font-normal text-[#6B4F43]">Participants</span></h3>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 border border-red-100">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex flex-col border-[#D4AF37]/20 shadow-sm bg-[#FFFDF9]">
        <CardHeader className="p-5 border-b border-[#D4AF37]/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B4F43]/70 w-4 h-4" />
              <Input 
                placeholder="Search by name, NIM..." 
                className="pl-9 border-[#D4AF37]/30 focus:border-[#4A0E17] focus:ring-[#4A0E17]/20 bg-[#D4AF37]/5"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>

            {/* Filter button + dropdown anchored to the right */}
            <div className="relative flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#5D0F1D] font-bold hover:underline cursor-pointer"
                >
                  Reset ({activeFilterCount})
                </button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(v => !v)}
                className={`cursor-pointer transition-colors ${
                  activeFilterCount > 0
                    ? "text-[#4A0E17] bg-[#D4AF37]/10 border-[#D4AF37]/60 font-bold hover:bg-[#D4AF37]/20"
                    : "border-[#D4AF37]/40 text-[#6B4F43] hover:text-[#4A0E17] hover:bg-[#D4AF37]/10"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {activeFilterCount > 0 && (
                  <span className="ml-2 w-5 h-5 rounded-full bg-[#5D0F1D] text-[#D4AF37] text-[10px] font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* Floating dropdown panel */}
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 z-20 bg-[#FFFDF9] border border-[#D4AF37]/30 rounded-xl shadow-xl p-4 flex flex-col gap-4 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#4A0E17] uppercase tracking-wider">Role</label>
                    <Select value={filterRole} onValueChange={(v) => { setFilterRole(v); setCurrentPage(1); }}>
                      <SelectTrigger className="h-8 text-xs border-[#D4AF37]/40 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Roles</SelectItem>
                        <SelectItem value="POI">POI</SelectItem>
                        <SelectItem value="OFFICER">OFFICER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#4A0E17] uppercase tracking-wider">Vote Status</label>
                    <Select value={filterVoted} onValueChange={(v) => { setFilterVoted(v); setCurrentPage(1); }}>
                      <SelectTrigger className="h-8 text-xs border-[#D4AF37]/40 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="voted">Voted</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader className="bg-[#D4AF37]/5">
              <TableRow className="border-[#D4AF37]/20">
                <TableHead className="w-16 text-center text-[#6B4F43] font-bold">
                  <Button variant="ghost" onClick={() => handleSort('id')} className="font-bold px-0 hover:bg-transparent h-auto text-[#6B4F43] cursor-pointer">
                    ID <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-[#6B4F43] font-bold">
                  <Button variant="ghost" onClick={() => handleSort('name')} className="font-bold px-0 hover:bg-transparent -ml-2 h-auto text-[#6B4F43] cursor-pointer">
                    Name / NIM <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-[#6B4F43] font-bold">Contact Info</TableHead>
                <TableHead className="text-[#6B4F43] font-bold">Credentials</TableHead>
                <TableHead className="text-center text-[#6B4F43] font-bold">
                  <Button variant="ghost" onClick={() => handleSort('role')} className="font-bold px-0 hover:bg-transparent h-auto text-[#6B4F43] justify-center w-full cursor-pointer">
                    Role <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center text-[#6B4F43] font-bold">
                  <Button variant="ghost" onClick={() => handleSort('hasVoted')} className="font-bold px-0 hover:bg-transparent h-auto text-[#6B4F43] justify-center w-full cursor-pointer">
                    Voted <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center text-[#6B4F43] font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#6B4F43]">
                    Memuat data partisipan...
                  </TableCell>
                </TableRow>
              ) : participantsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#6B4F43]">
                    No participants found.
                  </TableCell>
                </TableRow>
              ) : (
                participantsList.map((p: any) => (
                  <TableRow key={p.id} className="border-[#D4AF37]/20 hover:bg-[#D4AF37]/5">
                    <TableCell className="text-center text-[#6B4F43] text-xs font-mono truncate max-w-20" title={p.id}>{p.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-[#4A0E17]">{p.name}</div>
                    <div className="text-xs text-[#6B4F43] font-mono mt-0.5">{p.nim}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-[#6B4F43]">{p.email}</div>
                    <div className="text-xs text-[#6B4F43] mt-1">{p.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs mt-1">
                      <span className="text-[#6B4F43]">Pass:</span> <span className="font-mono text-[#4A0E17]">{p.plainPassword || "••••••••"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={p.role === "ADMIN" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-[#D4AF37]/10 text-[#4A0E17] border-[#D4AF37]/40"}>
                      {p.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={p.hasVoted ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}>
                      {p.hasVoted ? "Voted" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Dialog open={editingId === p.id} onOpenChange={(open) => !open && setEditingId(null)}>
                        <DialogTrigger asChild>
                          <Button onClick={() => openEditModal(p)} variant="ghost" size="icon" className="cursor-pointer text-[#4A0E17] hover:bg-[#D4AF37]/20 hover:text-[#5D0F1D]">
                            <FileEdit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-106.25 rounded-2xl border-[#D4AF37]/20 bg-[#FFFDF9] text-[#4A0E17]">
                          <form onSubmit={(e) => handleEditSubmit(e, p.id)}>
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-playfair font-black text-[#4A0E17]">Edit Participant</DialogTitle>
                              <DialogDescription>
                                Update participant details. Leave password blank if not changing.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                              <div className="space-y-2">
                                <Label htmlFor={`name-${p.id}`} className="text-[#4A0E17] font-bold">Name</Label>
                                <Input id={`name-${p.id}`} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`nim-${p.id}`} className="text-[#4A0E17] font-bold">NIM</Label>
                                <Input id={`nim-${p.id}`} required value={formData.nim} onChange={e => setFormData({...formData, nim: e.target.value})} className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`password-${p.id}`} className="text-[#4A0E17] font-bold flex justify-between">
                                  <span>New Password (Optional)</span>
                                  <button type="button" onClick={generatePassword} className="text-xs text-[#4A0E17] font-bold flex items-center gap-1 hover:underline cursor-pointer"><RefreshCw className="w-3 h-3"/> Generate</button>
                                </Label>
                                <Input id={`password-${p.id}`} type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Leave blank to keep current" className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`email-${p.id}`} className="text-[#4A0E17] font-bold">Email</Label>
                                <Input id={`email-${p.id}`} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`phone-${p.id}`} className="text-[#4A0E17] font-bold">Phone</Label>
                                <Input id={`phone-${p.id}`} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`role-${p.id}`} className="text-[#4A0E17] font-bold">Role</Label>
                                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                  <SelectTrigger id={`role-${p.id}`} className="border-[#D4AF37]/40 focus:ring-[#4A0E17]/20 focus:border-[#4A0E17] rounded-xl">
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-xl bg-[#FFFDF9] border-[#D4AF37]/30">
                                    <SelectItem value="POI">POI (Participant of Interest)</SelectItem>
                                    <SelectItem value="OFFICER">OFFICER</SelectItem>
                                    <SelectItem value="ADMIN">ADMIN (Full Access)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={updateParticipantMutation.isPending} className="w-full sm:w-auto font-bold rounded-xl bg-[#4A0E17] hover:bg-[#2D060C] text-white shadow-md">
                                {updateParticipantMutation.isPending ? "Saving..." : "Save changes"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-red-100 bg-[#FFFDF9]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600 font-bold text-xl">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#6B4F43]">
                              This action cannot be undone. This will permanently delete the participant <strong className="text-slate-900">{p.name} ({p.nim})</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl border-[#D4AF37]/40 hover:bg-slate-50 cursor-pointer text-[#4A0E17] font-bold">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer font-bold"
                              onClick={() => deleteParticipantMutation.mutate(p.id)}
                            >
                              {deleteParticipantMutation.isPending ? "Deleting..." : "Yes, delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="p-4 border-t border-[#D4AF37]/20 bg-[#D4AF37]/5 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-xl border-x-0 border-b-0">
          <p className="text-sm text-[#6B4F43] font-medium whitespace-nowrap">
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
          </p>
          <Pagination className="justify-end w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)) }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer text-[#6B4F43] hover:text-[#4A0E17]"}
                />
              </PaginationItem>
              
              {[...Array(totalPages === 0 ? 1 : totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}
                    isActive={currentPage === i + 1}
                    className={`cursor-pointer ${currentPage === i + 1 ? "border-[#4A0E17] text-[#4A0E17] hover:bg-[#D4AF37]/10" : "text-[#6B4F43] hover:bg-[#D4AF37]/10 hover:text-[#4A0E17]"}`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)) }}
                  className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer text-[#6B4F43] hover:text-[#4A0E17]"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}
