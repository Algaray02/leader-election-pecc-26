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
  const chartColors = ['#1e40af', '#3b82f6', '#93c5fd', '#bfdbfe']; // Dynamic colors based on candidates
  
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
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-slate-500 gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-blue-900">System Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Polytechnic English Conversation Club Election Platform</p>
        </div>
        <Badge variant="outline" className="w-fit bg-blue-50 text-primary border-blue-100 px-4 py-1.5 font-bold uppercase tracking-widest text-xs">
           Live Monitoring
        </Badge>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-blue-50 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Voters</h3>
                <p className="text-xs text-primary mt-1 font-medium">Eligible Students</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-primary border border-blue-100">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end gap-3 mt-4">
              <span className="text-4xl font-extrabold tracking-tight text-blue-900">{stats?.totalParticipants || 0}</span>
              <span className="text-sm text-slate-500 mb-1.5 font-medium">students</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-500">Registration Complete</span>
                <span className="text-primary font-bold">100%</span>
              </div>
              <Progress value={100} className="h-2 bg-blue-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-50 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Votes Cast</h3>
                <p className="text-xs text-emerald-600 mt-1 font-medium">Current Turnout</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                <Vote className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end gap-3 mt-4">
              <span className="text-4xl font-extrabold tracking-tight text-emerald-700">{stats?.votedCount || 0}</span>
              <span className="text-sm text-slate-500 mb-1.5 font-medium">voters</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{stats?.participationRate || 0}%</Badge>
              <span className="text-xs text-slate-500">Participation rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-50 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending</h3>
                <p className="text-xs text-amber-600 mt-1 font-medium">Not Voted Yet</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-500 border border-amber-100">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end gap-3 mt-4">
              <span className="text-4xl font-extrabold tracking-tight text-amber-600">{stats?.remainingVotes || 0}</span>
              <span className="text-sm text-slate-500 mb-1.5 font-medium">remaining</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-500 border-amber-100">{100 - (stats?.participationRate || 0)}%</Badge>
              <span className="text-xs text-slate-500">Of total voters</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-blue-50 flex flex-col bg-white">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-50 p-5">
            <div>
              <CardTitle className="text-blue-900">Live Voting Data</CardTitle>
              <p className="text-sm text-slate-500 mt-1">Real-time vote submissions</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="Search voter or ID..." 
                  className="pl-9 border-blue-100 focus:border-primary focus:ring-primary/20 bg-blue-50/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleExportExcel} className="cursor-pointer text-primary border-blue-200 hover:bg-blue-50 sm:w-auto w-full">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-blue-50">
                  <TableHead className="px-6 py-4 text-slate-600 font-bold">
                    <Button variant="ghost" onClick={() => handleSort('id')} className="font-bold px-0 hover:bg-transparent h-auto text-slate-600 cursor-pointer">
                      ID <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-slate-600 font-bold whitespace-nowrap">
                    <Button variant="ghost" onClick={() => handleSort('name')} className="font-bold px-0 hover:bg-transparent h-auto text-slate-600 cursor-pointer">
                      Voter Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-slate-600 font-bold whitespace-nowrap">
                    <Button variant="ghost" onClick={() => handleSort('time')} className="font-bold px-0 hover:bg-transparent h-auto text-slate-600 cursor-pointer">
                      Time <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-slate-600 font-bold whitespace-nowrap">
                    <Button variant="ghost" onClick={() => handleSort('votedFor')} className="font-bold px-0 hover:bg-transparent h-auto text-slate-600 cursor-pointer">
                      Voted For <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-slate-600 font-bold">
                    <Button variant="ghost" onClick={() => handleSort('status')} className="font-bold px-0 hover:bg-transparent h-auto text-slate-600 cursor-pointer">
                      Status <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        Memuat data...
                     </TableCell>
                  </TableRow>
                ) : liveVotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No votes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  liveVotes.map((vote: any) => (
                    <TableRow key={vote.id} className="border-blue-50 hover:bg-blue-50/30">
                      <TableCell className="px-6 py-4 font-mono text-xs text-slate-500">{vote.nim}</TableCell>
                      <TableCell className="font-medium text-slate-700 whitespace-nowrap">{vote.name}</TableCell>
                      <TableCell className="text-sm text-slate-600 whitespace-nowrap">
                        {vote.hasVoted && vote.updatedAt 
                          ? new Date(vote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-700 whitespace-nowrap font-medium">
                        {vote.votedFor ? `0${vote.votedFor.candidateNumber} - ${vote.votedFor.name}` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={vote.hasVoted ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-200"}>
                          {vote.hasVoted ? "Voted" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-4 border-t border-blue-50 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-xl border-x-0 border-b-0">
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap">
              Showing {totalItems === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
            </p>
            <Pagination className="justify-end w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)) }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer text-slate-600 hover:text-primary"}
                  />
                </PaginationItem>
                
                {[...Array(totalPages === 0 ? 1 : totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}
                      isActive={currentPage === i + 1}
                      className={`cursor-pointer ${currentPage === i + 1 ? "border-primary text-primary hover:bg-blue-50" : "text-slate-600 hover:bg-blue-50 hover:text-primary"}`}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)) }}
                    className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer text-slate-600 hover:text-primary"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>

        <Card className="shadow-sm border-blue-50 flex flex-col bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-blue-900">Vote Distribution</CardTitle>
              <p className="text-sm text-slate-500">Percentage of votes per candidate</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/dashboard/distribution')}
              className="text-primary border-blue-200 hover:bg-blue-50"
            >
              See Details <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center">
             <div className="relative w-full min-h-62.5 flex items-center justify-center">
                 <Doughnut data={chartData} options={chartOptions} />
             </div>
             <div className="mt-6 w-full space-y-3">
               {stats?.voteDistribution?.map((c: any, idx: number) => (
                 <div key={c.id} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[idx] }}></span>
                      <span className="text-slate-600 font-medium">0{c.number} - {c.name} ({c.percentage}%)</span>
                   </div>
                   <span className="font-bold text-blue-900">{c.votes}</span>
                 </div>
               ))}
               {(!stats?.voteDistribution || stats.voteDistribution.length === 0) && (
                 <p className="text-xs text-center text-slate-400">Belum ada data kandidat.</p>
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
