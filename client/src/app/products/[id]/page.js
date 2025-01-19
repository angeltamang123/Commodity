'use client'
import axios from 'axios'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
  const params = useParams()
  const[productDetails, setProductDetails] = useState({})
  const fetchProductDetails = async ()=>{
    const {data}= await axios.get('http://localhost:9000/products/'+params.id)
    setProductDetails(data)
  }
  useEffect(()=>{
    fetchProductDetails()
  })
  return (
    <div>
        <div className="aspect-square relative mb-4">
          <Image
            src={'http://localhost:9000/uploads/'+ productDetails.image}
            alt={productDetails.name}
            fill
            className="object-cover rounded-md" />
        </div>
        <h2 className="text-lg font-semibold mb-2">{productDetails.name}</h2>
        {}
        <p className="text-sm text-gray-600 mb-2">{productDetails.description}</p>
        <p className="text-sm text-gray-600">Category: {productDetails.category}</p>
        <p className="text-sm text-gray-600">Stock: {productDetails.stock}</p>
    </div>
  )
}

export default page