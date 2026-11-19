"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button, { buttonClass } from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { useAppStore } from "@/context/AppContext";
import { ordersApi } from "@/lib/api";
import { cn, formatPrice, getAuthToken, getAuthUser, removeAuthToken, removeAuthUser } from "@/lib/utils";
import { fromISODate, shortDate } from "@/lib/rental";

/** Shape returned by GET /orders. Dates and size are optional: older orders don't have them. */
interface OrderItem {
  productId: number;
  name: string;
  days: number;
  price: number;
  size?: string;
  startDate?: string;
  endDate?: string;
}

interface Order {
  orderId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

type Tab = "rentals" | "account" | "shop";

const STATUS: Record<string, { label: string; tone: "live" | "done" | "off" | "wait" }> = {
  PENDING: { label: "Waiting for payment", tone: "wait" },
  CREATED: { label: "Booked", tone: "live" },
  CONFIRMED: { label: "Confirmed", tone: "live" },
  ACTIVE: { label: "With you now", tone: "live" },
  COMPLETED: { label: "Returned", tone: "done" },
  SUCCESS: { label: "Returned", tone: "done" },
  CANCELLED: { label: "Cancelled", tone: "off" },
};

const statusOf = (s: string) => STATUS[s.toUpperCase()] ?? { label: s.charAt(0) + s.slice(1).toLowerCase(), tone: "done" as const };
const CANCELLABLE = ["CREATED", "CONFIRMED"];

const placedOn = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ProfilePageContent() {
  const router = useRouter();
  const { products } = useAppStore();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [tab, setTab] = useState<Tab>("rentals");
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const fetchOrders = useCallback(async (authToken: string) => {
    setLoadingOrders(true);
    setOrdersError("");
    try {
      const res = (await ordersApi.getMyOrders(authToken)) as Order[];
      setOrders(Array.isArray(res) ? res : []);
    } catch {
      setOrdersError("We couldn't load your rentals just now.");
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    const t = getAuthToken();
    const u = getAuthUser();
    if (!t || !u) {
      router.push("/auth?redirect=/profile");
      return;
    }
    setToken(t);
    setUser(u);
    fetchOrders(t);
  }, [router, fetchOrders]);

  const cancelOrder = async () => {
    if (!token || orderToCancel === null) return;
    setCancelError("");
    setCancelling(true);
    try {
      await ordersApi.cancel(String(orderToCancel), token);
      await fetchOrders(token);
      setOrderToCancel(null);
    } catch (err: unknown) {
      setCancelError(err instanceof Error && err.message ? err.message : "We couldn't cancel it just now. Try again, or contact us.");
    } finally {
      setCancelling(false);
    }
  };

  const signOut = () => {
    removeAuthToken();
    removeAuthUser();
    window.location.href = "/";
  };

  if (!user) return <div className="min-h-screen pt-24" aria-busy="true" />;

  const isAdmin = user.role === "admin";
  const firstName = user.name.split(" ")[0];
  const current = orders.filter((o) => statusOf(o.status).tone === "live" || statusOf(o.status).tone === "wait");
  const past = orders.filter((o) => !current.includes(o));

  const tabs: { id: Tab; label: string }[] = [
    { id: "rentals", label: "Rentals" },
    { id: "account", label: "Account" },
    ...(isAdmin ? [{ id: "shop" as Tab, label: "Shop" }] : []),
  ];

  const renderOrder = (order: Order) => {
    const status = statusOf(order.status);
    return (
      <li key={order.orderId} className="py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="text-sm text-ink/60">
            Order {order.orderId} · placed {placedOn(order.createdAt)}
          </p>
          <p
            className={cn(
              "text-sm",
              status.tone === "live" && "text-sage-ink",
              status.tone === "wait" && "text-rose-ink",
              status.tone === "off" && "text-ink/60 line-through decoration-ink/30",
              status.tone === "done" && "text-ink/70",
            )}
          >
            {status.label}
          </p>
        </div>

        <ul className="mt-4 flex flex-col gap-4">
          {order.items.map((item, i) => {
            const product = products.find((p) => String(p.id) === String(item.productId));
            return (
              <li key={i} className="flex gap-4">
                <div className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-sm bg-white">
                  {product && (
                    <Image src={product.images[0]} alt="" fill sizes="72px" className="object-contain p-1" />
                  )}
                </div>
                <div className="min-w-0 text-sm">
                  {product ? (
                    <Link href={`/shop/${product.id}`} className="font-display text-base text-ink hover:underline underline-offset-4">
                      {product.name}
                    </Link>
                  ) : (
                    <p className="font-display text-base text-ink">{item.name}</p>
                  )}
                  <p className="mt-1 text-ink/70">
                    {item.days === 1 ? "1 day" : `${item.days} days`}
                    {item.size && <> · Size {item.size}</>}
                    {" · "}
                    {formatPrice(item.price)}
                  </p>
                  {item.startDate && (
                    <p className="text-ink/60">
                      {shortDate(fromISODate(item.startDate))}
                      {item.endDate && <> to {shortDate(fromISODate(item.endDate))}</>}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink">
            Total <span className="tabular-nums">{formatPrice(order.totalAmount)}</span>
          </p>
          {CANCELLABLE.includes(order.status.toUpperCase()) && (
            <button
              type="button"
              onClick={() => {
                setCancelError("");
                setOrderToCancel(order.orderId);
              }}
              className="text-sm text-ink/70 underline underline-offset-4 hover:text-ink"
            >
              Cancel order
            </button>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-ink">Hi, {firstName}</h1>
            <p className="mt-1 text-sm text-ink/60">{user.email}</p>
          </div>
          <button type="button" onClick={signOut} className="text-sm text-ink/70 underline underline-offset-4 hover:text-ink">
            Sign out
          </button>
        </div>

        <div role="tablist" aria-label="Account sections" className="mt-8 flex gap-6 border-b border-ink/15">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn(
                "-mb-px border-b-2 pb-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
                tab === t.id ? "border-ink text-ink" : "border-transparent text-ink/60 hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "rentals" && (
          <div role="tabpanel" id="panel-rentals" aria-labelledby="tab-rentals" className="mt-8">
            {loadingOrders ? (
              <div className="space-y-6" aria-busy="true">
                {[0, 1].map((i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="h-24 w-[4.5rem] rounded-sm bg-ink/10" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 w-1/3 rounded-sm bg-ink/10" />
                      <div className="h-3 w-1/4 rounded-sm bg-ink/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : ordersError ? (
              <div className="border-l-2 border-ink/30 bg-paper-2 px-4 py-4">
                <p className="text-ink">{ordersError}</p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={() => token && fetchOrders(token)}>
                  Try again
                </Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="border-t border-ink/15 pt-8 pb-12">
                <p className="font-display text-2xl text-ink">No rentals yet</p>
                <p className="mt-2 max-w-sm text-ink/70">When you book something, the dates and delivery details will show up here.</p>
                <Link href="/shop" className={buttonClass({ className: "mt-6" })}>
                  Browse the collection
                </Link>
              </div>
            ) : (
              <div className="space-y-12">
                {current.length > 0 && (
                  <section>
                    <h2 className="font-display text-xl text-ink">Current and upcoming</h2>
                    <ul className="mt-2 divide-y divide-ink/15 border-y border-ink/15">{current.map(renderOrder)}</ul>
                  </section>
                )}
                {past.length > 0 && (
                  <section>
                    <h2 className="font-display text-xl text-ink">Past rentals</h2>
                    <ul className="mt-2 divide-y divide-ink/15 border-y border-ink/15">{past.map(renderOrder)}</ul>
                  </section>
                )}
                <p className="text-sm text-ink/70">
                  Something wrong with an order?{" "}
                  <Link href="/contact" className="text-ink underline underline-offset-4">
                    Write to us
                  </Link>{" "}
                  with the order number.
                </p>
              </div>
            )}
          </div>
        )}

        {tab === "account" && (
          <div role="tabpanel" id="panel-account" aria-labelledby="tab-account" className="mt-8 max-w-xl">
            <dl className="divide-y divide-ink/15 border-y border-ink/15 text-sm">
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-4">
                <dt className="text-ink/60">Name</dt>
                <dd className="text-ink">{user.name}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-4">
                <dt className="text-ink/60">Email</dt>
                <dd className="text-ink break-all">{user.email}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] gap-4 py-4">
                <dt className="text-ink/60">Password</dt>
                <dd>
                  <Link href="/auth/forgot-password" className="text-ink underline underline-offset-4">
                    Change password
                  </Link>
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-sm text-ink/70">
              To change your name or email, <Link href="/contact" className="text-ink underline underline-offset-4">contact us</Link>{" "}
              and we&apos;ll update it for you.
            </p>
          </div>
        )}

        {tab === "shop" && isAdmin && (
          <div role="tabpanel" id="panel-shop" aria-labelledby="tab-shop" className="mt-8">
            <dl className="grid grid-cols-3 gap-y-8 border-t border-ink/15 pt-6">
              {[
                { label: "pieces in the collection", value: products.length },
                { label: "booked out right now", value: products.filter((p) => !p.available).length },
                { label: "labels", value: new Set(products.map((p) => p.brand)).size },
              ].map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-sm text-ink/60">{s.label}</dt>
                  <dd className="font-display text-4xl text-ink tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 max-w-lg text-sm text-ink/70">
              Add, edit or remove pieces from the shop itself: you&apos;ll see an <strong className="font-medium text-ink">Add a piece</strong>{" "}
              button above the collection, and <strong className="font-medium text-ink">Edit</strong> on every product page.
            </p>
            <Link href="/shop" className={buttonClass({ variant: "secondary", className: "mt-6" })}>
              Go to the shop
            </Link>
          </div>
        )}
      </div>

      <Dialog
        open={orderToCancel !== null}
        onClose={() => setOrderToCancel(null)}
        title="Cancel this order?"
        description="Orders cancelled at least 24 hours before the delivery slot are refunded in full."
      >
        {cancelError && (
          <p role="alert" className="mb-5 border-l-2 border-red-700 bg-red-700/[0.06] px-4 py-3 text-sm text-red-800 dark:border-red-400 dark:text-red-300">
            {cancelError}
          </p>
        )}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button variant="secondary" onClick={() => setOrderToCancel(null)}>
            Keep order
          </Button>
          <Button variant="danger" loading={cancelling} onClick={cancelOrder}>
            Cancel order
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
