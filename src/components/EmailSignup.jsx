export default function EmailSignup() {
  return (
    <div className="band band-white email" id="subscribe">
      <div className="wrap">
        <div className="email-plate">
          <span className="lbl">The Savvy List</span>
          <h3>One Short Email a Week</h3>
          <p>The tips and finds worth your time, in one quick note. No filler, and easy to leave.</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" aria-label="Email address" required />
            <button className="btn" type="submit">Join the list</button>
          </form>
        </div>
      </div>
    </div>
  )
}
