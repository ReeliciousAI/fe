
export const BACKEND_BASE_URL = process.env.NODE_ENV ==="development" ? "http://localhost:5032" : "https://congen-api.ofneill.com"
export const BACKEND_PROMPT_URL = `${BACKEND_BASE_URL}/generate/prompt`
export const BACKEND_SERVICE_URL = `${BACKEND_BASE_URL}/storage/get-service-files`
export const BACKEND_PROJECTS_URL = `${BACKEND_BASE_URL}/project`
export const BACKEND_FILE_URL = "https://congen-api.ofneill.com/generate/file"