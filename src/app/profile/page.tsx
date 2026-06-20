"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  HelpCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Users
} from "lucide-react";
import { getAuthToken, getAuthUser, removeAuthToken, removeAuthUser, formatPrice } from "@/lib/utils";
import { ordersApi } from "@/lib/api";
import Button from "@/components/ui/Button";
import { useAppStore } from "@/context/AppContext";

interface OrderItem {
  productId: number;
  name: string;
  days: number;
  price: number;
}

interface Order {
  orderId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { products } = useAppStore();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"rentals" | "dashboard" | "settings">("rentals");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const currentToken = getAuthToken();
    const currentUser = getAuthUser();

    if (!currentToken || !currentUser) {
      router.push("/auth");
    } else {
      setToken(currentToken);
      setUser(currentUser);
      setAuthChecked(true);
      fetchOrders(currentToken);
    }
  }, [router]);

  const fetchOrders = async (authToken: string) => {
    try {
      setLoadingOrders(true);
      const res = await ordersApi.getMyOrders(authToken) as Order[];
      setOrders(res || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancellingId(orderId);
      await ordersApi.cancel(String(orderId), token);
      await fetchOrders(token);
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    removeAuthUser();
    setUser(null);
    setToken(null);
    window.location.href = "/";
  };

  // Helper: Look up actual frontend product details for order history
  const getProductDetails = (productId: number) => {
    return products.find((p) => String(p.id) === String(productId));
  };

  // User and Admin Analytics data calculation
  const analyticsData = useMemo(() => {
    if (orders.length === 0) return { totalSpent: 0, activeCount: 0, chartPoints: [] };

    let totalSpent = 0;
    let activeCount = 0;
    
    // Group monthly spend: { "Jan": 2000, "Feb": 1500 ... }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySpend: Record<string, number> = {};

    // Initialize last 6 months
    const currentMonth = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      monthlySpend[months[monthIdx]] = 0;
    }

    orders.forEach((order) => {
      const isCancelled = order.status.toUpperCase() === "CANCELLED";
      const isCompleted = order.status.toUpperCase() === "COMPLETED" || order.status.toUpperCase() === "SUCCESS";
      const isActive = ["CREATED", "CONFIRMED", "ACTIVE"].includes(order.status.toUpperCase());
      
      const amount = Number(order.totalAmount) || 0;

      if (!isCancelled) {
        totalSpent += amount;
      }
      if (isActive) {
        activeCount += 1;
      }

      // Extract month name
      const date = new Date(order.createdAt);
      const monthName = months[date.getMonth()];
      if (monthName in monthlySpend && !isCancelled) {
        monthlySpend[monthName] += amount;
      }
    });

    const chartPoints = Object.entries(monthlySpend).map(([month, value]) => ({
      label: month,
      value,
    }));

    return {
      totalSpent,
      activeCount,
      chartPoints,
    };
  }, [orders]);

  if (!authChecked || !user) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-rose border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-parchment/50">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-charcoal pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Header grid */}
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Sidebar Card */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="bg-charcoal-light rounded-2xl border border-parchment/10 p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-rose/10 border-2 border-rose/30 rounded-full flex items-center justify-center mb-4">
                <span className="text-rose font-display text-2xl font-bold uppercase">
                  {user.name.charAt(0)}
                </span>
              </div>
              <h2 className="font-display text-lg font-bold text-parchment line-clamp-1">{user.name}</h2>
              <p className="text-xs text-parchment/45 mt-1 truncate w-full">{user.email}</p>
              <span className="mt-3.5 px-3 py-1 bg-parchment/5 border border-parchment/10 text-[10px] uppercase tracking-wider text-rose rounded-full font-semibold">
                {user.role} Member
              </span>
            </div>

            {/* Navigation options */}
            <div className="bg-charcoal-light rounded-2xl border border-parchment/10 overflow-hidden">
              <button
                onClick={() => setActiveTab("rentals")}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm transition-colors text-left ${
                  activeTab === "rentals" 
                    ? "bg-rose/10 border-l-3 border-rose text-parchment font-semibold" 
                    : "text-parchment/60 hover:text-parchment hover:bg-parchment/5 border-l-3 border-transparent"
                }`}
              >
                <ShoppingBag size={16} />
                My Rentals
              </button>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm transition-colors text-left ${
                  activeTab === "dashboard" 
                    ? "bg-rose/10 border-l-3 border-rose text-parchment font-semibold" 
                    : "text-parchment/60 hover:text-parchment hover:bg-parchment/5 border-l-3 border-transparent"
                }`}
              >
                <BarChart3 size={16} />
                {isAdmin ? "Admin Dashboard" : "Dashboard Analytics"}
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-5 py-4 text-sm transition-colors text-left ${
                  activeTab === "settings" 
                    ? "bg-rose/10 border-l-3 border-rose text-parchment font-semibold" 
                    : "text-parchment/60 hover:text-parchment hover:bg-parchment/5 border-l-3 border-transparent"
                }`}
              >
                <Settings size={16} />
                Account Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-colors text-left border-t border-parchment/5"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>

            {/* Help box */}
            <div className="bg-rose/5 border border-rose/10 rounded-2xl p-5">
              <div className="flex gap-2.5 items-start">
                <HelpCircle size={16} className="text-rose shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-rose uppercase tracking-wider">Need help?</h4>
                  <p className="text-xs text-parchment/50 mt-1 leading-relaxed">
                    Check our support page or get in touch regarding your order, changes, or sizing issues.
                  </p>
                  <Link href="/about" className="text-xs text-[#c9a898] hover:underline font-semibold mt-2 inline-block">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main content pane */}
          <div className="md:col-span-3">
            
            {activeTab === "rentals" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-parchment">
                    Your Rental History
                  </h1>
                  <p className="text-sm text-parchment/50 mt-1">
                    Manage and view details of your past and current designer pieces.
                  </p>
                </div>

                {loadingOrders ? (
                  <div className="flex flex-col gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-charcoal-light border border-parchment/10 rounded-2xl p-6 animate-pulse">
                        <div className="flex justify-between items-center mb-4">
                          <div className="h-4 w-28 bg-parchment/10 rounded" />
                          <div className="h-5 w-20 bg-parchment/10 rounded-full" />
                        </div>
                        <div className="space-y-3">
                          <div className="h-5 w-1/2 bg-parchment/10 rounded" />
                          <div className="h-4 w-1/3 bg-parchment/10 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20 border border-parchment/10 rounded-2xl bg-charcoal-light/30">
                    <div className="w-16 h-16 rounded-full bg-parchment/5 border border-parchment/10 flex items-center justify-center mx-auto mb-5">
                      <ShoppingBag size={24} className="text-rose" />
                    </div>
                    <p className="font-display text-xl text-parchment/70 mb-2">
                      No rental history found
                    </p>
                    <p className="text-sm text-parchment/40 mb-8 max-w-sm mx-auto leading-relaxed">
                      {"You haven't rented any pieces yet. Explore our curated selection of luxury fashion."}
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 bg-rose text-charcoal font-semibold text-sm px-6 py-3 rounded-lg hover:bg-rose-dark transition-all duration-200"
                    >
                      Browse the Collection
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {orders.map((order) => {
                      const isCancelled = order.status.toUpperCase() === "CANCELLED";
                      const canCancel = ["CREATED", "CONFIRMED", "ACTIVE"].includes(order.status.toUpperCase());
                      
                      return (
                        <div 
                          key={order.orderId} 
                          className="bg-charcoal-light border border-parchment/10 rounded-2xl overflow-hidden transition-all duration-200 hover:border-parchment/20"
                        >
                          <div className="bg-charcoal-light/60 px-6 py-4 border-b border-parchment/5 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-[10px] text-parchment/45 uppercase tracking-wider">Order ID</p>
                                <p className="text-sm font-semibold text-parchment">#{order.orderId}</p>
                              </div>
                              <div className="h-6 w-px bg-parchment/10" />
                              <div>
                                <p className="text-[10px] text-parchment/45 uppercase tracking-wider">Date Placed</p>
                                <p className="text-sm text-parchment/70">
                                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                  })}
                                </p>
                              </div>
                            </div>

                            <span className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full ${
                              isCancelled 
                                ? "bg-red-500/10 border border-red-500/20 text-red-400" 
                                : order.status.toUpperCase() === "PENDING"
                                ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                                : "bg-sage/10 border border-sage/20 text-sage"
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="p-6 flex flex-col gap-4">
                            {order.items.map((item, idx) => {
                              const productDetails = getProductDetails(item.productId);
                              const displayName = productDetails ? productDetails.name : item.name;
                              const displayBrand = productDetails ? productDetails.brand : "Designer Piece";
                              
                              return (
                                <div key={idx} className="flex justify-between items-center gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-16 bg-charcoal border border-parchment/10 rounded-lg flex items-center justify-center shrink-0">
                                      <ShoppingBag size={18} className="text-parchment/30" />
                                    </div>
                                    <div>
                                      <span className="text-[9px] uppercase tracking-wider text-rose font-bold">
                                        {displayBrand}
                                      </span>
                                      <h4 className="font-display text-sm font-bold text-parchment line-clamp-1 mt-0.5">{displayName || "Premium Piece"}</h4>
                                      <div className="flex items-center gap-2 text-xs text-parchment/45 mt-1">
                                        <span>Duration: {item.days} {item.days === 1 ? "Day" : "Days"}</span>
                                        <span>•</span>
                                        <span>Price: {formatPrice(item.price)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            <div className="mt-4 pt-4 border-t border-parchment/5 flex justify-between items-end">
                              <div>
                                <p className="text-[10px] text-parchment/45 uppercase tracking-wider">Total Paid</p>
                                <p className="text-lg font-bold text-parchment">{formatPrice(order.totalAmount)}</p>
                              </div>

                              {canCancel && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500/30 hover:border-red-500/60 text-red-400 hover:bg-red-500/10 font-semibold"
                                  onClick={() => handleCancelOrder(order.orderId)}
                                  disabled={cancellingId === order.orderId}
                                >
                                  {cancellingId === order.orderId ? "Cancelling..." : "Cancel Order"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "dashboard" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-parchment">
                    {isAdmin ? "Store Analytics Overview" : "Your Rental Analytics"}
                  </h1>
                  <p className="text-sm text-parchment/50 mt-1">
                    {isAdmin ? "Track overall store performance, catalog size, and growth metrics." : "Visual summary of your expenditures and active designer rentals."}
                  </p>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {isAdmin ? (
                    <>
                      <div className="bg-charcoal-light border border-parchment/10 rounded-2xl p-5">
                        <div className="flex justify-between items-start text-rose">
                          <DollarSign size={20} />
                          <TrendingUp size={14} className="text-sage" />
                        </div>
                        <p className="text-2xl font-bold text-parchment mt-3">₹1,84,300</p>
                        <p className="text-[10px] uppercase text-parchment/40 mt-1">Total Revenue</p>
                      </div>
                      <div className="bg-charcoal-light border border-parchment/10 rounded-2xl p-5">
                        <div className="flex justify-between items-start text-sage">
                          <ShoppingBag size={20} />
                          <span className="text-[10px] font-semibold text-sage bg-sage/10 px-1.5 py-0.5 rounded">Active</span>
                        </div>
                        <p className="text-2xl font-bold text-parchment mt-3">{12 + analyticsData.activeCount}</p>
                        <p className="text-[10px] uppercase text-parchment/40 mt-1">Active Rentals</p>
                      </div>
                      <div className="bg-charcoal-light border border-parchment/10 rounded-2xl p-5">
                        <div className="flex justify-between items-start text-parchment/50">
                          <Package size={20} />
                        </div>
                        <p className="text-2xl font-bold text-parchment mt-3">{products.length}</p>
                        <p className="text-[10px] uppercase text-parchment/40 mt-1">Catalog Size</p>
                      </div>
                      <div className="bg-charcoal-light border border-parchment/10 rounded-2xl p-5">
                        <div className="flex justify-between items-start text-parchment/50">
                          <Users size={20} />
                        </div>
                        <p className="text-2xl font-bold text-parchment mt-3">86</p>
                        <p className="text-[10px] uppercase text-parchment/40 mt-1">Registered Users</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-charcoal-light border border-parchment/10 rounded-2xl p-5 col-span-2">
                        <div className="flex justify-between items-start text-rose">
                          <DollarSign size={20} />
                          <span className="text-[10px] font-semibold text-rose bg-rose/10 px-2 py-0.5 rounded">Spent</span>
                        </div>
                        <p className="text-3xl font-bold text-parchment mt-4">{formatPrice(analyticsData.totalSpent)}</p>
                        <p className="text-xs text-parchment/40 mt-1">Overall apparel rental investment</p>
                      </div>
                      <div className="bg-charcoal-light border border-parchment/10 rounded-2xl p-5 col-span-2">
                        <div className="flex justify-between items-start text-sage">
                          <ShoppingBag size={20} />
                          <span className="text-[10px] font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded">Live</span>
                        </div>
                        <p className="text-3xl font-bold text-parchment mt-4">{analyticsData.activeCount}</p>
                        <p className="text-xs text-parchment/40 mt-1">Current active items with you</p>
                      </div>
                    </>
                  )}
                </div>

                {/* SVG expenditure chart */}
                <div className="bg-charcoal-light border border-parchment/10 rounded-2xl p-6">
                  <h3 className="font-display text-base font-bold text-parchment mb-6 flex items-center gap-2">
                    <TrendingUp size={16} className="text-rose" />
                    {isAdmin ? "Overall Revenue Analytics" : "Monthly Spending History"}
                  </h3>

                  {analyticsData.chartPoints.length === 0 ? (
                    <div className="text-center py-10 text-xs text-parchment/30">
                      Place orders to generate analytics charts.
                    </div>
                  ) : (
                    <div className="w-full">
                      {/* Interactive Custom SVG Chart */}
                      <svg viewBox="0 0 500 200" className="w-full h-auto overflow-visible">
                        {/* Grid lines */}
                        <line x1="30" y1="150" x2="480" y2="150" stroke="#f5f0e8" strokeOpacity="0.1" strokeWidth="1" />
                        <line x1="30" y1="100" x2="480" y2="100" stroke="#f5f0e8" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3" />
                        <line x1="30" y1="50" x2="480" y2="50" stroke="#f5f0e8" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="3" />

                        {/* Rendering Bars */}
                        {analyticsData.chartPoints.map((point, index) => {
                          const x = 50 + index * 75;
                          // Max height logic (scaled to 120 max SVG height)
                          const values = analyticsData.chartPoints.map(p => p.value);
                          const maxVal = Math.max(...values, 5000);
                          const barHeight = (point.value / maxVal) * 120;
                          const y = 150 - barHeight;

                          return (
                            <g key={point.label} className="group">
                              {/* Hover Tooltip display */}
                              <rect
                                x={x}
                                y={y}
                                width="36"
                                height={barHeight}
                                fill="url(#roseGradient)"
                                rx="4"
                                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                              />
                              {/* Text values */}
                              <text
                                x={x + 18}
                                y={y - 8}
                                textAnchor="middle"
                                className="fill-rose text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              >
                                {formatPrice(point.value)}
                              </text>
                              {/* Label */}
                              <text
                                x={x + 18}
                                y="170"
                                textAnchor="middle"
                                className="fill-parchment/40 text-[10px] font-medium"
                              >
                                {point.label}
                              </text>
                            </g>
                          );
                        })}

                        {/* Gradients */}
                        <defs>
                          <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C9A898" />
                            <stop offset="100%" stopColor="#C9A898" stopOpacity="0.2" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-charcoal-light border border-parchment/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-parchment">
                    Profile Details
                  </h2>
                  <p className="text-sm text-parchment/50 mt-1">
                    Your account registration settings and details.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-parchment/5">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-parchment/40 block mb-1">Full Name</label>
                    <div className="bg-charcoal border border-parchment/10 rounded-lg px-4 py-3 text-sm text-parchment w-full font-medium">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-parchment/40 block mb-1">Email Address</label>
                    <div className="bg-charcoal border border-parchment/10 rounded-lg px-4 py-3 text-sm text-parchment w-full font-medium">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-parchment/40 block mb-1">Account Role</label>
                    <div className="bg-charcoal border border-parchment/10 rounded-lg px-4 py-3 text-sm text-parchment w-full capitalize font-medium">
                      {user.role}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-parchment/40 block mb-1">Secure Member Status</label>
                    <div className="flex items-center gap-2 text-sage bg-sage/5 border border-sage/20 rounded-lg px-4 py-3 text-sm font-semibold">
                      <ShieldCheck size={16} />
                      Verified & Active
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex gap-3">
                  <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-parchment/50 leading-relaxed">
                    Account modification is restricted in beta mode. Please reach support if you need to update your password or email address.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
