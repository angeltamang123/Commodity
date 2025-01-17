'use client'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from 'react'

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  price: Yup.number().required('Price is required').min(0, 'Price must be at least 0'),
  category: Yup.string().oneOf(
    ['Electronics', 'Clothing', 'Books', 'Furniture', 'Other'],
    'Invalid category'
  ),
  stock: Yup.number().min(0, 'Stock must be at least 0'),
  image: Yup.mixed()
  .test('fileSize', 'File size is too large', (value) => {
    if (!value) return true; // Let required handle this
    return value.size <= 5000000; // 5MB limit
  })
  .test('fileType', 'Unsupported file format', (value) => {
    if (!value) return true; // Let required handle this
    return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
  }),
})

export default function ProductForm() {
  const [submitStatus, setSubmitStatus] = useState('idle')
const [image,setImage] = useState(null)
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      category: 'Other',
      stock: '',
      image: '',
    },
    validationSchema: ProductSchema,
    onSubmit: async (values) => {
      
      setSubmitStatus('loading')
      try {
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('description', values.description)
        formData.append('price', values.price.toString())
        formData.append('category', values.category)
        formData.append('stock', values.stock.toString())
        if (image) {
          formData.append('image', image)
        }

        const response = await fetch('http://localhost:9000/products', {
          method: 'POST',
          body: formData
        })
        if (!response.ok) throw new Error('Failed to submit product')
        setSubmitStatus('success')
      } catch (error) {
        console.error('Error submitting product:', error)
        setSubmitStatus('error')
      }
    },
  })

  return (
    (<Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name} />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description} />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price} />
            {formik.touched.price && formik.errors.price && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              name="category"
              onValueChange={(value) => formik.setFieldValue('category', value)}
              defaultValue={formik.values.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
            )}
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.stock} />
            {formik.touched.stock && formik.errors.stock && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.stock}</p>
            )}
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={(e)=> setImage(e.target.files[0])}
           />
            {formik.touched.image && formik.errors.image && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
            )}
          </div>

          <Button type="submit" disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading' ? 'Submitting...' : 'Submit'}
          </Button>

          {submitStatus === 'success' && (
            <p className="text-green-500 mt-2">Product submitted successfully!</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-500 mt-2">Error submitting product. Please try again.</p>
          )}
        </form>
      </CardContent>
    </Card>)
  );
}

