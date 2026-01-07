import React, { useState } from 'react'
import api from '../../api/axios'

export default function Submission({ assignmentId }){
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault(); setMsg('')
    try{
      const fd = new FormData()
      if (file) fd.append('file', file)
      fd.append('assignment_id', assignmentId)
      fd.append('text', text)
      await api.post('/student/submit', fd, { headers: {'Content-Type':'multipart/form-data'} })
      setMsg('Submitted')
    }catch(err){ setMsg(err.response?.data?.error || 'Submit failed') }
  }

  return (
    <div className="card">
      <h4>Submit</h4>
      <form onSubmit={submit}>
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <textarea placeholder="Paste text or comments" value={text} onChange={e=>setText(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      {msg && <div>{msg}</div>}
    </div>
  )
}
