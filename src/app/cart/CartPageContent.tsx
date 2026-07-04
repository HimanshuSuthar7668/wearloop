"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Trash2, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import { useAppStore } from "@/context/AppContext";
import { formatPrice, getAuthToken } from "@/lib/utils";
import { ordersApi, paymentsApi } from "@/lib/api";
import Button from "@/components/ui/Button";

export default function CartPageContent() {
  const router = useRouter();
  const { cart, products, removeFromCart, clearCart } = useAppStore();
  const [token, setToken] = useState<string | null>(null);

  // Checkout states
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "securing" | "paying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  // Map cart items to full products
  const cartWithDetails = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    
    // Determine price based on duration
    let price = 0;
    if (product) {
      if (item.days === 1) price = product.rentalPrice.perDay;
      else if (item.days === 7) price = product.rentalPrice.perWeek;
      else price = product.rentalPrice.per3Days;
    }

    return {
      ...item,
      product,
      price,
    };
  }).filter((item) => item.product !== undefined);

  const subtotal = cartWithDetails.reduce((sum, item) => sum + item.price, 0);
  const securityDeposit = subtotal > 0 ? Math.round(subtotal * 0.1) : 0; // 10% security deposit
  const grandTotal = subtotal + securityDeposit;

  const handleCheckout = async () => {
    if (!token) {
      router.push("/auth?redirect=/cart");
      return;
    }

    try {
      setCheckoutStep("securing");
      setErrorMessage("");

      // 1. Create order on backend
      const orderItems = cartWithDetails.map((item) => ({
        productId: Number(item.productId),
        days: item.days,
      }));

      const { orderId } = await ordersApi.create({ items: orderItems }, token) as { orderId: number };

      // 2. Process simulated payment on backend
      setCheckoutStep("paying");
      const transactionId = "tx_" + Date.now() + Math.random().toString(36).substr(2, 5);

      await paymentsApi.create({ orderId, transactionId }, token);

      setCheckoutStep("success");
      clearCart();

      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 2000);

    } catch (err: any) {
      console.error("Checkout error:", err);
      setErrorMessage(err.message || "Something went wrong during checkout. Please try again.");
      setCheckoutStep("error");
    }
  };

  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-parchment mb-10">
          Your Rental Bag
        </h1>

        {cartWithDetails.length === 0 ? (
          <div className="text-center py-20 border border-parchment/10 rounded-2xl bg-charcoal-light/30">
            <div className="w-16 h-16 rounded-full bg-parchment/5 border border-parchment/10 flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={24} className="text-rose" />
            </div>
            <p className="font-display text-xl text-parchment/70 mb-2">
              Your bag is empty
            </p>
            <p className="text-sm text-parchment/40 mb-8 max-w-sm mx-auto leading-relaxed">
              Find the perfect statement pieces for your upcoming event.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-6 py-3 rounded-lg hover:bg-rose-dark transition-all duration-200"
            >
              Browse Shop
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cartWithDetails.map((item) => (
                <div 
                  key={item.productId} 
                  className="bg-charcoal-light border border-parchment/10 rounded-2xl p-5 flex gap-4 md:gap-6 items-center justify-between transition-all duration-200 hover:border-parchment/20"
                >
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden shrink-0 border border-parchment/5">
                      <Image
                        src={item.product?.images[0] || "/images/placeholder.jpg"}
                        alt={item.product?.name || "Product"}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-rose font-bold">
                        {item.product?.brand}
                      </span>
                      <h3 className="font-display text-sm md:text-base font-bold text-parchment mt-0.5 line-clamp-1">
                        {item.product?.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-parchment/45 mt-1.5">
                        <span>Size: <strong className="text-parchment/70">{item.size}</strong></span>
                        <span>•</span>
                        <span>Duration: <strong className="text-parchment/70">{item.days} {item.days === 1 ? "Day" : "Days"}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-parchment">{formatPrice(item.price)}</p>
                      <p className="text-[10px] text-parchment/40 mt-0.5">Rental Fee</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-parchment/40 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Checkout Card */}
            <div className="lg:col-span-1">
              <div className="bg-charcoal-light rounded-2xl p-6 border border-parchment/10 flex flex-col gap-6 sticky top-28">
                <h2 className="font-display text-lg font-bold text-parchment border-b border-parchment/5 pb-4">
                  Rental Summary
                </h2>

                <div className="flex flex-col gap-3.5 text-sm">
                  <div className="flex justify-between text-parchment/65">
                    <span>Items Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-parchment/65">
                    <span>Refundable Deposit (10%)</span>
                    <span>{formatPrice(securityDeposit)}</span>
                  </div>
                  <div className="flex justify-between text-parchment/65">
                    <span>Delivery & Dry Cleaning</span>
                    <span className="text-sage font-medium">FREE</span>
                  </div>
                  <div className="h-px bg-parchment/5 my-1" />
                  <div className="flex justify-between text-base font-bold text-parchment">
                    <span>Total Amount</span>
                    <span className="text-rose">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <div className="flex flex-col gap-2.5">
                  <Button 
                    variant="primary"
                    className="w-full bg-rose text-charcoal hover:bg-rose-dark font-bold py-3.5 rounded-xl transition-all"
                    onClick={handleCheckout}
                  >
                    {token ? "Pay & Rent Now" : "Sign In to Checkout"}
                  </Button>
                  
                  <div className="flex gap-2 items-center justify-center text-[10px] text-parchment/45 mt-1">
                    <ShieldCheck size={12} className="text-sage" />
                    <span>Free damage insurance included up to ₹5,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Processing Overlay */}
      {checkoutStep !== "idle" && (
        <div className="fixed inset-0 bg-charcoal/90 backdrop-blur-md z-999 flex items-center justify-center p-6">
          <div className="bg-charcoal-light border border-parchment/10 rounded-2xl w-full max-w-sm p-8 text-center flex flex-col items-center gap-6 shadow-2xl">
            {checkoutStep === "securing" && (
              <>
                <Loader2 size={40} className="text-rose animate-spin" />
                <div>
                  <h3 className="font-display text-lg font-bold text-parchment">Securing Rentals</h3>
                  <p className="text-xs text-parchment/50 mt-1">Reserving items and lock-in stock...</p>
                </div>
              </>
            )}

            {checkoutStep === "paying" && (
              <>
                <Loader2 size={40} className="text-[#8a9e8c] animate-spin" />
                <div>
                  <h3 className="font-display text-lg font-bold text-parchment">Authorizing Payment</h3>
                  <p className="text-xs text-parchment/50 mt-1">Processing secure simulated payment of {formatPrice(grandTotal)}...</p>
                </div>
              </>
            )}

            {checkoutStep === "success" && (
              <>
                <div className="w-12 h-12 bg-sage/10 border border-sage/30 rounded-full flex items-center justify-center text-sage text-xl animate-bounce">
                  ✓
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-sage">Order Placed!</h3>
                  <p className="text-xs text-parchment/50 mt-1">Redirecting you to your rental dashboard...</p>
                </div>
              </>
            )}

            {checkoutStep === "error" && (
              <>
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-400 text-xl font-bold">
                  !
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-red-400">Checkout Failed</h3>
                  <p className="text-xs text-red-400/80 mt-1.5">{errorMessage}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCheckoutStep("idle")}
                  className="w-full mt-2"
                >
                  Close & Try Again
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
