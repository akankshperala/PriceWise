"use client"
import { scrapeAndStoreProduct } from '@/lib/actions'
import React, { useState } from 'react'

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('')
  const [Loading, setLoading] = useState(false)
  const isValidAmazonProductURL = (url) => {
    try {
      const parsedURL = new URL(url)
      const hostname = parsedURL.hostname
      if (hostname.includes('amazon.in') || hostname.includes('amzn.in')) {
        return true
      }
      return false
    } catch (error) {

    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValidLink = isValidAmazonProductURL(searchPrompt)
    if (!isValidLink) return alert('Please provide a valis Amazon link')

    try {
      setLoading(true)
      const product = await scrapeAndStoreProduct(searchPrompt)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }
  return (
    <form
      className="flex gap-4 mt-12"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input w-full p-1 border-2 border-gray-400"
      />

      <button
        type="submit"
        className="searchbar-btn bg-black rounded-lg text-white px-4 py-2"
        disabled={searchPrompt === ''}
      >
        {Loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Searchbar
