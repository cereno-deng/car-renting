import type { CollectionConfig } from 'payload'

export const Cars: CollectionConfig = {
  slug: 'cars',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'pricePerDay', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Sedan', value: 'sedan' },
        { label: 'SUV', value: 'suv' },
        { label: 'Truck', value: 'truck' },
        { label: 'Luxury', value: 'luxury' },
        { label: 'Economy', value: 'economy' },
        { label: 'Van', value: 'van' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'pricePerDay',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'capacity',
      type: 'number',
      required: true,
      min: 1,
      max: 15,
    },
    {
      name: 'transmission',
      type: 'select',
      options: [
        { label: 'Automatic', value: 'automatic' },
        { label: 'Manual', value: 'manual' },
      ],
      required: true,
    },
    {
      name: 'fuelType',
      type: 'select',
      options: [
        { label: 'Gasoline', value: 'gasoline' },
        { label: 'Diesel', value: 'diesel' },
        { label: 'Hybrid', value: 'hybrid' },
        { label: 'Electric', value: 'electric' },
      ],
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      minRows: 3,
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Reserved', value: 'reserved' },
      ],
      defaultValue: 'available',
      required: true,
    },
  ],
}
