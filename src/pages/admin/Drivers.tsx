import { useState } from "react";
import { Plus, Edit, Trash2, MoreVertical, User, Search, Star, MapPin, Calendar, Clock, FileText, X, Shield, CreditCard, Phone, Bus, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";

export default function Drivers() {
    const {
        drivers, addDriver, deleteDriver, updateDriver, restoreDriver,
        caretakers, addCaretaker, deleteCaretaker, updateCaretaker, restoreCaretaker,
        buses,
        searchQuery: globalSearchQuery
    } = useData();

    const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
    const [isAddCaretakerOpen, setIsAddCaretakerOpen] = useState(false);
    const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
    const [selectedLicenseDriver, setSelectedLicenseDriver] = useState<typeof drivers[0] | null>(null);
    const [localSearchQuery, setLocalSearchQuery] = useState("");
    const searchQuery = globalSearchQuery || localSearchQuery;
    const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
    const [editingCaretakerId, setEditingCaretakerId] = useState<string | null>(null);

    const [newDriver, setNewDriver] = useState({
        name: "",
        license: "",
        phone: "",
        status: "active" as "active" | "on-leave",
        joinDate: "",
        experience: 0,
        rating: 5.0,
        address: "",
        workHistory: "",
        bloodGroup: "",
        emergencyContact: ""
    });

    const [newCaretaker, setNewCaretaker] = useState({
        name: "",
        phone: "",
        status: "active" as "active" | "on-leave",
        joinDate: "",
        experience: 0,
        address: "",
        bloodGroup: "",
        emergencyContact: ""
    });

    /* Driver Handlers */
    const openAddDriverDialog = () => {
        setEditingDriverId(null);
        setNewDriver({
            name: "",
            license: "",
            phone: "",
            status: "active",
            joinDate: new Date().toISOString().split('T')[0],
            experience: 0,
            rating: 5.0,
            address: "",
            workHistory: "",
            bloodGroup: "",
            emergencyContact: ""
        });
        setIsAddDriverOpen(true);
    };

    const openEditDriverDialog = (driver: any) => {
        setEditingDriverId(driver.id);
        setNewDriver({
            name: driver.name,
            license: driver.license,
            phone: driver.phone,
            status: driver.status,
            joinDate: driver.joinDate || "",
            experience: driver.experience || 0,
            rating: driver.rating || 5.0,
            address: driver.address || "",
            workHistory: driver.workHistory || "",
            bloodGroup: driver.bloodGroup || "",
            emergencyContact: driver.emergencyContact || ""
        });
        setIsAddDriverOpen(true);
    };

    const handleAddDriver = () => {
        if (!newDriver.name) return toast.error("Driver Name required");

        if (editingDriverId) {
            updateDriver(editingDriverId, newDriver);
            toast.success("Driver updated");
        } else {
            addDriver(newDriver);
            toast.success("Driver added");
        }
        setIsAddDriverOpen(false);
        setEditingDriverId(null);
    };

    const handleDeleteDriver = (id: string) => {
        const driverToDelete = drivers.find(d => d.id === id);
        deleteDriver(id);
        toast.success("Driver deleted", {
            action: {
                label: "Undo",
                onClick: () => driverToDelete && restoreDriver(driverToDelete),
            },
        });
    };

    /* Caretaker Handlers */
    const openAddCaretakerDialog = () => {
        setEditingCaretakerId(null);
        setNewCaretaker({
            name: "",
            phone: "",
            status: "active",
            joinDate: new Date().toISOString().split('T')[0],
            experience: 0,
            address: "",
            bloodGroup: "",
            emergencyContact: ""
        });
        setIsAddCaretakerOpen(true);
    };

    const openEditCaretakerDialog = (caretaker: any) => {
        setEditingCaretakerId(caretaker.id);
        setNewCaretaker({
            name: caretaker.name,
            phone: caretaker.phone,
            status: caretaker.status,
            joinDate: caretaker.joinDate || "",
            experience: caretaker.experience || 0,
            address: caretaker.address || "",
            bloodGroup: caretaker.bloodGroup || "",
            emergencyContact: caretaker.emergencyContact || ""
        });
        setIsAddCaretakerOpen(true);
    };

    const handleAddCaretaker = () => {
        if (!newCaretaker.name) return toast.error("Caretaker Name required");

        if (editingCaretakerId) {
            updateCaretaker(editingCaretakerId, newCaretaker);
            toast.success("Caretaker updated");
        } else {
            addCaretaker(newCaretaker);
            toast.success("Caretaker added");
        }
        setIsAddCaretakerOpen(false);
        setEditingCaretakerId(null);
    };

    const handleDeleteCaretaker = (id: string) => {
        const caretakerToDelete = caretakers.find(c => c.id === id);
        deleteCaretaker(id);
        toast.success("Caretaker deleted", {
            action: {
                label: "Undo",
                onClick: () => caretakerToDelete && restoreCaretaker(caretakerToDelete),
            },
        });
    };

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.license.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.phone.includes(searchQuery)
    );

    const filteredCaretakers = caretakers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Drivers & Caretakers</h1>
                    <p className="text-muted-foreground">Manage driver and caretaker profiles</p>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search drivers or caretakers..."
                    className="pl-10 max-w-sm"
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                />
            </div>

            <Tabs defaultValue="drivers" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="drivers" className="gap-2">
                        <User className="w-4 h-4" /> Drivers
                    </TabsTrigger>
                    <TabsTrigger value="caretakers" className="gap-2">
                        <UserCheck className="w-4 h-4" /> Caretakers
                    </TabsTrigger>
                </TabsList>

                {/* Drivers Tab */}
                <TabsContent value="drivers" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isAddDriverOpen} onOpenChange={setIsAddDriverOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2" onClick={openAddDriverDialog}>
                                    <Plus className="w-4 h-4" /> Add Driver
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingDriverId ? "Edit Driver" : "Add New Driver"}</DialogTitle>
                                    <DialogDescription>{editingDriverId ? "Update driver details" : "Register a new driver"}</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input value={newDriver.name} onChange={e => setNewDriver({ ...newDriver, name: e.target.value })} placeholder="Driver Name" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>License</Label>
                                            <Input value={newDriver.license} onChange={e => setNewDriver({ ...newDriver, license: e.target.value })} placeholder="License No." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input value={newDriver.phone} onChange={e => setNewDriver({ ...newDriver, phone: e.target.value })} placeholder="+1 234-567-8900" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Join Date</Label>
                                            <Input type="date" value={newDriver.joinDate} onChange={e => setNewDriver({ ...newDriver, joinDate: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Experience (Years)</Label>
                                            <Input type="number" value={newDriver.experience} onChange={e => setNewDriver({ ...newDriver, experience: parseInt(e.target.value) || 0 })} placeholder="5" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Input value={newDriver.address} onChange={e => setNewDriver({ ...newDriver, address: e.target.value })} placeholder="123 Main St, City" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Blood Group</Label>
                                            <Input value={newDriver.bloodGroup} onChange={e => setNewDriver({ ...newDriver, bloodGroup: e.target.value })} placeholder="O+" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Emergency Contact</Label>
                                            <Input value={newDriver.emergencyContact} onChange={e => setNewDriver({ ...newDriver, emergencyContact: e.target.value })} placeholder="+91..." />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Work History</Label>
                                        <Textarea
                                            value={newDriver.workHistory}
                                            onChange={e => setNewDriver({ ...newDriver, workHistory: e.target.value })}
                                            placeholder="Previous employers, roles, etc."
                                            className="min-h-[80px]"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDriverOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddDriver}>Save Driver</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* License Photo Dialog */}
                    <Dialog open={isLicenseModalOpen} onOpenChange={setIsLicenseModalOpen}>
                        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-transparent border-0 shadow-none">
                            <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden">
                                <div className="absolute top-2 right-2 z-10">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                                        onClick={() => setIsLicenseModalOpen(false)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="p-1">
                                    <img
                                        src="/driver_license_sample.png"
                                        alt="Driver License"
                                        className="w-full h-auto rounded-md object-contain"
                                    />
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-900">
                                    <h3 className="font-bold text-lg text-center">Driver License</h3>
                                    <p className="text-muted-foreground text-center text-sm">{selectedLicenseDriver?.license}</p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredDrivers.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-lg">
                                <div className="flex flex-col items-center gap-3">
                                    <User className="w-12 h-12 text-muted-foreground/50" />
                                    <p className="text-lg">No drivers found matching your search.</p>
                                </div>
                            </div>
                        ) : filteredDrivers.map((driver) => (
                            <Card key={driver.id} className="overflow-hidden border-2 border-primary/10 group relative">
                                {/* Action Menu (Absolute Top Right) */}
                                <div className="absolute top-2 right-2 z-20">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20"><MoreVertical className="w-4 h-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2" onClick={() => openEditDriverDialog(driver)}><Edit className="w-4 h-4" /> Edit Profile</DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteDriver(driver.id)}><Trash2 className="w-4 h-4" /> Delete Driver</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Gradient Header */}
                                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                                    <div className="absolute -bottom-10 left-6 p-1 bg-white dark:bg-slate-900 rounded-full">
                                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden">
                                            {driver.profileImage ? (
                                                <img src={driver.profileImage} alt={driver.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-10 h-10 text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="pt-12 px-6 pb-6">
                                    {/* Header Info */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                {driver.name}
                                                <Shield className="w-4 h-4 text-blue-500 fill-blue-500" />
                                            </h2>
                                            <p className="text-sm text-muted-foreground font-medium">{driver.id} • {driver.experience} Yrs Exp.</p>
                                        </div>
                                        <Badge className={`px-2 py-0.5 text-xs ${driver.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                            ● {driver.status}
                                        </Badge>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid gap-3">
                                        {/* License */}
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="text-xs text-muted-foreground">License</p>
                                                    <p className="text-sm font-semibold truncate">{driver.license}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                                onClick={() => {
                                                    setSelectedLicenseDriver(driver);
                                                    setIsLicenseModalOpen(true);
                                                }}
                                                title="View License"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Phone */}
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                                <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Phone</p>
                                                <p className="text-sm font-semibold">{driver.phone}</p>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        {driver.address && (
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900/40 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs text-muted-foreground">Address</p>
                                                    <p className="text-sm font-semibold truncate" title={driver.address}>{driver.address}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bus & Rating Row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                                                    <Bus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Bus</p>
                                                    <p className="text-sm font-semibold">{driver.assignedBus ? `Bus ${driver.assignedBus}` : 'N/A'}</p>
                                                    {driver.assignedBus && buses.find(b => b.id === driver.assignedBus)?.plate && (
                                                        <p className="text-[10px] text-muted-foreground">{buses.find(b => b.id === driver.assignedBus)?.plate}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                                    <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Rating</p>
                                                    <p className="text-sm font-semibold">{driver.rating} / 5.0</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Caretakers Tab */}
                <TabsContent value="caretakers" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog open={isAddCaretakerOpen} onOpenChange={setIsAddCaretakerOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2" onClick={openAddCaretakerDialog}>
                                    <Plus className="w-4 h-4" /> Add Caretaker
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingCaretakerId ? "Edit Caretaker" : "Add New Caretaker"}</DialogTitle>
                                    <DialogDescription>{editingCaretakerId ? "Update caretaker details" : "Register a new caretaker"}</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input value={newCaretaker.name} onChange={e => setNewCaretaker({ ...newCaretaker, name: e.target.value })} placeholder="Caretaker Name" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <Input value={newCaretaker.phone} onChange={e => setNewCaretaker({ ...newCaretaker, phone: e.target.value })} placeholder="+91 98765 43210" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Experience (Years)</Label>
                                            <Input type="number" value={newCaretaker.experience} onChange={e => setNewCaretaker({ ...newCaretaker, experience: parseInt(e.target.value) || 0 })} placeholder="3" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Join Date</Label>
                                            <Input type="date" value={newCaretaker.joinDate} onChange={e => setNewCaretaker({ ...newCaretaker, joinDate: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Blood Group</Label>
                                            <Input value={newCaretaker.bloodGroup} onChange={e => setNewCaretaker({ ...newCaretaker, bloodGroup: e.target.value })} placeholder="O+" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Input value={newCaretaker.address} onChange={e => setNewCaretaker({ ...newCaretaker, address: e.target.value })} placeholder="123 Main St, City" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Emergency Contact</Label>
                                        <Input value={newCaretaker.emergencyContact} onChange={e => setNewCaretaker({ ...newCaretaker, emergencyContact: e.target.value })} placeholder="+91..." />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddCaretakerOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddCaretaker}>Save Caretaker</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {filteredCaretakers.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-lg">
                                <div className="flex flex-col items-center gap-3">
                                    <UserCheck className="w-12 h-12 text-muted-foreground/50" />
                                    <p className="text-lg">No caretakers found matching your search.</p>
                                </div>
                            </div>
                        ) : filteredCaretakers.map((caretaker) => (
                            <Card key={caretaker.id} className="overflow-hidden border-2 border-primary/10 group relative">
                                {/* Action Menu (Absolute Top Right) */}
                                <div className="absolute top-2 right-2 z-20">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20"><MoreVertical className="w-4 h-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2" onClick={() => openEditCaretakerDialog(caretaker)}><Edit className="w-4 h-4" /> Edit Profile</DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteCaretaker(caretaker.id)}><Trash2 className="w-4 h-4" /> Delete Caretaker</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Gradient Header - Teal/Cyan for Caretakers */}
                                <div className="h-24 bg-gradient-to-r from-teal-500 to-cyan-600 relative">
                                    <div className="absolute -bottom-10 left-6 p-1 bg-white dark:bg-slate-900 rounded-full">
                                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden">
                                            {caretaker.profileImage ? (
                                                <img src={caretaker.profileImage} alt={caretaker.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-10 h-10 text-teal-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="pt-12 px-6 pb-6">
                                    {/* Header Info */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                {caretaker.name}
                                                <Shield className="w-4 h-4 text-teal-500 fill-teal-500" />
                                            </h2>
                                            <p className="text-sm text-muted-foreground font-medium">{caretaker.id} • {caretaker.experience} Yrs Exp.</p>
                                        </div>
                                        <Badge className={`px-2 py-0.5 text-xs ${caretaker.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                            ● {caretaker.status}
                                        </Badge>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid gap-3">
                                        {/* Phone */}
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                                <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Phone</p>
                                                <p className="text-sm font-semibold">{caretaker.phone}</p>
                                            </div>
                                        </div>

                                        {/* Bus & Blood Group Row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                                                    <Bus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Bus</p>
                                                    <p className="text-sm font-semibold">{caretaker.assignedBus ? `Bus ${caretaker.assignedBus}` : 'N/A'}</p>
                                                    {caretaker.assignedBus && buses.find(b => b.id === caretaker.assignedBus)?.plate && (
                                                        <p className="text-[10px] text-muted-foreground">{buses.find(b => b.id === caretaker.assignedBus)?.plate}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                                                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{caretaker.bloodGroup || "?"}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Blood Group</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                                                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs text-muted-foreground">Address</p>
                                                <p className="text-sm font-semibold truncate">{caretaker.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
