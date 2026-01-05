export interface Student {
    id: string;
    name: string;
    class: string;
    rfid: string;
    route: string;
    parent?: string;
    phone?: string;
    fatherName?: string;
    fatherPhone?: string;
    motherName?: string;
    motherPhone?: string;
    guardianName?: string;
    guardianPhone?: string;
    state?: string;
    mandal?: string;
    district?: string;
    country?: string;
    status: "active" | "inactive";
    boardingStatus?: "boarded" | "not-boarded";
    rollNumber?: string;
    bloodGroup?: string;
    address?: string;
    profileImage?: string;
    dob?: string;
    emergencyContact?: string;
    assignedBus?: string;
}

export interface Bus {
    id: string;
    busNumber: string;
    plate: string;
    driver: string;
    route: string;
    status: "on-route" | "delayed" | "idle" | "maintenance" | "completed";
    passengers: number;
    capacity: number;
    currentStop?: string;
    location?: {
        lat: number;
        lng: number;
    };
    speed?: number;
    isSOS?: boolean;
    state?: string;
    district?: string;
    mandal?: string;
    isHarshDriving?: boolean;
    isDrunkDriving?: boolean;
    engineNumber?: string;
    documents?: {
        insurance?: string;
        rc?: string;
        pollution?: string;
    };
}

export interface Route {
    id: string;
    name: string;
    busId?: string;
    stops: string[];
    path?: [number, number][];
    distance?: string;
    estimatedTime?: string;
}

export interface Alert {
    id: string;
    type: "delay" | "sos" | "speed" | "route" | "attendance" | "safety" | "geofence";
    title?: string;
    message: string;
    timestamp?: string;
    time: string;
    busId?: string;
    studentId?: string;
    status: "active" | "resolved";
    severity?: "info" | "warning" | "error" | "success";
}

export interface Driver {
    id: string;
    name: string;
    phone: string;
    licenseNumber?: string;
    license?: string;
    experience?: string | number;
    rating?: number;
    status: "active" | "inactive" | "on-leave";
    assignedBusId?: string;
    assignedBus?: string;
    address?: string;
    workHistory?: string;
    bloodGroup?: string;
    emergencyContact?: string;
    image?: string;
    licenseImage?: string;
    joinDate?: string;
    profileImage?: string;
}

export interface Stats {
    totalStudents: number;
    activeBuses: number;
    onTimeRate?: number;
    morningBoardings?: number;
    eveningReturns?: number;
    attendanceRate?: number;
    todaysScans?: number;
    notificationsSent?: number;
    morningBoarded?: number;
}

export interface Caretaker {
    id: string;
    name: string;
    phone: string;
    assignedBusId?: string;
    assignedBus?: string;
    status: "active" | "inactive" | "on-leave";
    experience?: string | number;
    joinDate?: string;
    address?: string;
    bloodGroup?: string;
    emergencyContact?: string;
    profileImage?: string;
}
