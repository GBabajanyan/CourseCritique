// swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CourseCritique API",
      version: "1.0.0",
      description:
        "REST API for CourseCritique — a student feedback platform. " +
        "Endpoints are split into three groups: **Auth** (public), **Mobile App** (student role), and **Dashboard** (admin/instructor role). " +
        "All protected routes require a Bearer JWT token obtained from `/auth/user_login`.",
      contact: {
        name: "George Babajanyan",
        email: "george.babajanyan@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
      {
        url: "https://coursecritique-o419.onrender.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT access token obtained from POST /auth/user_login",
        },
      },
      schemas: {
        UserProfile: {
          type: "object",
          description: "Full student profile returned after login or profile fetch",
          properties: {
            id: { type: "string", format: "uuid", description: "Internal profile UUID" },
            userId: { type: "string", format: "uuid", description: "Auth user UUID" },
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Smith" },
            email: { type: "string", format: "email", example: "john.smith@university.edu" },
            studentId: { type: "string", example: "S12345", description: "University-assigned student ID" },
            year: { type: "string", example: "2", description: "Academic year (1–4)" },
            degree: { type: "string", example: "Computer Science" },
            role: { type: "string", enum: ["student", "instructor", "admin"] },
            join_date: { type: "string", format: "date-time", description: "Account creation timestamp" },
          },
        },
        AuthTokens: {
          type: "object",
          description: "JWT token pair returned on login or token refresh",
          properties: {
            authToken: { type: "string", description: "Short-lived JWT access token (use in Authorization header)" },
            refreshToken: { type: "string", description: "Long-lived refresh token (30-day expiry)" },
          },
          required: ["authToken", "refreshToken"],
        },
        Course: {
          type: "object",
          description: "Core course record",
          properties: {
            id: { type: "string", format: "uuid" },
            course_code: { type: "string", example: "CS101" },
            course_name: { type: "string", example: "Introduction to Computer Science" },
            instructor: { type: "string", example: "Dr. Jane Doe" },
            department: { type: "string", example: "Computer Science" },
            credits: { type: "integer", example: 3 },
            section: { type: "string", example: "A" },
            description: { type: "string" },
          },
        },
        CourseWithStats: {
          allOf: [
            { $ref: "#/components/schemas/Course" },
            {
              type: "object",
              properties: {
                total_students: { type: "integer", description: "Number of enrolled students" },
                feedback_completed: { type: "integer", description: "Number of completed feedbacks" },
                pending_feedbacks: { type: "integer", description: "Number of pending feedbacks" },
              },
            },
          ],
        },
        FeedbackRatings: {
          type: "object",
          description: "Feedback response object. Numeric fields use a 1–5 scale; text fields are open-ended and optional.",
          properties: {
            course_pace: { type: "integer", minimum: 1, maximum: 5, example: 4 },
            instructor_clarity: { type: "integer", minimum: 1, maximum: 5, example: 5 },
            course_organization: { type: "integer", minimum: 1, maximum: 5, example: 3 },
            overall_satisfaction: { type: "integer", minimum: 1, maximum: 5, example: 4 },
            advice_future_gen: { type: "string", description: "Advice for future students (open-ended)", example: "Come to office hours early" },
            strengths: { type: "string", description: "Course strengths (open-ended)", example: "Great lecture slides" },
            improvements: { type: "string", description: "Suggested improvements (open-ended)", example: "More practice problems" },
          },
        },
        Badge: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string", example: "Pioneer" },
            description: { type: "string" },
            section: { type: "string", enum: ["milestones", "quality", "diversity", "bonus"] },
            icon: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Resource not found" },
          },
          required: ["error"],
        },
        Message: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: "Authentication", description: "Public auth endpoints — register, login, token refresh, logout" },
      { name: "Mobile - Courses", description: "Course listing for the student mobile app (requires student role)" },
      { name: "Mobile - Feedback", description: "Feedback submission and history for students (requires student role)" },
      { name: "Mobile - Profile", description: "Student profile and badge endpoints (requires student role)" },
      { name: "Dashboard - Courses", description: "Course management for admin/instructor dashboard" },
      { name: "Dashboard - Students", description: "Student management for admin/instructor dashboard" },
      { name: "Dashboard - Analytics", description: "Aggregate statistics and trends for admin/instructor dashboard" },
    ],
  },
  apis: [
    "./routes/auth.js",
    "./routes/mobileApp/*.js",
    "./routes/dashboard/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
