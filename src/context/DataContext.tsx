import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Bus, Route, Alert, Driver, Stats, Caretaker } from '@/types';

interface DataContextType {
    students: Student[];
    buses: Bus[];
    routes: Route[];
    alerts: Alert[];
    drivers: Driver[];
    stats: Stats;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    addStudent: (student: Omit<Student, 'id'>) => string;
    updateStudent: (id: string, updates: Partial<Student>) => void;
    deleteStudent: (id: string) => void;
    restoreStudent: (student: Student) => void;
    addBus: (bus: Omit<Bus, 'id'>) => void;
    updateBus: (id: string, updates: Partial<Bus>) => void;
    deleteBus: (id: string) => void;
    restoreBus: (bus: Bus) => void;
    addRoute: (route: Omit<Route, 'id'>) => void;
    updateRoute: (id: string, updates: Partial<Route>) => void;
    deleteRoute: (id: string) => void;
    restoreRoute: (route: Route) => void;
    addDriver: (driver: Omit<Driver, 'id'>) => void;
    updateDriver: (id: string, updates: Partial<Driver>) => void;
    deleteDriver: (id: string) => void;
    restoreDriver: (driver: Driver) => void;
    caretakers: Caretaker[];
    addCaretaker: (caretaker: Omit<Caretaker, 'id'>) => void;
    updateCaretaker: (id: string, updates: Partial<Caretaker>) => void;
    deleteCaretaker: (id: string) => void;
    restoreCaretaker: (caretaker: Caretaker) => void;
    refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Mock Data
const initialStudents: Student[] = [
    { id: "1", name: "John Smith", class: "Grade 5A", rfid: "RF001234", route: "Route A", assignedBus: "101", parent: "Mary Smith", phone: "+1 234-567-8901", status: "active", state: "Telangana", mandal: "Hyderabad", boardingStatus: "boarded", rollNumber: "5A01", bloodGroup: "A+", address: "123 Main St, Hyderabad, 500001", dob: "2013-05-15", emergencyContact: "+1 234-567-0001", fatherName: "Robert Smith", fatherPhone: "+1 234-567-8901", motherName: "Mary Smith", motherPhone: "+1 234-567-8900", guardianName: "George Smith", guardianPhone: "+1 234-567-0001" },
    { id: "2", name: "Emma Wilson", class: "Grade 4B", rfid: "RF001235", route: "Route B", assignedBus: "102", parent: "David Wilson", phone: "+1 234-567-8902", status: "active", state: "Telangana", mandal: "Secunderabad", boardingStatus: "not-boarded", rollNumber: "4B05", bloodGroup: "O+", address: "45 Park Ave, Secunderabad, 500003", dob: "2014-08-20", emergencyContact: "+1 234-567-0002", fatherName: "David Wilson", fatherPhone: "+1 234-567-8902", motherName: "Sarah Wilson", motherPhone: "+1 234-567-8903", guardianName: "Alice Wilson", guardianPhone: "+1 234-567-0002" },
    { id: "3", name: "Michael Brown", class: "Grade 6A", rfid: "RF001236", route: "Route A", assignedBus: "101", parent: "Sarah Brown", phone: "+1 234-567-8903", status: "active", state: "Telangana", mandal: "Kukatpally", boardingStatus: "boarded", rollNumber: "6A12", bloodGroup: "B-", address: "78 Lake View, Kukatpally, 500072", dob: "2012-03-10", emergencyContact: "+1 234-567-0003", fatherName: "James Brown", fatherPhone: "+1 234-567-8904", motherName: "Sarah Brown", motherPhone: "+1 234-567-8903", guardianName: "Kevin Brown", guardianPhone: "+1 234-567-0003" },
    { id: "4", name: "Sophia Davis", class: "Grade 3C", rfid: "RF001237", route: "Route C", assignedBus: "103", parent: "James Davis", phone: "+1 234-567-8904", status: "inactive", state: "Telangana", mandal: "Ameerpet", boardingStatus: "not-boarded", rollNumber: "3C08", bloodGroup: "AB+", address: "90 Hill Top, Ameerpet, 500016", dob: "2015-11-25", emergencyContact: "+1 234-567-0004", fatherName: "James Davis", fatherPhone: "+1 234-567-8904", motherName: "Linda Davis", motherPhone: "+1 234-567-8905", guardianName: "Nancy Davis", guardianPhone: "+1 234-567-0004" },
    { id: "5", name: "William Johnson", class: "Grade 5A", rfid: "RF001238", route: "Route B", assignedBus: "102", parent: "Lisa Johnson", phone: "+1 234-567-8905", status: "active", state: "Telangana", mandal: "Hitech City", boardingStatus: "boarded", rollNumber: "5A15", bloodGroup: "O-", address: "34 Tech Park, Hitech City, 500081", dob: "2013-01-30", emergencyContact: "+1 234-567-0005", fatherName: "Mark Johnson", fatherPhone: "+1 234-567-8906", motherName: "Lisa Johnson", motherPhone: "+1 234-567-8905", guardianName: "Peter Johnson", guardianPhone: "+1 234-567-0005" },
];

const initialBuses: Bus[] = [
    { id: "101", busNumber: "Bus 101", plate: "TS 09 UA 1234", driver: "Robert Johnson", route: "Route A", status: "on-route", passengers: 28, capacity: 40, currentStop: "Maple Street" },
    { id: "102", busNumber: "Bus 102", plate: "TS 09 UA 5678", driver: "Sarah Williams", route: "Route B", status: "delayed", passengers: 35, capacity: 40, currentStop: "Oak Avenue" },
    { id: "103", busNumber: "Bus 103", plate: "TS 09 UA 9012", driver: "Michael Davis", route: "Route C", status: "on-route", passengers: 22, capacity: 40, currentStop: "Pine Road" },
    { id: "104", busNumber: "Bus 104", plate: "TS 09 UA 3456", driver: "Emily Brown", route: "Route D", status: "idle", passengers: 0, capacity: 40 },
];

const initialRoutes: Route[] = [
    { id: "A", name: "Route A", stops: ["Stop 1", "Stop 2", "School"], distance: "12km", estimatedTime: "45 mins" },
    { id: "B", name: "Route B", stops: ["Stop X", "Stop Y", "School"], distance: "8km", estimatedTime: "30 mins" },
    { id: "C", name: "Route C", stops: ["Downtown", "City Center", "School"], distance: "15km", estimatedTime: "50 mins" },
    { id: "D", name: "Route D", stops: ["West Park", "Lake Side", "School"], distance: "10km", estimatedTime: "35 mins" },
];

const initialAlerts: Alert[] = [
    { id: "1", type: "delay", title: "Bus 102 Delayed", message: "Traffic on Route B", timestamp: "2024-03-10T08:30:00", time: "10m ago", status: "active", severity: "warning" },
    { id: "2", type: "geofence", title: "Route Deviation", message: "Bus 104 off route", timestamp: "2024-03-10T08:45:00", time: "5m ago", status: "active", severity: "error" },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const DATA_VERSION = "v11"; // Increment version to clear stale data

    const getInitialData = <T,>(key: string, fallback: T): T => {
        const version = localStorage.getItem('data_version');
        if (version !== DATA_VERSION) {
            // New version detected, clear old state
            console.log("New data version detected. Resetting localStorage...");
            return fallback;
        }
        const stored = localStorage.getItem(key);
        try {
            return stored ? JSON.parse(stored) : fallback;
        } catch (e) {
            return fallback;
        }
    };

    const initialBusesWithLocations: Bus[] = [
        { id: "101", busNumber: "Bus 101", plate: "TS 09 UA 1234", driver: "Robert Johnson", route: "Route A", status: "on-route", passengers: 28, capacity: 40, currentStop: "Maple Street", location: { lat: 17.3850, lng: 78.4867 }, speed: 45, isSOS: false, state: "Telangana", district: "Hyderabad", mandal: "Hyderabad", engineNumber: "ENG123456789", documents: { rc: "RC-TS09-1234", insurance: "INS-2024-001", pollution: "POL-2024-001" } },
        { id: "102", busNumber: "Bus 102", plate: "TS 09 UA 5678", driver: "Sarah Williams", route: "Route B", status: "delayed", passengers: 35, capacity: 40, currentStop: "Oak Avenue", location: { lat: 17.4000, lng: 78.4900 }, speed: 10, isSOS: false, state: "Telangana", district: "Hyderabad", mandal: "Secunderabad", engineNumber: "ENG987654321", documents: { rc: "RC-TS09-5678", insurance: "INS-2024-002", pollution: "POL-2024-002" } },
        { id: "103", busNumber: "Bus 103", plate: "TS 09 UA 9012", driver: "Michael Davis", route: "Route C", status: "on-route", passengers: 22, capacity: 40, currentStop: "Pine Road", location: { lat: 17.4200, lng: 78.4800 }, speed: 55, isSOS: false, state: "Telangana", district: "Medchal-Malkajgiri", mandal: "Kukatpally", engineNumber: "ENG456789012", documents: { rc: "RC-TS09-9012", insurance: "INS-2024-003", pollution: "POL-2024-003" } },
        { id: "104", busNumber: "Bus 104", plate: "TS 09 UA 3456", driver: "Emily Brown", route: "Route D", status: "idle", passengers: 0, capacity: 40, location: { lat: 17.4500, lng: 78.5000 }, speed: 0, isSOS: false, state: "Telangana", district: "Hyderabad", mandal: "Ameerpet", engineNumber: "ENG345678901", documents: { rc: "RC-TS09-3456", insurance: "INS-2024-004", pollution: "POL-2024-004" } },
        { id: "105", busNumber: "Bus 105", plate: "TS 09 UA 7890", driver: "David Smith", route: "Route E", status: "on-route", passengers: 30, capacity: 40, currentStop: "Main Road", location: { lat: 17.9689, lng: 79.5941 }, speed: 40, isSOS: false, state: "Telangana", district: "Warangal", mandal: "Hanamkonda" },
        { id: "106", busNumber: "Bus 106", plate: "TS 09 UA 2468", driver: "James Wilson", route: "Route F", status: "on-route", passengers: 15, capacity: 40, currentStop: "Market Square", location: { lat: 18.4386, lng: 79.1288 }, speed: 50, isSOS: false, state: "Telangana", district: "Karimnagar", mandal: "Karimnagar" },
        { id: "107", busNumber: "Bus 107", plate: "AP 16 TV 8055", driver: "Linda Garcia", route: "Route G", status: "on-route", passengers: 25, capacity: 40, currentStop: "Station Road", location: { lat: 15.9129, lng: 79.7400 }, speed: 45, isSOS: false, state: "Andhra Pradesh", district: "Guntur", mandal: "Guntur" },
        { id: "108", busNumber: "Bus 108", plate: "AP 31 TV 1001", driver: "Kevin Lee", route: "Route H", status: "on-route", passengers: 10, capacity: 40, currentStop: "Beach Road", location: { lat: 17.6868, lng: 83.2185 }, speed: 35, isSOS: false, state: "Andhra Pradesh", district: "Visakhapatnam", mandal: "Visakhapatnam" },
    ];

    const initialDrivers: Driver[] = [
        { id: "d1", name: "Robert Johnson", license: "DL-TX-2024-001", phone: "+91 98765 43210", status: "active", assignedBus: "101", joinDate: "2023-01-15", experience: 5, rating: 4.8, address: "123 Main St, Hyderabad", workHistory: "5 years at City Transport, 2 years at School Bus Co.", bloodGroup: "O+", emergencyContact: "+91 98765 00001" },
        { id: "d2", name: "Sarah Williams", license: "DL-TX-2024-002", phone: "+91 99887 76655", status: "active", assignedBus: "102", joinDate: "2022-11-20", experience: 3, rating: 4.5, address: "45 Park Ave, Secunderabad", workHistory: "3 years at Uber, 1 year private chauffeur.", bloodGroup: "A+", emergencyContact: "+91 99887 00002" },
        { id: "d3", name: "Michael Davis", license: "DL-TX-2024-003", phone: "+91 88776 65544", status: "active", assignedBus: "103", joinDate: "2021-06-10", experience: 7, rating: 4.9, address: "78 Lake View, Kukatpally", workHistory: "7 years driving heavy vehicles for Logistics Inc.", bloodGroup: "B+", emergencyContact: "+91 88776 00003" },
        { id: "d4", name: "Emily Brown", license: "DL-TX-2024-004", phone: "+91 77665 54433", status: "on-leave", assignedBus: "104", joinDate: "2023-08-01", experience: 2, rating: 4.2, address: "90 Hill Top, Ameerpet", workHistory: "2 years as a school bus driver.", bloodGroup: "AB+", emergencyContact: "+91 77665 00004" },
        { id: "d5", name: "David Smith", license: "DL-TX-2024-005", phone: "+91 91234 56789", status: "active", assignedBus: "105", joinDate: "2020-03-12", experience: 10, rating: 5.0, address: "34 River Side, Warangal", workHistory: "10 years at State Transport Corporation.", bloodGroup: "O-", emergencyContact: "+91 91234 00005" },
        { id: "d6", name: "James Wilson", license: "DL-TX-2024-006", phone: "+91 81234 56780", status: "active", assignedBus: "106", joinDate: "2023-05-22", experience: 4, rating: 4.6, address: "56 Green Field, Karimnagar", workHistory: "4 years with Tour & Travels Co.", bloodGroup: "B-", emergencyContact: "+91 81234 00006" },
        { id: "d7", name: "Linda Garcia", license: "DL-TX-2024-007", phone: "+91 71234 56781", status: "active", assignedBus: "107", joinDate: "2022-09-15", experience: 6, rating: 4.7, address: "12 Blue Sky, Guntur", workHistory: "6 years driving inter-city buses.", bloodGroup: "A-", emergencyContact: "+91 71234 00007" },
        { id: "d8", name: "Kevin Lee", license: "DL-TX-2024-008", phone: "+91 61234 56782", status: "active", assignedBus: "108", joinDate: "2024-01-05", experience: 1, rating: 4.0, address: "89 Ocean View, Visakhapatnam", workHistory: "1 year as a delivery driver, new to bus driving.", bloodGroup: "O+", emergencyContact: "+91 61234 00008" },
    ];

    const initialCaretakers: Caretaker[] = [
        { id: "c1", name: "Priya Sharma", phone: "+91 98765 11111", status: "active", assignedBus: "101", joinDate: "2023-02-10", experience: 3, address: "22 MG Road, Hyderabad", bloodGroup: "A+", emergencyContact: "+91 98765 11100" },
        { id: "c2", name: "Anita Reddy", phone: "+91 98765 22222", status: "active", assignedBus: "102", joinDate: "2022-08-15", experience: 4, address: "45 Jubilee Hills, Hyderabad", bloodGroup: "B+", emergencyContact: "+91 98765 22200" },
        { id: "c3", name: "Lakshmi Devi", phone: "+91 98765 33333", status: "active", assignedBus: "103", joinDate: "2021-06-01", experience: 5, address: "78 Banjara Hills, Hyderabad", bloodGroup: "O+", emergencyContact: "+91 98765 33300" },
        { id: "c4", name: "Sunita Kumari", phone: "+91 98765 44444", status: "on-leave", assignedBus: "104", joinDate: "2023-01-20", experience: 2, address: "12 Ameerpet, Hyderabad", bloodGroup: "AB+", emergencyContact: "+91 98765 44400" },
    ];

    const [students, setStudents] = useState<Student[]>(() => getInitialData('students', initialStudents));
    const [buses, setBuses] = useState<Bus[]>(() => getInitialData('buses', initialBusesWithLocations));
    const [routes, setRoutes] = useState<Route[]>(() => getInitialData('routes', initialRoutes));
    const [alerts, setAlerts] = useState<Alert[]>(() => getInitialData('alerts', initialAlerts));
    const [drivers, setDrivers] = useState<Driver[]>(() => getInitialData('drivers', initialDrivers));
    const [caretakers, setCaretakers] = useState<Caretaker[]>(() => getInitialData('caretakers', initialCaretakers));
    const [searchQuery, setSearchQuery] = useState("");

    // Update version on mount
    useEffect(() => {
        localStorage.setItem('data_version', DATA_VERSION);
    }, []);

    // Persistence Effects
    useEffect(() => localStorage.setItem('students', JSON.stringify(students)), [students]);
    useEffect(() => localStorage.setItem('buses', JSON.stringify(buses)), [buses]);
    useEffect(() => localStorage.setItem('routes', JSON.stringify(routes)), [routes]);
    useEffect(() => localStorage.setItem('alerts', JSON.stringify(alerts)), [alerts]);
    useEffect(() => localStorage.setItem('drivers', JSON.stringify(drivers)), [drivers]);
    useEffect(() => localStorage.setItem('caretakers', JSON.stringify(caretakers)), [caretakers]);

    // Simulation Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBuses(prevBuses => prevBuses.map(bus => {
                if (bus.status === 'idle' || bus.status === 'maintenance') return bus;

                // Simulate movement slightly
                const newLat = (bus.location?.lat || 17.3850) + (Math.random() - 0.5) * 0.001;
                const newLng = (bus.location?.lng || 78.4867) + (Math.random() - 0.5) * 0.001;

                // Simulate speed
                let newSpeed = Math.floor(Math.random() * 80); // 0-80 km/h
                const isOverSpeeding = newSpeed > 60;
                return {
                    ...bus,
                    location: { lat: newLat, lng: newLng },
                    speed: newSpeed,
                };
            }));
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // Stats derived from data
    const stats: Stats = {
        totalStudents: students.length,
        activeBuses: buses.filter(b => b.status === "on-route" || b.status === "delayed").length,
        todaysScans: 847, // Mocked for now
        notificationsSent: 1694, // Mocked
        morningBoarded: 423, // Mocked morning boarding count
        eveningReturns: 398 // Mocked evening returns count
    };

    const uuid = () => Math.random().toString(36).substr(2, 9);

    const addStudent = (student: Omit<Student, 'id'>) => {
        const id = uuid();
        setStudents(prev => [...prev, { ...student, id }]);
        return id;
    };

    const updateStudent = (id: string, updates: Partial<Student>) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const deleteStudent = (id: string) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    };

    const restoreStudent = (student: Student) => {
        setStudents(prev => [...prev, student]);
    };

    const addBus = (bus: Omit<Bus, 'id'>) => {
        setBuses(prev => [...prev, { ...bus, id: uuid() }]);
    };

    const updateBus = (id: string, updates: Partial<Bus>) => {
        setBuses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const deleteBus = (id: string) => {
        setBuses(prev => prev.filter(b => b.id !== id));
    };

    const restoreBus = (bus: Bus) => {
        setBuses(prev => [...prev, bus]);
    };

    const addRoute = (route: Omit<Route, 'id'>) => {
        setRoutes(prev => [...prev, { ...route, id: uuid() }]);
    };

    const updateRoute = (id: string, updates: Partial<Route>) => {
        setRoutes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const deleteRoute = (id: string) => {
        setRoutes(prev => prev.filter(r => r.id !== id));
    };

    const restoreRoute = (route: Route) => {
        setRoutes(prev => [...prev, route]);
    };

    // Driver logic
    const addDriver = (driver: Omit<Driver, "id">) => {
        setDrivers(prev => [...prev, { ...driver, id: uuid(), status: 'active' }]);
    };

    const updateDriver = (id: string, updates: Partial<Driver>) => {
        setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    };

    const deleteDriver = (id: string) => {
        setDrivers(prev => prev.filter(d => d.id !== id));
    };

    const restoreDriver = (driver: Driver) => {
        setDrivers(prev => [...prev, driver]);
    };

    // Caretaker CRUD
    const addCaretaker = (caretaker: Omit<Caretaker, 'id'>) => {
        const newCaretaker = { ...caretaker, id: `c${Date.now()}` };
        setCaretakers(prev => [...prev, newCaretaker]);
    };
    const updateCaretaker = (id: string, updates: Partial<Caretaker>) => {
        setCaretakers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };
    const deleteCaretaker = (id: string) => {
        setCaretakers(prev => prev.filter(c => c.id !== id));
    };
    const restoreCaretaker = (caretaker: Caretaker) => {
        setCaretakers(prev => [...prev, caretaker]);
    };

    const refreshData = () => {
        // Force reset all data to initial state and clear storage
        console.log("Resetting all application data...");

        // Preserve authentication state
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userRole = localStorage.getItem('userRole');

        localStorage.clear();

        // Restore authentication state
        if (isAuthenticated) localStorage.setItem('isAuthenticated', isAuthenticated);
        if (userRole) localStorage.setItem('userRole', userRole);

        setBuses(initialBusesWithLocations);
        setStudents(initialStudents);
        setRoutes(initialRoutes);
        setDrivers([]);
        setAlerts(initialAlerts);
        localStorage.setItem('data_version', DATA_VERSION);
        window.location.reload(); // Ensure everything is fresh
    };

    return (
        <DataContext.Provider value={{
            students, buses, routes, alerts, drivers, stats,
            searchQuery, setSearchQuery,
            addStudent, updateStudent, deleteStudent, restoreStudent,
            addBus, updateBus, deleteBus, restoreBus,
            addRoute, updateRoute, deleteRoute, restoreRoute,
            addDriver, updateDriver, deleteDriver, restoreDriver,
            caretakers, addCaretaker, updateCaretaker, deleteCaretaker, restoreCaretaker,
            refreshData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
