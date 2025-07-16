'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import {
  bloodInventorySchema,
  BloodInventoryFormSchema,
  bloodTypeOptions,
  bloodComponentOptions
} from '@/validations/blood-inventory'
import { BloodInventoryTableItem } from '@/types/blood-inventory.d'
import {
  useGetHospitalsForSelect,
  useAddBloodInventoryItem,
  useUpdateBloodInventoryItem
} from '@/hooks/use-api/use-blood-inventory'
import { format } from 'date-fns'

interface BloodInventoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editItem?: BloodInventoryTableItem | null
  onSuccess?: () => void
}

export function BloodInventoryForm({ open, onOpenChange, editItem, onSuccess }: BloodInventoryFormProps) {
  const { data: hospitalOptions = [], isLoading: hospitalsLoading } = useGetHospitalsForSelect()
  const addMutation = useAddBloodInventoryItem()
  const updateMutation = useUpdateBloodInventoryItem()

  const isEditing = !!editItem
  const isLoading = addMutation.isPending || updateMutation.isPending

  const form = useForm<BloodInventoryFormSchema>({
    resolver: zodResolver(bloodInventorySchema),
    defaultValues: {
      hospitalId: '',
      bloodType: undefined,
      component: undefined,
      quantity: 1,
      expiresAt: ''
    }
  })

  useEffect(() => {
    if (open) {
      if (editItem) {
        form.reset({
          hospitalId: editItem.hospitalId,
          bloodType: editItem.bloodType,
          component: editItem.component,
          quantity: editItem.quantity,
          expiresAt: format(new Date(editItem.expiresAt), 'yyyy-MM-dd')
        })
      } else {
        form.reset({
          hospitalId: '',
          bloodType: undefined,
          component: undefined,
          quantity: 1,
          expiresAt: ''
        })
      }
    }
  }, [editItem, open, form])

  const onSubmit = async (data: BloodInventoryFormSchema) => {
    try {
      const submitData = {
        bloodType: data.bloodType,
        component: data.component,
        quantity: data.quantity,
        expiresAt: new Date(data.expiresAt).toISOString()
      }

      if (isEditing && editItem?._id) {
        await updateMutation.mutateAsync({
          hospitalId: data.hospitalId,
          itemId: editItem._id,
          data: submitData
        })
      } else {
        await addMutation.mutateAsync({
          hospitalId: data.hospitalId,
          data: submitData
        })
      }

      onOpenChange(false)
      onSuccess?.()
    } catch {
      // Error handling is done in the mutation
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Blood Inventory Item' : 'Add Blood Inventory Item'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='hospitalId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isEditing || hospitalsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select hospital' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hospitalOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='bloodType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select blood type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name='component'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select component' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodComponentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (units)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min='1'
                        max='9999'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='expiresAt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='outline' onClick={() => handleOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isEditing ? 'Update' : 'Add'} Item
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
