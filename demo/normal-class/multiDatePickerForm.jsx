/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
// import PhoneInput from "react-phone-input-2";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { SetStateAction, useState } from "react";

const items = [
  {
    id: "24hours",
    label: "24 Hours",
  },
  {
    id: "1hour",
    label: "1 Hour",
  },
];

const weekdays = [
  {
    id: "sun",
    label: "Sunday",
  },
  {
    id: "mon",
    label: "Monday",
  },
  {
    id: "tue",
    label: "Tuesday",
  },
  {
    id: "wed",
    label: "Wednesday",
  },
  {
    id: "thu",
    label: "Thursday",
  },
  {
    id: "fri",
    label: "Friday",
  },
  {
    id: "sat",
    label: "Saturday",
  },
];

const times = [
  {
    id: new Date().toLocaleTimeString().substring(11, 16),
    label: "",
  },
  {
    id: new Date().toLocaleTimeString().substring(11, 16),
    label: "",
  },
  {
    id: new Date().toLocaleTimeString().substring(11, 16),
    label: "",
  },
  {
    id: new Date().toLocaleTimeString().substring(11, 16),
    label: "",
  },
  {
    id: new Date().toLocaleTimeString().substring(11, 16),
    label: "",
  },
  {
    id: new Date().toLocaleTimeString().substring(11, 16),
    label: "",
  },
  {
    id: new Date().toLocaleTimeString().substring(11, 16),
    label: "",
  },
];

const FormSchema = z.object({
  date: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one date.",
  }),

  time: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one time.",
  }),

  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),

  weekdays: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one day.",
  }),

  teacher: z
    .string()
    .min(2, { message: "Teacher name must contain atleast 2 character." }),

  batch: z
    .string()
    .min(2, { message: "Batch name must contain atleast 2 character." }),
});

export function MultiDatePickerForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      teacher: "",
      batch: "Prime B21",
      date: undefined,
      time: ['','','','','','','',],
      items: ["1hour"],
      weekdays: ["mon"],
    },
  });

  // const [startDate, setStartDate] = useState();
  // const [endDate, setEndDate] = useState();

  // const dateRangeHandler = (value) => {
  //   setStartDate(value[0]);
  //   setEndDate(value[1]);
  // };

  async function onSubmit(data) {
    try {
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
        <Table>
          <TableCaption>A list of weekdays with time slot</TableCaption>
          <TableHeader>
            <TableRow>
              {weekdays.map((item) => (
                <TableHead className="w-[100px]" key={item.id}>
                  {item.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {times.map((item, index) => (
                <TableCell className="font-medium" key={item.id}>
                  <FormField
                    control={form.control}
                    name={`time.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                         {item.label}
                        </FormLabel>

                        <FormControl>
                          <Input
                            type="time"
                            placeholder="e.g. - AI for kids"
                            {...field}
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>

        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Batch Details</FormLabel>

              <FormControl>
                <Input {...field} required className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Teacher Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="Enter your teacher name"
                  {...field}
                  required
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
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
        /> */}

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
