"use client"

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X, ChevronUp, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/lib/auth"
import { fetchCartItems, fetchWishlistItems, searchProducts } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { debounce } from "@/lib/debounce"
import { SearchResults } from "./search/search-results"
import type { Product } from "@/lib/types"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [wishlistItemCount, setWishlistItemCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, logout } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  // Navigation items with their paths
  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/collection" },
    { name: "Our Brand", path: "/brand" },
    { name: "Size & Care Guide", path: "/guide" },
    { name: "Contact Us", path: "/contact" },
  ]

  // Check if a path is active (exact match or starts with for nested routes)
  const isActivePath = (path: string): boolean => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      try {
        setIsSearching(true)
        const results = await searchProducts(query)
        setSearchResults(results)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
    [],
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Close the search dropdown
      setIsSearchOpen(false)
      setSearchResults([])

      // Check if already on collection page
      if (pathname === "/collection") {
        // Use router.replace to update the URL without adding to history stack
        router.replace(`/collection?search=${encodeURIComponent(searchQuery.trim())}`)

        // Manually dispatch a custom event that the collection page can listen for
        const searchEvent = new CustomEvent("search-query-updated", {
          detail: { query: searchQuery.trim() },
        })
        window.dispatchEvent(searchEvent)
      } else {
        // Navigate to the collection page with the search query
        router.push(`/collection?search=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus search input when search bar opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Create a reusable function to fetch counts
  const fetchCounts = useCallback(async () => {
    if (isAuthenticated && user?._id) {
      try {
        // Fetch cart items
        const cartItems = await fetchCartItems(user._id)
        setCartItemCount(cartItems.length)

        // Fetch wishlist items with error handling
        try {
          const wishlistItems = await fetchWishlistItems(user._id)
          setWishlistItemCount(wishlistItems.length)
        } catch (wishlistError) {
          console.error("Error fetching wishlist count:", wishlistError)
          // Don't update the count if there's an error
        }
      } catch (error) {
        console.error("Error fetching cart count:", error)
      }
    } else {
      // Reset counts if not authenticated
      setCartItemCount(0)
      setWishlistItemCount(0)
    }
  }, [isAuthenticated, user])

  // Fetch cart and wishlist counts when component mounts or auth state changes
  useEffect(() => {
    fetchCounts()

    // Set up polling to refresh counts every 30 seconds
    const intervalId = setInterval(fetchCounts, 30000)

    return () => clearInterval(intervalId)
  }, [fetchCounts])

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCounts()
    }

    // Add event listener for cart updates
    window.addEventListener("cart-updated", handleCartUpdate)

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate)
    }
  }, [fetchCounts])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close search when user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button[aria-label="Search"]') &&
        !(event.target as Element).closest('button[aria-label="Close Search"]')
      ) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchOpen])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleLogout = () => {
    logout()
    // Redirect to home page after logout
    window.location.href = "/"
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchQuery("")
      setSearchResults([])
    }
  }

  const handleSearchResultClick = () => {
    setIsSearchOpen(false)
    setSearchResults([])
    setSearchQuery("")
  }

  // Handle click outside to close search results
  const handleClickOutsideResults = useCallback((event: MouseEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node) &&
      !(event.target as Element).closest('button[aria-label="Search"]')
    ) {
      setSearchResults([])
    }
  }, [])

  // Add event listener for click outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideResults)
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideResults)
    }
  }, [handleClickOutsideResults])

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[60] transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>
        <nav className="bg-teal-500 text-white">
          <div className="container mx-auto flex flex-wrap items-center justify-between px-4 pt-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                {/* Full logo for medium screens and up */}
                <div className="hidden md:block h-14 w-auto">
                  <Image
                    src="/logos/teal-parrot-logo-white.svg"
                    alt="Teal Parrot"
                    width={300}
                    height={70}
                    className="h-14 w-auto"
                    priority
                  />
                </div>
                {/* Emblem only for small screens */}
                <div className="md:hidden h-14 w-auto">
                  <Image
                    src="/logos/teal-parrot-emblem-white.svg"
                    alt="Teal Parrot"
                    width={70}
                    height={70}
                    className="h-14 w-auto"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <motion.div initial={false} animate={{ rotate: isSearchOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSearch}
                  className="text-white hover:bg-teal-600 relative"
                  aria-label="Search"
                >
                  {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </Button>
              </motion.div>

              {/* Wishlist Icon with Badge */}
              {isAuthenticated ? (
                <Link href="/wishlist" className="relative">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600" aria-label="Wishlist">
                    <Heart className="h-5 w-5" />
                    {wishlistItemCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                        {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              ) : (
                <Link href={`/login?redirect=${encodeURIComponent("/wishlist")}`} className="relative">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600" aria-label="Wishlist">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {/* Cart Icon with Badge */}
              {isAuthenticated ? (
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600" aria-label="Cart">
                    <ShoppingCart className="h-5 w-5" />
                    <AnimatePresence mode="wait">
                      {cartItemCount > 0 && (
                        <motion.div
                          key="cart-badge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Badge className="bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                            {cartItemCount > 99 ? "99+" : cartItemCount}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </Link>
              ) : (
                <Link href={`/login?redirect=${encodeURIComponent("/cart")}`} className="relative">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600" aria-label="Cart">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {/* Account Icon - Direct Link to Account Page */}
              {isAuthenticated ? (
                <Link href="/account">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600" aria-label="Account">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-teal-600" aria-label="Login">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-teal-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div className="container mx-auto flex flex-wrap items-center justify-center px-4 pb-4">
            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center space-x-1 text-base">
              {navigationItems.map((item, index) => (
                <React.Fragment key={item.path}>
                  <li>
                    <Link
                      href={item.path}
                      className={cn(
                        "px-3 py-2 rounded-md relative transition-all duration-200 group flex items-center",
                        isActivePath(item.path) ? "font-medium" : "hover:bg-teal-600/30",
                      )}
                      aria-current={isActivePath(item.path) ? "page" : undefined}
                    >
                      {item.name}
                      <span
                        className={cn(
                          "absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-left transition-transform duration-300",
                          isActivePath(item.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                  {index < navigationItems.length - 1 && <li className="text-white/30">•</li>}
                </React.Fragment>
              ))}
            </ul>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="md:hidden bg-teal-500 w-full"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ul className="flex flex-col items-center py-2">
                  {navigationItems.map((item) => (
                    <li key={item.path} className="w-full">
                      <Link
                        href={item.path}
                        className={cn(
                          "block py-2 px-4 transition-all duration-200",
                          isActivePath(item.path)
                            ? "bg-teal-600 font-medium border-l-4 border-white"
                            : "hover:bg-teal-600/50 hover:pl-6",
                        )}
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={isActivePath(item.path) ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <li className="w-full">
                        <Link
                          href="/account"
                          className={cn(
                            "block py-2 px-4 transition-all duration-200",
                            isActivePath("/account")
                              ? "bg-teal-600 font-medium border-l-4 border-white"
                              : "hover:bg-teal-600/50 hover:pl-6",
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Account
                        </Link>
                      </li>
                      <li className="w-full">
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsMenuOpen(false)
                          }}
                          className="w-full text-left block py-2 px-4 hover:bg-teal-600/50 hover:pl-6 transition-all duration-200"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <li className="w-full">
                      <Link
                        href={`/login?redirect=${encodeURIComponent(pathname)}`}
                        className={cn(
                          "block py-2 px-4 transition-all duration-200",
                          isActivePath("/login")
                            ? "bg-teal-600 font-medium border-l-4 border-white"
                            : "hover:bg-teal-600/50 hover:pl-6",
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login / Sign Up
                      </Link>
                    </li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                className="w-full bg-teal-500 shadow-lg"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="container mx-auto py-4 px-4">
                  <div ref={searchContainerRef} className="relative">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                      <div className="relative flex-grow">
                        <Input
                          ref={searchInputRef}
                          type="search"
                          placeholder="Search for products..."
                          className="w-full rounded-md border-0 bg-white/90 backdrop-blur-sm text-gray-800 pl-4 pr-10 py-6 text-base focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-600"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery("")
                              setSearchResults([])
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            aria-label="Clear search"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                      <Button
                        type="submit"
                        className="bg-white text-teal-600 hover:bg-gray-100 hover:text-teal-700 font-medium py-6 px-6 rounded-md transition-all duration-200 shadow-sm"
                      >
                        Search
                      </Button>

                      {/* Search Results - Rendered outside the form to avoid overflow issues */}
                    </form>

                    {(searchResults.length > 0 || isSearching || (searchQuery && searchQuery.length > 2)) && (
                      <SearchResults
                        results={searchResults}
                        isLoading={isSearching}
                        searchQuery={searchQuery}
                        onResultClick={handleSearchResultClick}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
      {/* This div provides spacing to push content below the fixed header */}
      <div className="h-[85px] md:h-[125px]"></div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-2 rounded-full bg-teal-500 text-white shadow-md"
            aria-label="Scroll to top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
