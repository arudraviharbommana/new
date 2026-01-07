import React, { useState } from 'react'
import api from '../../api/axios'

export default function CreateAssignment(){
  const [form, setForm] = useState({ title:'', description:'' })
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault(); setMsg('')
    try{ await api.post('/professor/assignment', form); setMsg('Created'); setForm({title:'',description:''}) }catch(err){ setMsg(err.response?.data?.error || 'Create failed') }
  }

  return (
    <div className="card">
      <h3>Create Assignment</h3>
      <form onSubmit={submit}>
        <div style={{marginBottom:8}}><input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
        <div style={{marginBottom:8}}><textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} /></div>
        <button type="submit">Create</button>
      </form>
      {msg && <div>{msg}</div>}
    </div>
  )
}
