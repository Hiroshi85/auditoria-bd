import { z } from "zod";
import { SQL_BANNED_KEYWORDS } from "@/constants/personalizadas/sql-keywords";

export const PersonalizadasFormSchema = z
  .object({
    task_name: z.string().min(1).max(50),
    query: z.string().min(1),
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
