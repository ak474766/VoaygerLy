"use client"
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

// Redirect to the correct home page
export default function AllProductsPage() {
  useEffect(() => {
    redirect('/home')
  }, [])

  return null
}
