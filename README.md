## AI-Powered Browser Extension

### Description

The goal of this project is to automate certain tasks while browsing through job vacancies, such as analyzing job descriptions and providing some insights to a user. It extracts required skills, tries to estimate salary if it's hidden, searches for red flags and composes a basic cover letter to employers for now.

Browser's built-in side panel serves as a view, therefore no website or standalone app is required.

    Note: This is a learning and portfolio project, to explore different aspects of fullstack engineering. It is still in active development.

### Structure

- Frontend: Browser extension on React, TypeScript and WXT Framework;
- Backend: ASP.NET Core app with integrated Google's GenAI SDK;
- Hosting: AWS (ECR for Docker images, Lambda for API);
- Infrastructure: GitHub Actions for CI and Terraform for CD;
- Database: to be implemented yet.  