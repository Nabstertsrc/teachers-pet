import { useState, useEffect } from 'react'
import { getResources, addResource, saveResources } from '../lib/storage'
import { suggestResources } from '../lib/gemini'
import { useToast } from '../context/AppContext'

const TYPES = ['Website','Video','Book','Article','PDF','Tool','Other']
const SUBJECTS_LIST = ['Mathematics','English','Afrikaans','Natural Sciences','Life Sciences','Physical Sciences','Geography','History','Life Orientation','Technology','Economics','Business Studies','Accounting','General']

export default function Resources() {
  const toast = useToast()
  const [resources, setResources] = useState([])
  const [search, setSearch] = useState('')
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title:'', url:'', type:'Website', subject:'', description:'', tags:'' })
  const [suggesting, setSuggesting] = useState(false)
  const [suggestForm, setSuggestForm] = useState({ subject:'', grade:'', topic:'' })
  const [showSuggest, setShowSuggest] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await getResources()
      setResources(data)
    }
    load()
  }, [])

  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleAdd = async () => {
    if (!form.title) { toast('Add a title', 'warning'); return }
    await addResource({ ...form, tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) })
    const updated = await getResources()
    setResources(updated); setShowAdd(false)
    setForm({ title:'', url:'', type:'Website', subject:'', description:'', tags:'' })
    toast('Resource saved!', 'success')
  }

  const handleDelete = async (id) => { 
    await saveResources(resources.filter(r=>r.id!==id))
    const updated = await getResources()
    setResources(updated) 
  }

  const handleSuggest = async () => {
    if (!suggestForm.subject || !suggestForm.topic) { toast('Enter subject and topic', 'warning'); return }
    setSuggesting(true)
    try {
      const suggestions = await suggestResources(suggestForm)
      if (suggestions.length) {
        for (const s of suggestions) {
          await addResource({ title: s.title, url: s.url||'', type: s.type||'Website', subject: suggestForm.subject, description: s.description, tags:[suggestForm.topic] })
        }
        const updated = await getResources()
        setResources(updated); toast(`Added ${suggestions.length} AI-suggested resources!`, 'success')
        setShowSuggest(false)
      }
    } catch { toast('Suggestion failed', 'error') }
    finally { setSuggesting(false) }
  }

  const filtered = resources.filter(r => {
    const matchSearch = `${r.title} ${r.description} ${r.subject} ${r.tags?.join(' ')}`.toLowerCase().includes(search.toLowerCase())
    const matchSubject = filterSubject === 'All' || r.subject === filterSubject
    const matchType = filterType === 'All' || r.type === filterType
    return matchSearch && matchSubject && matchType
  })

  const typeIcon = { Website:'🌐', Video:'🎬', Book:'📕', Article:'📰', PDF:'📑', Tool:'🛠️', Other:'📎' }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div><h1 className="page-title">📖 Resource Library</h1><p className="page-subtitle">Organize links, books, videos, and teaching materials</p></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-secondary" onClick={()=>setShowSuggest(true)}>🤖 AI Suggest</button>
          <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Add Resource</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div className="search-bar" style={{ flex:1, minWidth:200 }}><span>🔍</span><input placeholder="Search resources…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <select className="form-select" style={{ width:'auto' }} value={filterSubject} onChange={e=>setFilterSubject(e.target.value)}><option value="All">All Subjects</option>{SUBJECTS_LIST.map(s=><option key={s}>{s}</option>)}</select>
        <select className="form-select" style={{ width:'auto' }} value={filterType} onChange={e=>setFilterType(e.target.value)}><option value="All">All Types</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select>
      </div>

      {/* Stats row */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        {[...new Set(resources.map(r=>r.type))].map(type => (
          <div key={type} className="badge badge-primary" style={{ padding:'6px 14px', fontSize:'0.82rem' }}>
            {typeIcon[type]||'📎'} {type}: {resources.filter(r=>r.type===type).length}
          </div>
        ))}
        {resources.length > 0 && <div className="badge badge-success" style={{ padding:'6px 14px', fontSize:'0.82rem' }}>Total: {resources.length}</div>}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📖</div><h3>No resources found</h3><p>Add links, books, and materials to your library</p><button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Add First Resource</button></div>
      ) : (
        <div className="grid-auto">
          {filtered.map(r=>(
            <div key={r.id} className="card" style={{ position:'relative' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <span className="badge badge-primary" style={{ fontSize:'0.75rem' }}>{typeIcon[r.type]||'📎'} {r.type}</span>
                <button onClick={()=>handleDelete(r.id)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:'0.82rem' }}>🗑️</button>
              </div>
              <h3 style={{ fontSize:'0.95rem', marginBottom:6 }}>{r.title}</h3>
              {r.description && <p style={{ fontSize:'0.8rem', marginBottom:8, lineHeight:1.5 }}>{r.description}</p>}
              {r.subject && <div className="badge badge-success" style={{ fontSize:'0.72rem', marginBottom:8 }}>{r.subject}</div>}
              {r.tags?.length > 0 && <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:10 }}>{r.tags.map((t,i)=><span key={i} className="tag" style={{ fontSize:'0.72rem' }}>{t}</span>)}</div>}
              {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ width:'100%', justifyContent:'center', marginTop:4 }}>🔗 Open Resource</a>}
              <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:8 }}>{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">📎 Add Resource</h3><button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(false)}>✕</button></div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group"><label className="form-label">Title *</label><input className="form-input" placeholder="Resource title" value={form.title} onChange={e=>set('title',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">URL / Link</label><input className="form-input" placeholder="https://…" value={form.url} onChange={e=>set('url',e.target.value)} /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={form.type} onChange={e=>set('type',e.target.value)}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Subject</label><select className="form-select" value={form.subject} onChange={e=>set('subject',e.target.value)}><option value="">Select…</option>{SUBJECTS_LIST.map(s=><option key={s}>{s}</option>)}</select></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" rows={2} placeholder="Brief description…" value={form.description} onChange={e=>set('description',e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Tags (comma separated)</label><input className="form-input" placeholder="e.g. photosynthesis, biology, grade 9" value={form.tags} onChange={e=>set('tags',e.target.value)} /></div>
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn btn-primary" style={{ flex:1 }} onClick={handleAdd}>Save Resource</button>
                <button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuggest && (
        <div className="modal-overlay" onClick={()=>setShowSuggest(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">🤖 AI Resource Suggestions</h3><button className="btn btn-ghost btn-sm" onClick={()=>setShowSuggest(false)}>✕</button></div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group"><label className="form-label">Subject</label><input className="form-input" placeholder="e.g. Biology" value={suggestForm.subject} onChange={e=>setSuggestForm(f=>({...f,subject:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Grade</label><input className="form-input" placeholder="e.g. Grade 9" value={suggestForm.grade} onChange={e=>setSuggestForm(f=>({...f,grade:e.target.value}))} /></div>
              <div className="form-group"><label className="form-label">Topic</label><input className="form-input" placeholder="e.g. Photosynthesis" value={suggestForm.topic} onChange={e=>setSuggestForm(f=>({...f,topic:e.target.value}))} /></div>
              <button className="btn btn-primary" onClick={handleSuggest} disabled={suggesting}>{suggesting?<><div className="generating-dots"><span/><span/><span/></div>Searching…</>:'🤖 Get Suggestions'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
