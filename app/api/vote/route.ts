import { errorResponse, successResponse } from "@/lib/server/utils/response";
import { submitVote } from "@/lib/server/services/vote.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    
    if (!session || !session.user || !session.user.id) {
       return errorResponse("Unauthorized. Please log in first.", 401);
    }

    const body = await req.json();
    const { candidateId } = body;

    if (!candidateId) {
      return errorResponse("Candidate ID is required", 400);
    }

    await submitVote(session.user.id, candidateId);

    return successResponse({ success: true }, "Vote cast successfully");
  } catch (error: any) {
    if (error.message === "You have already cast your vote" || error.message === "Participant not found") {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Failed to submit vote", 500);
  }
}
