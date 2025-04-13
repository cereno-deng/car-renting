import type { CollectionConfig } from 'payload'

export const Extras: CollectionConfig = {
  slug: 'extras',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'pricePerDay', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'pricePerDay',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      defaultValue: 'active',
      required: true,
    },
  ],
}
