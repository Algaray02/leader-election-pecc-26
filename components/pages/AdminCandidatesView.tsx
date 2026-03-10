"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit3, Trash2, User, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCandidates, useDeleteCandidate, useUpdateCandidate } from "@/hooks/useCandidates";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AdminCandidatesView() {
  const { data: candidates = [], isLoading } = useCandidates();
  const deleteCandidateMutation = useDeleteCandidate();
  const updateCandidateMutation = useUpdateCandidate();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    candidateNumber: "",
    vision: "",
    mission: "",
    imageUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File terlalu besar", {
          description: "Mohon upload gambar dengan ukuran maksimal 2MB."
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (candidate: any) => {
    setFormData({
      name: candidate.name || "",
      candidateNumber: candidate.candidateNumber?.toString() || "",
      vision: candidate.vision || "",
      mission: candidate.mission || "",
      imageUrl: candidate.imageUrl || "",
    });
    setEditingId(candidate.id);
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    updateCandidateMutation.mutate({ 
      id, 
      data: {
        ...formData,
        candidateNumber: parseInt(formData.candidateNumber, 10),
      } 
    }, {
      onSuccess: () => {
        setEditingId(null);
        toast.success("Candidate updated successfully!");
      },
      onError: (err: any) => {
         toast.error("Failed to update candidate", {
           description: err?.response?.data?.message || err.message
         });
      }
    });
  };

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-blue-900">Candidate List</h2>
          <p className="text-sm text-slate-500 mt-1">Manage the candidates for the 2026 election.</p>
        </div>
        <Link href="/admin/candidates/create">
          <Button className="cursor-pointer flex items-center gap-2 bg-primary text-white hover:bg-blue-800 shadow-md shadow-primary/20">
            <Plus className="w-5 h-5" /> Add New Candidate
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="font-medium animate-pulse">Loading candidates...</p>
          </div>
        )}
        
        {!isLoading && candidates.map((candidate: any) => (
          <Card key={candidate.id} className="overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-primary/5 transition-all border-blue-50 bg-white rounded-2xl pt-0">
            <div className={`relative h-56 bg-linear-to-b from-blue-600 to-blue-400 shrink-0 rounded-t-2xl flex items-center justify-center p-6`}>
              
              <div className="relative w-32 h-32 rounded-full border-4 border-white/20 bg-white/10 shadow-xl overflow-hidden flex items-center justify-center">
                {candidate.imageUrl ? (
                  <Image 
                    src={candidate.imageUrl} 
                    alt={candidate.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <User className="w-16 h-16 text-white/70" />
                )}
              </div>

              <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-md text-sm font-black text-blue-900 shadow-sm tracking-widest border border-white/50 backdrop-blur-sm">
                #0{candidate.candidateNumber}
              </div>
            </div>
            <CardContent className="pt-6 flex flex-col flex-1">
               <h3 className="text-lg font-bold mb-1 text-blue-900 group-hover:text-primary transition-colors">{candidate.name}</h3>
               <p className="text-sm text-primary font-medium mb-4">Leader Candidate</p>
               
               <div className="space-y-3 mb-6 flex-1">
                 <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Vision</h4>
                    <p className="text-sm line-clamp-3 text-slate-600">{candidate.vision}</p>
                 </div>
                 <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Mission</h4>
                    <p className="text-sm line-clamp-3 text-slate-600">{candidate.mission}</p>
                 </div>
               </div>

               <div className="flex gap-2 pt-4 border-t border-blue-50 mt-auto">
                  <Dialog open={editingId === candidate.id} onOpenChange={(open) => !open && setEditingId(null)}>
                    <DialogTrigger asChild>
                      <Button onClick={() => openEditModal(candidate)} variant="outline" className="cursor-pointer flex-1 border-blue-200 text-slate-600 hover:text-primary hover:bg-blue-50">
                         <Edit3 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-106.25 rounded-2xl border-blue-50">
                      <form onSubmit={(e) => handleEditSubmit(e, candidate.id)}>
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-blue-900">Edit Candidate</DialogTitle>
                          <DialogDescription>
                            Make changes to candidate's public profile here.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                           {/* image sector */}
                           <div className="space-y-4 flex flex-col items-center justify-center">
                              <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-32 h-32 rounded-full border-4 border-dashed border-blue-200 bg-blue-50/50 flex flex-col items-center justify-center text-slate-400 group hover:border-primary hover:bg-blue-50 cursor-pointer transition-all relative overflow-hidden"
                              >
                                {formData.imageUrl ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                  <>
                                    <User className="w-10 h-10 mb-1 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider group-hover:text-primary">Upload Photo</span>
                                  </>
                                )}
                              </div>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                              />
                              <div className="w-full space-y-2 text-left">
                                <Label htmlFor={`imageUrl-${candidate.id}`} className="text-blue-900 font-bold ml-1 text-xs">Atau gunakan Image URL (Opsional)</Label>
                                <Input id={`imageUrl-${candidate.id}`} value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl h-10 text-xs" />
                              </div>
                           </div>

                           <div className="space-y-4">
                             <div className="space-y-2">
                               <Label htmlFor={`candidateNumber-${candidate.id}`} className="text-blue-900 font-bold">Candidate No.</Label>
                               <Input required type="number" id={`candidateNumber-${candidate.id}`} value={formData.candidateNumber} onChange={e => setFormData({...formData, candidateNumber: e.target.value})} className="border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl" />
                             </div>
                             <div className="space-y-2">
                               <Label htmlFor={`name-${candidate.id}`} className="text-blue-900 font-bold">Name</Label>
                               <Input required id={`name-${candidate.id}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl" />
                             </div>
                           </div>
                           <div className="col-span-1 md:col-span-2 space-y-4">
                             <div className="space-y-2">
                               <Label htmlFor={`vision-${candidate.id}`} className="text-blue-900 font-bold">Vision</Label>
                               <Textarea required id={`vision-${candidate.id}`} value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} className="border-slate-200 min-h-20 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl resize-y" />
                             </div>
                             <div className="space-y-2">
                               <Label htmlFor={`mission-${candidate.id}`} className="text-blue-900 font-bold">Mission</Label>
                               <Textarea required id={`mission-${candidate.id}`} value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})} className="border-slate-200 min-h-32 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl resize-y" />
                             </div>
                           </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={updateCandidateMutation.isPending} className="w-full sm:w-auto font-bold rounded-xl bg-primary hover:bg-blue-800 text-white shadow-md">
                            {updateCandidateMutation.isPending ? "Saving..." : "Save changes"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="cursor-pointer text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600">
                         <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl border-red-50">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600 font-bold text-xl">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600">
                          This action cannot be undone. This will permanently delete <strong className="text-slate-900">{candidate.name}</strong> from the election servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-700 font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md cursor-pointer font-bold"
                          onClick={() => deleteCandidateMutation.mutate(candidate.id)}
                        >
                          {deleteCandidateMutation.isPending ? "Deleting..." : "Yes, delete candidate"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
               </div>
            </CardContent>
          </Card>
        ))}

        <Link href="/admin/candidates/create" className="block outline-none min-h-full">
          <Card className="border-2 border-dashed border-blue-200 flex flex-col items-center justify-center min-h-100 h-full hover:border-primary hover:bg-blue-50/50 cursor-pointer transition-colors group bg-white shadow-sm">
             <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white text-primary transition-colors border border-blue-100">
                <Plus className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">Add New Candidate</h3>
             <p className="text-sm text-slate-500 mt-2 text-center max-w-50">Register a new candidate for the upcoming election cycle.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
