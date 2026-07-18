const variants = ['a', 'b', 'c', 'd']

export default function Photo({ seed = '', label = 'Photo via Amazon' }) {
  const v = variants[Math.abs([...seed].reduce((h, c) => h + c.charCodeAt(0), 0)) % variants.length]
  return (
    <div className={`photo ${v}`}>
      <svg className="photo-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 21V10l8-6 8 6v11M9 21v-7h6v7" />
      </svg>
      {label && <span>{label}</span>}
    </div>
  )
}
