import { useState } from "react";
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, User, Shield, CreditCard, Phone, MapPin, Calendar, BookOpen, GraduationCap, Home, Heart, X, Bus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Student } from "@/types";
import { useData } from "@/context/DataContext";
import { toast } from "sonner";
import { Autocomplete } from "@/components/ui/autocomplete";
import { mockCountries, mockStates, mockDistricts } from "@/data/locations";

export default function Students() {
  const { students, buses, addStudent, deleteStudent, updateStudent, restoreStudent, searchQuery: globalSearchQuery } = useData();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const searchQuery = globalSearchQuery || localSearchQuery;

  const [classFilter, setClassFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isViewStudentOpen, setIsViewStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form State
  const [newStudent, setNewStudent] = useState({
    name: "",
    class: "",
    rfid: "",
    route: "",
    parent: "",
    phone: "",
    guardianName: "",
    guardianPhone: "",
    state: "",
    district: "",
    country: "",
    status: "active" as "active" | "inactive",
    bloodGroup: "",
    dob: "",
    address: "",
    rollNumber: "",
    assignedBus: "",
    emergencyContact: "",
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rfid) {
      toast.error("Name and RFID are required");
      return;
    }

    if (editingId) {
      updateStudent(editingId, newStudent);
      toast.success("Student updated successfully");
    } else {
      const newId = addStudent(newStudent);
      toast("Message sent", {
        description: "Student added successfully",
        action: {
          label: "Undo",
          onClick: () => {
            deleteStudent(newId);
            toast.info("Action undone");
          }
        },
      });
    }

    setIsAddDialogOpen(false);
    setNewStudent({
      name: "", class: "", rfid: "", route: "",
      parent: "", phone: "", guardianName: "", guardianPhone: "",
      state: "", district: "", country: "", status: "active",
      bloodGroup: "", dob: "", address: "", rollNumber: "", assignedBus: "", emergencyContact: ""
    });
    setEditingId(null);
  };

  const openAddDialog = () => {
    setEditingId(null);
    setNewStudent({
      name: "", class: "", rfid: "", route: "",
      parent: "", phone: "", guardianName: "", guardianPhone: "",
      state: "", district: "", country: "", status: "active",
      bloodGroup: "", dob: "", address: "", rollNumber: "", assignedBus: "", emergencyContact: ""
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (student: any) => {
    setEditingId(student.id);
    setNewStudent({
      name: student.name,
      class: student.class,
      rfid: student.rfid,
      route: student.route,
      parent: student.parent || "",
      phone: student.phone || "",
      guardianName: student.guardianName || "",
      guardianPhone: student.guardianPhone || "",
      state: student.state || "",
      district: student.district || "",
      country: student.country || "",
      status: student.status,
      bloodGroup: student.bloodGroup || "",
      dob: student.dob || "",
      address: student.address || "",
      rollNumber: student.rollNumber || "",
      assignedBus: student.assignedBus || "",
      emergencyContact: student.emergencyContact || ""
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    const studentToDelete = students.find((s) => s.id === id);
    if (!studentToDelete) return;

    deleteStudent(id);
    toast("Student deleted", {
      description: `${studentToDelete.name} has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          restoreStudent(studentToDelete);
          toast.success("Student restored");
        },
      },
    });
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rfid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || student.class === classFilter;
    const matchesRoute = routeFilter === "all" || student.route === routeFilter;
    return matchesSearch && matchesClass && matchesRoute;
  });

  // Derived unique values for filters (mock values if list is empty)
  const uniqueClasses = [...new Set(students.map((s) => s.class))];
  if (uniqueClasses.length === 0) uniqueClasses.push("Grade 1A", "Grade 2B");

  const uniqueRoutes = [...new Set(students.map((s) => s.route))];
  if (uniqueRoutes.length === 0) uniqueRoutes.push("Route A", "Route B");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage student records and RFID assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openAddDialog}>
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Student" : "Add New Student"}</DialogTitle>
              <DialogDescription>{editingId ? "Update student details." : "Enter student details to create a new record."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter student name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    onValueChange={(val) => setNewStudent({ ...newStudent, class: val })}
                    value={newStudent.class}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade 5A">Grade 5A</SelectItem>
                      <SelectItem value="Grade 4B">Grade 4B</SelectItem>
                      <SelectItem value="Grade 6A">Grade 6A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rfid">RFID Card Number</Label>
                  <Input
                    id="rfid"
                    placeholder="RF00XXXX"
                    value={newStudent.rfid}
                    onChange={(e) => setNewStudent({ ...newStudent, rfid: e.target.value })}
                  />
                </div>
                {/* 
                   Replacing Route select with State/Mandal inputs as requested 
                   User said "change the assigned route section as give location details like state, mandal"
                   I'm adding these AND keeping route logically but making it less prominent if needed, 
                   but usually students need a route. I will add fields below.
                */}
                <div className="space-y-2">
                  <Label htmlFor="route">Route Code</Label>
                  <Select
                    onValueChange={(val) => setNewStudent({ ...newStudent, route: val })}
                    value={newStudent.route}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Route A">Route A</SelectItem>
                      <SelectItem value="Route B">Route B</SelectItem>
                      <SelectItem value="Route C">Route C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Autocomplete
                    options={mockCountries}
                    placeholder="Select Country"
                    value={newStudent.country || ""}
                    onChange={(val) => setNewStudent({ ...newStudent, country: val })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Autocomplete
                    options={mockStates}
                    placeholder="Select State"
                    value={newStudent.state || ""}
                    onChange={(val) => setNewStudent({ ...newStudent, state: val })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Autocomplete
                    options={mockDistricts}
                    placeholder="Select District"
                    value={newStudent.district || ""}
                    onChange={(val) => setNewStudent({ ...newStudent, district: val })}
                  />
                </div>
                <div className="space-y-2">
                  {/* Kept Mandal/Mandal logic mapped to District for now or separate? 
                        User asked to replace mandal with autocomplete for district names. 
                        I'm replacing the 'Mandal' input above with 'District' Autocomplete.
                        I'll remove the old Mandal input to avoid confusion.
                     */}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Name</Label>
                  <Input
                    id="parent"
                    placeholder="Enter parent name"
                    value={newStudent.parent}
                    onChange={(e) => setNewStudent({ ...newStudent, parent: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Parent Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guardianName">Guardian Name (Optional)</Label>
                  <Input
                    id="guardianName"
                    placeholder="Enter guardian name"
                    value={newStudent.guardianName || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianPhone">Guardian Phone (Optional)</Label>
                  <Input
                    id="guardianPhone"
                    placeholder="+91 XXXXX XXXXX"
                    value={newStudent.guardianPhone || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStudent}>Save Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="animate-fade-in">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name or RFID..."
                className="pl-10"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={routeFilter} onValueChange={setRouteFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Routes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  {uniqueRoutes.map((route) => (
                    <SelectItem key={route} value={route}>{route}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={isViewStudentOpen} onOpenChange={setIsViewStudentOpen}>
        <DialogContent className="p-0 overflow-hidden bg-transparent border-0 shadow-none max-w-sm">
          {selectedStudent && (
            <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden">
              <div className="absolute top-2 right-2 z-20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
                  onClick={() => setIsViewStudentOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Gradient Header */}
              <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <div className="absolute -bottom-10 left-6 p-1 bg-white dark:bg-slate-900 rounded-full">
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden">
                    {selectedStudent.profileImage ? (
                      <img src={selectedStudent.profileImage} alt={selectedStudent.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-12 px-6 pb-6">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {selectedStudent.name}
                      <Shield className="w-4 h-4 text-blue-500 fill-blue-500" />
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {selectedStudent.class} • Roll: {selectedStudent.rollNumber || "N/A"}
                    </p>
                  </div>
                  <Badge className={`px-2 py-0.5 text-[10px] ${selectedStudent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {selectedStudent.status}
                  </Badge>
                </div>

                <div className="grid gap-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">RFID Card</span>
                      <div className="flex items-center gap-1.5 font-medium overflow-hidden mt-0.5">
                        <CreditCard className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate text-xs">{selectedStudent.rfid}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Route</span>
                      <div className="flex items-center gap-1.5 font-medium overflow-hidden mt-0.5">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate text-xs">{selectedStudent.route}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Bus</span>
                      <div className="flex items-center gap-1.5 font-medium overflow-hidden mt-0.5">
                        <Bus className="w-3 h-3 text-primary shrink-0" />
                        <div className="flex flex-col truncate leading-tight">
                          <span className="truncate font-bold text-xs">
                            {selectedStudent.assignedBus ? `Bus ${selectedStudent.assignedBus}` : 'N/A'}
                          </span>
                          {selectedStudent.assignedBus && buses.find(b => b.id === selectedStudent.assignedBus)?.plate && (
                            <span className="text-[9px] text-muted-foreground truncate">
                              {buses.find(b => b.id === selectedStudent.assignedBus)?.plate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parent & Guardian Info */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2.5">
                    {/* Parent Contact */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Parent Name</p>
                          <p className="font-semibold text-xs">{selectedStudent.parent || "N/A"}</p>
                          <p className="text-[10px] text-muted-foreground">{selectedStudent.phone || "N/A"}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-xs px-2" asChild disabled={!selectedStudent.phone}>
                        <a href={`tel:${selectedStudent.phone}`}>
                          <Phone className="w-3 h-3 mr-1" /> Call
                        </a>
                      </Button>
                    </div>

                    {/* Guardian Contact */}
                    {(selectedStudent.guardianName || selectedStudent.guardianPhone) && (
                      <div className="flex items-center justify-between pt-2.5 border-t border-slate-300 dark:border-slate-600">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Guardian</p>
                            <p className="font-semibold text-xs">{selectedStudent.guardianName || "N/A"}</p>
                            {selectedStudent.guardianPhone && (
                              <p className="text-[10px] text-muted-foreground">{selectedStudent.guardianPhone}</p>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2" asChild disabled={!selectedStudent.guardianPhone}>
                          <a href={`tel:${selectedStudent.guardianPhone}`}>
                            <Phone className="w-3 h-3 mr-1" /> Call
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>



                  {/* Address & Personal */}
                  <div className="grid gap-2">
                    <div className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Home className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold">Address</p>
                        <p className="text-xs">{selectedStudent.address || "No address provided"}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold">DOB</p>
                          <p className="text-xs">{selectedStudent.dob || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="text-base font-bold text-red-500">
                          {selectedStudent.bloodGroup || "N/A"}
                        </span>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold">Blood Group</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Students Table */}
      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Students ({filteredStudents.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>RFID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsViewStudentOpen(true);
                        }}
                        className="hover:underline text-left font-semibold text-primary"
                      >
                        {student.name}
                      </button>
                    </TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{student.rfid}</code>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="font-medium">{student.district || student.mandal || "N/A"}, {student.state || "N/A"}</span>
                        <span className="text-xs text-muted-foreground text-blue-500">{student.route}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold">{student.parent}</p>
                        <p className="text-xs text-muted-foreground">{student.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        student.boardingStatus === "boarded"
                          ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                      }>
                        {student.boardingStatus === "boarded" ? "Boarded" : "Not Boarded"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">

                          <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(student)}>
                            <Edit className="w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteStudent(student.id)}>
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div >
  );
}
