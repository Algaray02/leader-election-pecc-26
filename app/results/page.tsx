import { AdminDashboardView } from "@/components/pages/AdminDashboardView";
import { VoterLayout } from "@/components/layout/VoterLayout";

// The voter's Live Results page can just re-use the chart layout of AdminDashboardView
// OR a dedicated uneditable view. But to save effort we will compose.
// Let's wrap a simplifed chart in VoterLayout.

export default function ResultsPage() {
  return (
    <VoterLayout>
      <div className="w-full">
         <h2 className="text-3xl font-display font-bold mb-8">Live Results</h2>
         {/* Using the same component for now to provide the chart UI */}
         <AdminDashboardView />
      </div>
    </VoterLayout>
  );
}
