import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/", // if deploying on main domain
    plugins: [react()],
});
