import { z } from "zod";

export const SecuencialFormSchema = z.object({
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
}).superRefine((val, ctx)=>{
    if (val.column_type === 'str' ){
        if (!val.example){
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['example'],
                message: 'El campo ejemplo es requerido'
            })
        }
    }
});
