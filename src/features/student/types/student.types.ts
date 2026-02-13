export interface StudentProfile {
    numero_identificacion: string;
    email: string;
    nombres: string;
    apellidos: string;
    tipo_identificacion: string;
    celular: string;
    ciudad: string;
    estado: boolean;
}

export interface EducationEntry {
    id: string;
    universityId: string;
    universityName?: string;
    careerId: string;
    careerName?: string;
    level: string;
    status: string;
    semester: string;
    startDate: string;
    endDate: string;
    persisted?: boolean;
    originalCareerId?: string;
    originalStatus?: string;
    originalSemester?: string;
    originalStartDate?: string;
    originalEndDate?: string;
}
