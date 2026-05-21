import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  CirclePlus,
  Filter,
  Heart,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'

import toast from 'react-hot-toast'

import {
  createOfficialShirt,
  deleteOfficialShirt,
  getOfficialShirts,
} from '../../services/officialShirtService'

import {
  addToInventory,
} from '../../services/inventoryService'

import {
  addToWishlist,
} from '../../services/wishlistService'

import useAuthStore from '../../store/authStore'

const emptyAdminForm = {
  name: '',
  team: '',
  league: '',
  season: '',
  image: null,
}

const emptyInventoryForm = {
  shirtNumber: '',
  playerName: '',
  size: '',
}

const sizes = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
]

const shirtsPerPage = 6

const normalizeText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()

const compareText = (a, b) =>
  String(a || '').localeCompare(
    String(b || ''),
    'es',
    {
      sensitivity: 'base',
    }
  )

const uniqueSorted = (values) =>
  [
    ...new Set(
      values.filter(Boolean)
    ),
  ].sort(compareText)

const getVisiblePages = (
  currentPage,
  totalPages
) => {
  const visiblePages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ])

  return [...visiblePages]
    .filter(
      (page) =>
        page >= 1 &&
        page <= totalPages
    )
    .sort((a, b) => a - b)
    .reduce((pages, page) => {
      const previous =
        pages[pages.length - 1]

      if (
        previous &&
        page - previous > 1
      ) {
        pages.push(`ellipsis-${page}`)
      }

      pages.push(page)
      return pages
    }, [])
}

