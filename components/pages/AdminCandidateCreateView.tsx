"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Save, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useCreateCandidate } from "@/hooks/useCandidates";

export function AdminCandidateCreateView() {
  const router = useRouter();
  const createCandidateMutation = useCreateCandidate();

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    createCandidateMutation.mutate({
      ...formData,
      candidateNumber: parseInt(formData.candidateNumber, 10),
    }, {
      onSuccess: () => {
        toast.success("Candidate created successfully", {
          description: "The new candidate has been added to the election."
        });
        router.push("/admin/candidates");
      },
      onError: (err: any) => {
         toast.error("Failed to create candidate", {
           description: err?.response?.data?.message || err.message
         });
      }
    });
  };

  return (
    <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/candidates">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-blue-900">Add New Candidate</h2>
          <p className="text-sm text-slate-500 mt-1">Register a new candidate profile for the election.</p>
        </div>
      </div>

      <div className="max-w-8xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Image Upload */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-blue-50 shadow-sm rounded-2xl overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-40 h-40 rounded-full border-4 border-dashed border-blue-200 bg-blue-50/50 flex flex-col items-center justify-center text-slate-400 group hover:border-primary hover:bg-blue-50 cursor-pointer transition-all relative overflow-hidden"
                  >
                    {formData.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <User className="w-12 h-12 mb-2 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-primary">Upload Photo</span>
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
                    <Label htmlFor="imageUrl" className="text-blue-900 font-bold ml-1">Image URL (Optional)</Label>
                    <Input id="imageUrl" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://example.com/photo.jpg" className="border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl h-12" />
                    <p className="text-xs text-slate-500 ml-1">You can either upload a local file or provide a direct image URL.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-50 shadow-sm rounded-2xl">
                <CardContent className="p-6 space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="candidateNumber" className="text-blue-900 font-bold">Candidate Number</Label>
                     <Input required type="number" id="candidateNumber" value={formData.candidateNumber} onChange={e => setFormData({...formData, candidateNumber: e.target.value})} min="1" placeholder="e.g., 04" className="border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl h-12" />
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-blue-50 shadow-sm rounded-2xl">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-blue-900 font-bold">Full Name</Label>
                      <Input required id="fullName" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter candidate full name" className="border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl h-12" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vision" className="text-blue-900 font-bold">Vision</Label>
                    <Textarea required id="vision" value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} placeholder="Describe the candidate's vision..." className="min-h-25 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl resize-y" />
                    <p className="text-xs text-slate-500">A short, impactful paragraph summarizing the main goal.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mission" className="text-blue-900 font-bold">Mission</Label>
                    <Textarea required id="mission" value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})} placeholder="1. First mission...&#10;2. Second mission...&#10;3. Third mission..." className="min-h-37.5 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary rounded-xl resize-y" />
                    <p className="text-xs text-slate-500">Provide actionable steps. Use numbers for a list format.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4 pt-4">
                <Link href="/admin/candidates">
                  <Button type="button" variant="outline" className="cursor-pointer h-12 px-8 rounded-xl font-bold border-blue-200 text-slate-600 hover:bg-blue-50 hover:text-primary">
                    Cancel
                  </Button>
                </Link>
                <Button disabled={createCandidateMutation.isPending} type="submit" className="cursor-pointer h-12 px-8 rounded-xl font-bold bg-primary hover:bg-blue-800 text-white shadow-xl shadow-primary/20 transition-all">
                  <Save className="w-5 h-5 mr-2" />
                  {createCandidateMutation.isPending ? "Saving..." : "Save Candidate"}
                </Button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
