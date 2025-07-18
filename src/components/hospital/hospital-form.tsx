'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addressApi } from '@/lib/apis/address.api'
import { District, Province, Ward } from '@/types/address'
import { CreateHospitalDto, Hospital, UpdateHospitalDto } from '@/types/hospital'

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
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  emergencyContact: z.string().regex(/^(\+84|0)[0-9]{9,10}$/, 'Invalid emergency phone number.'),
  services: z.string().min(1, 'Please list at least one service.'), // Simple string for now, can be changed to array later
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  })
})

type HospitalFormValues = z.infer<typeof hospitalFormSchema>

interface HospitalFormProps {
  hospital?: Hospital
  onSubmit: (data: CreateHospitalDto | UpdateHospitalDto) => void
  isSubmitting: boolean
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
        phone: hospital?.contactInfo?.phone || '',
        email: hospital?.contactInfo?.email || ''
      },
      operatingHours: hospital?.operatingHours || '',
      description: hospital?.description || '',
      emergencyContact: hospital?.emergencyContact || '',
      services: hospital?.services?.join(', ') || '',
      coordinates: {
        latitude: hospital?.coordinates?.latitude || 0,
        longitude: hospital?.coordinates?.longitude || 0
      }
    }
  })

  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const selectedProvinceName = form.watch('province')
  const selectedDistrictName = form.watch('district')

  const selectedProvinceCode = provinces.find((p) => p.name === selectedProvinceName)?.code
  const selectedDistrictCode = districts.find((d) => d.name === selectedDistrictName)?.code

  useEffect(() => {
    addressApi.getProvinces().then(setProvinces)
  }, [])

  // Handle district loading and form reset
  useEffect(() => {
    const isInitialLoad = !districts.length && hospital?.district
    if (selectedProvinceCode) {
      addressApi.getDistricts(selectedProvinceCode).then((districtsData) => {
        setDistricts(districtsData)
        // If not initial load, reset district and ward
        if (!isInitialLoad) {
          form.setValue('district', '')
          form.setValue('ward', '')
          setWards([])
        }
      })
    } else {
      setDistricts([])
      setWards([])
      if (!isInitialLoad) {
        form.setValue('district', '')
        form.setValue('ward', '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvinceCode, hospital?.district])

  // Handle ward loading and form reset
  useEffect(() => {
    const isInitialLoad = !wards.length && hospital?.ward
    if (selectedDistrictCode) {
      addressApi.getWards(selectedDistrictCode).then((wardsData) => {
        setWards(wardsData)
        if (!isInitialLoad) {
          form.setValue('ward', '')
        }
      })
    } else {
      setWards([])
      if (!isInitialLoad) {
        form.setValue('ward', '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDistrictCode, hospital?.ward])

  function handleSubmit(values: HospitalFormValues) {
    const dataToSubmit = {
      ...values,
      services: values.services
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      // Mock coordinates as the map functionality is removed
      coordinates: {
        latitude: 21.0278, // Default to Hanoi center
        longitude: 105.8342
      }
    }
    onSubmit(dataToSubmit)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6 flex flex-col h-full'>
        <ScrollArea className='flex-grow pr-4 -mr-4' style={{ maxHeight: 'calc(100vh - 20rem)' }}>
          <div className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Bach Mai Hospital' {...field} autoComplete='organization' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='province'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a province' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p.code} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='district'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedProvinceCode}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a district' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem key={d.code} value={d.name}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='ward'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDistrictCode}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a ward' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wards.map((w) => (
                          <SelectItem key={w.code} value={w.name}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder='78 Giai Phong Street' {...field} autoComplete='street-address' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='contactInfo.phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='0912345678' {...field} autoComplete='tel' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contactInfo.email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder='contact@hospital.com' {...field} autoComplete='email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='A brief description of the hospital...' className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='emergencyContact'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input placeholder='0123456789' {...field} autoComplete='tel' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='operatingHours'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Hours</FormLabel>
                    <FormControl>
                      <Input placeholder='24/7' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='services'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <FormControl>
                    <Input placeholder='Cardiology, Neurology, Pediatrics... (comma-separated)' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>

        <div className='flex-shrink-0 pt-6 border-t'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
