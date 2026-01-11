import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Bus, Route, Alert, Driver, Stats, Caretaker } from '@/types';
import { initialStudents, initialBuses, initialRoutes, initialAlerts, initialDrivers, initialCaretakers, initialBusesWithLocations } from '@/data/mockData';
import { useTrafficSimulation } from '@/hooks/useTrafficSimulation';

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



export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const DATA_VERSION = "v12"; // Increment version to clear stale data

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

    // Use Custom Hook for Traffic Simulation
    useTrafficSimulation(setBuses);

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
