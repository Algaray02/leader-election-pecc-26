import { CandidateDetailView } from "@/components/pages/CandidateDetailView";

export default async function CandidateDetailPage({ params }: { params: Promise<{ candidateId: string }> }) {
  const resolvedParams = await params;
  return <CandidateDetailView candidateId={resolvedParams.candidateId} />;
}
