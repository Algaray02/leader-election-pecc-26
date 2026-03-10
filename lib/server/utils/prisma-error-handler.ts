/**
 * Prisma-specific error codes
 * https://www.prisma.io/docs/reference/api-reference/error-reference
 */
export const PRISMA_ERROR_CODES = {
  P2000: "The provided value for the column is too long",
  P2001: "The record searched for in the WHERE condition does not exist",
  P2002: "Unique constraint failed",
  P2003: "Foreign key constraint failed",
  P2004: "A constraint failed while trying to write to the database",
  P2005: "The value stored in the database is invalid",
  P2006: "The provided value is invalid",
  P2007: "Data validation error",
  P2008: "Failed to parse the query",
  P2009: "Query validation error",
  P2010: "Raw query failed",
  P2011: "Null constraint violation",
  P2012: "Missing a required value",
  P2013: "Missing the required argument",
  P2014: "The change would violate a required relation",
  P2015: "Related record not found",
  P2016: "Query interpretation error",
  P2017: "The records for relation do not connect",
  P2018: "The required relations do not exist",
  P2019: "Input error",
  P2020: "Value out of range",
  P2021: "The table does not exist",
  P2022: "The column does not exist",
  P2023: "Inconsistent column data",
  P2024: "Timed out fetching a new connection",
  P2025: "Record to update/delete does not exist",
  P2026: "The database string is invalid",
  P2027: "Multiple errors occurred",
  P2028: "Transaction API error",
  P2029: "Query parameter limit exceeded",
  P2030: "Cannot find a fulltext index to use for the search",
  P2031: "Prisma Client initialization failed",
  P2033: "A number in your filter does not match the type",
  P2034: "Transaction failed due to a write conflict",
  P2035: "Assertion violation",
};

export interface PrismaErrorDetail {
  code: string;
  userMessage: string;
  statusCode: number;
  isOperational: boolean;
}

/**
 * Handle Prisma errors and convert to user-friendly messages
 * Returns standardized error details for API responses
 */
export function handlePrismaError(error: any): PrismaErrorDetail {
  // Check if it's a Prisma error
  if (error.code && PRISMA_ERROR_CODES[error.code as keyof typeof PRISMA_ERROR_CODES]) {
    const code = error.code as keyof typeof PRISMA_ERROR_CODES;

    switch (code) {
      case "P2002":
        return {
          code,
          userMessage: `${error.meta?.target?.[0] || "Data"} sudah terdaftar dalam sistem`,
          statusCode: 409,
          isOperational: true,
        };

      case "P2025":
        return {
          code,
          userMessage: "Data yang Anda cari tidak ditemukan",
          statusCode: 404,
          isOperational: true,
        };

      case "P2003":
      case "P2014":
      case "P2017":
        return {
          code,
          userMessage: "Data yang direferensikan tidak ditemukan atau sudah dihapus",
          statusCode: 400,
          isOperational: true,
        };

      case "P2011":
      case "P2012":
        return {
          code,
          userMessage: "Beberapa field wajib tidak boleh kosong",
          statusCode: 400,
          isOperational: true,
        };

      case "P2024":
        return {
          code,
          userMessage: "Koneksi database timeout, silakan coba lagi",
          statusCode: 503,
          isOperational: true,
        };

      default:
        return {
          code,
          userMessage: PRISMA_ERROR_CODES[code] || "Terjadi kesalahan database",
          statusCode: 400,
          isOperational: true,
        };
    }
  }

  // If it's a database error but not Prisma
  if (error.message?.includes("database") || error.message?.includes("connection")) {
    return {
      code: "DATABASE_ERROR",
      userMessage: "Terjadi kesalahan database, silakan coba lagi",
      statusCode: 503,
      isOperational: true,
    };
  }

  // Unknown error
  return {
    code: "UNKNOWN_ERROR",
    userMessage: "Terjadi kesalahan tidak terduga",
    statusCode: 500,
    isOperational: false,
  };
}

/**
 * Check if error is a specific Prisma code
 */
export function isPrismaError(error: any, code: string): boolean {
  return error?.code === code;
}

/**
 * Check if error is unique constraint violation
 */
export function isUniqueConstraintError(error: any): boolean {
  return isPrismaError(error, "P2002");
}

/**
 * Check if record does not exist
 */
export function isNotFoundError(error: any): boolean {
  return isPrismaError(error, "P2025");
}

/**
 * Check if foreign key constraint failed
 */
export function isForeignKeyError(error: any): boolean {
  return isPrismaError(error, "P2003");
}
