import { errorResponse, successResponse } from "@/lib/server/utils/response";
import { getCandidateById } from "@/lib/server/services/candidate.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidate = await getCandidateById(id);
    return successResponse(candidate);
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
