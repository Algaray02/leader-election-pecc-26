import { getDashboardStats } from "@/lib/server/services/dashboard.service";
import { successResponse, serverErrorResponse } from "@/lib/server/utils/response";

export async function GET() {
  try {
    const result = await getDashboardStats();
    return successResponse(result.data);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return serverErrorResponse("Gagal memuat statistik dasbor.");
  }
}
