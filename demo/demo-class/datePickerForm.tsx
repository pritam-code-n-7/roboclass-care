/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// import PhoneInput from "react-phone-input-2";

const items = [
  {
    id: "24hours",
    label: "24 Hours",
  },
  {
    id: "1hour",
    label: "1 Hour",
  },
] as const;

const FormSchema = z.object({
  date: z.string({ required_error: "A date is required." }),

  userName: z
    .string()
    .min(2, { message: "name must contain atleast 2 character." }),

  destination: z.string().min(12, { message: "mobile is incorrect." }),

  course: z
    .string()
    .min(2, { message: "course must contain atleast 2 chracter" }),

  time: z.string({ required_error: "Time slot is required." }),

  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function DatePickerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userName: "",
      destination: "+971",
      course: "",
      date: undefined,
      time: new Date().toLocaleTimeString().substring(11, 16),
      items: ["1hour"],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      //  const formattedDate = data.date.toISOString();
      await fetch("/api/scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error booking appointment", error);
    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Student/Parent name"
                  {...field}
                  required
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Contact Number</FormLabel>

              <FormControl>
                <Input
                  placeholder="Parent's Mobile/WhatsApp number"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
               <FormLabel className="font-semibold">Phone</FormLabel>
              <FormControl>
                <PhoneInput
                  country={"us"}
                  placeholder="Parents Contact/Whatsapp number"
                  {...field}               
                  inputClass="phone-input" 
                  specialLabel= ""
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Course Details</FormLabel>

              <FormControl>
                <Input
                  placeholder="e.g. - AI for kids"
                  {...field}
                  required
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-semibold">
                Book an Appointment
              </FormLabel>
              {/* <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    required
                  />
                  <div className="p-10"></div>
                </PopoverContent>
              </Popover> */}
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  required
                  className="bg-white"
                />
              </FormControl>
              <FormDescription>
                Book an appointment for demo class
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Your time slot</FormLabel>

              <FormControl>
                <Input
                  type="time"
                  placeholder="e.g. - AI for kids"
                  {...field}
                  required
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="font-bold">
                  When to send the Reminder
                </FormLabel>
                <FormDescription>
                  Select the time which you want!
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Book</Button>
      </form>
    </Form>
  );
}
