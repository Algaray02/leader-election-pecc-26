import { listParticipants, createParticipant } from "@/lib/server/services/participant.service";
import { successResponse, createdResponse, serverErrorResponse, conflictResponse } from "@/lib/server/utils/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const role = searchParams.get("role") || undefined;
    const hasVotedParam = searchParams.get("hasVoted");
    const hasVoted = hasVotedParam === null ? undefined : hasVotedParam === "true";

    const result = await listParticipants({ page, limit, search, sortBy, sortOrder, role, hasVoted });
    return successResponse(result.data, result.meta);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return serverErrorResponse("Gagal memuat daftar partisipan.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newParticipant = await createParticipant(body);
    return createdResponse(newParticipant);
  } catch (error: any) {
    console.error("Error creating participant:", error);
    if (error.code === "P2002") {
      return conflictResponse("NIM, Email, atau Username sudah terdaftar.");
    }
    return serverErrorResponse("Gagal membuat partisipan baru.");
  }
}
