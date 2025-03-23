import { authenticated } from '../../access/authenticated'

export const Cars = {
  slug: 'cars',
  admin: {
    useAsTitle: 'model',
    defaultColumns: ['model', 'packageName', 'normalPrice', 'holidayPrice'],
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'model',
      type: 'text',
      required: true,
      label: 'Model',
    },
    {
      name: 'packageName',
      type: 'text',
      label: 'Package Name',
    },
    {
      name: 'packageDescription',
      type: 'text',
      label: 'Package Description',
    },
    {
      name: 'normalPrice',
      type: 'number',
      required: true,
      label: 'Normal Rental Price per Day',
      min: 0,
    },
    {
      name: 'holidayPrice',
      type: 'number',
      required: true,
      label: 'Holiday Rental Price per Day',
      min: 0,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
    },
    {
      name: 'available',
      type: 'checkbox',
      required: true,
      label: 'Available',
    },
  ],
}
