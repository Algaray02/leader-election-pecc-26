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
    major: "",
    vision: "",
    mission: "",
    imageUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File terlalu besar", {
          description: "Mohon upload gambar dengan ukuran maksimal 10MB."
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
      major: candidate.major || "",
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
          <h2 className="text-3xl font-playfair font-black tracking-tight text-[#4A0E17]">Candidate List</h2>
          <p className="text-sm text-[#6B4F43] mt-1">Manage the candidates for the 2026 election.</p>
        </div>
        <Link href="/admin/candidates/create">
          <Button className="cursor-pointer flex items-center gap-2 bg-[#4A0E17] text-white hover:bg-[#2D060C] shadow-md shadow-[#4A0E17]/20">
            <Plus className="w-5 h-5" /> Add New Candidate
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#6B4F43] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#4A0E17]" />
            <p className="font-medium animate-pulse">Loading candidates...</p>
          </div>
        )}
        
        {!isLoading && candidates.map((candidate: any) => (
          <Card key={candidate.id} className="overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-[#4A0E17]/5 transition-all border-[#D4AF37]/20 bg-[#FFFDF9] rounded-2xl pt-0">
            <div className={`relative h-56 bg-linear-to-b from-[#5D0F1D] to-[#2D060C] shrink-0 rounded-t-2xl flex items-center justify-center p-6`}>
              
              <div className="relative w-32 h-32 rounded-full border-4 border-white/20 bg-[#FFFDF9]/10 shadow-xl overflow-hidden flex items-center justify-center">
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

              <div className="absolute top-4 right-4 bg-[#FFFDF9]/95 px-3 py-1.5 rounded-md text-sm font-black text-[#4A0E17] shadow-sm tracking-widest border border-white/50 backdrop-blur-sm">
                #0{candidate.candidateNumber}
              </div>
            </div>
            <CardContent className="pt-6 flex flex-col flex-1">
               <h3 className="text-lg font-bold mb-1 text-[#4A0E17] group-hover:text-[#4A0E17] transition-colors">{candidate.name}</h3>
               <p className="text-sm text-[#4A0E17] font-medium mb-4">{candidate.major}</p>
               
               <div className="space-y-3 mb-6 flex-1">
                 <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-1 text-[#6B4F43]/70">Vision</h4>
                    <p className="text-sm line-clamp-3 text-[#6B4F43]">{candidate.vision}</p>
                 </div>
                 <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-1 text-[#6B4F43]/70">Mission</h4>
                    <p className="text-sm line-clamp-3 text-[#6B4F43]">{candidate.mission}</p>
                 </div>
               </div>

               <div className="flex gap-2 pt-4 border-t border-[#D4AF37]/20 mt-auto">
                  <Dialog open={editingId === candidate.id} onOpenChange={(open) => !open && setEditingId(null)}>
                    <DialogTrigger asChild>
                      <Button onClick={() => openEditModal(candidate)} variant="outline" className="cursor-pointer flex-1 border-[#D4AF37]/40 text-[#6B4F43] hover:text-[#4A0E17] hover:bg-[#D4AF37]/10">
                         <Edit3 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-106.25 rounded-2xl border-[#D4AF37]/20">
                      <form onSubmit={(e) => handleEditSubmit(e, candidate.id)}>
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-playfair font-black text-[#4A0E17]">Edit Candidate</DialogTitle>
                          <DialogDescription>
                            Make changes to candidate's public profile here.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                           {/* image sector */}
                           <div className="space-y-4 flex flex-col items-center justify-center">
                              <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-32 h-32 rounded-full border-4 border-dashed border-[#D4AF37]/40 bg-[#D4AF37]/5 flex flex-col items-center justify-center text-[#6B4F43]/70 group hover:border-[#4A0E17] hover:bg-[#D4AF37]/10 cursor-pointer transition-all relative overflow-hidden"
                              >
                                {formData.imageUrl ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                  <>
                                    <User className="w-10 h-10 mb-1 group-hover:text-[#4A0E17] transition-colors" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider group-hover:text-[#4A0E17]">Upload Photo</span>
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
                                <Label htmlFor={`imageUrl-${candidate.id}`} className="text-[#4A0E17] font-bold ml-1 text-xs">Atau gunakan Image URL (Opsional)</Label>
                                <Input id={`imageUrl-${candidate.id}`} value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl h-10 text-xs" />
                              </div>
                           </div>

                           <div className="space-y-4">
                             <div className="space-y-2">
                               <Label htmlFor={`candidateNumber-${candidate.id}`} className="text-[#4A0E17] font-bold">Candidate No.</Label>
                               <Input required type="number" id={`candidateNumber-${candidate.id}`} value={formData.candidateNumber} onChange={e => setFormData({...formData, candidateNumber: e.target.value})} className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                             </div>
                             <div className="space-y-2">
                               <Label htmlFor={`name-${candidate.id}`} className="text-[#4A0E17] font-bold">Name</Label>
                               <Input required id={`name-${candidate.id}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                             </div>
                           </div>
                           <div className="w-full space-y-2 md:col-span-2">
                             <Label htmlFor={`major-${candidate.id}`} className="text-[#4A0E17] font-bold">Major</Label>
                             <Input required id={`major-${candidate.id}`} value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl" />
                           </div>
                           <div className="col-span-1 md:col-span-2 space-y-4">
                             <div className="space-y-2">
                               <Label htmlFor={`vision-${candidate.id}`} className="text-[#4A0E17] font-bold">Vision</Label>
                               <Textarea required id={`vision-${candidate.id}`} value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} className="border-[#D4AF37]/40 min-h-20 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl resize-y" />
                             </div>
                             <div className="space-y-2">
                               <Label htmlFor={`mission-${candidate.id}`} className="text-[#4A0E17] font-bold">Mission</Label>
                               <Textarea required id={`mission-${candidate.id}`} value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})} className="border-[#D4AF37]/40 min-h-32 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl resize-y" />
                             </div>
                           </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={updateCandidateMutation.isPending} className="w-full sm:w-auto font-bold rounded-xl bg-[#4A0E17] hover:bg-[#2D060C] text-white shadow-md">
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
                        <AlertDialogDescription className="text-[#6B4F43]">
                          This action cannot be undone. This will permanently delete <strong className="text-slate-900">{candidate.name}</strong> from the election servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-[#D4AF37]/40 hover:bg-slate-50 cursor-pointer text-[#4A0E17] font-bold">Cancel</AlertDialogCancel>
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
          <Card className="border-2 border-dashed border-[#D4AF37]/40 flex flex-col items-center justify-center min-h-100 h-full hover:border-[#4A0E17] hover:bg-[#D4AF37]/5 cursor-pointer transition-colors group bg-[#FFFDF9] shadow-sm">
             <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:bg-[#4A0E17] group-hover:text-white text-[#4A0E17] transition-colors border border-[#D4AF37]/30">
                <Plus className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-bold text-[#4A0E17] group-hover:text-[#4A0E17] transition-colors">Add New Candidate</h3>
             <p className="text-sm text-[#6B4F43] mt-2 text-center max-w-50">Register a new candidate for the upcoming election cycle.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
