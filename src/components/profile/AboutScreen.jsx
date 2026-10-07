function AboutScreen({ onBack }) {
  return (
    <article className="tab-screen about-screen">
      <button type="button" className="text-button detail-back" onClick={onBack}>
        ← Profile
      </button>

      <h1 className="tab-title">About NOVA</h1>

      <section className="about-card">
        <h2>What NOVA does</h2>
        <p>
          NOVA reads a packet’s barcode or ingredient list and gives it a 0–100 score. Additives with known
          concerns lower the score, and anything that clashes with your diet, allergies or goals is flagged for
          you.
        </p>
        <p>
          Scores are general guidance, not medical advice. Ingredient matching can miss things, so always check
          the pack if you have a serious allergy.
        </p>
      </section>

      <section className="about-card">
        <h2>Privacy</h2>
        <p>
          Your profile, scan history and saved products are stored only on this phone. There’s no account, and
          we don’t keep a copy.
        </p>
        <p>A few things do leave your phone so NOVA can work:</p>
        <ul>
          <li>Barcode numbers are looked up on Open Food Facts, a public product database.</li>
          <li>Text read from an ingredient label is sent to our server to tidy it up with AI. It isn’t stored.</li>
          <li>
            For your home-screen greeting, we send a short summary — number of scans, average score, often-flagged
            ingredients and your goals. Never your name or allergies.
          </li>
        </ul>
        <p>Clearing your scan history in Profile removes it from this phone for good.</p>
      </section>
    </article>
  )
}

export default AboutScreen
