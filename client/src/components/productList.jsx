import axios from 'axios'
import React from 'react'

const ProductList =async () => {
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  return (
    <div>{JSON.stringify(data)}</div>
  )
}

export default ProductList