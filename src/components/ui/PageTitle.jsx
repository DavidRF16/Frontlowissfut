function PageTitle({
  children,
}) {
  return (
    <h1 className='text-3xl font-black leading-tight text-white sm:text-4xl'>
      {children}
    </h1>
  )
}

export default PageTitle
