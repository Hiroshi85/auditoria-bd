import { z } from "zod";
import { SQL_BANNED_KEYWORDS } from "@/constants/personalizadas/sql-keywords";

export const PersonalizadasFormSchema = z
  .object({
    table: z.string().optional(),
    name: z.string().max(60).refine((value) => value !== "", { message: "El nombre de la tarea debe tener al menos 1 caracter" }),
    query: z.string().refine((value) => value !== "", { message: "La consulta no puede estar vacía" }),
  })
  .superRefine((val, ctx) => {
    if (val.query) {
      const bannedKeywords = SQL_BANNED_KEYWORDS.filter((keyword) => {
        return new RegExp(`\\b${keyword}\\b`, "i").test(val.query);
      });

      if (bannedKeywords.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["query"],
          message: `No puedes usar las siguientes palabras reservadas: ${bannedKeywords.join(", ")}`,
        });

      }
    }
  });
