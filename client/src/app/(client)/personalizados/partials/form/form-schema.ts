import { z } from "zod";

export const PersonalizadasFormSchema = z.object({
    task_name: z.string().min(1).max(50),
    columns: z.string().min(1),
    conditions: z.string().optional(),    
});