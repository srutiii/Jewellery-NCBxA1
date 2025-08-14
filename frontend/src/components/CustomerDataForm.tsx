import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Diamond } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { firebaseService } from "@/services/firebaseService";
import { transformFormDataToApiData } from "@/utils/dataTransform";

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  contact_number: z.string().min(1, "Contact number is required"),
  email_address: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  community: z.string().optional(),
  sub_community: z.string().optional(),
  location: z.string().optional(), // City / Pincode
  
  // Purchase History
  transaction_id: z.string().optional(),
  sku_product_id: z.string().optional(),
  product_category: z.string().optional(),
  product_subcategory: z.string().optional(),
  metal_type: z.string().optional(),
  metal_purity: z.string().optional(),
  gemstone_type: z.string().optional(),
  gemstone_details: z.string().optional(),
  design_style: z.string().optional(),
  purchase_date_time: z.string().optional(),
  purchase_value: z.string().optional(),
  discount_applied: z.boolean().default(false),
  discount_value: z.string().optional(),
  
  // Personal Information
  date_of_birth: z.date().optional(),
  anniversary_date: z.date().optional(),
  gender: z.string().optional(),
  marital_status: z.string().optional(),
  
  // Occasion and Relationship
  occasion_for_purchase: z.string().min(1, "Occasion for purchase is required"),
  gift_recipient_relationship: z.string().optional(),
  
  // Business Intelligence
  items_shown_or_discussed: z.string().optional(),
  expressed_interest_or_intent: z.string().optional(),
  in_store_query: z.string().optional(),
  budget_mentioned: z.string().optional(),
  frequency_of_visit: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const CustomerDataForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      contact_number: "",
      email_address: "",
      address: "",
      community: "",
      sub_community: "",
      location: "",
      
      // Purchase History
      transaction_id: "",
      sku_product_id: "",
      product_category: "",
      product_subcategory: "",
      metal_type: "",
      metal_purity: "",
      gemstone_type: "",
      gemstone_details: "",
      design_style: "",
      purchase_date_time: "",
      purchase_value: "",
      discount_applied: false,
      discount_value: "",
      
      // Personal Information
      gender: "",
      marital_status: "",
      
      // Occasion and Relationship
      occasion_for_purchase: "",
      gift_recipient_relationship: "",
      
      // Business Intelligence
      items_shown_or_discussed: "",
      expressed_interest_or_intent: "",
      in_store_query: "",
      budget_mentioned: "",
      frequency_of_visit: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Transform form data to API format
      const apiData = transformFormDataToApiData(data);
      
      // Call Firebase to create customer
      const response = await firebaseService.createCustomer(apiData);
      
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      
      // Success
      toast({
        title: "Customer data saved successfully!",
        description: `Data for ${data.full_name} has been recorded.`,
      });
      
      form.reset();
    } catch (error) {
      console.error("Error saving customer:", error);
      toast({
        title: "Error",
        description: "Failed to save customer data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-luxury-gold-dark shadow-elegant border-2 border-primary/20 animate-bounce-in">
            <Diamond className="h-10 w-10 text-primary-foreground animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Nemichand Bamalwa
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">Customer Data Form</p>
          <div className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-primary to-luxury-gold rounded-full"></div>
        </div>

        <Card className="shadow-elegant border border-primary/10 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="space-y-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-luxury-gold/5 animate-shimmer"></div>
            <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent relative z-10">
              Customer Information
            </CardTitle>
            <CardDescription className="text-center text-lg relative z-10">
              Please fill in the customer details below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter customer full name"
                          {...field}
                          className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Number */}
                <FormField
                  control={form.control}
                  name="contact_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter contact number"
                          {...field}
                          className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Address */}
                <FormField
                  control={form.control}
                  name="email_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                          className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter full address"
                          className="min-h-[80px] resize-none bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Community */}
                <FormField
                  control={form.control}
                  name="community"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Marwari, Bengali, etc."
                          {...field}
                          className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sub Community */}
                <FormField
                  control={form.control}
                  name="sub_community"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Community</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Agarwal, Maheshwari, etc."
                          {...field}
                          className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location (City / Pincode) */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (City / Pincode)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city or pincode"
                          {...field}
                          className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Purchase History Section */}
                <div className="pt-6 border-t border-border/20">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Purchase History</h3>
                  
                  {/* Transaction ID */}
                  <FormField
                    control={form.control}
                    name="transaction_id"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Transaction ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter transaction ID"
                            {...field}
                            className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SKU / Product ID */}
                  <FormField
                    control={form.control}
                    name="sku_product_id"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>SKU / Product ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter SKU or product ID"
                            {...field}
                            className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Category */}
                  <FormField
                    control={form.control}
                    name="product_category"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Product Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select product category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="Ring" className="focus:bg-primary/10 transition-colors">Ring</SelectItem>
                            <SelectItem value="Necklace" className="focus:bg-primary/10 transition-colors">Necklace</SelectItem>
                            <SelectItem value="Earrings" className="focus:bg-primary/10 transition-colors">Earrings</SelectItem>
                            <SelectItem value="Bangle" className="focus:bg-primary/10 transition-colors">Bangle</SelectItem>
                            <SelectItem value="Watch" className="focus:bg-primary/10 transition-colors">Watch</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Subcategory */}
                  <FormField
                    control={form.control}
                    name="product_subcategory"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Product Subcategory</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select product subcategory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="Engagement Ring" className="focus:bg-primary/10 transition-colors">Engagement Ring</SelectItem>
                            <SelectItem value="Cocktail Ring" className="focus:bg-primary/10 transition-colors">Cocktail Ring</SelectItem>
                            <SelectItem value="Studs" className="focus:bg-primary/10 transition-colors">Studs</SelectItem>
                            <SelectItem value="Hoops" className="focus:bg-primary/10 transition-colors">Hoops</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Metal Type */}
                  <FormField
                    control={form.control}
                    name="metal_type"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Metal Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select metal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="Gold" className="focus:bg-primary/10 transition-colors">Gold</SelectItem>
                            <SelectItem value="Platinum" className="focus:bg-primary/10 transition-colors">Platinum</SelectItem>
                            <SelectItem value="Silver" className="focus:bg-primary/10 transition-colors">Silver</SelectItem>
                            <SelectItem value="Rose Gold" className="focus:bg-primary/10 transition-colors">Rose Gold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Metal Purity */}
                  <FormField
                    control={form.control}
                    name="metal_purity"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Metal Purity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select metal purity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="18K" className="focus:bg-primary/10 transition-colors">18K</SelectItem>
                            <SelectItem value="22K" className="focus:bg-primary/10 transition-colors">22K</SelectItem>
                            <SelectItem value="24K" className="focus:bg-primary/10 transition-colors">24K</SelectItem>
                            <SelectItem value="950 Platinum" className="focus:bg-primary/10 transition-colors">950 Platinum</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gemstone Type */}
                  <FormField
                    control={form.control}
                    name="gemstone_type"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Gemstone Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select gemstone type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="Diamond" className="focus:bg-primary/10 transition-colors">Diamond</SelectItem>
                            <SelectItem value="Ruby" className="focus:bg-primary/10 transition-colors">Ruby</SelectItem>
                            <SelectItem value="Emerald" className="focus:bg-primary/10 transition-colors">Emerald</SelectItem>
                            <SelectItem value="Sapphire" className="focus:bg-primary/10 transition-colors">Sapphire</SelectItem>
                            <SelectItem value="Pearl" className="focus:bg-primary/10 transition-colors">Pearl</SelectItem>
                            <SelectItem value="None" className="focus:bg-primary/10 transition-colors">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gemstone Details */}
                  <FormField
                    control={form.control}
                    name="gemstone_details"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Gemstone Details</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Carat, Cut, Colour, Clarity (The 4Cs)"
                            {...field}
                            className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Design Style */}
                  <FormField
                    control={form.control}
                    name="design_style"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Design Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select design style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="Modern" className="focus:bg-primary/10 transition-colors">Modern</SelectItem>
                            <SelectItem value="Vintage" className="focus:bg-primary/10 transition-colors">Vintage</SelectItem>
                            <SelectItem value="Traditional" className="focus:bg-primary/10 transition-colors">Traditional</SelectItem>
                            <SelectItem value="Minimalist" className="focus:bg-primary/10 transition-colors">Minimalist</SelectItem>
                            <SelectItem value="Art Deco" className="focus:bg-primary/10 transition-colors">Art Deco</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Purchase Date & Time (Timestamp) */}
                  <FormField
                    control={form.control}
                    name="purchase_date_time"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Purchase Date & Time</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            placeholder="Select purchase date & time"
                            {...field}
                            className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Purchase Value */}
                  <FormField
                    control={form.control}
                    name="purchase_value"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Purchase Value</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter purchase value (₹)"
                            {...field}
                            className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Discount Applied */}
                  <FormField
                    control={form.control}
                    name="discount_applied"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Discount Applied</FormLabel>
                        <FormControl>
                          <div className="flex h-12 items-center gap-3 rounded-md border border-border/50 bg-card/50 px-3">
                            <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                            <span className="text-sm text-muted-foreground">Toggle if any discount was applied</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Discount Value (Shown if discount applied) */}
                  {form.watch("discount_applied") && (
                    <FormField
                      control={form.control}
                      name="discount_value"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Discount Value</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter discount percentage or amount"
                              {...field}
                              className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Personal Information Section */}
                <div className="pt-6 border-t border-border/20">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Personal Information</h3>
                  
                  {/* Date of Birth */}
                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-4">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-12 pl-3 text-left font-normal bg-card/50 border-border/50 hover:border-primary/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:shadow-elegant",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick date of birth</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Anniversary Date */}
                  <FormField
                    control={form.control}
                    name="anniversary_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mb-4">
                        <FormLabel>Anniversary Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-12 pl-3 text-left font-normal bg-card/50 border-border/50 hover:border-primary/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:shadow-elegant",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick anniversary date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="Male" className="focus:bg-primary/10 transition-colors">Male</SelectItem>
                            <SelectItem value="Female" className="focus:bg-primary/10 transition-colors">Female</SelectItem>
                            <SelectItem value="Other" className="focus:bg-primary/10 transition-colors">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Marital Status */}
                  <FormField
                    control={form.control}
                    name="marital_status"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select marital status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="Single" className="focus:bg-primary/10 transition-colors">Single</SelectItem>
                            <SelectItem value="Engaged" className="focus:bg-primary/10 transition-colors">Engaged</SelectItem>
                            <SelectItem value="Married" className="focus:bg-primary/10 transition-colors">Married</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Occasion and Relationship Section */}
                <div className="pt-6 border-t border-border/20">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Occasion & Relationship</h3>
                  
                  {/* Occasion for Purchase */}
                  <FormField
                    control={form.control}
                    name="occasion_for_purchase"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Occasion for Purchase *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select occasion" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="Wedding" className="focus:bg-primary/10 transition-colors">Wedding</SelectItem>
                            <SelectItem value="Anniversary" className="focus:bg-primary/10 transition-colors">Anniversary</SelectItem>
                            <SelectItem value="Birthday Gift" className="focus:bg-primary/10 transition-colors">Birthday Gift</SelectItem>
                            <SelectItem value="Self-Purchase (Reward)" className="focus:bg-primary/10 transition-colors">Self-Purchase (Reward)</SelectItem>
                            <SelectItem value="Investment (e.g., gold coins)" className="focus:bg-primary/10 transition-colors">Investment (e.g., gold coins)</SelectItem>
                            <SelectItem value="Festive Gift (e.g., Diwali, Akshaya Tritiya)" className="focus:bg-primary/10 transition-colors">Festive Gift (e.g., Diwali, Akshaya Tritiya)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gift Recipient Relationship */}
                  <FormField
                    control={form.control}
                    name="gift_recipient_relationship"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Gift Recipient Relationship</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="Spouse" className="focus:bg-primary/10 transition-colors">Spouse</SelectItem>
                            <SelectItem value="Parent" className="focus:bg-primary/10 transition-colors">Parent</SelectItem>
                            <SelectItem value="Child" className="focus:bg-primary/10 transition-colors">Child</SelectItem>
                            <SelectItem value="Sibling" className="focus:bg-primary/10 transition-colors">Sibling</SelectItem>
                            <SelectItem value="Friend" className="focus:bg-primary/10 transition-colors">Friend</SelectItem>
                            <SelectItem value="Self" className="focus:bg-primary/10 transition-colors">Self</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Business Intelligence Section */}
                <div className="pt-6 border-t border-border/20">
                  <h3 className="text-lg font-semibold mb-4 text-primary">Business Intelligence</h3>
                  
                  {/* Items Shown or Discussed */}
                  <FormField
                    control={form.control}
                    name="items_shown_or_discussed"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Items Shown or Discussed</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Showed client heavy gold bridal sets, Client spent 20 minutes looking at platinum tennis bracelets"
                            className="min-h-[80px] resize-none bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Expressed Interest or Intent */}
                  <FormField
                    control={form.control}
                    name="expressed_interest_or_intent"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Expressed Interest or Intent</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Client mentioned she is saving for a solitaire for her 40th birthday next year, Husband and wife loved the Navaratna necklace but want to think about it"
                            className="min-h-[80px] resize-none bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* In-Store Query */}
                  <FormField
                    control={form.control}
                    name="in_store_query"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>In-Store Query</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Do you have lightweight daily-wear gold chains? This is the equivalent of a website search query"
                            className="min-h-[80px] resize-none bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Budget Mentioned */}
                  <FormField
                    control={form.control}
                    name="budget_mentioned"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Budget Mentioned</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Looking for a ring around ₹1.5 lakh"
                            {...field}
                            className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Frequency of Visit */}
                  <FormField
                    control={form.control}
                    name="frequency_of_visit"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Frequency of Visit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all duration-300 hover:border-primary/30 focus:shadow-elegant">
                              <SelectValue placeholder="How often do they visit your store?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover/95 backdrop-blur-sm border-primary/10 shadow-elegant animate-scale-in">
                            <SelectItem value="First time" className="focus:bg-primary/10 transition-colors">First time</SelectItem>
                            <SelectItem value="Occasional (2-3 times a year)" className="focus:bg-primary/10 transition-colors">Occasional (2-3 times a year)</SelectItem>
                            <SelectItem value="Regular (Monthly)" className="focus:bg-primary/10 transition-colors">Regular (Monthly)</SelectItem>
                            <SelectItem value="Frequent (Weekly)" className="focus:bg-primary/10 transition-colors">Frequent (Weekly)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-primary to-luxury-gold hover:from-primary/90 hover:to-luxury-gold/90 text-primary-foreground font-semibold text-lg shadow-elegant hover:shadow-luxury transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save Customer Data"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};