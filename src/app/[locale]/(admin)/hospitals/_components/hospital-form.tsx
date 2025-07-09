'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addressApi } from '@/lib/services/address.api';
import { District, Province, Ward } from '@/lib/types/address';
import { CreateHospitalDto, Hospital } from '@/lib/types/hospital';

// Zod schema for validation
const hospitalFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  address: z.string().min(5, 'Address is required.'),
  province: z.string({ required_error: 'Please select a province.' }),
  district: z.string({ required_error: 'Please select a district.' }),
  ward: z.string({ required_error: 'Please select a ward.' }),
  contactInfo: z.object({
    phone: z.string().regex(/^(\+84|0)[0-9]{9,10}$/, 'Invalid Vietnamese phone number.'),
    email: z.string().email('Invalid email address.').optional().or(z.literal(''))
  }),
  operatingHours: z.string().optional(),
  // We'll handle coordinates separately with the map picker
});

type HospitalFormValues = z.infer<typeof hospitalFormSchema>;

interface HospitalFormProps {
  hospital?: Hospital;
  onSubmit: (data: CreateHospitalDto) => void;
  isSubmitting: boolean;
}

export function HospitalForm({ hospital, onSubmit, isSubmitting }: HospitalFormProps) {
  const form = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalFormSchema),
    defaultValues: {
        name: hospital?.name || '',
        address: hospital?.address || '',
        province: hospital?.province || undefined,
        district: hospital?.district || undefined,
        ward: hospital?.ward || undefined,
        contactInfo: {
            phone: hospital?.contactInfo.phone || '',
            email: hospital?.contactInfo.email || '',
        },
        operatingHours: hospital?.operatingHours || '',
    },
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const selectedProvinceCode = provinces.find(p => p.name === form.watch('province'))?.code;
  const selectedDistrictCode = districts.find(d => d.name === form.watch('district'))?.code;

  useEffect(() => {
    addressApi.getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProvinceCode) {
      addressApi.getDistricts(selectedProvinceCode).then(setDistricts);
    } else {
      setDistricts([]);
    }
    form.setValue('district', '');
  }, [selectedProvinceCode, form]);

  useEffect(() => {
    if (selectedDistrictCode) {
      addressApi.getWards(selectedDistrictCode).then(setWards);
    } else {
      setWards([]);
    }
    form.setValue('ward', '');
  }, [selectedDistrictCode, form]);

  const handleFormSubmit = (values: HospitalFormValues) => {
    // Here you would also get lat/lng from the map state
    const submissionData: CreateHospitalDto = {
        ...values,
        operatingHours: values.operatingHours || '', // Ensure it's a string
        // Mock coordinates for now
        coordinates: { latitude: 0, longitude: 0 },
        description: 'Default description', // Add fields if they are in the form
        emergencyContact: '115', // Add fields if they are in the form
        services: []
    };
    onSubmit(submissionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hospital Name</FormLabel>
              <FormControl>
                <Input placeholder="Bach Mai Hospital" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Province</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a province" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {provinces.map(p => <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>District</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedProvinceCode}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a district" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {districts.map(d => <SelectItem key={d.code} value={d.name}>{d.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ward</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDistrictCode}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a ward" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {wards.map(w => <SelectItem key={w.code} value={w.name}>{w.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="78 Giai Phong Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add other fields like contactInfo, operatingHours etc. here */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
