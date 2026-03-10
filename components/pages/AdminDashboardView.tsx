"use client";

import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Vote, Clock, Search, ArrowUpDown, Download, ArrowRight } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { AdminAPI } from "@/lib/api/admin";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function AdminDashboardView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const itemsPerPage = 10;

  const { stats, liveVotes = [], liveVotesMeta, isLoading } = useAdmin({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    sortBy: sortConfig?.key || "updatedAt",
    sortOrder: sortConfig?.direction || "desc",
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = liveVotesMeta?.totalPages || 0;
  const totalItems = liveVotesMeta?.total || 0;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleExportExcel = async () => {
    try {
      const limit = Math.max(stats?.totalParticipants || 1000, 1000);
      const res: any = await AdminAPI.getLiveVotes({ page: 1, limit, search: "" });
      const allVotes = res.data || [];

      if (allVotes.length === 0) {
        toast.warning("No vote data to export");
        return;
      }

      const worksheetData = allVotes.map((v: any) => ({
        "ID": v.nim || "",
        "Name": v.name || "",
        "Time": v.hasVoted && v.updatedAt ? new Date(v.updatedAt).toLocaleString() : "-",
        "Voted For": v.votedFor ? `0${v.votedFor.candidateNumber} - ${v.votedFor.name}` : "-",
        "Status": v.hasVoted ? "Voted" : "Pending"
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Live_Votes");
      XLSX.writeFile(workbook, `PECC_Election_Votes_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Excel exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export Excel");
    }
  };

  // Transform backend stats into chart format
  const chartLabels = stats?.voteDistribution?.map((c: any) => c.name) || ['Waiting for data...'];
  const chartValues = stats?.voteDistribution?.map((c: any) => c.votes) || [1];
  const chartColors = ['#5D0F1D', '#8B2636', '#B34A5A', '#D4AF37', '#E5C973']; // Royal dynamic colors
  
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues.every((v: number) => v === 0) ? [1] : chartValues, // Prevent empty chart crash
        backgroundColor: chartColors.slice(0, chartLabels.length),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (isLoading && !stats) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-[#6B4F43] gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
        <p className="font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-playfair font-black tracking-tight text-[#4A0E17]">System Dashboard</h2>
          <p className="text-sm text-[#6B4F43] mt-1 font-medium">Polytechnic English Conversation Club Election Platform</p>
        </div>
        <Badge variant="outline" className="w-fit bg-[#D4AF37]/10 text-[#5D0F1D] border-[#D4AF37]/40 px-4 py-1.5 font-bold uppercase tracking-widest text-xs">
           Live Monitoring
        </Badge>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md border-[#D4AF37]/30 bg-[#FFFDF9]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#6B4F43] uppercase tracking-wider">Total Voters</h3>
                <p className="text-xs text-[#D4AF37] mt-1 font-bold">Eligible Students</p>
              </div>
              <div className="p-3 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37] border border-[#D4AF37]/30">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end gap-3 mt-4">
              <span className="text-4xl font-extrabold tracking-tight text-[#4A0E17]">{stats?.totalParticipants || 0}</span>
              <span className="text-sm text-[#6B4F43] mb-1.5 font-medium">students</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-[#6B4F43]">Registration Complete</span>
                <span className="text-[#D4AF37] font-bold">100%</span>
              </div>
              <Progress value={100} className="h-2 bg-[#D4AF37]/20 border border-[#D4AF37]/10 [*::-webkit-progress-value]:bg-[#D4AF37] [*::-moz-progress-bar]:bg-[#D4AF37]" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#D4AF37]/30 bg-[#FFFDF9]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#6B4F43] uppercase tracking-wider">Votes Cast</h3>
                <p className="text-xs text-[#5D0F1D] mt-1 font-bold">Current Turnout</p>
              </div>
              <div className="p-3 bg-[#5D0F1D]/10 rounded-xl text-[#5D0F1D] border border-[#5D0F1D]/30">
                <Vote className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end gap-3 mt-4">
              <span className="text-4xl font-extrabold tracking-tight text-[#4A0E17]">{stats?.votedCount || 0}</span>
              <span className="text-sm text-[#6B4F43] mb-1.5 font-medium">voters</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-[#5D0F1D]/10 text-[#5D0F1D] border-[#5D0F1D]/30 shadow-sm">{stats?.participationRate || 0}%</Badge>
              <span className="text-xs text-[#6B4F43]">Participation rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#D4AF37]/30 bg-[#FFFDF9]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#6B4F43] uppercase tracking-wider">Pending</h3>
                <p className="text-xs text-[#6B4F43] mt-1 font-bold">Not Voted Yet</p>
              </div>
              <div className="p-3 bg-[#6B4F43]/10 rounded-xl text-[#6B4F43] border border-[#6B4F43]/30">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end gap-3 mt-4">
              <span className="text-4xl font-extrabold tracking-tight text-[#4A0E17]">{stats?.remainingVotes || 0}</span>
              <span className="text-sm text-[#6B4F43] mb-1.5 font-medium">remaining</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-[#6B4F43]/10 text-[#6B4F43] border-[#6B4F43]/30 shadow-sm">{100 - (stats?.participationRate || 0)}%</Badge>
              <span className="text-xs text-[#6B4F43]">Of total voters</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="pt-0 lg:col-span-2 shadow-md border-[#D4AF37]/30 flex flex-col bg-[#FFFDF9]">
          <CardHeader className="rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/20 p-5 bg-gradient-to-r from-transparent to-[#D4AF37]/5">
            <div>
              <CardTitle className="text-[#4A0E17] font-playfair font-black text-2xl">Live Voting Data</CardTitle>
              <p className="text-sm text-[#6B4F43] mt-1">Real-time vote submissions</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64 shadow-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37] w-4 h-4" />
                <Input 
                  placeholder="Search voter or ID..." 
                  className="pl-9 border-[#D4AF37]/50 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleExportExcel} className="cursor-pointer text-[#4A0E17] border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 hover:text-[#5D0F1D] sm:w-auto w-full shadow-sm font-bold">
                <Download className="w-4 h-4 mr-2 text-[#D4AF37]" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#D4AF37]/10">
                <TableRow className="border-[#D4AF37]/20">
                  <TableHead className="px-6 py-4 text-[#4A0E17] font-bold">
                    <Button variant="ghost" onClick={() => handleSort('id')} className="font-bold px-0 hover:text-[#D4AF37] h-auto text-[#4A0E17] cursor-pointer tracking-wider">
                      ID <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-[#4A0E17] font-bold whitespace-nowrap">
                    <Button variant="ghost" onClick={() => handleSort('name')} className="font-bold px-0 hover:text-[#D4AF37] h-auto text-[#4A0E17] cursor-pointer tracking-wider">
                      Voter Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-[#4A0E17] font-bold whitespace-nowrap">
                    <Button variant="ghost" onClick={() => handleSort('time')} className="font-bold px-0 hover:text-[#D4AF37] h-auto text-[#4A0E17] cursor-pointer tracking-wider">
                      Time <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-[#4A0E17] font-bold whitespace-nowrap">
                    <Button variant="ghost" onClick={() => handleSort('votedFor')} className="font-bold px-0 hover:text-[#D4AF37] h-auto text-[#4A0E17] cursor-pointer tracking-wider">
                      Voted For <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-[#4A0E17] font-bold">
                    <Button variant="ghost" onClick={() => handleSort('status')} className="font-bold px-0 hover:text-[#D4AF37] h-auto text-[#4A0E17] cursor-pointer tracking-wider">
                      Status <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center py-8 text-[#6B4F43]">
                        Memuat data...
                     </TableCell>
                  </TableRow>
                ) : liveVotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-[#6B4F43]">
                      No votes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  liveVotes.map((vote: any) => (
                    <TableRow key={vote.id} className="border-[#D4AF37]/20 hover:bg-[#D4AF37]/5">
                      <TableCell className="px-6 py-4 font-mono text-xs text-[#6B4F43]">{vote.nim}</TableCell>
                      <TableCell className="font-medium text-[#4A0E17] whitespace-nowrap">{vote.name}</TableCell>
                      <TableCell className="text-sm text-[#6B4F43] whitespace-nowrap">
                        {vote.hasVoted && vote.updatedAt 
                          ? new Date(vote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-[#4A0E17] whitespace-nowrap font-medium">
                        {vote.votedFor ? `0${vote.votedFor.candidateNumber} - ${vote.votedFor.name}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={vote.hasVoted ? "bg-[#5D0F1D]/10 text-[#5D0F1D] border-[#5D0F1D]/30" : "bg-[#D4AF37]/10 text-[#4A0E17] border-[#D4AF37]/30"}>
                          {vote.hasVoted ? "Voted" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer text-[#4A0E17] hover:bg-[#D4AF37]/20"}
                  />
                </PaginationItem>
                
                {[...Array(totalPages === 0 ? 1 : totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}
                      isActive={currentPage === i + 1}
                      className={`cursor-pointer ${currentPage === i + 1 ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#4A0E17]" : "text-[#6B4F43] hover:bg-[#D4AF37]/10 hover:text-[#4A0E17]"}`}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)) }}
                    className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer text-[#4A0E17] hover:bg-[#D4AF37]/20"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>

        <Card className="shadow-md border-[#D4AF37]/30 flex flex-col bg-[#FFFDF9]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-[#4A0E17] font-playfair font-black text-xl">Vote Distribution</CardTitle>
              <p className="text-sm text-[#6B4F43]">Percentage of votes per candidate</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/dashboard/distribution')}
              className="text-[#4A0E17] border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 font-bold"
            >
              See Details <ArrowRight className="w-4 h-4 ml-2 text-[#D4AF37]" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
             <div className="relative w-full min-h-62.5 flex items-center justify-center pt-4">
                 <Doughnut data={chartData} options={chartOptions} />
             </div>
             <div className="mt-8 w-full space-y-3">
               {stats?.voteDistribution?.map((c: any, idx: number) => (
                 <div key={c.id} className="flex items-center justify-between text-sm bg-[#D4AF37]/5 p-2 px-3 rounded-lg border border-[#D4AF37]/20">
                   <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: chartColors[idx] }}></span>
                      <span className="text-[#4A0E17] font-semibold">0{c.number} - {c.name} ({c.percentage}%)</span>
                   </div>
                   <span className="font-bold text-[#D4AF37]">{c.votes}</span>
                 </div>
               ))}
               {(!stats?.voteDistribution || stats.voteDistribution.length === 0) && (
                 <p className="text-xs text-center text-[#6B4F43]">Belum ada data kandidat.</p>
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
