"use client"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - replace with real data from your API
const inventory = [
  {
    id: "1",
    name: "Premium Subscription",
    category: "Subscription",
    stock: "Unlimited",
    price: "$29.99",
    status: "Active",
    lastUpdated: "2024-01-20",
  },
  {
    id: "2",
    name: "Basic Subscription",
    category: "Subscription",
    stock: "Unlimited",
    price: "$9.99",
    status: "Active",
    lastUpdated: "2024-01-20",
  },
  {
    id: "3",
    name: "T-Shirt - Medium",
    category: "Merchandise",
    stock: "45",
    price: "$24.99",
    status: "Low Stock",
    lastUpdated: "2024-01-19",
  },
  {
    id: "4",
    name: "Coffee Mug",
    category: "Merchandise",
    stock: "120",
    price: "$14.99",
    status: "In Stock",
    lastUpdated: "2024-01-18",
  },
  {
    id: "5",
    name: "Digital Course",
    category: "Digital",
    stock: "Unlimited",
    price: "$99.99",
    status: "Active",
    lastUpdated: "2024-01-17",
  },
]

export function InventoryTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "In Stock":
        return "default"
      case "Low Stock":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Item</DropdownMenuItem>
                      <DropdownMenuItem>Update Stock</DropdownMenuItem>
                      <DropdownMenuItem>View History</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete Item</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
