"use client";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { BotIcon, LucidePanelBottomOpen, SendIcon } from "lucide-react";
import { PersonalizadasFormSchema } from "./form-schema";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useConnectionDatabase } from "@/providers/connection";
import { API_HOST } from "@/constants/server";
import { useParams, useSearchParams } from "next/navigation";

interface Props {
    form: UseFormReturn<z.infer<typeof PersonalizadasFormSchema>>;
}

const formSchema = z.object({
    query: z.string(),
});

export default function EnterPromtp({ form }: Props) {
    const [columnsListOpen, setColumnsListOpen] = useState(false);

    const {id} = useConnectionDatabase();

    const formHook = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    const params = useSearchParams();
    const table = params.get("table") ?? "";

    async function OnSubmit(data: z.infer<typeof formSchema>) {
        try {
            const response = await axios.post(`${API_HOST}/aud/completions/${id}`, {
                query: data.query,
                table: table,
            }, {
                withCredentials: true,
            });

            form.setValue("query", response.data.message);

        }catch(e){
            toast.error("Error al enviar la consulta")
        }
    }

    return (
        <Popover open={columnsListOpen} onOpenChange={setColumnsListOpen}>
            <PopoverTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <BotIcon className="w-6 h-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="center" side="top">
                <Form {...formHook}>
                    <div className="flex">
                        <FormField
                            control={formHook.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prompt</FormLabel>
                                    <div className="flex">
                                        <FormControl>
                                            <Input
                                                placeholder="quiero ..."
                                                type="text"
                                                onKeyUp={(e) => {
                                                    if (e.key === "Enter") {
                                                        formHook.handleSubmit(OnSubmit)();
                                                    }
                                                }}
                                                {...field}
                                            />
                                        </FormControl>
                                        <Button type="button" size={"icon"} className="min-w-10" onClick={() => formHook.handleSubmit(OnSubmit)()} disabled={formHook.formState.isSubmitting}>
                                            <SendIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Form>
            </PopoverContent>
        </Popover>
    );
}
