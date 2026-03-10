import { updateParticipant, deleteParticipant } from "@/lib/server/services/participant.service";
import { successResponse, serverErrorResponse } from "@/lib/server/utils/response";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const updatedParticipant = await updateParticipant(resolvedParams.id, body);
    return successResponse(updatedParticipant);
  } catch (error) {
    console.error("Error updating participant:", error);
    return serverErrorResponse("Gagal memperbarui partisipan.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await deleteParticipant(resolvedParams.id);
    return successResponse({ message: "Partisipan berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting participant:", error);
    return serverErrorResponse("Gagal menghapus partisipan.");
  }
}
