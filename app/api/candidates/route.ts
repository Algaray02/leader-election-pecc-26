import { errorResponse, successResponse } from "@/lib/server/utils/response";
import { listCandidates } from "@/lib/server/services/candidate.service";

export async function GET() {
  try {
    const { data } = await listCandidates();
    return successResponse(data);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
