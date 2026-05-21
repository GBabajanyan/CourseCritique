// swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CourseCritique API",
      version: "1.0.0",
      description: "REST API for CourseCritique - Student Feedback Platform",
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
      // Add production URL when deployed
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
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            year: { type: "string" },
            degree: { type: "string" },
          },
        },
        Course: {
          type: "object",
          properties: {
            id: { type: "string" },
            course_code: { type: "string" },
            course_name: { type: "string" },
            instructor: { type: "string" },
            department: { type: "string" },
            credits: { type: "integer" },
            section: { type: "string" },
          },
        },
        Feedback: {
          type: "object",
          properties: {
            id: { type: "string" },
            status: { type: "string", enum: ["pending", "completed"] },
            feedback_phase: {
              type: "string",
              enum: ["addDrop", "midterm", "finals"],
            },
            start_date: { type: "string", format: "date" },
            deadline: { type: "string", format: "date" },
            submitted_at: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to files containing JSDoc comments
  apis: [
    "./routes/auth.js",
    "./routes/mobileApp*.js",
    "./routes/dashboard/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
