"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Download } from "lucide-react";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const orders = [
    {
      id: "ORD-001",
      type: "Commission",
      description: "Referral commission from alice@email.com",
      amount: 25.0,
      status: "Completed",
      date: "2024-01-15",
      referralEmail: "alice@email.com",
    },
    {
      id: "ORD-002",
      type: "Deposit",
      description: "Account deposit via Credit Card",
      amount: 500.0,
      status: "Completed",
      date: "2024-01-14",
      referralEmail: null,
    },
    {
      id: "ORD-003",
      type: "Commission",
      description: "Referral commission from bob@email.com",
      amount: 15.5,
      status: "Pending",
      date: "2024-01-12",
      referralEmail: "bob@email.com",
    },
    {
      id: "ORD-004",
      type: "Withdrawal",
      description: "Withdrawal to Bank Account",
      amount: -200.0,
      status: "Processing",
      date: "2024-01-10",
      referralEmail: null,
    },
    {
      id: "ORD-005",
      type: "Commission",
      description: "Referral commission from charlie@email.com",
      amount: 30.0,
      status: "Completed",
      date: "2024-01-08",
      referralEmail: "charlie@email.com",
    },
    {
      id: "ORD-006",
      type: "Deposit",
      description: "Account deposit via PayPal",
      amount: 250.0,
      status: "Failed",
      date: "2024-01-05",
      referralEmail: null,
    },
    {
      id: "ORD-007",
      type: "Commission",
      description: "Referral commission from diana@email.com",
      amount: 12.75,
      status: "Completed",
      date: "2024-01-03",
      referralEmail: "diana@email.com",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "processing":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getAmountColor = (amount: number, status: string) => {
    if (status === "Failed") return "text-muted-foreground";
    return amount > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto mb-24 pt-24 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order History</h1>
          <p className="text-muted-foreground text-sm">
            Track all your transactions and commissions
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 pb-4 px-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className="border border-muted shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="pt-6 pb-4 px-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold">{order.id}</h3>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {order.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Right Section */}
                <div className="flex flex-col sm:items-end gap-1 min-w-[100px]">
                  <div
                    className={`text-lg font-semibold ${getAmountColor(
                      order.amount,
                      order.status
                    )}`}
                  >
                    {order.amount > 0 ? "+" : ""}$
                    {Math.abs(order.amount).toFixed(2)}
                  </div>
                  {order.referralEmail && (
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      from {order.referralEmail}
                    </p>
                  )}
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="self-end sm:self-auto"
                  >
                    <Eye className="h-4 w-4" />
                  </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground text-sm">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Your order history will appear here once you start making transactions"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Orders;
