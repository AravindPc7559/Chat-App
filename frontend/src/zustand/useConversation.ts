import { create } from "zustand";
import { ConversationStore, SelectedConversation, Message } from "../types";

const useConversation = create<ConversationStore>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation: SelectedConversation | null) => 
        set({ selectedConversation }),
    messages: [],
    setMessages: (messages: Message[]) => set({ messages }),
    unreadCounts: {},
    setUnreadCounts: (counts: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => 
        set((state) => ({
            unreadCounts: typeof counts === "function" ? counts(state.unreadCounts) : counts,
        })),
}));

export default useConversation;

