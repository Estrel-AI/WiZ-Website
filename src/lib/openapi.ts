export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "WiiZ Website Admin API",
    version: "1.0.0",
    description:
      "OpenAPI contract for current admin APIs and the finalized MySQL-backed hierarchy and use-case detail APIs.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development",
    },
  ],
  tags: [
    { name: "Health", description: "Project health and infrastructure checks." },
    { name: "Admin Auth", description: "Admin authentication and session endpoints." },
    { name: "Admin CMS", description: "Current JSON-backed admin CMS endpoints." },
    { name: "Admin Upload", description: "File upload endpoints." },
    {
      name: "Hierarchy",
      description:
        "MySQL-backed hierarchy APIs for industries, functions, and use cases stored in one table.",
    },
    {
      name: "Use Case Details",
      description:
        "MySQL-backed use case detail APIs for HTML content rows like Impact, Outcome, Artifacts, and Challenges.",
    },
    { name: "Blog", description: "MySQL-backed blog post management endpoints." },
    { name: "Plans", description: "MySQL-backed pricing plan management endpoints." },
    { name: "Hero Section", description: "MySQL-backed homepage hero section management endpoints." },
  ],
  paths: {
    "/api/health/database": {
      get: {
        tags: ["Health"],
        summary: "Check MySQL connectivity",
        responses: {
          "200": {
            description: "Database connection succeeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DatabaseHealthResponse" },
              },
            },
          },
          "500": {
            description: "Database connection failed.",
          },
        },
      },
    },
    "/api/admin/login": {
      post: {
        tags: ["Admin Auth"],
        summary: "Admin login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdminLoginRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Logged in successfully." },
          "401": {
            description: "Invalid credentials.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/logout": {
      post: {
        tags: ["Admin Auth"],
        summary: "Admin logout",
        responses: {
          "200": { description: "Logged out successfully." },
        },
      },
    },
    "/api/admin/cms": {
      get: {
        tags: ["Admin CMS"],
        summary: "Get CMS payload",
        responses: {
          "200": { description: "CMS payload returned." },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Admin CMS"],
        summary: "Replace CMS payload",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          "200": { description: "CMS updated." },
          "400": {
            description: "Invalid payload.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/upload": {
      post: {
        tags: ["Admin Upload"],
        summary: "Upload an asset",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Upload succeeded." },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/hierarchy/list": {
      post: {
        tags: ["Hierarchy"],
        summary: "List hierarchy rows",
        description:
          "Generic list endpoint for industries, functions, and usecases using pagination, search, sorting, optional type filtering, and optional parent filtering.",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HierarchyListRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Hierarchy rows returned.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HierarchyListApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/industries/bulk-upsert": {
      post: {
        tags: ["Hierarchy"],
        summary: "Bulk create or update industries",
        description:
          "Creates industry rows when id is 0 or missing, and updates rows when id is greater than 0.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/IndustryBulkUpsertRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Industries processed successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BulkUpsertApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/industries/bulk": {
      delete: {
        tags: ["Hierarchy"],
        summary: "Bulk soft delete industries",
        description:
          "Soft deletes multiple industries and also deactivates their descendant functions and usecases.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BulkDeleteRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Industries deleted successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeleteIdsApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/functions/bulk-upsert": {
      post: {
        tags: ["Hierarchy"],
        summary: "Bulk create or update functions",
        description:
          "Creates function rows under multiple industries when id is 0 or missing, and updates rows when id is greater than 0.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FunctionBulkUpsertRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Functions processed successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BulkUpsertApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/functions/bulk": {
      delete: {
        tags: ["Hierarchy"],
        summary: "Bulk soft delete functions",
        description: "Soft deletes multiple functions and also deactivates descendant usecases.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BulkDeleteRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Functions deleted successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeleteIdsApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/use-cases/upsert": {
      post: {
        tags: ["Hierarchy"],
        summary: "Create or update a use case",
        description:
          "Creates a new usecase when id is 0 or missing, updates an existing one when id is greater than 0, and can also save multiple linked use case detail rows in the same request.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UseCaseUpsertRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Use case saved successfully.",
            content: {
                "application/json": {
                schema: { $ref: "#/components/schemas/UseCaseUpsertApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/use-cases/{id}": {
      delete: {
        tags: ["Hierarchy"],
        summary: "Soft delete one use case",
        parameters: [{ $ref: "#/components/parameters/NodeId" }],
        responses: {
          "200": {
            description: "Use case deleted successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeleteIdsApiResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Use case not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/use-case-details/{useCaseId}": {
      get: {
        tags: ["Use Case Details"],
        summary: "List detail rows for one use case",
        parameters: [
          {
            name: "useCaseId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Use case detail rows returned.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UseCaseDetailListApiResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Use case not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/use-case-details/upsert": {
      post: {
        tags: ["Use Case Details"],
        summary: "Create or update one use case detail row",
        description:
          "Creates a new detail row when id is 0 or missing, and updates an existing one when id is greater than 0.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UseCaseDetailUpsertRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Use case detail row saved successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SingleUpsertApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/use-case-details/{id}": {
      delete: {
        tags: ["Use Case Details"],
        summary: "Soft delete one use case detail row",
        parameters: [{ $ref: "#/components/parameters/DetailId" }],
        responses: {
          "200": {
            description: "Use case detail row deleted successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeleteIdsApiResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Use case detail row not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/industries/{industryId}/functions-usecases": {
      get: {
        tags: ["Hierarchy"],
        summary: "Get one industry with nested functions and use cases",
        parameters: [
          {
            name: "industryId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Industry with nested functions and usecases returned.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/IndustryFunctionsUseCasesApiResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Industry not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/blog/list": {
      post: {
        tags: ["Blog"],
        summary: "List blog posts",
        description:
          "Returns active blog posts only, with optional search and status filtering. Pagination and sorting are not applied.",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BlogListRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Blog posts returned successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BlogListApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/blog/upsert": {
      post: {
        tags: ["Blog"],
        summary: "Create or update a blog post",
        description:
          "Creates a new blog post when id is 0 or missing, and updates an existing post when id is greater than 0.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BlogUpsertRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Blog post saved successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SingleUpsertApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/blog/{id}": {
      get: {
        tags: ["Blog"],
        summary: "Get one blog post",
        parameters: [{ $ref: "#/components/parameters/NodeId" }],
        responses: {
          "200": {
            description: "Blog post returned successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BlogApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Blog post not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Blog"],
        summary: "Soft delete one blog post",
        parameters: [{ $ref: "#/components/parameters/NodeId" }],
        responses: {
          "200": {
            description: "Blog post deleted successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeleteSingleApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Blog post not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/plans/list": {
      post: {
        tags: ["Plans"],
        summary: "List plans",
        description:
          "Returns active plans only, with optional search and hide filtering. Pagination and sorting are not applied.",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PlanListRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Plans returned successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PlanListApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/plans/upsert": {
      post: {
        tags: ["Plans"],
        summary: "Create or update a plan",
        description:
          "Creates a new plan when id is 0 or missing, and updates an existing plan when id is greater than 0.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PlanUpsertRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Plan saved successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SingleUpsertApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/plans/{id}": {
      get: {
        tags: ["Plans"],
        summary: "Get one plan",
        parameters: [{ $ref: "#/components/parameters/NodeId" }],
        responses: {
          "200": {
            description: "Plan returned successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PlanApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Plan not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Plans"],
        summary: "Soft delete one plan",
        parameters: [{ $ref: "#/components/parameters/NodeId" }],
        responses: {
          "200": {
            description: "Plan deleted successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/DeleteSingleApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Plan not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/plans/{id}/visibility": {
      patch: {
        tags: ["Plans"],
        summary: "Update plan visibility",
        parameters: [{ $ref: "#/components/parameters/NodeId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PlanVisibilityRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Plan visibility updated successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PlanVisibilityApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Plan not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/hero-section": {
      get: {
        tags: ["Hero Section"],
        summary: "Get the current hero section",
        responses: {
          "200": {
            description: "Hero section returned successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HeroSectionApiResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Hero section not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/hero-section/upsert": {
      post: {
        tags: ["Hero Section"],
        summary: "Create or update the hero section",
        description:
          "Creates a new hero section row when id is 0 or missing, and updates an existing row when id is greater than 0.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HeroSectionUpsertRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Hero section saved successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SingleUpsertApiResponse" },
              },
            },
          },
          "400": {
            description: "Validation failed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/admin/use-cases/{useCaseId}/details": {
      get: {
        tags: ["Use Case Details"],
        summary: "Get one use case with all detail rows",
        parameters: [
          {
            name: "useCaseId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "Use case with detail rows returned.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UseCaseWithDetailsApiResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Use case not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    parameters: {
      NodeId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer" },
      },
      DetailId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer" },
      },
    },
    schemas: {
      DatabaseHealthResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          driver: { type: "string" },
          database: { type: "string", nullable: true },
        },
      },
      AdminLoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string" },
          password: { type: "string" },
        },
      },
      QueryBasePayload: {
        type: "object",
        properties: {
          page: { type: "integer", minimum: 1, default: 1 },
          limit: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          search: { type: "string" },
          sortBy: { type: "string", enum: ["title", "created_at", "updated_at"] },
          sortOrder: { type: "string", enum: ["asc", "desc"], default: "desc" },
        },
      },
      ApiResponseMeta: {
        type: "object",
        required: ["success", "message", "error"],
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          error: { type: "string", nullable: true },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["success", "message", "error"],
        properties: {
          success: { type: "boolean", enum: [false] },
          message: { type: "string" },
          data: { nullable: true, example: null },
          error: { type: "string" },
        },
      },
      HierarchyRow: {
        type: "object",
        required: ["id", "parentId", "title", "type", "description", "slug", "createdAt", "updatedAt"],
        properties: {
          id: { type: "integer" },
          parentId: { type: "integer", nullable: true },
          title: { type: "string" },
          type: { type: "string", enum: ["industry", "function", "usecase"] },
          description: { type: "string", nullable: true },
          slug: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      HierarchyListData: {
        type: "object",
        required: ["result", "count"],
        properties: {
          result: {
            type: "array",
            items: { $ref: "#/components/schemas/HierarchyRow" },
          },
          count: { type: "integer" },
        },
      },
      HierarchyListRequest: {
        allOf: [
          { $ref: "#/components/schemas/QueryBasePayload" },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["industry", "function", "usecase"] },
              parentId: { type: "integer" },
            },
          },
        ],
      },
      HierarchyListApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/HierarchyListData" },
            },
          },
        ],
      },
      IndustryBulkUpsertRequest: {
        type: "object",
        required: ["items"],
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              required: ["title"],
              properties: {
                id: { type: "integer", description: "Send 0 or omit to create, send existing id to update." },
                title: { type: "string" },
                description: { type: "string", nullable: true },
              },
            },
          },
        },
      },
      FunctionBulkUpsertRequest: {
        type: "array",
        items: {
          type: "object",
          required: ["industryId", "items"],
          properties: {
            industryId: { type: "integer" },
            items: {
              type: "array",
              items: {
                type: "object",
                required: ["title"],
                properties: {
                  id: { type: "integer", description: "Send 0 or omit to create, send existing id to update." },
                  title: { type: "string" },
                  description: { type: "string", nullable: true },
                },
              },
            },
          },
        },
      },
      UseCaseUpsertRequest: {
        type: "object",
        required: ["functionId", "title"],
        properties: {
          id: { type: "integer", description: "Send 0 or omit to create, send existing id to update." },
          functionId: { type: "integer" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          usecaseDetails: {
            type: "array",
            items: { $ref: "#/components/schemas/UseCaseDetailNestedInput" },
          },
        },
      },
      UseCaseDetailNestedInput: {
        type: "object",
        required: ["type", "description"],
        properties: {
          id: { type: "integer", description: "Send 0 or omit to create, send existing id to update." },
          type: {
            type: "string",
            enum: ["Impact", "Outcome", "Artifacts", "Challenges"],
          },
          description: {
            type: "string",
            description: "Formatted HTML stored in the database.",
          },
          filePath: {
            type: "string",
            nullable: true,
            description: "Relative media path stored for the detail row.",
          },
        },
      },
      UseCaseDetailUpsertRequest: {
        type: "object",
        required: ["useCaseId", "type", "description"],
        properties: {
          id: { type: "integer", description: "Send 0 or omit to create, send existing id to update." },
          useCaseId: { type: "integer" },
          type: {
            type: "string",
            enum: ["Impact", "Outcome", "Artifacts", "Challenges"],
          },
          description: {
            type: "string",
            description: "Formatted HTML stored in the database.",
          },
          filePath: {
            type: "string",
            nullable: true,
            description: "Relative media path stored for the detail row.",
          },
        },
      },
      BulkDeleteRequest: {
        type: "object",
        required: ["ids"],
        properties: {
          ids: {
            type: "array",
            items: { type: "integer" },
          },
        },
      },
      UpsertResult: {
        type: "object",
        required: ["id", "action"],
        properties: {
          id: { type: "integer" },
          action: { type: "string", enum: ["created", "updated"] },
        },
      },
      BulkUpsertResultData: {
        type: "array",
        items: { $ref: "#/components/schemas/UpsertResult" },
      },
      BulkUpsertApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/BulkUpsertResultData" },
            },
          },
        ],
      },
      SingleUpsertResultData: {
        $ref: "#/components/schemas/UpsertResult",
      },
      SingleUpsertApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/SingleUpsertResultData" },
            },
          },
        ],
      },
      UseCaseUpsertResultData: {
        type: "object",
        required: ["useCase", "useCaseDetails"],
        properties: {
          useCase: { $ref: "#/components/schemas/UpsertResult" },
          useCaseDetails: {
            type: "array",
            items: { $ref: "#/components/schemas/UpsertResult" },
          },
        },
      },
      UseCaseUpsertApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/UseCaseUpsertResultData" },
            },
          },
        ],
      },
      DeleteIdsData: {
        type: "object",
        required: ["deletedIds"],
        properties: {
          deletedIds: {
            type: "array",
            items: { type: "integer" },
          },
        },
      },
      DeleteIdsApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/DeleteIdsData" },
            },
          },
        ],
      },
      UseCaseDetailRow: {
        type: "object",
        required: ["id", "useCaseId", "type", "description", "filePath", "createdAt", "updatedAt"],
        properties: {
          id: { type: "integer" },
          useCaseId: { type: "integer" },
          type: {
            type: "string",
            enum: ["Impact", "Outcome", "Artifacts", "Challenges"],
          },
          description: { type: "string" },
          filePath: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UseCaseDetailListData: {
        type: "object",
        required: ["result", "count"],
        properties: {
          result: {
            type: "array",
            items: { $ref: "#/components/schemas/UseCaseDetailRow" },
          },
          count: { type: "integer" },
        },
      },
      UseCaseDetailListApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/UseCaseDetailListData" },
            },
          },
        ],
      },
      UseCaseBasic: {
        type: "object",
        required: ["id", "title", "description"],
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
        },
      },
      FunctionWithUseCases: {
        type: "object",
        required: ["id", "title", "description", "useCases"],
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          useCases: {
            type: "array",
            items: { $ref: "#/components/schemas/UseCaseBasic" },
          },
        },
      },
      IndustryFunctionsUseCasesData: {
        type: "object",
        required: ["industry", "functions"],
        properties: {
          industry: {
            type: "object",
            required: ["id", "title", "description"],
            properties: {
              id: { type: "integer" },
              title: { type: "string" },
              description: { type: "string", nullable: true },
            },
          },
          functions: {
            type: "array",
            items: { $ref: "#/components/schemas/FunctionWithUseCases" },
          },
        },
      },
      IndustryFunctionsUseCasesApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/IndustryFunctionsUseCasesData" },
            },
          },
        ],
      },
      UseCaseWithDetailsData: {
        type: "object",
        required: ["useCase", "details"],
        properties: {
          useCase: { $ref: "#/components/schemas/UseCaseBasic" },
          details: {
            type: "array",
            items: { $ref: "#/components/schemas/UseCaseDetailRow" },
          },
        },
      },
      BlogRow: {
        type: "object",
        required: ["id", "title", "slug", "shortDescription", "content", "filepath", "status", "isActive", "createdAt", "updatedAt"],
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          slug: { type: "string" },
          shortDescription: { type: "string", nullable: true },
          content: { type: "string" },
          filepath: { type: "string", nullable: true },
          status: { type: "string", enum: ["draft", "published"] },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      BlogListRequest: {
        type: "object",
        properties: {
          search: { type: "string" },
          status: { type: "string", enum: ["draft", "published"], nullable: true },
        },
      },
      BlogUpsertRequest: {
        type: "object",
        required: ["title", "slug", "content"],
        properties: {
          id: { type: "integer", description: "Send 0 or omit to create, send existing id to update." },
          title: { type: "string" },
          slug: { type: "string" },
          shortDescription: { type: "string", nullable: true },
          content: { type: "string" },
          filepath: { type: "string", nullable: true },
          status: { type: "string", enum: ["draft", "published"], nullable: true },
        },
      },
      BlogListData: {
        type: "object",
        required: ["result", "count"],
        properties: {
          result: { type: "array", items: { $ref: "#/components/schemas/BlogRow" } },
          count: { type: "integer" },
        },
      },
      BlogListApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/BlogListData" },
            },
          },
        ],
      },
      BlogApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/BlogRow" },
            },
          },
        ],
      },
      PlanRow: {
        type: "object",
        required: ["id", "planCode", "shortDescription", "highlightedFeatures", "features", "show", "isActive", "createdAt", "updatedAt"],
        properties: {
          id: { type: "integer" },
          planCode: { type: "string", nullable: true },
          shortDescription: { type: "string", nullable: true },
          highlightedFeatures: { type: "string", nullable: true },
          features: { type: "string", nullable: true },
          show: { type: "boolean" },
          isActive: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PlanListRequest: {
        type: "object",
        properties: {
          search: { type: "string" },
          hide: { type: "boolean", nullable: true, description: "Null returns all active plans, true returns hidden only, false returns visible only." },
        },
      },
      PlanUpsertRequest: {
        type: "object",
        required: ["show"],
        properties: {
          id: { type: "integer", description: "Send 0 or omit to create, send existing id to update." },
          planCode: { type: "string", nullable: true, description: "Optional for custom plans." },
          shortDescription: { type: "string", nullable: true, description: "Brief summary copy for the plan card." },
          highlightedFeatures: { type: "string", nullable: true, description: "Formatted template/HTML content." },
          features: { type: "string", nullable: true, description: "Formatted template/HTML content." },
          show: { type: "boolean", description: "True keeps the plan visible, false hides it." },
        },
      },
      PlanVisibilityRequest: {
        type: "object",
        required: ["show"],
        properties: {
          show: { type: "boolean" },
        },
      },
      PlanListData: {
        type: "object",
        required: ["result", "count"],
        properties: {
          result: { type: "array", items: { $ref: "#/components/schemas/PlanRow" } },
          count: { type: "integer" },
        },
      },
      PlanListApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/PlanListData" },
            },
          },
        ],
      },
      PlanApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/PlanRow" },
            },
          },
        ],
      },
      PlanVisibilityResult: {
        type: "object",
        required: ["id", "show"],
        properties: {
          id: { type: "integer" },
          show: { type: "boolean" },
        },
      },
      PlanVisibilityApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/PlanVisibilityResult" },
            },
          },
        ],
      },
      HeroSectionData: {
        type: "object",
        required: ["salesBarText", "heroHeading", "highlightedHeading", "shortDescription", "buttonText", "buttonText2", "filepath"],
        properties: {
          salesBarText: { type: "string" },
          heroHeading: { type: "string" },
          highlightedHeading: { type: "string" },
          shortDescription: { type: "string" },
          buttonText: { type: "string" },
          buttonText2: { type: "string" },
          filepath: { type: "string", nullable: true },
        },
      },
      HeroSectionRow: {
        type: "object",
        required: ["id", "data", "createdAt", "updatedAt"],
        properties: {
          id: { type: "integer" },
          data: { $ref: "#/components/schemas/HeroSectionData" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      HeroSectionUpsertRequest: {
        type: "object",
        required: ["data"],
        properties: {
          id: { type: "integer", description: "Send 0 or omit to create, send existing id to update." },
          data: { $ref: "#/components/schemas/HeroSectionData" },
        },
      },
      HeroSectionApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/HeroSectionRow" },
            },
          },
        ],
      },
      DeleteSingleApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: {
                type: "object",
                required: ["deletedId"],
                properties: {
                  deletedId: { type: "integer" },
                },
              },
            },
          },
        ],
      },
      UseCaseWithDetailsApiResponse: {
        allOf: [
          { $ref: "#/components/schemas/ApiResponseMeta" },
          {
            type: "object",
            properties: {
              data: { $ref: "#/components/schemas/UseCaseWithDetailsData" },
            },
          },
        ],
      },
    },
  },
} as const;

