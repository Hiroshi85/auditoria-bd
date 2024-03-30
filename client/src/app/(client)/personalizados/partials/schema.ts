import { z } from "zod";

export const PersonalizadasFormSchema = z.object({
    task_name: z.string(),
    script: z.string(),
});
