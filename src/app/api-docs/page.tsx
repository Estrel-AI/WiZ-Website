import SwaggerUi from "@/src/components/swagger/swagger-ui";

export const metadata = {
  title: "API Docs",
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-950">Swagger API Docs</h1>
          <p className="mt-2 text-sm text-slate-500">
            Current admin endpoints plus the planned hierarchy and use case detail CRUD API contract.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <SwaggerUi url="/api/openapi" />
        </div>
      </div>
    </main>
  );
}
