import { z } from "zod";
import { checkAlphanumericCoincidence, getNumericPart } from "@/helpers/exc-secuenciales/tipos";
export const SecuencialFormSchema = z
  .object({
    column: z.string(),
    column_type: z.string().optional(),
    example: z.string().optional(),
    frequency: z.enum(["D", "W", "ME", "MS", "YE", "YS"]).optional(),
    step: z.coerce.number().optional(),
    static: z.coerce.boolean().optional(),
    max: z.coerce.string().optional(),
    min: z.coerce.string().optional(),
    min_date: z.coerce
      .date()
      .transform((value) => value.toISOString().split("T")[0])
      .optional(),
    max_date: z.coerce
      .date()
      .transform((value) => value.toISOString().split("T")[0])
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.column_type === "str") {

      if(val.min){
        const num = getNumericPart(val.min);
        if(num !== 0 && !num){
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["min"],
            message: "El valor mínimo debe contener al menos un número",
          });
        }
      }

      if(val.max){
        const num = getNumericPart(val.max);
        if(num !== 0 && !num){
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["max"],
            message: "El valor máximo debe contener al menos un número",
          });
        }
      }

      if(val.example){
        const num = getNumericPart(val.example);
        if(num !== 0 && !num){
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["example"],
            message: "El valor de ejemplo debe contener al menos un número",
          });
        }
      }

      if (!val.example) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["example"],
          message: "El campo ejemplo es requerido",
        });
      }

      if (val.example && val.min) {
        const coincide = checkAlphanumericCoincidence(val.example, val.min);

        if (!coincide) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["min"],
            message: "El valor mínimo no coincide con el ejemplo",
          });
        }
      }

      if (val.example && val.max) {
        const coincide = checkAlphanumericCoincidence(val.example, val.max);

        if (!coincide) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["max"],
            message: "El valor máximo no coincide con el ejemplo",
          });
        }
      }

      if (val.min && val.max) {
        const min = getNumericPart(val.min);
        const max = getNumericPart(val.max);
        
        if (min > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["min"],
            message: "El valor mínimo no puede ser mayor al valor máximo",
          });
        }
      }
    }
    // Validaciones date
    if (val.column_type === "date" || val.column_type === "datetime") {
      if (val.min_date && val.max_date) {
        const min = new Date(val.min_date);
        const max = new Date(val.max_date);
        if (min > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["min_date"],
            message: "La fecha mínima no puede ser mayor a la fecha máxima",
          });
        }
      }
    }
    // Validaciones int
    if (val.column_type === "int"){

      
      if(val.min && val.min.match('^[0-9]+$') === null){
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["min"],
          message: "El valor mínimo debe ser un número entero",
        });
      }

      if(val.max && val.max.match('^[0-9]+$') === null){
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["max"],
          message: "El valor máximo debe ser un número entero",
        });
      }

      if (val.min && val.max) {
        const min = parseInt(val.min);
        const max = parseInt(val.max);
        if (min > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["min"],
            message: "El valor mínimo no puede ser mayor al valor máximo",
          });
        }
      }
    }

    if(val.column_type === "int" || val.column_type === "str"){
      if(!val.step){
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["step"],
          message: "El campo paso es requerido",
        });
      }
    }
  });
