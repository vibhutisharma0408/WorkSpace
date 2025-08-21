import Brand from './Brand'
import ThemeToggle from './ThemeToggle'

export default function AuthLayout({ title, subtitle, children, cardClassName = 'max-w-md', headerAlign = 'left' }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient and animated blobs */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-base-200 via-base-100 to-base-200" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl animate-float-delay" />

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <Brand />
          <ThemeToggle />
        </div>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Promo / visual side */}
          <div className="hidden lg:block">
            <div className="mockup-window border bg-base-300 shadow-xl">
              <div className="bg-base-100 px-8 py-10">
                <h1 className="text-4xl font-bold">TeamSpace</h1>
                <p className="mt-2 text-base opacity-80">Your collaborative hub for workspaces, documents, and teamwork.</p>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {['Alex','Priya','Sam'].map((name, idx) => (
                    <div key={name} className={`card bg-base-200/60 backdrop-blur border ${idx===1? 'translate-y-4' : ''} animate-float`}> 
                      <div className="card-body">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 rounded-full">
                              <img alt="avatar" src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`} />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-xs opacity-60">typing…</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <div className="badge badge-primary badge-lg">Docs</div>
                  <div className="badge badge-secondary badge-lg">Chat</div>
                  <div className="badge badge-accent badge-lg">Tasks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Auth card */}
          <div className={`card mx-auto w-full ${cardClassName} bg-base-100/80 backdrop-blur-xl border border-base-300/40 shadow-xl rounded-2xl`}>
            <div className="card-body p-7 md:p-8">
              <div className={`mb-2 ${headerAlign === 'center' ? 'text-center' : ''}`}>
                <h2 className="card-title text-3xl font-semibold tracking-tight">{title}</h2>
                {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


