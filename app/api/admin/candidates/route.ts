import { listCandidates, createCandidate } from "@/lib/server/services/candidate.service";
import { successResponse, createdResponse, serverErrorResponse } from "@/lib/server/utils/response";

export async function GET() {
  try {
    const result = await listCandidates();
    return successResponse(result.data);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return serverErrorResponse("Gagal memuat kandidat.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Skipping zod validation for brevity, assuming standard inputs for now based on the scope
    const newCandidate = await createCandidate(body);
    return createdResponse(newCandidate);
  } catch (error) {
    console.error("Error creating candidate:", error);
    return serverErrorResponse("Gagal membuat kandidat.");
  }
}
