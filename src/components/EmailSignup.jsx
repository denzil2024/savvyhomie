export default function EmailSignup() {
  return (
    <div className="band email" id="subscribe">
      <div className="wrap email-bar">
        <div className="email-copy">
          <h3>Join the List</h3>
          <p>One short email a week. The tips and finds worth your time, no filler.</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="First name" aria-label="First name" />
          <input type="email" placeholder="Email address" aria-label="Email address" required />
          <button className="btn" type="submit">Go</button>
        </form>
      </div>
    </div>
  )
}