function AddShirt() {
  const { user } = useAuthStore()
  const [shirts, setShirts] =
    useState([])
  const [search, setSearch] =
    useState('')
  const [league, setLeague] =
    useState('')
  const [season, setSeason] =
    useState('')
  const [team, setTeam] =
    useState('')
  const [currentPage, setCurrentPage] =
    useState(1)
  const [adminForm, setAdminForm] =
    useState(emptyAdminForm)
  const [
    selectedInventoryShirt,
    setSelectedInventoryShirt,
  ] = useState(null)
  const [
    inventoryForm,
    setInventoryForm,
  ] = useState(emptyInventoryForm)

  const fetchShirts =
    async () => {
      try {
        const data =
          await getOfficialShirts()

        setShirts(data)
      } catch (error) {
        toast.error(
          'No se pudo cargar el catálogo'
        )
      }
    }

  useEffect(() => {
    fetchShirts()
  }, [])

  const searchMatches = (shirt) => {
    const text = [
      shirt.name,
      shirt.team,
      shirt.league,
      shirt.season,
    ]
      .join(' ')
      .toLowerCase()

    return text.includes(
      search.toLowerCase()
    )
  }

  const filterValues = useMemo(() => {
    const shirtsForOption = (
      excludedFilter
    ) =>
      shirts.filter((shirt) => {
        return (
          searchMatches(shirt) &&
          (excludedFilter ===
            'league' ||
            !league ||
            shirt.league ===
              league) &&
          (excludedFilter ===
            'season' ||
            !season ||
            shirt.season ===
              season) &&
          (excludedFilter ===
            'team' ||
            !team ||
            shirt.team === team)
        )
      })

    return {
      leagues: uniqueSorted(
        shirtsForOption(
          'league'
        ).map(
          (shirt) => shirt.league
        )
      ),
      seasons: uniqueSorted(
        shirtsForOption(
          'season'
        ).map(
          (shirt) => shirt.season
        )
      ),
      teams: uniqueSorted(
        shirtsForOption('team').map(
          (shirt) => shirt.team
        )
      ),
    }
  }, [
    shirts,
    search,
    league,
    season,
    team,
  ])

  useEffect(() => {
    if (
      league &&
      !filterValues.leagues.includes(
        league
      )
    ) {
      setLeague('')
    }

    if (
      season &&
      !filterValues.seasons.includes(
        season
      )
    ) {
      setSeason('')
    }

    if (
      team &&
      !filterValues.teams.includes(
        team
      )
    ) {
      setTeam('')
    }
  }, [
    filterValues,
    league,
    season,
    team,
  ])

  useEffect(() => {
    setCurrentPage(1)
  }, [
    search,
    league,
    season,
    team,
  ])

  const filteredShirts = useMemo(
    () =>
      shirts
        .filter((shirt) => {
          return (
            searchMatches(shirt) &&
            (!league ||
              shirt.league ===
                league) &&
            (!season ||
              shirt.season ===
                season) &&
            (!team ||
              shirt.team === team)
          )
        })
        .sort((a, b) => {
          const byLeague = compareText(
            a.league,
            b.league
          )

          if (byLeague !== 0) {
            return byLeague
          }

          const byTeam = compareText(
            a.team,
            b.team
          )

          if (byTeam !== 0) {
            return byTeam
          }

          const byName = compareText(
            a.name,
            b.name
          )

          if (byName !== 0) {
            return byName
          }

          return compareText(
            a.season,
            b.season
          )
        }),
    [
      shirts,
      search,
      league,
      season,
      team,
    ]
  )

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredShirts.length /
        shirtsPerPage
    )
  )

  const paginatedShirts = useMemo(
    () =>
      filteredShirts.slice(
        (currentPage - 1) *
          shirtsPerPage,
        currentPage *
          shirtsPerPage
      ),
    [filteredShirts, currentPage]
  )

  const visiblePages = useMemo(
    () =>
      getVisiblePages(
        currentPage,
        totalPages
      ),
    [currentPage, totalPages]
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const openInventoryForm =
    (shirt) => {
      setSelectedInventoryShirt(shirt)
      setInventoryForm(
        emptyInventoryForm
      )
    }

  const closeInventoryForm =
    () => {
      setSelectedInventoryShirt(null)
      setInventoryForm(
        emptyInventoryForm
      )
    }

  const handleInventoryFormChange =
    (field, value) => {
      setInventoryForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const handleAddInventory =
    async (event) => {
      event.preventDefault()

      if (!selectedInventoryShirt) {
        return
      }

      if (!inventoryForm.size) {
        toast.error(
          'Elige una talla'
        )
        return
      }

      try {
        await addToInventory(
          selectedInventoryShirt._id,
          inventoryForm
        )

        toast.success(
          'Añadida al inventario'
        )
        closeInventoryForm()
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo añadir'
        )
      }
    }

  const handleAddWishlist =
    async (id) => {
      try {
        await addToWishlist(id)

        toast.success(
          'Añadida a wishlist'
        )
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo guardar'
        )
      }
    }

  const handleAdminChange =
    (field, value) => {
      setAdminForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const handleCreateOfficialShirt =
    async (e) => {
      e.preventDefault()

      try {
        const duplicate =
          shirts.some((shirt) => {
            return (
              normalizeText(
                shirt.name
              ) ===
                normalizeText(
                  adminForm.name
                ) &&
              normalizeText(
                shirt.team
              ) ===
                normalizeText(
                  adminForm.team
                ) &&
              normalizeText(
                shirt.league
              ) ===
                normalizeText(
                  adminForm.league
                ) &&
              normalizeText(
                shirt.season
              ) ===
                normalizeText(
                  adminForm.season
                )
            )
          })

        if (duplicate) {
          toast.error(
            'Esta camiseta ya existe'
          )
          return
        }

        const formData =
          new FormData()

        Object.entries(
          adminForm
        ).forEach(
          ([key, value]) => {
            if (value) {
              formData.append(
                key,
                value
              )
            }
          }
        )

        await createOfficialShirt(
          formData
        )

        setAdminForm(
          emptyAdminForm
        )
        await fetchShirts()
        toast.success(
          'Camiseta añadida al catálogo'
        )
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo crear'
        )
      }
    }

  const handleDeleteOfficialShirt =
    async (shirt) => {
      const confirmed =
        window.confirm(
          `¿Eliminar "${shirt.name}" del catálogo? También se quitará de inventarios y wishlists.`
        )

      if (!confirmed) return

      try {
        await deleteOfficialShirt(
          shirt._id
        )

        setShirts((prev) =>
          prev.filter(
            (item) =>
              item._id !== shirt._id
          )
        )

        toast.success(
          'Camiseta eliminada'
        )
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            'No se pudo eliminar'
        )
      }
    }

  return (
    <div className='page-stack mx-auto max-w-5xl'>
      <header className='page-header rounded-lg border border-white/10 bg-[#10151f] shadow-xl shadow-black/10'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <h1 className='text-2xl font-black text-white sm:text-3xl'>
            Añadir camisetas
          </h1>

          <span className='w-fit rounded-md bg-violet-600/20 px-3 py-1 text-xs font-bold text-violet-100'>
            {filteredShirts.length} disponibles
          </span>
        </div>
      </header>

      {user?.isAdmin && (
        <section className='page-section rounded-lg border border-violet-400/30 bg-violet-500/10'>
          <div className='mb-5 flex items-center gap-2 text-sm font-bold text-violet-100'>
            <ShieldCheck size={18} />
            Panel admin
          </div>

          <form
            onSubmit={
              handleCreateOfficialShirt
            }
            className='grid gap-4 md:grid-cols-2 xl:grid-cols-6'
          >
            <input
              value={adminForm.name}
              required
              onChange={(e) =>
                handleAdminChange(
                  'name',
                  e.target.value
                )
              }
              placeholder='Nombre'
              className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400 md:col-span-2 xl:col-span-2'
            />

            <input
              value={adminForm.team}
              required
              onChange={(e) =>
                handleAdminChange(
                  'team',
                  e.target.value
                )
              }
              placeholder='Equipo'
              className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
            />

            <input
              value={adminForm.league}
              required
              onChange={(e) =>
                handleAdminChange(
                  'league',
                  e.target.value
                )
              }
              placeholder='Liga'
              className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
            />

            <input
              value={adminForm.season}
              required
              onChange={(e) =>
                handleAdminChange(
                  'season',
                  e.target.value
                )
              }
              placeholder='Temporada'
              className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
            />

            <input
              type='file'
              accept='image/*'
              required
              onChange={(e) =>
                handleAdminChange(
                  'image',
                  e.target.files?.[0] ||
                    null
                )
              }
              className='min-h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 py-2 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:font-bold file:text-white md:col-span-2 xl:col-span-5'
            />

            <button
              type='submit'
              className='inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-500'
            >
              <Plus size={18} />
              Crear
            </button>
          </form>
        </section>
      )}

      <section className='page-section rounded-lg border border-white/10 bg-[#10151f]'>
        <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px_200px]'>
          <label className='relative'>
            <Search
              className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500'
              size={18}
            />
            <input
              type='text'
              placeholder='Buscar camiseta, equipo o temporada'
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className='h-12 w-full rounded-lg border border-white/10 bg-[#0b0f17] pl-10 pr-4 text-sm text-white outline-none focus:border-violet-400'
            />
          </label>

          <select
            value={league}
            onChange={(e) =>
              setLeague(
                e.target.value
              )
            }
            className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
          >
            <option value=''>
              Todas las ligas
            </option>
            {filterValues.leagues.map(
              (value) => (
                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              )
            )}
          </select>

          <select
            value={season}
            onChange={(e) =>
              setSeason(
                e.target.value
              )
            }
            className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
          >
            <option value=''>
              Todos los años
            </option>
            {filterValues.seasons.map(
              (value) => (
                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              )
            )}
          </select>

          <select
            value={team}
            onChange={(e) =>
              setTeam(e.target.value)
            }
            className='h-12 rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
          >
            <option value=''>
              Todos los equipos
            </option>
            {filterValues.teams.map(
              (value) => (
                <option
                  key={value}
                  value={value}
                >
                  {value}
                </option>
              )
            )}
          </select>
        </div>

        <div className='mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
          <Filter size={15} />
          Filtros de catálogo
        </div>
      </section>

      {filteredShirts.length === 0 ? (
        <div className='rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-10 text-center'>
          <CirclePlus
            className='mx-auto text-violet-300'
            size={36}
          />
          <h2 className='mt-4 text-lg font-bold text-white'>
            No hay camisetas
          </h2>
          <p className='mt-2 text-sm text-slate-400'>
            Cambia los filtros o crea una desde admin.
          </p>
        </div>
      ) : (
        <div className='card-list flex flex-wrap justify-center gap-7 sm:justify-start'>
          {paginatedShirts.map(
            (shirt) => (
              <article
                key={shirt._id}
                className='relative w-full overflow-hidden rounded-lg border border-white/10 bg-[#10151f] sm:w-[260px]'
              >
                {user?.isAdmin && (
                  <button
                    type='button'
                    onClick={() =>
                      handleDeleteOfficialShirt(
                        shirt
                      )
                    }
                    className='absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-lg bg-red-500/90 text-white shadow-lg shadow-black/30 transition hover:bg-red-500'
                    aria-label='Eliminar camiseta'
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <img
                  src={shirt.image}
                  alt=''
                  className='h-52 w-full bg-[#0b0f17] object-contain p-5'
                />

                <div className='p-4'>
                  <h2 className='line-clamp-2 text-base font-bold text-white'>
                    {shirt.name}
                  </h2>

                  <p className='mt-1 text-sm text-slate-400'>
                    {shirt.team}
                  </p>

                  <p className='mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500'>
                    {shirt.season} /{' '}
                    {shirt.league}
                  </p>

                  <div className='mt-4 grid gap-2'>
                  <button
                    type='button'
                    onClick={() =>
                      openInventoryForm(
                        shirt
                      )
                    }
                    className='inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 text-xs font-bold text-white transition hover:bg-violet-500'
                  >
                    <Plus size={18} />
                    Añadir al inventario
                  </button>

                  <button
                    type='button'
                    onClick={() =>
                      handleAddWishlist(
                        shirt._id
                      )
                    }
                    className='inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-bold text-violet-100 transition hover:border-violet-400/60 hover:bg-violet-500/10'
                  >
                    <Heart size={18} />
                    Wishlist
                  </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}

      {filteredShirts.length > 0 && (
        <div className='flex flex-col items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#10151f] p-4 sm:flex-row'>
          <p className='text-sm text-slate-400'>
            Página {currentPage} de{' '}
            {totalPages} -{' '}
            {filteredShirts.length}{' '}
            camisetas
          </p>

          <div className='flex flex-wrap justify-center gap-2'>
            <button
              type='button'
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              disabled={currentPage === 1}
              className='min-h-10 rounded-lg border border-white/10 px-4 text-sm font-bold text-white transition hover:border-violet-400 disabled:cursor-not-allowed disabled:opacity-40'
            >
              Anterior
            </button>

            {visiblePages.map((page) =>
              typeof page ===
              'string' ? (
                <span
                  key={page}
                  className='grid h-10 w-8 place-items-center text-sm font-black text-slate-500'
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type='button'
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`grid h-10 w-10 place-items-center rounded-lg border text-sm font-black transition ${
                    currentPage ===
                    page
                      ? 'border-violet-400 bg-violet-600 text-white'
                      : 'border-white/10 text-slate-300 hover:border-violet-400'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type='button'
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    totalPages,
                    page + 1
                  )
                )
              }
              disabled={
                currentPage === totalPages
              }
              className='min-h-10 rounded-lg border border-white/10 px-4 text-sm font-bold text-white transition hover:border-violet-400 disabled:cursor-not-allowed disabled:opacity-40'
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {selectedInventoryShirt && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm'>
          <section className='max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/10 bg-[#10151f] p-5 shadow-2xl shadow-black/50 sm:p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <h2 className='break-words text-2xl font-black text-white'>
                  Datos de tu camiseta
                </h2>
                <p className='mt-2 text-sm text-slate-400'>
                  {
                    selectedInventoryShirt.name
                  }{' '}
                  -{' '}
                  {
                    selectedInventoryShirt.team
                  }
                </p>
              </div>

              <button
                type='button'
                onClick={
                  closeInventoryForm
                }
                className='grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-red-400/60 hover:text-red-200'
                aria-label='Cerrar'
              >
                <X size={17} />
              </button>
            </div>

            <form
              onSubmit={
                handleAddInventory
              }
              className='mt-6 grid gap-5'
            >
              <div className='grid gap-4 sm:grid-cols-2'>
                <label>
                  <span className='text-sm font-bold text-slate-300'>
                    Dorsal
                  </span>
                  <input
                    value={
                      inventoryForm
                        .shirtNumber
                    }
                    onChange={(e) =>
                      handleInventoryFormChange(
                        'shirtNumber',
                        e.target.value.replace(
                          /\D/g,
                          ''
                        )
                      )
                    }
                    maxLength={3}
                    inputMode='numeric'
                    placeholder='10'
                    className='mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
                  />
                </label>

                <label>
                  <span className='text-sm font-bold text-slate-300'>
                    Jugador
                  </span>
                  <input
                    value={
                      inventoryForm
                        .playerName
                    }
                    onChange={(e) =>
                      handleInventoryFormChange(
                        'playerName',
                        e.target.value
                      )
                    }
                    maxLength={60}
                    placeholder='Messi'
                    className='mt-2 h-12 w-full rounded-lg border border-white/10 bg-[#0b0f17] px-4 text-sm text-white outline-none focus:border-violet-400'
                  />
                </label>
              </div>

              <div>
                <p className='text-sm font-bold text-slate-300'>
                  Talla
                </p>
                <div className='mt-3 grid grid-cols-5 gap-2'>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type='button'
                      onClick={() =>
                        handleInventoryFormChange(
                          'size',
                          size
                        )
                      }
                      className={`min-h-11 rounded-lg border px-2 text-sm font-black transition ${
                        inventoryForm.size ===
                        size
                          ? 'border-violet-400 bg-violet-600 text-white'
                          : 'border-white/10 bg-[#0b0f17] text-slate-300 hover:border-violet-400/60'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type='submit'
                className='inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-500'
              >
                <Plus size={18} />
                Guardar en inventario
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default AddShirt
