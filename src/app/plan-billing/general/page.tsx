"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IUserResponse } from "@/interface/response/user.response";
import userService from "@/service/user.service";
import orderService from "@/service/order.service";
import { IOrder } from "@/interface/response/order.response";
import { formatUSD, formatINR, usdToInr } from "@/utils/currency";
import { CreditCard, Receipt, History, TrendingUp } from "lucide-react";

export default function PlanBillingGeneralPage() {
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, ordersData] = await Promise.all([
          userService.currentUser(),
          orderService.getOrders(),
        ]);
        setUser(userData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSpent = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.amount, 0);

  const totalCredits = user?.totalCredits || 0;
  const creditsUsed = user?.creditsUsed || 0;
  const creditsRemaining = totalCredits - creditsUsed;

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar userData={user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">
                      Job Hunter
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/plan-billing">
                      Plan & Billing
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>General</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
                Billing Overview
              </h1>
              <p className="text-text-secondary mt-1 text-sm sm:text-base">
                Manage your subscription and view billing history
              </p>
            </div>

            {/* Credit Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-surface border border-border rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm sm:text-base">
                    Credits Remaining
                  </h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-accent">
                  {creditsRemaining}
                </p>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  of {totalCredits} total credits
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm sm:text-base">
                    Total Spent
                  </h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-accent">
                  {formatINR(totalSpent)}
                </p>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  {formatUSD(usdToInr(totalSpent) / 83.5)} USD
                </p>
              </div>

              <div className="bg-surface border border-border rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Receipt className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm sm:text-base">
                    Total Orders
                  </h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-accent">{orders.length}</p>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  {orders.filter((o) => o.status === "paid").length} successful
                </p>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-surface border border-border rounded-xl">
              <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-accent" />
                  <h2 className="text-base sm:text-lg font-semibold text-text-primary">
                    Order History
                  </h2>
                </div>
              </div>

              {isLoading ? (
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex gap-4">
                        <div className="h-4 bg-border rounded w-1/4" />
                        <div className="h-4 bg-border rounded w-1/6" />
                        <div className="h-4 bg-border rounded w-1/6" />
                        <div className="h-4 bg-border rounded w-1/6" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-4 sm:p-6 text-center text-text-secondary">
                  <p className="text-sm sm:text-base">No orders yet. Purchase a credit pack to get started!</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-4 text-sm font-medium text-text-secondary">
                            Order ID
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-text-secondary">
                            Pack
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-text-secondary">
                            Amount
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-text-secondary">
                            Status
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-text-secondary">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order._id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="p-4 text-sm text-text-primary font-mono">
                              {order._id.slice(-8)}
                            </td>
                            <td className="p-4 text-sm text-text-primary">
                              {order.creditPack}
                            </td>
                            <td className="p-4 text-sm text-text-primary">
                              {formatINR(order.amount)}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "FAILED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-text-secondary">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden p-4 space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono text-text-secondary">
                            #{order._id.slice(-8)}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : order.status === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-primary font-medium">
                            {order.creditPack}
                          </span>
                          <span className="text-sm font-semibold text-text-primary">
                            {formatINR(order.amount)}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/plan-billing"
                className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-300 text-center"
              >
                Buy More Credits
              </a>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
