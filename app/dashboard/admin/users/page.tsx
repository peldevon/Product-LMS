"use client"

import type React from "react"
import type { FormEvent } from "react"

import { useState, useEffect } from "react"
import { MagnifyingGlassIcon, DownloadIcon } from "@radix-ui/react-icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getUsers, updateUser, createUser, deleteUser, updateUserStatus } from '@/app/actions/user'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

// User type definition matching database schema
type User = {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Farmer' | 'Processor' | 'Transporter';
  status: 'Active' | 'Inactive';
  lastActive: string;
  dateJoined: string;
}

export default function AdminUsersPage() {
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await getUsers(searchTerm, roleFilter, statusFilter);
        setUsers(data as User[]);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: "Error loading users",
          description: "There was a problem loading the user data.",
          variant: "destructive"
        })
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const handleAddUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await createUser({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string, // Should be hashed
        role: formData.get('role') as 'Admin' | 'Farmer' | 'Processor' | 'Transporter',
        status: 'Active',
        lastActive: new Date().toISOString(),
        dateJoined: new Date().toISOString(),
      });
      
      // Refresh users list
      const updatedUsers = await getUsers(searchTerm, roleFilter, statusFilter);
      setUsers(updatedUsers as User[]);
      setShowAddUserForm(false);
      
      toast({
        title: "User added successfully",
        description: `${formData.get('name')} has been added as a ${formData.get('role')}.`,
      });
    } catch (error) {
      console.error('Failed to add user:', error);
      toast({
        title: "Failed to add user",
        description: "There was an error adding the new user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }
  
  const handleUpdateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedUser) return
    
    const formData = new FormData(e.target as HTMLFormElement)
    
    try {
      await updateUser(selectedUser.id, {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as 'Admin' | 'Farmer' | 'Processor' | 'Transporter',
      })
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? {
          ...u,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          role: formData.get('role') as 'Admin' | 'Farmer' | 'Processor' | 'Transporter',
        } : u
      ))
      
      setShowEditDialog(false)
      toast({
        title: "User updated",
        description: `${formData.get('name')}'s details have been updated.`,
      })
    } catch (error) {
      console.error('Failed to update user:', error)
      toast({
        title: "Update failed",
        description: "There was an error updating the user details.",
        variant: "destructive"
      })
    }
  }

  const handleResetPassword = (id: number) => {
    // Implement reset password logic
  };

  const handleToggleUserStatus = async (id: number, status: 'Active' | 'Inactive') => {
    try {
      await updateUser(id, { status: status === "Active" ? "Inactive" : "Active" });
      const updatedUsers = await getUsers(searchTerm, roleFilter, statusFilter);
      setUsers(updatedUsers as User[]);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleStatusChange = (user: User) => {
    setSelectedUser(user)
    setShowStatusDialog(true)
  }
  
  const handleUpdateStatus = async () => {
    if (!selectedUser) return
    
    try {
      const newStatus = selectedUser.status === 'Active' ? 'Inactive' : 'Active'
      await updateUserStatus(selectedUser.id, newStatus)
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? {...u, status: newStatus} : u
      ))
      
      setShowStatusDialog(false)
      toast({
        title: "User status updated",
        description: `${selectedUser.name}'s status has been set to ${newStatus}.`,
      })
    } catch (error) {
      console.error('Failed to update user status:', error)
      toast({
        title: "Update failed",
        description: "There was an error updating the user status.",
        variant: "destructive"
      })
    }
  }

  // Filter users by role
  const adminUsers = users.filter(user => user.role === 'Admin')
  const farmerUsers = users.filter(user => user.role === 'Farmer')
  const processorUsers = users.filter(user => user.role === 'Processor')
  const transporterUsers = users.filter(user => user.role === 'Transporter')
  
  const renderUserTable = (filteredUsers: User[]) => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={
                      user.role === 'Admin' ? 'bg-purple-500' : 
                      user.role === 'Farmer' ? 'bg-green-500' : 
                      user.role === 'Processor' ? 'bg-blue-500' : 
                      'bg-orange-500'
                    }>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.dateJoined).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(user)}
                      >
                        Toggle Status
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts across the platform</p>
        </div>
        <Button onClick={() => setShowAddUserForm(true)}>
          Add New User
        </Button>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={showAddUserForm} onOpenChange={setShowAddUserForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new user account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Full Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="email@cassava.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="Farmer">
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Farmer">Farmer</SelectItem>
                    <SelectItem value="Processor">Processor</SelectItem>
                    <SelectItem value="Transporter">Transporter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddUserForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total registered accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((users.filter(u => u.status === 'Active').length / users.length) * 100 || 0).toFixed(0)}% of total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => {
                const joined = new Date(u.dateJoined);
                const now = new Date();
                return joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Joined in {new Date().toLocaleString('default', { month: 'long' })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Roles Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-500">{adminUsers.length}</div>
                <div className="text-muted-foreground">Admin</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-500">{farmerUsers.length}</div>
                <div className="text-muted-foreground">Farmer</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-500">{processorUsers.length}</div>
                <div className="text-muted-foreground">Processor</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-500">{transporterUsers.length}</div>
                <div className="text-muted-foreground">Transporter</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 pb-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Farmer">Farmer</SelectItem>
              <SelectItem value="Processor">Processor</SelectItem>
              <SelectItem value="Transporter">Transporter</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="farmer">Farmers</TabsTrigger>
          <TabsTrigger value="processor">Processors</TabsTrigger>
          <TabsTrigger value="transporter">Transporters</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {renderUserTable(users)}
        </TabsContent>
        <TabsContent value="admin">
          {renderUserTable(adminUsers)}
        </TabsContent>
        <TabsContent value="farmer">
          {renderUserTable(farmerUsers)}
        </TabsContent>
        <TabsContent value="processor">
          {renderUserTable(processorUsers)}
        </TabsContent>
        <TabsContent value="transporter">
          {renderUserTable(transporterUsers)}
        </TabsContent>
      </Tabs>
      
      {/* Status Change Dialog */}
      {selectedUser && (
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update User Status</DialogTitle>
              <DialogDescription>
                Change the status for {selectedUser.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 py-4">
              <Switch 
                id="status-switch"
                checked={selectedUser.status === 'Active'}
                onCheckedChange={(checked) => {
                  setSelectedUser(prev => prev ? {...prev, status: checked ? 'Active' : 'Inactive'} : null)
                }}
              />
              <Label htmlFor="status-switch">
                {selectedUser.status === 'Active' ? 'Active' : 'Inactive'}
              </Label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update details for {selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input 
                    id="edit-name" 
                    name="name" 
                    defaultValue={selectedUser.name}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    name="email" 
                    type="email" 
                    defaultValue={selectedUser.email}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select name="role" defaultValue={selectedUser.role}>
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Farmer">Farmer</SelectItem>
                      <SelectItem value="Processor">Processor</SelectItem>
                      <SelectItem value="Transporter">Transporter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

