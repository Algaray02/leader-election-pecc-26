import { getCandidateById, updateCandidate, deleteCandidate } from "@/lib/server/services/candidate.service";
import { successResponse, serverErrorResponse } from "@/lib/server/utils/response";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const candidate = await getCandidateById(resolvedParams.id);
    return successResponse(candidate);
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return serverErrorResponse("Gagal memuat kandidat.");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const updatedCandidate = await updateCandidate(resolvedParams.id, body);
    return successResponse(updatedCandidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return serverErrorResponse("Gagal memperbarui kandidat.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await deleteCandidate(resolvedParams.id);
    return successResponse({ message: "Kandidat berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    return serverErrorResponse("Gagal menghapus kandidat.");
  }
}
