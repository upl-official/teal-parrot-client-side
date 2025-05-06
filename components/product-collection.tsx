"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  fetchProducts,
  fetchCategories,
  fetchMaterials,
  fetchGrades,
  fetchCartItems,
  fetchWishlistItems,
} from "@/lib/api"
import type { Product, Category, Material, Grade } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  ChevronDown,
  Filter,
  Grid,
  Heart,
  List,
  Search,
  ShoppingBag,
  X,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { addToCart, addToWishlist, getCurrentUserId } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useInView } from "react-intersection-observer"

// Add the import for ProductImage at the top of the file
import { ProductImage } from "@/components/ui/product-image"

// Add the placeholder image constant at the top of the file, after the imports
const PLACEHOLDER_IMAGE = "/images/tp-placeholder-img.jpg"

// Define filter panel props interface
interface FilterSidebarProps {
  categories: Category[]
  materials: Material[]
  grades: Grade[]
  filters: {
    categories: string[]
    materials: string[]
    grades: string[]
    priceRange: { min: number; max: number }
    discount: boolean
    newArrivals: boolean
  }
  expandedFilters: {
    categories: boolean
    price: boolean
    materials: boolean
    grades: boolean
    discount: boolean
  }
  onCategoryChange: (categoryId: string) => void
  onMaterialChange: (materialId: string) => void
  onGradeChange: (gradeId: string) => void
  onPriceChange: (value: number[]) => void
  onDiscountChange: (checked: boolean) => void
  onToggleFilterSection: (section: string) => void
  onResetFilters: () => void
}

