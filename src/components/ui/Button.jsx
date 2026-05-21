function Button({
  children,
  className = '',
  ...props
}) {
  return (
    <button
      {...props}
      className={`
        bg-purple-600
        hover:bg-purple-700
        inline-flex
        min-h-11
        items-center
        justify-center
        px-6
        py-3
        rounded-lg
        font-semibold
        transition-all
        duration-300
        active:scale-[0.98]
        shadow-lg
        shadow-purple-600/20
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default Button
