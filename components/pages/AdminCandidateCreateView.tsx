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
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#D4AF37]/10 hover:text-[#4A0E17] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-playfair font-black tracking-tight text-[#4A0E17]">Add New Candidate</h2>
          <p className="text-sm text-[#6B4F43] mt-1">Register a new candidate profile for the election.</p>
        </div>
      </div>

      <div className="max-w-8xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Image Upload */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-[#D4AF37]/20 shadow-sm rounded-2xl overflow-hidden bg-[#FFFDF9]">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-40 h-40 rounded-full border-4 border-dashed border-[#D4AF37]/40 bg-[#D4AF37]/5 flex flex-col items-center justify-center text-[#6B4F43]/70 group hover:border-[#4A0E17] hover:bg-[#D4AF37]/10 cursor-pointer transition-all relative overflow-hidden"
                  >
                    {formData.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <User className="w-12 h-12 mb-2 group-hover:text-[#4A0E17] transition-colors" />
                        <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-[#4A0E17]">Upload Photo</span>
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
                    <Label htmlFor="imageUrl" className="text-[#4A0E17] font-bold ml-1">Image URL (Optional)</Label>
                    <Input id="imageUrl" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://example.com/photo.jpg" className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl h-12" />
                    <p className="text-xs text-[#6B4F43] ml-1">You can either upload a local file or provide a direct image URL.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#D4AF37]/20 shadow-sm rounded-2xl bg-[#FFFDF9]">
                <CardContent className="p-6 space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="candidateNumber" className="text-[#4A0E17] font-bold">Candidate Number</Label>
                     <Input required type="number" id="candidateNumber" value={formData.candidateNumber} onChange={e => setFormData({...formData, candidateNumber: e.target.value})} min="1" placeholder="e.g., 04" className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl h-12" />
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-[#D4AF37]/20 shadow-sm rounded-2xl bg-[#FFFDF9]">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-[#4A0E17] font-bold">Full Name</Label>
                      <Input required id="fullName" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter candidate full name" className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl h-12" />
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="major" className="text-[#4A0E17] font-bold">Major</Label>
                      <Input required id="major" value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} placeholder="Enter candidate major" className="border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl h-12" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vision" className="text-[#4A0E17] font-bold">Vision</Label>
                    <Textarea required id="vision" value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} placeholder="Describe the candidate's vision..." className="min-h-25 border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl resize-y" />
                    <p className="text-xs text-[#6B4F43]">A short, impactful paragraph summarizing the main goal.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mission" className="text-[#4A0E17] font-bold">Mission</Label>
                    <Textarea required id="mission" value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})} placeholder="1. First mission...&#10;2. Second mission...&#10;3. Third mission..." className="min-h-37.5 border-[#D4AF37]/40 focus-visible:ring-[#4A0E17]/20 focus-visible:border-[#4A0E17] rounded-xl resize-y" />
                    <p className="text-xs text-[#6B4F43]">Provide actionable steps. Use numbers for a list format.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4 pt-4">
                <Link href="/admin/candidates">
                  <Button type="button" variant="outline" className="cursor-pointer h-12 px-8 rounded-xl font-bold border-[#D4AF37]/40 text-[#6B4F43] hover:bg-[#D4AF37]/10 hover:text-[#4A0E17]">
                    Cancel
                  </Button>
                </Link>
                <Button disabled={createCandidateMutation.isPending} type="submit" className="cursor-pointer h-12 px-8 rounded-xl font-bold bg-[#4A0E17] hover:bg-[#2D060C] text-white shadow-xl shadow-[#4A0E17]/20 transition-all">
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