// Memoized Filter Sidebar Component
const MemoizedFilterSidebar = memo(function FilterSidebar({
  categories,
  materials,
  grades,
  filters,
  expandedFilters,
  onCategoryChange,
  onMaterialChange,
  onGradeChange,
  onPriceChange,
  onDiscountChange,
  onToggleFilterSection,
  onResetFilters,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <div className="border rounded-lg p-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => onToggleFilterSection("categories")}
        >
          <h3 className="text-lg font-semibold">Categories</h3>
          <motion.div animate={{ rotate: expandedFilters.categories ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>

        <AnimatePresence>
          {expandedFilters.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category._id}`}
                        checked={filters.categories.includes(category._id)}
                        onCheckedChange={() => onCategoryChange(category._id)}
                      />
                      <Label htmlFor={`category-${category._id}`} className="cursor-pointer text-sm flex-1">
                        {category.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No categories available</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range Filter */}
      <div className="border rounded-lg p-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => onToggleFilterSection("price")}
        >
          <h3 className="text-lg font-semibold">Price Range</h3>
          <motion.div animate={{ rotate: expandedFilters.price ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>

        <AnimatePresence>
          {expandedFilters.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 px-2">
                <div className="mb-6">
                  <Slider
                    defaultValue={[filters.priceRange.min, filters.priceRange.max]}
                    min={0}
                    max={10000}
                    step={100}
                    value={[filters.priceRange.min, filters.priceRange.max]}
                    onValueChange={onPriceChange}
                    className="mb-6"
                  />
                  <div className="flex items-center justify-between">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-100 px-2 py-1 text-xs font-medium">Min</div>
                      <Input
                        type="number"
                        value={filters.priceRange.min}
                        onChange={(e) => onPriceChange([Number.parseInt(e.target.value) || 0, filters.priceRange.max])}
                        className="border-0 text-sm py-1"
                      />
                    </div>
                    <div className="text-gray-400">-</div>
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-100 px-2 py-1 text-xs font-medium">Max</div>
                      <Input
                        type="number"
                        value={filters.priceRange.max}
                        onChange={(e) => onPriceChange([filters.priceRange.min, Number.parseInt(e.target.value) || 0])}
                        className="border-0 text-sm py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Materials Filter */}
      <div className="border rounded-lg p-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => onToggleFilterSection("materials")}
        >
          <h3 className="text-lg font-semibold">Materials</h3>
          <motion.div animate={{ rotate: expandedFilters.materials ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>

        <AnimatePresence>
          {expandedFilters.materials && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-2">
                {materials.length > 0 ? (
                  materials.map((material) => (
                    <div key={material._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`material-${material._id}`}
                        checked={filters.materials.includes(material._id)}
                        onCheckedChange={() => onMaterialChange(material._id)}
                      />
                      <Label htmlFor={`material-${material._id}`} className="cursor-pointer text-sm flex-1">
                        {material.material}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No materials available</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grades Filter */}
      <div className="border rounded-lg p-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => onToggleFilterSection("grades")}
        >
          <h3 className="text-lg font-semibold">Grades</h3>
          <motion.div animate={{ rotate: expandedFilters.grades ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>

        <AnimatePresence>
          {expandedFilters.grades && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-2">
                {grades.length > 0 ? (
                  grades.map((grade) => (
                    <div key={grade._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`grade-${grade._id}`}
                        checked={filters.grades.includes(grade._id)}
                        onCheckedChange={() => onGradeChange(grade._id)}
                      />
                      <Label htmlFor={`grade-${grade._id}`} className="cursor-pointer text-sm flex-1">
                        {grade.grade}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No grades available</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Discount Filter */}
      <div className="border rounded-lg p-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => onToggleFilterSection("discount")}
        >
          <h3 className="text-lg font-semibold">Offers</h3>
          <motion.div animate={{ rotate: expandedFilters.discount ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>

        <AnimatePresence>
          {expandedFilters.discount && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discount-filter"
                    checked={filters.discount}
                    onCheckedChange={(checked) => onDiscountChange(checked as boolean)}
                  />
                  <Label htmlFor="discount-filter" className="cursor-pointer text-sm flex-1">
                    Discounted Items
                  </Label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button onClick={onResetFilters} variant="outline" className="w-full">
        Reset All Filters
      </Button>
    </div>
  )
})

// Find the ProductCard component and update it by replacing the current component with this enhanced version

// Memoized Product Card Component
const ProductCard = memo(function ProductCard({
  product,
  viewMode,
  userCartItems,
  userWishlistItems,
  onAddToCart,
  onAddToWishlist,
}: {
  product: Product
  viewMode: "grid" | "list"
  userCartItems: string[]
  userWishlistItems: string[]
  onAddToCart: (product: Product, e: React.MouseEvent) => void
  onAddToWishlist: (product: Product, e: React.MouseEvent) => void
}) {
  const isInCart = userCartItems.includes(product._id)
  const isWishlisted = userWishlistItems.includes(product._id)

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.3 },
      }}
      transition={{ duration: 0.3 }}
      className={cn("group relative border rounded-lg overflow-hidden", viewMode === "list" ? "flex" : "")}
    >
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        {/* Wishlist button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "rounded-full p-1.5 shadow-sm",
            isWishlisted ? "bg-teal-500 text-white" : "bg-white/90 text-gray-700 hover:bg-gray-100",
          )}
          onClick={(e) => onAddToWishlist(product, e)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4", isWishlisted ? "fill-white" : "")} />
        </motion.button>

        {/* Cart button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "rounded-full p-1.5 shadow-sm",
            isInCart ? "bg-teal-500 text-white" : "bg-white/90 text-gray-700 hover:bg-gray-100",
          )}
          onClick={(e) => onAddToCart(product, e)}
          aria-label={isInCart ? "Remove from cart" : "Add to cart"}
        >
          <ShoppingBag className="h-4 w-4" />
        </motion.button>
      </div>

      <Link href={`/product/${product._id}`} className="w-full h-full">
        <div className={cn("relative overflow-hidden", viewMode === "list" ? "w-1/3" : "aspect-[3/4]")}>
          <ProductImage
            src={product.images[0] || "/placeholder.svg?height=400&width=300&query=silver jewelry"}
            alt={product.name}
            width={300}
            height={400}
            className="w-full h-full"
            objectFit="cover" // Ensure this is set to "cover"
          />
          {product.discountPercentage && product.discountPercentage > 0 && (
            <motion.div
              className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {product.discountPercentage}% OFF
            </motion.div>
          )}

          {/* Keep hover action buttons for additional options in future */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
            <motion.div
              className="bg-black/60 p-2 flex justify-center space-x-2"
              initial={{ y: "100%" }}
              animate={{ y: "100%" }}
              whileHover={{ y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-xs text-white">Quick view</span>
            </motion.div>
          </div>
        </div>

        <div className={cn("p-4", viewMode === "list" ? "flex-1 flex flex-col justify-between" : "")}>
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
            {viewMode === "list" && product.description && (
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
            )}
          </div>

          <div className="mt-2">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="font-semibold text-gray-900">₹{product.price}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <motion.span
                  className="text-gray-500 line-through text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  ₹{product.originalPrice}
                </motion.span>
              )}
            </motion.div>

            {/* Status indicators for list view */}
            {viewMode === "list" && (
              <div className="mt-4 flex items-center gap-3">
                {isInCart && (
                  <span className="inline-flex items-center text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    In Cart
                  </span>
                )}

                {isWishlisted && (
                  <span className="inline-flex items-center text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                    <Heart className="h-3 w-3 mr-1 fill-teal-600" />
                    In Wishlist
                  </span>
                )}
              </div>
            )}

            {viewMode === "list" && (
              <div className="mt-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-3 py-1 rounded-md flex items-center text-sm",
                    isInCart
                      ? "border border-teal-500 text-teal-500 hover:bg-teal-50"
                      : "bg-teal-500 text-white hover:bg-teal-600",
                  )}
                  onClick={(e) => onAddToCart(product, e)}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  {isInCart ? "In Cart" : "Add to Cart"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-3 py-1 rounded-md border border-teal-500 flex items-center text-sm",
                    isWishlisted ? "bg-teal-50 text-teal-600" : "text-teal-500 hover:bg-teal-50",
                  )}
                  onClick={(e) => onAddToWishlist(product, e)}
                >
                  <Heart className={cn("h-4 w-4 mr-1", isWishlisted ? "fill-teal-500" : "")} />
                  {isWishlisted ? "In Wishlist" : "Wishlist"}
                </motion.button>
              </div>
            )}
          </div>

          {/* Status indicators for grid view - show at bottom of card */}
          {viewMode === "grid" && (isInCart || isWishlisted) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {isInCart && (
                <span className="inline-flex items-center text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  In Cart
                </span>
              )}

              {isWishlisted && (
                <span className="inline-flex items-center text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  <Heart className="h-3 w-3 mr-1 fill-teal-600" />
                  In Wishlist
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
})

// Memoized Product Grid Component
const ProductGrid = memo(function ProductGrid({
  products,
  viewMode,
  userCartItems,
  userWishlistItems,
  onAddToCart,
  onAddToWishlist,
}: {
  products: Product[]
  viewMode: "grid" | "list"
  userCartItems: string[]
  userWishlistItems: string[]
  onAddToCart: (product: Product, e: React.MouseEvent) => void
  onAddToWishlist: (product: Product, e: React.MouseEvent) => void
}) {
  return (
    <div
      className={cn(
        "grid gap-4 md:gap-6",
        viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3" : "grid-cols-1",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            viewMode={viewMode}
            userCartItems={userCartItems}
            userWishlistItems={userWishlistItems}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        ))}
      </AnimatePresence>
    </div>
  )
})

// Memoized Active Filters Component
const ActiveFilters = memo(function ActiveFilters({
  searchQuery,
  filters,
  categories,
  materials,
  grades,
  activeFiltersCount,
  onRemoveFilter,
  onResetFilters,
}: {
  searchQuery: string
  filters: {
    categories: string[]
    materials: string[]
    grades: string[]
    discount: boolean
  }
  categories: Category[]
  materials: Material[]
  grades: Grade[]
  activeFiltersCount: number
  onRemoveFilter: (type: string, value?: string) => void
  onResetFilters: () => void
}) {
  // Helper functions to get names
  const getCategoryName = (id: string) => {
    const category = categories.find((c) => c._id === id)
    return category?.name || id
  }

  const getMaterialName = (id: string) => {
    const material = materials.find((m) => m._id === id)
    return material?.material || id
  }

  const getGradeName = (id: string) => {
    const grade = grades.find((g) => g._id === id)
    return grade?.grade || id
  }

  if (activeFiltersCount === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {searchQuery && (
        <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
          Search: {searchQuery}
          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => onRemoveFilter("search")}>
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      )}

      {filters.categories.map((categoryId) => (
        <Badge key={categoryId} variant="secondary" className="px-3 py-1 flex items-center gap-1">
          {getCategoryName(categoryId)}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveFilter("categories", categoryId)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      ))}

      {filters.materials.map((materialId) => (
        <Badge key={materialId} variant="secondary" className="px-3 py-1 flex items-center gap-1">
          {getMaterialName(materialId)}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveFilter("materials", materialId)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      ))}

      {filters.grades.map((gradeId) => (
        <Badge key={gradeId} variant="secondary" className="px-3 py-1 flex items-center gap-1">
          {getGradeName(gradeId)}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveFilter("grades", gradeId)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      ))}

      {filters.discount && (
        <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
          Discounted Items
          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => onRemoveFilter("discount")}>
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      )}

      {activeFiltersCount > 0 && (
        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={onResetFilters}>
          Clear all
        </Button>
      )}
    </div>
  )
})

// Main ProductCollection Component
export function ProductCollection() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true,
    materials: true,
    grades: true,
    discount: true,
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const productsPerPage = 12
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()
  const router = useRouter()
  const [isProductGridLoading, setIsProductGridLoading] = useState(false)

  const [userCartItems, setUserCartItems] = useState<string[]>([])
  const [userWishlistItems, setUserWishlistItems] = useState<string[]>([])

  const [filters, setFilters] = useState({
    categories: [] as string[],
    materials: [] as string[],
    grades: [] as string[],
    priceRange: { min: 0, max: 10000 },
    discount: false,
    newArrivals: false,
  })

  // Intersection observer for main content
  const { ref: collectionRef, inView: collectionInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "100px", // Add rootMargin to start observation earlier
  })

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Get parameters from URL if present
        const urlParams = new URLSearchParams(window.location.search)
        const urlCategoryId = urlParams.get("category")
        const urlSearchQuery = urlParams.get("search")

        // If there's a search query in the URL, set it in the state
        if (urlSearchQuery) {
          setSearchQuery(urlSearchQuery)
        }

        // CHANGE: Always fetch all products first, regardless of URL parameter
        const [productsData, categoriesData, materialsData, gradesData] = await Promise.all([
          fetchProducts(), // Remove the urlCategoryId parameter to always fetch all products
          fetchCategories(),
          fetchMaterials(),
          fetchGrades(),
        ])

        setProducts(productsData)

        // Apply initial filters based on URL parameters
        let filteredByParams = [...productsData]

        // If category was specified in URL, filter by category
        if (urlCategoryId) {
          setFilters((prev) => ({
            ...prev,
            categories: [urlCategoryId],
          }))

          // Filter products by category
          filteredByParams = filteredByParams.filter((product) => {
            const categoryName = product.category
            const matchingCategory = categoriesData.find((c) => c.name === categoryName)
            return matchingCategory && matchingCategory._id === urlCategoryId
          })
        }

        // If search query was specified in URL, filter by search query
        if (urlSearchQuery) {
          const query = urlSearchQuery.toLowerCase()
          filteredByParams = filteredByParams.filter(
            (product) =>
              product.name.toLowerCase().includes(query) ||
              (product.description && product.description.toLowerCase().includes(query)),
          )
        }

        setFilteredProducts(filteredByParams)
        setCategories(categoriesData)
        setMaterials(materialsData)
        setGrades(gradesData)

        // Find min and max prices in products
        if (productsData.length > 0) {
          const prices = productsData.map((p) => p.price)
          const minPrice = Math.floor(Math.min(...prices))
          const maxPrice = Math.ceil(Math.max(...prices))

          setFilters((prev) => ({
            ...prev,
            priceRange: { min: minPrice, max: maxPrice },
          }))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch user cart and wishlist items
  useEffect(() => {
    const fetchUserItems = async () => {
      const userId = getCurrentUserId()
      if (!userId) return

      try {
        // Fetch cart items
        const cartItems = await fetchCartItems(userId)
        setUserCartItems(cartItems.map((item) => item.product._id))

        // Fetch wishlist items
        const wishlistItems = await fetchWishlistItems(userId)
        setUserWishlistItems(wishlistItems.map((item) => item.product._id))
      } catch (error) {
        console.error("Error fetching user items:", error)
      }
    }

    fetchUserItems()
  }, [])

  // Inside the component, add this new useEffect hook after the other useEffect hooks

  // Listen for search events when already on the collection page
  useEffect(() => {
    const handleSearchUpdate = (event: any) => {
      const query = event.detail.query
      setSearchQuery(query)

      // Update URL without page reload
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set("search", query)
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`
      window.history.pushState({}, "", newUrl)
    }

    window.addEventListener("search-query-updated", handleSearchUpdate)
    return () => {
      window.removeEventListener("search-query-updated", handleSearchUpdate)
    }
  }, [])

  // Apply filters and sorting with useCallback to prevent unnecessary re-renders
  const applyFilters = useCallback(() => {
    if (loading) return

    // Start product grid loading animation without affecting filter panel
    setIsProductGridLoading(true)

    // Use a debounced approach to prevent rapid state changes
    const filterTimeout = setTimeout(() => {
      // Apply filtering logic
      let result = [...products]

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        result = result.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query)),
        )
      }

      // Apply category filter
      if (filters.categories.length > 0) {
        result = result.filter((product) => {
          const categoryName = product.category
          const matchingCategory = categories.find((c) => c.name === categoryName)
          return matchingCategory && filters.categories.includes(matchingCategory._id)
        })
      }

      // Apply material filter
      if (filters.materials.length > 0) {
        result = result.filter((product) => {
          const materialName = product.material
          const matchingMaterial = materials.find((m) => m.material === materialName)
          return matchingMaterial && filters.materials.includes(matchingMaterial._id)
        })
      }

      // Apply grade filter
      if (filters.grades.length > 0) {
        result = result.filter((product) => {
          const gradeName = product.grade
          const matchingGrade = grades.find((g) => g.grade === gradeName)
          return matchingGrade && filters.grades.includes(matchingGrade._id)
        })
      }

      // Apply price range filter
      result = result.filter(
        (product) => product.price >= filters.priceRange.min && product.price <= filters.priceRange.max,
      )

      // Apply discount filter
      if (filters.discount) {
        result = result.filter((product) => product.discountPercentage && product.discountPercentage > 0)
      }

      // Count active filters
      let count = 0
      if (filters.categories.length > 0) count++
      if (filters.materials.length > 0) count++
      if (filters.grades.length > 0) count++
      if (filters.discount) count++
      if (filters.newArrivals) count++
      if (searchQuery.trim()) count++
      setActiveFiltersCount(count)

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          result.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          result.sort((a, b) => b.price - a.price)
          break
        case "discount":
          result.sort((a, b) => {
            const discountA = a.discountPercentage || 0
            const discountB = b.discountPercentage || 0
            return discountB - discountA
          })
          break
        case "newest":
          // In a real app, would sort by date
          break
        default: // featured
          // Keep default order
          break
      }

      // Update state after a small delay to prevent layout thrashing
      setTimeout(() => {
        setFilteredProducts(result)
        setCurrentPage(1)
        setIsProductGridLoading(false)
      }, 100)
    }, 250) // Debounce time

    return () => clearTimeout(filterTimeout)
  }, [filters, sortBy, searchQuery, products, categories, materials, grades, loading])

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Filter handlers with useCallback
  const handleCategoryChange = useCallback((categoryId: string) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter((c) => c !== categoryId)
        : [...prev.categories, categoryId]

      // Update URL to reflect the current category filter state
      const urlParams = new URLSearchParams(window.location.search)

      if (categories.length === 0) {
        // If no categories selected, remove the category parameter
        urlParams.delete("category")
      } else if (categories.length === 1) {
        // If only one category, set it as the URL parameter
        urlParams.set("category", categories[0])
      } else {
        // For multiple categories, we could use a comma-separated list
        // But for simplicity, we'll just use the first one
        urlParams.set("category", categories[0])
      }

      // Update the URL without refreshing the page
      const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`
      window.history.pushState({}, "", newUrl)

      return { ...prev, categories }
    })
  }, [])

  const handleMaterialChange = useCallback((materialId: string) => {
    setFilters((prev) => {
      const materials = prev.materials.includes(materialId)
        ? prev.materials.filter((m) => m !== materialId)
        : [...prev.materials, materialId]

      return { ...prev, materials }
    })
  }, [])

  const handleGradeChange = useCallback((gradeId: string) => {
    setFilters((prev) => {
      const grades = prev.grades.includes(gradeId)
        ? prev.grades.filter((g) => g !== gradeId)
        : [...prev.grades, gradeId]

      return { ...prev, grades }
    })
  }, [])

  const handlePriceChange = useCallback((value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        min: value[0],
        max: value[1],
      },
    }))
  }, [])

  const handleDiscountChange = useCallback((checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      discount: checked,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    // Find min and max prices in products
    let minPrice = 0
    let maxPrice = 10000

    if (products.length > 0) {
      const prices = products.map((p) => p.price)
      minPrice = Math.floor(Math.min(...prices))
      maxPrice = Math.ceil(Math.max(...prices))
    }

    setFilters({
      categories: [],
      materials: [],
      grades: [],
      priceRange: { min: minPrice, max: maxPrice },
      discount: false,
      newArrivals: false,
    })
    setSearchQuery("")
    setSortBy("featured")

    // Clear URL parameters
    const newUrl = window.location.pathname
    window.history.pushState({}, "", newUrl)
  }, [products])

  const removeFilter = useCallback((type: string, value?: string) => {
    if (type === "search") {
      setSearchQuery("")

      // Update URL to remove search parameter
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.delete("search")
      const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`
      window.history.pushState({}, "", newUrl)

      return
    }

    setFilters((prev) => {
      const newFilters = { ...prev }

      if (type === "categories" && value) {
        newFilters.categories = prev.categories.filter((id) => id !== value)

        // Update URL when removing category filter
        const urlParams = new URLSearchParams(window.location.search)
        if (newFilters.categories.length === 0) {
          urlParams.delete("category")
        } else if (newFilters.categories.length === 1) {
          urlParams.set("category", newFilters.categories[0])
        }

        const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`
        window.history.pushState({}, "", newUrl)
      } else if (type === "materials" && value) {
        newFilters.materials = prev.materials.filter((id) => id !== value)
      } else if (type === "grades" && value) {
        newFilters.grades = prev.grades.filter((id) => id !== value)
      } else if (type === "discount") {
        newFilters.discount = false
      } else if (type === "newArrivals") {
        newFilters.newArrivals = false
      }

      return newFilters
    })
  }, [])

  const toggleFilterSection = useCallback((section: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }))
  }, [])

  const handleAddToCart = useCallback(
    async (product: Product, e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      try {
        const userId = getCurrentUserId()
        if (!userId) {
          toast({
            title: "Please log in",
            description: "You need to be logged in to add items to your cart",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        await addToCart(userId, product._id, 1)

        // Update local state to reflect the change
        setUserCartItems((prev) => [...prev, product._id])

        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart.`,
        })
      } catch (error) {
        console.error("Error adding to cart:", error)
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        })
      }
    },
    [router, toast],
  )

  const handleAddToWishlist = useCallback(
    async (product: Product, e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      try {
        const userId = getCurrentUserId()
        if (!userId) {
          toast({
            title: "Please log in",
            description: "You need to be logged in to add items to your wishlist",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        await addToWishlist(userId, product._id)

        // Update local state to reflect the change
        setUserWishlistItems((prev) => [...prev, product._id])

        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      } catch (error) {
        console.error("Error adding to wishlist:", error)
        toast({
          title: "Error",
          description: "Failed to add item to wishlist. Please try again.",
          variant: "destructive",
        })
      }
    },
    [router, toast],
  )

  const handleViewModeChange = useCallback(
    (mode: "grid" | "list") => {
      if (mode === viewMode) return
      setIsProductGridLoading(true)
      setTimeout(() => {
        setViewMode(mode)
        setIsProductGridLoading(false)
      }, 300)
    },
    [viewMode],
  )

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = useMemo(
    () => filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct),
    [filteredProducts, indexOfFirstProduct, indexOfLastProduct],
  )
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to top of product grid
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500"
          >
            Loading collection...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Alert variant="destructive" className="w-full max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </Button>
            </motion.div>
          </Alert>
        </motion.div>
      </div>
    )
  }

  // Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null

    const pageNumbers = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex justify-center mt-8">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={cn(
              "h-8 w-8 rounded-md flex items-center justify-center",
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(1)}
                className={cn(
                  "h-8 w-8 rounded-md flex items-center justify-center",
                  currentPage === 1
                    ? "bg-teal-500 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
                )}
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}

          {pageNumbers.map((number) => (
            <Button
              key={number}
              variant="outline"
              size="icon"
              onClick={() => paginate(number)}
              className={cn(
                "h-8 w-8 rounded-md flex items-center justify-center",
                currentPage === number
                  ? "bg-teal-500 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
              )}
            >
              {number}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(totalPages)}
                className={cn(
                  "h-8 w-8 rounded-md flex items-center justify-center",
                  currentPage === totalPages
                    ? "bg-teal-500 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
                )}
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={cn(
              "h-8 w-8 rounded-md flex items-center justify-center",
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
            )}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16" ref={collectionRef}>
      {/* Breadcrumbs */}
      <motion.nav
        className="flex mb-6 text-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/" className="text-gray-500 hover:text-teal-500 transition-colors">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="font-medium">Collection</span>
      </motion.nav>

      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Collection
        </motion.h1>

        <motion.div
          className="flex items-center mt-4 md:mt-0 space-x-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile filter button */}
          {isMobile && (
            <Drawer open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => setShowMobileFilters(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <div className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-teal-500 text-white rounded-full text-xs">
                      {activeFiltersCount}
                    </div>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <MemoizedFilterSidebar
                    categories={categories}
                    materials={materials}
                    grades={grades}
                    filters={filters}
                    expandedFilters={expandedFilters}
                    onCategoryChange={handleCategoryChange}
                    onMaterialChange={handleMaterialChange}
                    onGradeChange={handleGradeChange}
                    onPriceChange={handlePriceChange}
                    onDiscountChange={handleDiscountChange}
                    onToggleFilterSection={toggleFilterSection}
                    onResetFilters={resetFilters}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          )}

          {/* Search - Integrated with Header */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => {
              // Find the header search button and click it
              const headerSearchButton = document.querySelector('[aria-label="Search"]') as HTMLButtonElement
              if (headerSearchButton) {
                headerSearchButton.click()
              }
            }}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <span>Sort by</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="discount">Highest Discount</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* View mode toggle */}
          <div className="border rounded-md flex">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-none rounded-l-md px-2 py-1",
                viewMode === "grid" ? "bg-teal-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50",
              )}
              onClick={() => handleViewModeChange("grid")}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-none rounded-r-md px-2 py-1",
                viewMode === "list" ? "bg-teal-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50",
              )}
              onClick={() => handleViewModeChange("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Active filters */}
      <ActiveFilters
        searchQuery={searchQuery}
        filters={filters}
        categories={categories}
        materials={materials}
        grades={grades}
        activeFiltersCount={activeFiltersCount}
        onRemoveFilter={removeFilter}
        onResetFilters={resetFilters}
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        {!isMobile && (
          <div className="w-full md:w-1/4 lg:w-1/5">
            <MemoizedFilterSidebar
              categories={categories}
              materials={materials}
              grades={grades}
              filters={filters}
              expandedFilters={expandedFilters}
              onCategoryChange={handleCategoryChange}
              onMaterialChange={handleMaterialChange}
              onGradeChange={handleGradeChange}
              onPriceChange={handlePriceChange}
              onDiscountChange={handleDiscountChange}
              onToggleFilterSection={toggleFilterSection}
              onResetFilters={resetFilters}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          {/* Results count */}
          <div className="mb-4 text-sm text-gray-500">
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any products matching your criteria.</p>
              <Button onClick={resetFilters}>Clear all filters</Button>
            </div>
          ) : (
            <motion.div
              key="product-grid-container"
              initial={{ opacity: 1 }}
              animate={{
                opacity: isProductGridLoading ? 0.6 : 1,
                scale: isProductGridLoading ? 0.98 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {isProductGridLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="bg-white/80 p-3 rounded-full shadow-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                </div>
              )}
              <ProductGrid
                products={currentProducts}
                viewMode={viewMode}
                userCartItems={userCartItems}
                userWishlistItems={userWishlistItems}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
              <PaginationComponent />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
