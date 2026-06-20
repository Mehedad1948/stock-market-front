import "server-only";

interface SpanAttributes {
  operation: string;
  requestId?: string;
  status?: number;
}

export async function withServerSpan<T>(
  attributes: SpanAttributes,
  operation: () => Promise<T>
): Promise<T> {
  // Vendor-neutral boundary. Add an approved tracing adapter here without leaking payload data.
  void attributes;
  return operation();
}
