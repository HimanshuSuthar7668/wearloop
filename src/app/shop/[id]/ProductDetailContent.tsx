"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Heart, Calendar, Package, Shield, Edit, Trash2, X } from "lucide-react";
import { formatPrice, getAuthUser, getAuthToken } from "@/lib/utils";
import Button from "@/components/ui/Button";
import AuthPromptModal from "@/components/ui/AuthPromptModal";
import { useAppStore } from "@/context/AppContext";


interface ProductDetailContentProps {
  productId: string;
}

export default function ProductDetailContent({ productId }: ProductDetailContentProps) {
  const router = useRouter();
  const { products, cart, addToCart, deleteProduct, updateProduct, favourites, addToFavourites, removeFromFavourites } = useAppStore();
  const product = products.find((p) => p.id === productId);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<"perDay" | "per3Days" | "perWeek">("per3Days");
  const isFavourited = favourites.includes(productId);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRetailPrice, setEditRetailPrice] = useState(0);
  const [editPerDay, setEditPerDay] = useState(0);
  const [editPer3Days, setEditPer3Days] = useState(0);
  const [editPerWeek, setEditPerWeek] = useState(0);

  useEffect(() => {
    const user = getAuthUser();
    if (user?.role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (product) {
      setEditName(product.name);
      setEditBrand(product.brand);
      setEditDescription(product.description);
      setEditRetailPrice(product.retailPrice);
      setEditPerDay(product.rentalPrice.perDay);
      setEditPer3Days(product.rentalPrice.per3Days);
      setEditPerWeek(product.rentalPrice.perWeek);
    }
  }, [product]);

  const performAddToCart = useCallback(async () => {
    if (!product || !selectedSize) return;

    let days = 3;
    if (selectedDuration === "perDay") days = 1;
    if (selectedDuration === "perWeek") days = 7;

    const added = await addToCart(product.id, selectedSize, days);
    if (added) {
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  }, [product, selectedSize, selectedDuration, addToCart]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-parchment/40 mb-3">
            Piece not found
          </p>
          <Link href="/shop" className="text-sm text-[#c9a898] hover:underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const alreadyInCart = cart.some((item) => item.productId === product.id);

  const durationOptions = [
    { key: "perDay" as const, label: "1 day", price: product.rentalPrice.perDay },
    { key: "per3Days" as const, label: "3 days", price: product.rentalPrice.per3Days },
    { key: "perWeek" as const, label: "7 days", price: product.rentalPrice.perWeek },
  ];

  const savings = Math.round(
    ((product.retailPrice - product.rentalPrice[selectedDuration]) / product.retailPrice) * 100
  );

  const handleAdd = () => {
    if (!selectedSize) return;

    // Check if user is logged in
    const token = getAuthToken();
    if (!token) {
      // Not logged in — show auth modal
      setShowAuthModal(true);
      return;
    }

    performAddToCart();
  };

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    // After successful login, automatically add the item to cart
    performAddToCart();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(product.id);
      router.push("/shop");
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(product.id, {
      name: editName,
      brand: editBrand,
      description: editDescription,
      retailPrice: Number(editRetailPrice),
      rentalPrice: {
        perDay: Number(editPerDay),
        per3Days: Number(editPer3Days),
        perWeek: Number(editPerWeek),
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-parchment/50 hover:text-parchment transition-colors"
          >
            <ArrowLeft size={14} />
            Back to shop
          </Link>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 border-parchment/10 text-rose hover:bg-rose/10 font-semibold"
              >
                <Edit size={14} />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="flex items-center gap-1.5 border-red-500/20 text-red-400 hover:bg-red-500/10 font-semibold"
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-charcoal-light border border-parchment/10">
            <Image
              src={product.images[0].startsWith("/") || product.images[0].startsWith("http") ? product.images[0] : "/images/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <button
              onClick={() => isFavourited ? removeFromFavourites(productId) : addToFavourites(productId)}
              className="absolute top-5 right-5 p-3 bg-charcoal/60 backdrop-blur-sm rounded-full hover:bg-charcoal/80 transition-colors"
              aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
            >
              <Heart
                size={18}
                className={isFavourited ? "fill-rose text-[#c9a898]" : "text-parchment/60"}
              />
            </button>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-widest text-[#c9a898] font-bold">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-parchment/50">
                  <Star size={12} className="fill-rose text-[#c9a898]" />
                  <span>{product.rating}</span>
                  <span className="text-parchment/30">({product.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-parchment">
                {product.name}
              </h1>
            </div>

            <p className="text-parchment/55 leading-relaxed">{product.description}</p>

            {/* Savings badge */}
            <div className="inline-flex items-center gap-2 bg-sage/10 border border-sage/20 rounded-lg px-4 py-2 text-sm text-sage w-fit font-medium">
              <Shield size={14} />
              Save {savings}% vs buying retail ({formatPrice(product.retailPrice)})
            </div>

            {/* Rental duration */}
            <div>
              <p className="text-xs uppercase tracking-wider text-parchment/40 mb-3 font-semibold">
                Rental Duration
              </p>
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map(({ key, label, price }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDuration(key)}
                    className={`p-3 rounded-xl border text-center transition-colors ${
                      selectedDuration === key
                        ? "border-rose bg-rose/10"
                        : "border-parchment/10 hover:border-parchment/30"
                    }`}
                  >
                    <p className="text-sm font-semibold text-parchment">
                      {formatPrice(price)}
                    </p>
                    <p className="text-xs text-parchment/40 mt-0.5">{label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <p className="text-xs uppercase tracking-wider text-parchment/40 mb-3 font-semibold">
                Select Size
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "border-parchment bg-parchment text-charcoal font-bold"
                        : "border-parchment/20 text-parchment/60 hover:border-parchment/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex flex-col gap-3 pt-2">
              {alreadyInCart ? (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 bg-charcoal-light border border-parchment/20 text-parchment hover:bg-charcoal"
                    onClick={() => router.push("/cart")}
                  >
                    Already in Bag — Go to Cart
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-rose text-charcoal hover:bg-rose-dark font-bold py-3.5 rounded-xl transition-all"
                  disabled={!product.available || !selectedSize}
                  onClick={handleAdd}
                >
                  {!product.available
                    ? "Currently Unavailable"
                    : !selectedSize
                    ? "Select a Size"
                    : "Add to Bag"}
                </Button>
              )}

              {addedSuccess && (
                <p className="text-xs text-sage text-center font-medium animate-pulse">
                  ✓ Successfully added to your bag!
                </p>
              )}
            </div>

            {/* Trust signals */}
            <div className="pt-4 border-t border-parchment/10 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Package, text: "Free delivery & return" },
                { icon: Shield, text: "Dry-cleaned before dispatch" },
                { icon: Calendar, text: "Flexible rental dates" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2">
                  <Icon size={16} className="text-parchment/30" />
                  <p className="text-xs text-parchment/40 leading-tight">{text}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 bg-parchment/5 border border-parchment/10 rounded-full text-parchment/40 capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-charcoal/80 backdrop-blur-md z-999 flex items-center justify-center p-6">
          <div className="bg-charcoal-light border border-parchment/10 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-parchment/40 hover:text-parchment"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-xl font-bold text-parchment mb-6">
              Edit Product Details
            </h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs text-parchment/50 block mb-1">Product Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-parchment/50 block mb-1">Brand</label>
                <input
                  type="text"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-parchment/50 block mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    value={editRetailPrice}
                    onChange={(e) => setEditRetailPrice(Number(e.target.value))}
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">1-Day Rental (₹)</label>
                  <input
                    type="number"
                    value={editPerDay}
                    onChange={(e) => setEditPerDay(Number(e.target.value))}
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">3-Day Rental (₹)</label>
                  <input
                    type="number"
                    value={editPer3Days}
                    onChange={(e) => setEditPer3Days(Number(e.target.value))}
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-parchment/50 block mb-1">7-Day Rental (₹)</label>
                  <input
                    type="number"
                    value={editPerWeek}
                    onChange={(e) => setEditPerWeek(Number(e.target.value))}
                    className="w-full bg-charcoal border border-parchment/10 rounded-lg px-4 py-2.5 text-sm text-parchment focus:border-rose outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-parchment/5">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border-parchment/10 hover:bg-parchment/5"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="flex-1 bg-rose text-charcoal hover:bg-rose-dark font-bold"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Prompt Modal — shown when unauthenticated user tries to add to cart */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        redirectPath={`/shop/${product.id}`}
      />
    </div>
  );
}
