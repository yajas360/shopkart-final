export default function SearchBar({
    search,
    setSearch,
    category,
    setCategory,
    sort,
    setSort
}) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-xs mb-8 transition-colors duration-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm pointer-events-none">
                        <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg pl-10 pr-8 py-2.5 text-sm outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-600 dark:focus:ring-emerald-500 transition"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs w-5 h-5 flex items-center justify-center cursor-pointer"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-600 dark:focus:ring-emerald-500 transition cursor-pointer"
                    >
                        <option value="" className="dark:bg-slate-900">All Categories</option>
                        <option value="Electronics" className="dark:bg-slate-900">Electronics</option>
                        <option value="Fashion" className="dark:bg-slate-900">Fashion</option>
                        <option value="Books" className="dark:bg-slate-900">Books</option>
                        <option value="Home" className="dark:bg-slate-900">Home</option>
                    </select>
                </div>

                <div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-600 dark:focus:ring-emerald-500 transition cursor-pointer"
                    >
                        <option value="" className="dark:bg-slate-900">Sort: Featured</option>
                        <option value="price_asc" className="dark:bg-slate-900">Price: Low to High</option>
                        <option value="price_desc" className="dark:bg-slate-900">Price: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
}