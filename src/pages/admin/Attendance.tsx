import { useState } from "react";
import { Search, Download, Calendar, Filter, RefreshCw, Sunrise, Sunset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const attendanceRecords = [
  { id: "1", student: "John Smith", rfid: "RF001234", bus: "Bus 101", route: "Route A", scanType: "boarding", time: "7:15 AM", date: "2024-01-20", location: "Stop 3 - Maple Street" },
  { id: "2", student: "Emma Wilson", rfid: "RF001235", bus: "Bus 102", route: "Route B", scanType: "boarding", time: "7:22 AM", date: "2024-01-20", location: "Stop 5 - Oak Avenue" },
  { id: "3", student: "Michael Brown", rfid: "RF001236", bus: "Bus 101", route: "Route A", scanType: "alighting", time: "7:45 AM", date: "2024-01-20", location: "School Gate" },
  { id: "4", student: "Sophia Davis", rfid: "RF001237", bus: "Bus 103", route: "Route C", scanType: "boarding", time: "7:18 AM", date: "2024-01-20", location: "Stop 2 - Pine Road" },
  { id: "5", student: "William Johnson", rfid: "RF001238", bus: "Bus 102", route: "Route B", scanType: "alighting", time: "7:50 AM", date: "2024-01-20", location: "School Gate" },
  { id: "6", student: "Olivia Taylor", rfid: "RF001239", bus: "Bus 104", route: "Route D", scanType: "boarding", time: "7:35 AM", date: "2024-01-20", location: "Stop 7 - Elm Street" },
  { id: "7", student: "James Anderson", rfid: "RF001240", bus: "Bus 103", route: "Route C", scanType: "alighting", time: "7:55 AM", date: "2024-01-20", location: "School Gate" },
  { id: "8", student: "Isabella Martinez", rfid: "RF001241", bus: "Bus 101", route: "Route A", scanType: "boarding", time: "7:20 AM", date: "2024-01-20", location: "Stop 4 - Cedar Lane" },
  { id: "9", student: "John Smith", rfid: "RF001234", bus: "Bus 101", route: "Route A", scanType: "alighting", time: "3:45 PM", date: "2024-01-20", location: "Stop 3 - Maple Street" },
  { id: "10", student: "Emma Wilson", rfid: "RF001235", bus: "Bus 102", route: "Route B", scanType: "alighting", time: "3:52 PM", date: "2024-01-20", location: "Stop 5 - Oak Avenue" },
];

export default function Attendance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [busFilter, setBusFilter] = useState("all");
  const [scanTypeFilter, setScanTypeFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleExport = () => {
    toast.success("Attendance report text exported");
  };

  const handleRefresh = () => {
    toast.success("Attendance data refreshed");
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch = record.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.rfid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBus = busFilter === "all" || record.bus === busFilter;
    const matchesScanType = scanTypeFilter === "all" || record.scanType === scanTypeFilter;
    return matchesSearch && matchesBus && matchesScanType;
  });

  const uniqueBuses = [...new Set(attendanceRecords.map((r) => r.bus))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance & Scan Logs</h1>
          <p className="text-muted-foreground">Track all RFID scan events and boarding records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Scans Today</p>
            <p className="text-2xl font-bold">847</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Morning Boardings</p>
            <p className="text-2xl font-bold text-success">423</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Evening Returns</p>
            <p className="text-2xl font-bold text-primary">424</p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in hover:shadow-md transition-all">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
            <p className="text-2xl font-bold">96.2%</p>
          </CardContent>
        </Card>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2 w-[180px] justify-start">
                    <Calendar className="w-4 h-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select value={busFilter} onValueChange={setBusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Buses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buses</SelectItem>
                  {uniqueBuses.map((bus) => (
                    <SelectItem key={bus} value={bus}>{bus}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={scanTypeFilter} onValueChange={setScanTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="boarding">Boarded</SelectItem>
                  <SelectItem value="alighting">Not Boarded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant={scanTypeFilter === 'boarding' ? "default" : "outline"}
              className={cn(
                "flex-1 gap-2 h-12 text-sm font-semibold transition-all",
                scanTypeFilter === 'boarding' ? "bg-orange-500 hover:bg-orange-600 border-none shadow-lg shadow-orange-500/20" : "hover:border-orange-500 hover:text-orange-500"
              )}
              onClick={() => setScanTypeFilter(scanTypeFilter === 'boarding' ? 'all' : 'boarding')}
            >
              <Sunrise className={cn("w-5 h-5", scanTypeFilter === 'boarding' ? "text-white" : "text-orange-500")} />
              Morning Boarded
            </Button>

            <Button
              variant={scanTypeFilter === 'alighting' ? "default" : "outline"}
              className={cn(
                "flex-1 gap-2 h-12 text-sm font-semibold transition-all",
                scanTypeFilter === 'alighting' ? "bg-purple-600 hover:bg-purple-700 border-none shadow-lg shadow-purple-500/20" : "hover:border-purple-600 hover:text-purple-600"
              )}
              onClick={() => setScanTypeFilter(scanTypeFilter === 'alighting' ? 'all' : 'alighting')}
            >
              <Sunset className={cn("w-5 h-5", scanTypeFilter === 'alighting' ? "text-white" : "text-purple-500")} />
              Evening Returns
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Scan Records ({filteredRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>RFID</TableHead>
                <TableHead>Bus</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.time}</TableCell>
                  <TableCell>{record.student}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{record.rfid}</code>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{record.bus}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{record.route}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      record.scanType === "boarding"
                        ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                    )}>
                      {record.scanType === "boarding" ? "Boarded" : "Not Boarded"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{record.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
