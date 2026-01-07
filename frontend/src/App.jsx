import React, { useEffect, useState } from 'react'
import api from './api'

export default function App() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const res = await api.get('/items')
    setItems(res.data)
  }

  async function addItem(e) {
    e.preventDefault()
    if (!title) return
    await api.post('/items', { title, description: '' })
    setTitle('')
    fetchItems()
  }

  return (
    <div className="container">
      <h1>MERN Starter</h1>
      <form onSubmit={addItem}>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Item title" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map(it => (
          <li key={it._id}>{it.title} - {new Date(it.createdAt).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  )
}
