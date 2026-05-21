function Textarea(props) {
  return (
    <textarea
      {...props}
      className='min-h-36 w-full resize-y rounded-lg border border-white/10 bg-[#181820] px-5 py-4 outline-none transition-all focus:border-purple-500'
    />
  )
}

export default Textarea
