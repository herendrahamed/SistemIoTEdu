import { CircleUserRound, ChevronRight, Menu, Search, Heart } from "lucide-react";

export function Header({
  detailOpen,
  isPlayground,
  moduleTitle,
  activeLesson,
  activeLevel,
  sidebarOpen,
  toggleSidebar,
  openMobile,
  search,
  setSearch,
  searchResults,
  onSelectResult,
  profileOpen,
  toggleProfile,
  openDonation,
}) {
  return (
    <header className="topbar" data-testid="app-header">
      <div className="header-left">
        <button
          className="icon-button desktop-toggle"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          data-testid="sidebar-toggle"
        >
          <Menu size={20} />
        </button>
        <button
          className="icon-button mobile-toggle"
          onClick={openMobile}
          aria-label="Buka menu"
          data-testid="mobile-menu-button"
        >
          <Menu size={21} />
        </button>
        <div className="breadcrumb" data-testid="breadcrumb">
          <span>
            {detailOpen ? "Playground · Detail" : isPlayground ? "Playground" : `Level ${activeLevel}`}
          </span>
          <ChevronRight size={14} />
          <b>{detailOpen || isPlayground ? moduleTitle : activeLesson.name}</b>
        </div>
      </div>
      <div className="header-actions">
        <div className="search-wrap" data-testid="search-wrap">
          <div className="search-button" data-testid="search-button">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari pelajaran atau modul"
              aria-label="Cari pelajaran"
              data-testid="search-input"
            />
          </div>
          {search && (
            <div className="search-results" data-testid="search-results">
              {searchResults.length ? (
                searchResults.map((result) => (
                  <button
                    key={`${result.kind}-${result.key}`}
                    onClick={() => onSelectResult(result)}
                    data-testid="search-result-item"
                  >
                    <b>{result.name}</b>
                    <small>{result.label}</small>
                  </button>
                ))
              ) : (
                <span data-testid="search-empty">Materi tidak ditemukan</span>
              )}
            </div>
          )}
        </div>
        <button
          className="header-donation-button"
          onClick={openDonation}
          data-testid="header-donation-button"
          aria-label="Buka donasi QRIS"
        >
          <Heart size={14} fill="currentColor" />
          <span>Donasi</span>
        </button>
        <button
          className="profile-button"
          aria-label="Profil pengguna"
          onClick={toggleProfile}
          data-testid="profile-button"
          aria-expanded={profileOpen}
        >
          <CircleUserRound size={26} />
        </button>
      </div>
    </header>
  );
}
