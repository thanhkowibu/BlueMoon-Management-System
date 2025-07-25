"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateFeeRequest } from "@/lib/types/fee";
import { IconPlus } from "@tabler/icons-react";
import { MonthSelect } from "@/components/ui/month-select";

const formSchema = z.object({
  type: z.string().min(2, "Fee type must be at least 2 characters"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  month: z.string().min(1, "Month is required"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  compulsory: z.boolean(),
});

interface CreateFeeDialogProps {
  onSubmit: (data: CreateFeeRequest) => Promise<void>;
  isLoading?: boolean;
}

export function CreateFeeDialog({ onSubmit, isLoading }: CreateFeeDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isCustomType, setIsCustomType] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      amount: 0,
      month: "",
      description: "",
      compulsory: true,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create fee:", error);
    }
  };

  const handleTypeChange = (value: string) => {
    if (value === "other") {
      setIsCustomType(true);
      form.setValue("type", "");
    } else {
      setIsCustomType(false);
      form.setValue("type", value);
      // Set compulsory based on type
      form.setValue("compulsory", value === "area");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Add Fee</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Fee</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new fee to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee Type</FormLabel>
                    {isCustomType ? (
                      <FormControl>
                        <Input placeholder="Enter custom fee type" {...field} />
                      </FormControl>
                    ) : (
                      <Select
                        onValueChange={handleTypeChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fee type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="area">Phí diện tích</SelectItem>
                          <SelectItem value="vehicle">Phí gửi xe</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <FormControl>
                        <MonthSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          id="month"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compulsory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compulsory</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={field.value ? "true" : "false"}
                      disabled={form.getValues("type") === "area"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Is this fee compulsory?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes - Compulsory</SelectItem>
                        <SelectItem value="false">No - Optional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Fee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
