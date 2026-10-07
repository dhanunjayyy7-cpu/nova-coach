import './coach.css'

const VERDICTS = {
  safe: { label: 'Good for you', color: '#00C896', tint: '#E6FAF4' },
  caution: { label: 'Eat with caution', color: '#E58E00', tint: '#FFF4E2' },
  avoid: { label: 'Avoid', color: '#FF4757', tint: '#FFECED' },
}

function CoachVerdict({ coach, productName, brand, imageUrl }) {
  const verdict = coach.status === 'done' ? VERDICTS[coach.scan.verdict] : null

  return (
    <section
      className="tw:flex tw:flex-col tw:items-center tw:rounded-[28px] tw:bg-white tw:px-5 tw:py-6 tw:text-center tw:shadow-sm"
      aria-live="polite"
    >
      {imageUrl && <img src={imageUrl} alt="" className="tw:mb-3 tw:size-20 tw:rounded-2xl tw:object-contain" />}
      <h1 className="tw:text-xl tw:leading-tight tw:font-extrabold tw:text-[#1A1A2E]">{productName}</h1>
      {brand && <p className="tw:mt-0.5 tw:text-sm tw:text-[#5B6170]">{brand}</p>}

      <span className="tw:mt-4 tw:rounded-full tw:bg-[#EEF0FF] tw:px-3 tw:py-1 tw:text-xs tw:font-extrabold tw:tracking-wide tw:text-[#4B4FC4] tw:uppercase">
        Nova Coach · for you
      </span>

      {coach.status === 'loading' ? (
        <div className="tw:mt-5 tw:flex tw:w-full tw:flex-col tw:items-center tw:gap-3" aria-label="Checking against your profile">
          <div className="tw:h-10 tw:w-44 tw:animate-pulse tw:rounded-full tw:bg-[#EEF0F4]" />
          <div className="tw:h-3 tw:w-64 tw:animate-pulse tw:rounded-full tw:bg-[#EEF0F4]" />
          <p className="tw:text-sm tw:font-semibold tw:text-[#5B6170]">Checking this against your profile…</p>
        </div>
      ) : (
        <div
          className="tw:mt-4 tw:flex tw:w-full tw:flex-col tw:items-center tw:rounded-3xl tw:px-4 tw:py-5"
          style={{ backgroundColor: verdict.tint }}
        >
          <p className="tw:text-[2rem] tw:leading-none tw:font-black" style={{ color: verdict.color }}>
            {verdict.label}
          </p>
          <p className="tw:mt-2 tw:text-[#1A1A2E]">
            <span className="tw:text-4xl tw:font-black">{coach.scan.personal_score}</span>
            <span className="tw:text-base tw:font-semibold tw:text-[#5B6170]"> / 100 personal score</span>
          </p>
          <p className="tw:mt-3 tw:text-[15px] tw:leading-snug tw:font-semibold tw:text-[#1A1A2E]">{coach.scan.reason}</p>
          {coach.allergen_override && (
            <span className="tw:mt-3 tw:rounded-full tw:bg-[#FF4757] tw:px-3 tw:py-1 tw:text-xs tw:font-extrabold tw:text-white tw:uppercase">
              Allergen alert
            </span>
          )}
          {coach.source === 'fallback' && (
            <span className="tw:mt-3 tw:text-xs tw:font-semibold tw:text-[#5B6170]">
              AI check unavailable — based on the general score
            </span>
          )}
        </div>
      )}

      <p className="tw:mt-4 tw:text-sm tw:font-semibold tw:text-[#5B6170]">General score: {coach.generic}</p>
      <p className="tw:mt-1 tw:text-xs tw:text-[#9CA3AF]">Personal guidance, not medical advice.</p>
    </section>
  )
}

export default CoachVerdict
