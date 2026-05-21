function Card({
  children,
  className = '',
}) {
  return (
    <div
      className={`
        bg-[#111118]
        border
        border-white/5
        rounded-lg
        p-6
        sm:p-7
        transition-all
        duration-300
        hover:border-purple-500/20
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
