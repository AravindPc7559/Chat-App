// User types
export interface User {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    profilePic: string;
    gender: "male" | "female";
    contacts?: string[];
    createdAt?: string;
    updatedAt?: string;
}

// Message types
export interface Message {
    _id: string;
    senderId: string | User;
    receiverId?: string | User;
    groupId?: string;
    message: string;
    read: boolean;
    createdAt: string;
    updatedAt?: string;
    shouldShake?: boolean;
}

// Conversation types
export interface Conversation {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    profilePic: string;
    isContact?: boolean;
    unreadCount?: number;
}

// Group types
export interface Group {
    _id: string;
    name: string;
    description?: string;
    admin: string | User;
    members: (string | User)[];
    messages?: string[];
    groupPic?: string;
    unreadCount?: number;
    createdAt?: string;
    updatedAt?: string;
    type?: "group";
}

// Selected conversation can be either a user conversation or a group
export type SelectedConversation = Conversation | (Group & { type: "group" });

// Auth context types
export interface AuthContextType {
    authUser: User | null;
    setAuthUser: (user: User | null) => void;
    loading: boolean;
}

// Socket context types
export interface SocketContextType {
    socket: any | null;
    onlineUsers: string[];
}

// Payment types
export interface PaymentPlan {
    name: string;
    price: string;
    credits: number | string;
    features: string[];
    planType: "basic" | "pro" | "enterprise";
}

// API Response types
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    code?: string;
}

// Hook return types
export interface UseGetConversationsReturn {
    loading: boolean;
    conversations: Conversation[];
    setConversations: (conversations: Conversation[]) => void;
}

export interface UseGetGroupsReturn {
    loading: boolean;
    groups: Group[];
    setGroups: (groups: Group[]) => void;
}

export interface UseGetMessagesReturn {
    messages: Message[];
    loading: boolean;
}

export interface UseSendMessageReturn {
    sendMessage: (message: string) => Promise<void>;
    loading: boolean;
}

export interface UseTranslateReturn {
    translate: (text: string) => Promise<string | null>;
    loading: boolean;
    showCreditModal: boolean;
    setShowCreditModal: (show: boolean) => void;
}

// Zustand store types
export interface ConversationStore {
    selectedConversation: SelectedConversation | null;
    setSelectedConversation: (conversation: SelectedConversation | null) => void;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    unreadCounts: Record<string, number>;
    setUnreadCounts: (counts: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
}

