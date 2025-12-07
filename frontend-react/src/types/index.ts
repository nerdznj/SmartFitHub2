export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

export interface User {
    id: string;
    email: string;
    phone: string;
    role: 'user' | 'trainer' | 'admin';
    isActive: boolean;
    createdAt: string;
}

export interface UserProfile {
    userId: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    gender?: 'male' | 'female';
    height?: number;
    weight?: number;
    fitnessGoal?: string;
    activityLevel?: string;
    medicalConditions?: string;
    totalPoints?: number;
    currentStreak?: number;
    longestStreak?: number;
    lastActivityDate?: string;
    bodyType?: 'ectomorph' | 'mesomorph' | 'endomorph';
}

export interface Class {
    id: number;
    name: string;
    description: string;
    trainerId: number;
    trainerName?: string;
    type: 'online' | 'offline';
    level: 'beginner' | 'intermediate' | 'advanced';
    date: string;
    startTime: string;
    endTime: string;
    capacity: number;
    remainingCapacity: number;
    price: number;
    imageUrl?: string;
}

export interface Booking {
    id: string;
    classId: number;
    class?: Class;
    bookingStatus: 'pending_payment' | 'confirmed' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid' | 'refunded';
    bookingDate: string;
    canCancel: boolean;
}

export interface TrainingPlan {
    id: string;
    userId: string;
    planType: string;
    weeklyPlan: any;
    nutritionAdvice?: string;
    aiPrompt?: string;
    isActive: boolean;
    validUntil: string;
    generatedAt: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Post {
    id: string;
    userId: string;
    content: string;
    imageUrl?: string;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    isLiked?: boolean;
    user?: {
        id: string;
        email: string;
        profile?: {
            firstName?: string;
            lastName?: string;
            fitnessGoal?: string;
        };
    };
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: string;
    user?: {
        id: string;
        email: string;
        profile?: {
            firstName?: string;
            lastName?: string;
        };
    };
}

export interface ProgressRecord {
    id: string;
    userId: string;
    date: string;
    weight: number;
    height?: number;
    bmi?: number;
    bodyFatPercentage?: number;
    waistSize?: number;
    createdAt: string;
}

export interface PersonalRecord {
    id: string;
    userId: string;
    exerciseName: string;
    value: number;
    unit: string;
    date: string;
    createdAt: string;
}

export interface Payment {
    id: string;
    userId: string;
    bookingId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: string;
    transactionId?: string;
    createdAt: string;
    booking?: Booking;
}

export interface MedicalHistory {
    id: string;
    condition: string;
    treatment: string;
    date: string;
}

export interface SportsHistory {
    id: string;
    sportName: string;
    experienceLevel: string;
    yearsOfExperience: number;
    weeklyHours: number;
}