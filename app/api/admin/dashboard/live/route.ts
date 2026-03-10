import { getLiveVotes } from "@/lib/server/services/dashboard.service";
import { successResponse, serverErrorResponse } from "@/lib/server/utils/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const result = await getLiveVotes({ page, limit, search, sortBy, sortOrder });
    return successResponse(result.data, result.meta);
  } catch (error) {
    console.error("Error fetching live votes:", error);
    return serverErrorResponse("Gagal memuat data live voting.");
  }
}
